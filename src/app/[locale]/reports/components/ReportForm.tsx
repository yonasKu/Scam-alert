"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

import { FormField } from "./FormField";
import { ReportTypeOption } from "./ReportTypeOption";

interface ReportFormProps {
  t: (key: string, params?: Record<string, any>) => string;
  windowWidth: number;
}

type FormDataType = {
  title: string;
  businessName: string;
  location: string;
  category: string;
  description: string;
  photo: File | null;
  photoPreview: string | null;
  contact: string;
  reportType: string;
  priceBefore: string;
  priceAfter: string;
  receiptIssue: string;
  suspiciousActivity: string;
  unauthorizedIssue: string;
  item: string;
};

export function ReportForm({ t, windowWidth }: ReportFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    businessName: "",
    location: "",
    category: "",
    description: "",
    photo: null,
    photoPreview: null,
    contact: "",
    reportType: "",
    priceBefore: "",
    priceAfter: "",
    receiptIssue: "",
    suspiciousActivity: "",
    unauthorizedIssue: "",
    item: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData({ 
          ...formData, 
          photo: file,
          photoPreview: event.target?.result as string
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData({ 
          ...formData, 
          photo: file,
          photoPreview: event.target?.result as string
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photo: null,
      photoPreview: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use the photoPreview (base64 string) directly instead of trying to upload to Supabase storage
      let photoUrl = formData.photoPreview;
      
      // Insert report data into Supabase
      const { error: insertError, data: report } = await supabase
        .from('reports')
        .insert({
          title: formData.title,
          business_name: formData.businessName,
          location: formData.location,
          category: formData.category,
          description: formData.description,
          photo_url: photoUrl, // This will now be the base64 string
          reporter_contact: formData.contact,
          report_type: formData.reportType,
          price_before: formData.priceBefore || null,
          price_after: formData.priceAfter || null,
          receipt_issue: formData.receiptIssue || null,
          suspicious_activity: formData.suspiciousActivity || null,
          unauthorized_issue: formData.unauthorizedIssue || null,
          item: formData.item || null,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (insertError) {
        throw new Error(`Error inserting report: ${insertError.message}`);
      }
      
      console.log("Report submitted successfully:", report);
      setSubmittedReport(report);
      setShowSuccessMessage(true);
      
      // Don't auto-redirect - let the user choose what to do next
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      borderRadius: "0.75rem",
      overflow: "hidden"
    }}>
      <CardHeader style={{
        borderBottom: "1px solid hsla(var(--border) / 0.5)",
        padding: "1.5rem",
        backgroundColor: "hsla(var(--muted) / 0.1)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem"
        }}>
          <div style={{
            backgroundColor: "hsla(var(--primary) / 0.1)",
            borderRadius: "50%",
            width: "2.5rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "hsl(var(--primary))"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <CardTitle style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>{t('form.reportDetails.title')}</CardTitle>
        </div>
        <CardDescription style={{ lineHeight: 1.6, fontSize: "1rem" }}>
          {t('form.reportDetails.description')}
        </CardDescription>
      </CardHeader>
      <CardContent style={{ padding: "2rem 1.5rem" }}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Basic Information Fields */}
            <FormField
              id="title"
              label={t('form.fields.title.label')}
              placeholder={t('form.fields.title.placeholder')}
              value={formData.title}
              onChange={handleChange}
              required
            />

            <FormField
              id="businessName"
              label={t('form.fields.businessName.label')}
              placeholder={t('form.fields.businessName.placeholder')}
              value={formData.businessName}
              onChange={handleChange}
              required
            />

            <FormField
              id="location"
              label={t('form.fields.location.label')}
              placeholder={t('form.fields.location.placeholder')}
              value={formData.location}
              onChange={handleChange}
              required
            />

            <FormField
              id="category"
              label={t('form.fields.category.label')}
              placeholder=""
              value={formData.category}
              onChange={handleChange}
              required
              as="select"
            >
              <option value="">{t('form.fields.category.options.default')}</option>
              <option value="Groceries">{t('form.fields.category.options.groceries')}</option>
              <option value="Fuel">{t('form.fields.category.options.fuel')}</option>
              <option value="Essentials">{t('form.fields.category.options.essentials')}</option>
              <option value="Electronics">{t('form.fields.category.options.electronics')}</option>
              <option value="Restaurants">{t('form.fields.category.options.restaurants')}</option>
              <option value="Accommodation">{t('form.fields.category.options.accommodation')}</option>
              <option value="No Receipt">{t('form.fields.category.options.noReceipt')}</option>
              <option value="Other">{t('form.fields.category.options.other')}</option>
            </FormField>

            {/* Report Type */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <label 
                htmlFor="reportType" 
                style={{ 
                  fontSize: "1.125rem", 
                  fontWeight: "600", 
                  color: "hsl(var(--foreground))",
                  fontFamily: "var(--font-heading)"
                }}
              >
                {t('form.fields.reportType.label')}
              </label>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: windowWidth >= 768 ? "repeat(2, 1fr)" : "1fr",
                gap: "1rem"
              }}>
                {/* Report type options */}
                <ReportTypeOption
                  id="reportType-price-gouging"
                  value="price_gouging"
                  title={t('form.reportTypes.priceGouging.title')}
                  description={t('form.reportTypes.priceGouging.description')}
                  isSelected={formData.reportType === "price_gouging"}
                  onClick={() => setFormData({...formData, reportType: "price_gouging"})}
                  iconBgColor="hsla(var(--destructive) / 0.1)"
                  iconColor="hsl(var(--destructive))"
                  icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                      <path d="M3 6h18"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  )}
                />
                
                <ReportTypeOption
                  id="reportType-no-receipt"
                  value="no_receipt"
                  title={t('form.reportTypes.noReceipt.title')}
                  description={t('form.reportTypes.noReceipt.description')}
                  isSelected={formData.reportType === "no_receipt"}
                  onClick={() => setFormData({...formData, reportType: "no_receipt"})}
                  iconBgColor="hsla(var(--destructive) / 0.1)"
                  iconColor="hsl(var(--destructive))"
                  icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <line x1="9" x2="15" y1="9" y2="9" />
                      <line x1="9" x2="15" y1="15" y2="15" />
                    </svg>
                  )}
                />
                
                <ReportTypeOption
                  id="reportType-suspicious"
                  value="suspicious_activity"
                  title={t('form.reportTypes.suspiciousActivity.title')}
                  description={t('form.reportTypes.suspiciousActivity.description')}
                  isSelected={formData.reportType === "suspicious_activity"}
                  onClick={() => setFormData({...formData, reportType: "suspicious_activity"})}
                  iconBgColor="hsla(var(--warning) / 0.1)"
                  iconColor="hsl(var(--warning))"
                  icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  )}
                />
                
                <ReportTypeOption
                  id="reportType-unauthorized"
                  value="unauthorized_business"
                  title={t('form.reportTypes.unauthorizedBusiness.title')}
                  description={t('form.reportTypes.unauthorizedBusiness.description')}
                  isSelected={formData.reportType === "unauthorized_business"}
                  onClick={() => setFormData({...formData, reportType: "unauthorized_business"})}
                  iconBgColor="hsla(var(--primary) / 0.1)"
                  iconColor="hsl(var(--primary))"
                  icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                />

                <ReportTypeOption
                  id="reportType-false-advertising"
                  value="false_advertising"
                  title={t('form.reportTypes.falseAdvertising.title')}
                  description={t('form.reportTypes.falseAdvertising.description')}
                  isSelected={formData.reportType === "false_advertising"}
                  onClick={() => setFormData({...formData, reportType: "false_advertising"})}
                  iconBgColor="hsla(var(--warning) / 0.1)"
                  iconColor="hsl(var(--warning))"
                  icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 8 4-4 4 4"/>
                      <path d="M11 12H3"/>
                      <path d="m9 16 4 4 4-4"/>
                      <path d="M20 12h-8"/>
                    </svg>
                  )}
                />

                <ReportTypeOption
                  id="reportType-hidden-fees"
                  value="hidden_fees"
                  title={t('form.reportTypes.hiddenFees.title')}
                  description={t('form.reportTypes.hiddenFees.description')}
                  isSelected={formData.reportType === "hidden_fees"}
                  onClick={() => setFormData({...formData, reportType: "hidden_fees"})}
                  iconBgColor="hsla(var(--destructive) / 0.1)"
                  iconColor="hsl(var(--destructive))"
                  icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4"/>
                      <path d="M12 16h.01"/>
                    </svg>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            {/* Conditional fields based on report type */}
            {formData.reportType === 'price_gouging' && (
              <>
                {/* Price Before */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <FormField
                    id="priceBefore"
                    label={`${t('form.reportDetails.priceBefore')} *`}
                    value={formData.priceBefore}
                    onChange={handleChange}
                    placeholder={t('form.reportDetails.priceBeforePlaceholder')}
                    required
                  />
                </div>

                {/* Price After */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <FormField
                    id="priceAfter"
                    label={`${t('form.reportDetails.priceAfter')} *`}
                    value={formData.priceAfter}
                    onChange={handleChange}
                    placeholder={t('form.reportDetails.priceAfterPlaceholder')}
                    required
                  />
                </div>
              </>
            )}

            {formData.reportType === 'no_receipt' && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label 
                  htmlFor="receiptIssue" 
                  style={{ 
                    fontSize: "0.9375rem", 
                    fontWeight: "600", 
                    marginBottom: "0.25rem",
                    color: "hsl(var(--foreground))"
                  }}
                >
                  {t('form.evidence.receiptIssue')} *
                </label>
                <select 
                  id="receiptIssue" 
                  value={formData.receiptIssue}
                  onChange={handleChange}
                  style={{
                    fontSize: "1rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid hsla(var(--border) / 0.5)",
                    backgroundColor: "hsla(var(--background) / 0.5)",
                    color: "hsl(var(--foreground))",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    height: "2.75rem",
                    width: "100%"
                  }}
                  required={formData.reportType === 'no_receipt'}
                  className="select-with-visible-options"
                >
                  <option value="">{t('form.evidence.receiptIssueTypes.placeholder', { default: 'Select receipt issue' })}</option>
                  <option value="no_receipt">{t('form.evidence.receiptIssueTypes.noReceipt', { default: 'No receipt offered at all' })}</option>
                  <option value="refused_receipt">{t('form.evidence.receiptIssueTypes.refusedReceipt', { default: 'Receipt refused when requested' })}</option>
                  <option value="incomplete_receipt">{t('form.evidence.receiptIssueTypes.incompleteReceipt', { default: 'Incomplete/illegible receipt' })}</option>
                  <option value="verbal_receipt">{t('form.evidence.receiptIssueTypes.verbalReceipt', { default: 'Only verbal confirmation, no paper receipt' })}</option>
                  <option value="handwritten">{t('form.evidence.receiptIssueTypes.handwrittenReceipt', { default: 'Suspicious handwritten receipt' })}</option>
                </select>
              </div>
            )}

            {formData.reportType === 'suspicious_activity' && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <FormField
                  id="suspiciousActivity"
                  label={t('form.reportTypes.suspiciousActivity.title')}
                  value={formData.suspiciousActivity}
                  onChange={handleChange}
                  placeholder={t('form.reportTypes.suspiciousActivity.description')}
                  as="textarea"
                  required
                />
              </div>
            )}

            {formData.reportType === 'unauthorized_business' && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <FormField
                  id="unauthorizedIssue"
                  label={t('form.reportTypes.unauthorizedBusiness.title')}
                  value={formData.unauthorizedIssue}
                  onChange={handleChange}
                  placeholder={t('form.reportTypes.unauthorizedBusiness.description')}
                  as="textarea"
                  required
                />
              </div>
            )}

            {/* Item Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <FormField
                id="item"
                label={`${t('form.fields.item.label')} *`}
                value={formData.item}
                onChange={handleChange}
                placeholder={t('form.fields.item.placeholder')}
                required
              />
            </div>

            {/* Description */}
            <FormField
              id="description"
              label={`${t('form.fields.description.label')} *`}
              placeholder={t('form.fields.description.placeholder')}
              value={formData.description}
              onChange={handleChange}
              required
              as="textarea"
            />

            {/* Photo Upload */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <label 
                htmlFor="photo" 
                style={{ 
                  fontSize: "0.9375rem", 
                  fontWeight: "600", 
                  marginBottom: "0.25rem",
                  color: "hsl(var(--foreground))"
                }}
              >
                {t('form.fields.photo.label')}
              </label>
              
              {!formData.photoPreview ? (
                <div 
                  style={{
                    border: "2px dashed hsla(var(--border) / 0.7)",
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "hsla(var(--muted) / 0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = "hsla(var(--muted) / 0.2)";
                    e.currentTarget.style.borderColor = "hsl(var(--primary))";
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = "hsla(var(--muted) / 0.1)";
                    e.currentTarget.style.borderColor = "hsla(var(--border) / 0.7)";
                  }}
                >
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}>
                    <div style={{
                      backgroundColor: "hsla(var(--primary) / 0.1)",
                      borderRadius: "50%",
                      width: "3rem",
                      height: "3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "0.75rem",
                      color: "hsl(var(--primary))"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                        <line x1="16" x2="22" y1="5" y2="5"/>
                        <line x1="19" x2="19" y1="2" y2="8"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                    <input 
                      ref={fileInputRef}
                      id="photo" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        display: "none"
                      }}
                    />
                    <div>
                      <p style={{
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                        color: "hsl(var(--primary))"
                      }}>
                        {t('form.fields.photo.uploadText')}
                      </p>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        margin: "0"
                      }}>
                        {t('form.fields.photo.dragDropText', { default: 'Drag and drop or click to select' })}
                      </p>
                    </div>
                    <p style={{
                      fontSize: "0.875rem",
                      color: "hsl(var(--muted-foreground))",
                      margin: "0.5rem 0 0 0"
                    }}>
                      {t('form.fields.photo.fileFormats')}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{
                  border: "1px solid hsla(var(--border) / 0.7)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "hsla(var(--background) / 1)",
                }}>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <p style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        margin: "0"
                      }}>
                        {formData.photo?.name || 'Selected Image'}
                      </p>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        style={{
                          backgroundColor: "hsla(var(--destructive) / 0.1)",
                          color: "hsl(var(--destructive))",
                          border: "none",
                          borderRadius: "0.25rem",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        {t('form.fields.photo.remove', { default: 'Remove' })}
                      </button>
                    </div>
                    <div style={{
                      position: "relative",
                      width: "100%",
                      height: "200px",
                      borderRadius: "0.375rem",
                      overflow: "hidden",
                      backgroundColor: "hsla(var(--muted) / 0.1)"
                    }}>
                      <img 
                        src={formData.photoPreview} 
                        alt="Preview" 
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end"
                    }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          backgroundColor: "hsla(var(--primary) / 0.1)",
                          color: "hsl(var(--primary))",
                          border: "none",
                          borderRadius: "0.25rem",
                          padding: "0.375rem 0.75rem",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                          <line x1="16" x2="22" y1="5" y2="5"/>
                          <line x1="19" x2="19" y1="2" y2="8"/>
                        </svg>
                        {t('form.fields.photo.change', { default: 'Change Photo' })}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <p style={{
                fontSize: "0.75rem",
                color: "hsl(var(--muted-foreground))",
                margin: "0.25rem 0 0 0"
              }}>
                {t('form.fields.photo.helpText', { default: 'Adding a photo helps verify your report and provides evidence of the issue.' })}
              </p>
            </div>
            
            {/* Contact Info */}
            <FormField
              id="contact"
              label={t('form.contact.title')}
              placeholder={t('form.contact.contactInfoPlaceholder')}
              value={formData.contact}
              onChange={handleChange}
              // description={t('form.contact.privacyNote')}
            />
          </div>

          {/* Form Buttons */}
          <div style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            {error && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "hsla(var(--destructive) / 0.1)",
                color: "hsl(var(--destructive))",
                borderRadius: "0.375rem",
                fontSize: "0.875rem"
              }}>
                {error}
              </div>
            )}
            {showSuccessMessage && submittedReport && (
              <div 
                style={{
                  padding: "1.5rem",
                  backgroundColor: "hsla(var(--success) / 0.1)",
                  border: "1px solid hsla(var(--success) / 0.3)",
                  color: "hsl(var(--foreground))",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                  animation: fadeOut ? "fadeOut 0.5s ease-out forwards" : "fadeIn 0.5s ease-in forwards",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <style jsx>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-10px); }
                  }
                `}</style>
                
                {/* Success Icon and Title */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ 
                    width: "2.5rem", 
                    height: "2.5rem", 
                    borderRadius: "50%", 
                    backgroundColor: "hsla(var(--success) / 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "0.75rem"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "hsl(var(--success))" }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    fontWeight: "600", 
                    color: "hsl(var(--success))",
                    margin: 0
                  }}>
                    {t('successMessage')}
                  </h3>
                </div>
                
                {/* Report Details */}
                <div style={{ 
                  backgroundColor: "hsla(var(--card) / 0.5)", 
                  padding: "1rem", 
                  borderRadius: "0.375rem",
                  marginBottom: "1.25rem"
                }}>
                  <h4 style={{ 
                    fontSize: "1rem", 
                    fontWeight: "600", 
                    marginTop: 0,
                    marginBottom: "0.75rem"
                  }}>
                    {t('reportDetails')}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
                        {t('form.fields.title.label')}:
                      </p>
                      <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
                        {submittedReport.title}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
                        {t('form.fields.businessName.label')}:
                      </p>
                      <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
                        {submittedReport.business_name}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
                        {t('form.fields.category.label')}:
                      </p>
                      <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
                        {submittedReport.category}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
                        {t('form.fields.reportType.label')}:
                      </p>
                      <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
                        {submittedReport.report_type}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ 
                  display: "flex", 
                  gap: "0.75rem", 
                  justifyContent: windowWidth >= 640 ? "flex-end" : "stretch",
                  flexDirection: windowWidth >= 640 ? "row" : "column"
                }}>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowSuccessMessage(false);
                      setFadeOut(true);
                      
                      // Reset form for a new submission
                      setFormData({
                        title: "",
                        businessName: "",
                        location: "",
                        category: "",
                        description: "",
                        photo: null,
                        photoPreview: null,
                        contact: "",
                        reportType: "",
                        priceBefore: "",
                        priceAfter: "",
                        receiptIssue: "",
                        suspiciousActivity: "",
                        unauthorizedIssue: "",
                        item: ""
                      });
                    }}
                    style={{
                      padding: "0 1.25rem",
                      height: "2.5rem"
                    }}
                  >
                    {t('buttons.submitAnotherReport')}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      setFadeOut(true);
                      setTimeout(() => {
                        setShowSuccessMessage(false);
                        router.push(`/${locale}/reports`);
                      }, 300);
                    }}
                    style={{
                      padding: "0 1.25rem",
                      height: "2.5rem", 
                      backgroundColor: "hsl(var(--success))"
                    }}
                  >
                    {t('buttons.viewAllReports')}
                  </Button>
                </div>
              </div>
            )}
            <div style={{
              display: "flex",
              gap: "1rem",
              flexDirection: windowWidth >= 640 ? "row" : "column",
              justifyContent: windowWidth >= 640 ? "flex-end" : "stretch",
              width: "100%"
            }}>
              <Button 
                type="button" 
                variant="outline" 
                asChild 
                style={{
                  padding: "0 1.5rem",
                  height: "2.75rem"
                }}
                disabled={isSubmitting}
              >
                <Link href="/reports">{t('buttons.cancel')}</Link>
              </Button>
              <Button 
                type="submit"
                style={{
                  padding: "0 1.5rem",
                  height: "2.75rem", 
                  backgroundColor: "hsl(var(--primary))"
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
