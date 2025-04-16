"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    businessName: "",
    location: "",
    category: "",
    description: "",
    photo: null,
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
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would submit the data to an API
    console.log("Submitting report:", formData);
    alert(t('successMessage'));
    // Reset form or redirect
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
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    height: "2.75rem",
                    width: "100%"
                  }}
                  required={formData.reportType === 'no_receipt'}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
              <div style={{
                border: "2px dashed hsla(var(--border) / 0.7)",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                textAlign: "center",
                backgroundColor: "hsla(var(--muted) / 0.1)",
                cursor: "pointer"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <input 
                    id="photo" 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      display: "none"
                    }}
                  />
                  <label htmlFor="photo" style={{
                    cursor: "pointer",
                    color: "hsl(var(--primary))",
                    fontWeight: "500"
                  }}>
                    {t('form.fields.photo.uploadText')}
                  </label>
                  <p style={{
                    fontSize: "0.875rem",
                    color: "hsl(var(--muted-foreground))"
                  }}>
                    {t('form.fields.photo.fileFormats')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <FormField
              id="contact"
              label={t('form.contact.title')}
              placeholder={t('form.contact.contactInfoPlaceholder')}
              value={formData.contact}
              onChange={handleChange}
              description={t('form.contact.privacyNote')}
            />
          </div>

          {/* Form Buttons */}
          <div style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
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
              >
                {t('buttons.submit')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
