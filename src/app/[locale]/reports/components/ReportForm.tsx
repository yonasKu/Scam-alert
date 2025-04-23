"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { uploadImage } from "@/lib/storage";

import { FormField } from "./FormField";
import { PhotoUpload } from "./PhotoUpload";
import { ReportTypeSelector } from "./ReportTypeSelector";
import { SuccessMessage } from "./SuccessMessage";

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

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photo: null,
      photoPreview: null
    });
  };

  const handleReportTypeChange = (reportType: string) => {
    setFormData({...formData, reportType});
  };

  const handleSubmitAnother = () => {
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
  };

  const handleViewReports = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      router.push(`/${locale}/reports`);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Handle photo upload - using our storage module
      let photoUrl = null;
      
      if (formData.photo) {
        // Try to upload to Supabase storage first
        photoUrl = await uploadImage(formData.photo, 'reports', 'report-photos');
        
        // If storage upload fails, fall back to using the data URL
        if (!photoUrl && formData.photoPreview) {
          photoUrl = formData.photoPreview;
        }
      }
      
      // Insert report data into Supabase
      const { error: insertError, data: report } = await supabase
        .from('reports')
        .insert({
          title: formData.title,
          business_name: formData.businessName,
          location: formData.location,
          category: formData.category,
          description: formData.description,
          photo_url: photoUrl, // This will be either the Supabase URL or base64 string
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
      
      // Show success message
      console.log('Report submitted successfully:', report[0]);
      setSubmittedReport(report[0]);
      setShowSuccessMessage(true);
      setIsSubmitting(false);
      
      // Debug: Check if the success message state is being set correctly
      setTimeout(() => {
        console.log('Success message state:', { showSuccessMessage, submittedReport: report[0] });
      }, 100);
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsSubmitting(false);
    }
  };

  // If success message is showing, only render the success message
  if (showSuccessMessage && submittedReport) {
    return (
      <Card style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderRadius: "0.75rem",
        overflow: "hidden"
      }}>
        <CardContent style={{ padding: "2rem 1.5rem" }}>
          <SuccessMessage 
            report={submittedReport} 
            onSubmitAnother={handleSubmitAnother}
            onViewReports={handleViewReports}
            t={t}
            windowWidth={windowWidth}
          />
        </CardContent>
      </Card>
    );
  }

  // Otherwise render the form
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

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "1rem",
                backgroundColor: "hsla(var(--destructive) / 0.1)",
                borderRadius: "0.5rem",
                color: "hsl(var(--destructive))",
                marginBottom: "1rem"
              }}>
                <p style={{ margin: 0 }}>{t('errorMessage')}</p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>{error}</p>
              </div>
            )}

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
            <ReportTypeSelector 
              selectedType={formData.reportType}
              onSelect={handleReportTypeChange}
              t={t}
              windowWidth={windowWidth}
            />

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
            <PhotoUpload 
              photoPreview={formData.photoPreview}
              onFileChange={handleFileChange}
              onRemove={handleRemovePhoto}
              t={t}
            />
            
            {/* Contact Info */}
            <FormField
              id="contact"
              label={t('form.fields.contact.label')}
              placeholder={t('form.fields.contact.placeholder')}
              value={formData.contact}
              onChange={handleChange}
            />

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
