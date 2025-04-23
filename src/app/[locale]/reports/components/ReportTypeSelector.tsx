"use client";

import { ReportTypeOption } from "./ReportTypeOption";

interface ReportTypeSelectorProps {
  selectedType: string;
  onSelect: (reportType: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  windowWidth: number;
}

export function ReportTypeSelector({ 
  selectedType, 
  onSelect, 
  t, 
  windowWidth 
}: ReportTypeSelectorProps) {
  return (
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
        {/* Price Gouging */}
        <ReportTypeOption
          id="reportType-price-gouging"
          value="price_gouging"
          title={t('form.reportTypes.priceGouging.title')}
          description={t('form.reportTypes.priceGouging.description')}
          isSelected={selectedType === "price_gouging"}
          onClick={() => onSelect("price_gouging")}
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
        
        {/* No Receipt */}
        <ReportTypeOption
          id="reportType-no-receipt"
          value="no_receipt"
          title={t('form.reportTypes.noReceipt.title')}
          description={t('form.reportTypes.noReceipt.description')}
          isSelected={selectedType === "no_receipt"}
          onClick={() => onSelect("no_receipt")}
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
        
        {/* Suspicious Activity */}
        <ReportTypeOption
          id="reportType-suspicious"
          value="suspicious_activity"
          title={t('form.reportTypes.suspiciousActivity.title')}
          description={t('form.reportTypes.suspiciousActivity.description')}
          isSelected={selectedType === "suspicious_activity"}
          onClick={() => onSelect("suspicious_activity")}
          iconBgColor="hsla(var(--warning) / 0.1)"
          iconColor="hsl(var(--warning))"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          )}
        />
        
        {/* Unauthorized Business */}
        <ReportTypeOption
          id="reportType-unauthorized"
          value="unauthorized_business"
          title={t('form.reportTypes.unauthorizedBusiness.title')}
          description={t('form.reportTypes.unauthorizedBusiness.description')}
          isSelected={selectedType === "unauthorized_business"}
          onClick={() => onSelect("unauthorized_business")}
          iconBgColor="hsla(var(--primary) / 0.1)"
          iconColor="hsl(var(--primary))"
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        />

        {/* False Advertising */}
        <ReportTypeOption
          id="reportType-false-advertising"
          value="false_advertising"
          title={t('form.reportTypes.falseAdvertising.title')}
          description={t('form.reportTypes.falseAdvertising.description')}
          isSelected={selectedType === "false_advertising"}
          onClick={() => onSelect("false_advertising")}
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

        {/* Hidden Fees */}
        <ReportTypeOption
          id="reportType-hidden-fees"
          value="hidden_fees"
          title={t('form.reportTypes.hiddenFees.title')}
          description={t('form.reportTypes.hiddenFees.description')}
          isSelected={selectedType === "hidden_fees"}
          onClick={() => onSelect("hidden_fees")}
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
  );
}
