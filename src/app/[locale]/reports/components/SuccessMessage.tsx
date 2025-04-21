"use client";

import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  report: any;
  onSubmitAnother: () => void;
  onViewReports: () => void;
  t: (key: string, params?: Record<string, any>) => string;
  windowWidth: number;
}

export function SuccessMessage({ 
  report, 
  onSubmitAnother, 
  onViewReports, 
  t, 
  windowWidth 
}: SuccessMessageProps) {
  return (
    <div style={{
      padding: "1.5rem",
      backgroundColor: "hsla(var(--success) / 0.1)",
      borderRadius: "0.75rem",
      border: "1px solid hsla(var(--success) / 0.2)",
      marginBottom: "1.5rem"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1rem"
      }}>
        <div style={{
          backgroundColor: "hsla(var(--success) / 0.2)",
          borderRadius: "50%",
          width: "2.5rem",
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "hsl(var(--success))"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 style={{ 
          fontSize: "1.125rem", 
          fontWeight: "600", 
          margin: 0,
          color: "hsl(var(--success))"
        }}>
          {t('form.successMessage.title')}
        </h3>
      </div>
      
      <p style={{ 
        fontSize: "0.9375rem", 
        lineHeight: "1.5", 
        marginBottom: "1.5rem",
        color: "hsl(var(--foreground))"
      }}>
        {t('form.successMessage.description')}
      </p>
      
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "0.5rem", 
        padding: "1.25rem",
        marginBottom: "1.5rem",
        border: "1px solid hsla(var(--border) / 0.3)"
      }}>
        <h4 style={{ 
          fontSize: "1rem", 
          fontWeight: "600", 
          marginTop: 0, 
          marginBottom: "1rem" 
        }}>
          {t('form.successMessage.reportDetails')}
        </h4>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: windowWidth >= 640 ? "1fr 1fr" : "1fr", 
          gap: "1rem" 
        }}>
          <div>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
              {t('form.fields.businessName.label')}:
            </p>
            <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
              {report.business_name}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
              {t('form.fields.location.label')}:
            </p>
            <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
              {report.location}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
              {t('form.fields.category.label')}:
            </p>
            <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
              {report.category}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", margin: "0 0 0.25rem 0" }}>
              {t('form.fields.reportType.label')}:
            </p>
            <p style={{ fontSize: "0.9375rem", fontWeight: "500", margin: 0 }}>
              {report.report_type}
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
          onClick={onSubmitAnother}
          style={{
            padding: "0 1.25rem",
            height: "2.5rem"
          }}
        >
          {t('buttons.submitAnotherReport')}
        </Button>
        <Button 
          type="button"
          onClick={onViewReports}
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
  );
}
