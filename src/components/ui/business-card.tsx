"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Business, ReportTypeCount } from '@/lib/api/businesses';
import { ImageWithFallback } from '@/components/ui/image-fallback';

interface BusinessCardProps {
  business: Business & {
    lastReported?: string;
    reportTypes?: ReportTypeCount[];
  };
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function BusinessCard({ business, locale, t }: BusinessCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get scam score color based on score value
  const getScamScoreColor = (score?: number) => {
    if (!score) return "hsl(var(--muted-foreground))";
    if (score >= 8) return "hsl(var(--destructive))";
    if (score >= 5) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  // Get report type label
  const getReportTypeLabel = (reportType: string) => {
    return t(`reportTypes.${reportType}`, { fallback: reportType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') });
  };

  // Get icon color based on report type
  const getIconColor = (reportType: string) => {
    switch (reportType) {
      case "price_gouging": return "hsl(var(--destructive))";
      case "no_receipt": return "hsl(var(--warning))";
      case "suspicious_activity": return "hsl(var(--warning))";
      case "unauthorized_business": return "hsl(var(--destructive))";
      case "false_advertising": return "hsl(var(--warning))";
      case "hidden_fees": return "hsl(var(--destructive))";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  // Get icon component based on report type
  const getReportTypeIcon = (reportType: string) => {
    switch (reportType) {
      case "price_gouging":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 5 3-3m-3 3-7 7-7-7m14 0h-4m4 0v-4M5 19l-3 3m3-3 7-7 7 7m-14 0h4m-4 0v4"/>
          </svg>
        );
      case "no_receipt":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/>
            <line x1="3" y1="15" x2="9" y2="15"/>
            <path d="m5 10 4 4 6-6"/>
          </svg>
        );
      case "suspicious_activity":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4"/>
            <path d="M12 16h.01"/>
          </svg>
        );
      case "unauthorized_business":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
            <path d="M9 9h1"/>
            <path d="M9 13h1"/>
            <path d="M9 17h1"/>
          </svg>
        );
      case "false_advertising":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 8 4-4 4 4"/>
            <path d="M11 12H3"/>
            <path d="m9 16 4 4 4-4"/>
            <path d="M20 12h-8"/>
          </svg>
        );
      case "hidden_fees":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4"/>
            <path d="M12 16h.01"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
        );
    }
  };

  return (
    <div 
      style={{ 
        border: "1px solid hsl(var(--border))",
        borderRadius: "0.5rem",
        overflow: "hidden",
        backgroundColor: "hsl(var(--card))",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "0 2px 4px rgba(0, 0, 0, 0.05)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ 
              fontSize: "1.25rem", 
              fontWeight: "600", 
              marginBottom: "0.5rem" 
            }}>
              {business.name}
            </h3>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.875rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{business.city}, {business.state}</span>
            </div>
          </div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end"
          }}>
            <div style={{
              backgroundColor: `${getScamScoreColor(business.scam_score)}10`,
              color: getScamScoreColor(business.scam_score),
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: "600",
              marginBottom: "0.5rem"
            }}>
              {t("scamScore")}: {business.scam_score?.toFixed(1) || "N/A"}
            </div>
            
            <div style={{
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))"
            }}>
              {business.report_count || 0} {t("reports")}
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ 
            fontSize: "0.875rem", 
            fontWeight: "600", 
            marginBottom: "0.75rem",
            color: "hsl(var(--foreground))"
          }}>
            {t("reportTypes.title")}
          </h4>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {business.reportTypes && business.reportTypes.length > 0 ? (
              business.reportTypes.map((report, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem"
                }}>
                  <span style={{ color: getIconColor(report.report_type) }}>
                    {getReportTypeIcon(report.report_type)}
                  </span>
                  <span>{getReportTypeLabel(report.report_type)} ({report.count})</span>
                </div>
              ))
            ) : (
              <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>
                {t("noReportsYet")}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          borderTop: "1px solid hsl(var(--border))",
          paddingTop: "1rem"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem",
            color: "hsl(var(--muted-foreground))",
            fontSize: "0.875rem"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{t("lastReported")}: {business.lastReported || t("unknown")}</span>
          </div>
          
          <Link 
            href={`/${locale}/businesses/${business.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid hsl(var(--border))",
              backgroundColor: "transparent",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "hsl(var(--foreground))",
              textDecoration: "none",
              transition: "all 0.2s"
            }}
          >
            {t("viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}
