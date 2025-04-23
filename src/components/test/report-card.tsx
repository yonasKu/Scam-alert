"use client";

import Link from "next/link";
import { Report } from "@/lib/api/reports";

interface ReportCardProps {
  report: Report;
  locale: string;
}

export default function ReportCard({ report, locale }: ReportCardProps) {
  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  // Get relative time (e.g., "2 days ago")
  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };
  
  // Get icon for report type
  const getReportTypeIcon = (reportType: string) => {
    let iconColor = "hsl(var(--foreground))";
    
    switch (reportType) {
      case "price_gouging":
        iconColor = "hsl(var(--destructive))";
        return (
          <span style={{ color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="m9 16 4 4 4-4"/>
              <path d="M20 12h-8"/>
            </svg>
          </span>
        );
      case "no_receipt":
        iconColor = "hsl(var(--warning))";
        return (
          <span style={{ color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <line x1="9" x2="15" y1="9" y2="9" />
              <line x1="9" x2="15" y1="15" y2="15" />
            </svg>
          </span>
        );
      case "suspicious_activity":
        iconColor = "hsl(var(--amber))";
        return (
          <span style={{ color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </span>
        );
      case "unauthorized_charges":
        iconColor = "hsl(var(--muted))";
        return (
          <span style={{ color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </span>
        );
      case "false_advertising":
        iconColor = "hsl(var(--warning))";
        return (
          <span style={{ color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6"/>
              <path d="M3 6h18"/>
              <path d="m9 16 4 4 4-4"/>
              <path d="M20 12h-8"/>
            </svg>
          </span>
        );
      case "hidden_fees":
        iconColor = "hsl(var(--destructive))";
        return (
          <span style={{ color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
          </span>
        );
      default:
        iconColor = "hsl(var(--muted-foreground))";
        return (
          <span style={{ color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
          </span>
        );
    }
  };
  
  // Get report type label
  const getReportTypeLabel = (reportType: string) => {
    switch (reportType) {
      case "price_gouging": return "Price Gouging";
      case "no_receipt": return "No Receipt";
      case "suspicious_activity": return "Suspicious Activity";
      case "unauthorized_charges": return "Unauthorized Charges";
      case "false_advertising": return "False Advertising";
      case "hidden_fees": return "Hidden Fees";
      default: return reportType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  return (
    <div style={{
      backgroundColor: 'hsl(var(--card))',
      borderRadius: '0.75rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Card Header */}
      <div style={{
        padding: '1.25rem 1.25rem 0.75rem',
        borderBottom: '1px solid hsla(var(--border) / 0.5)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              lineHeight: '1.4'
            }}>
              {report.title}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {report.location}
            </div>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: 'hsla(var(--primary) / 0.1)',
            color: 'hsl(var(--primary))',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}>
            {getReportTypeIcon(report.report_type)}
            {getReportTypeLabel(report.report_type)}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <Link 
            href={`/${locale}/businesses?search=${encodeURIComponent(report.business_name)}`}
            style={{
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.9375rem'
            }}
          >
            {report.business_name}
          </Link>
        </div>
      </div>
      
      {/* Card Content */}
      <div style={{
        padding: '1.25rem',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <p style={{
          fontSize: '0.9375rem',
          lineHeight: '1.6',
          color: 'hsl(var(--foreground))',
          marginBottom: '1.5rem',
          flex: '1 1 auto',
          display: '-webkit-box',
          WebkitLineClamp: '4',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {report.description}
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid hsla(var(--border) / 0.2)',
          fontSize: '0.875rem',
          color: 'hsl(var(--muted-foreground))'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span title={formatDate(report.created_at)}>
              {getRelativeTime(report.created_at)}
            </span>
          </div>
          
          <Link 
            href={`/${locale}/reports/${report.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid hsla(var(--border) / 0.8)',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
