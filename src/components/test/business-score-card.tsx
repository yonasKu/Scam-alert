"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Business } from '@/lib/api/businesses';

interface BusinessScoreCardProps {
  business: Business & {
    category?: string;
    location?: string;
    reportCount?: number;
    lastReported?: string;
    issueTypes?: Array<{ type: string; count: number }>;
    details?: string;
    alertLevel?: string;
    reasonText?: string;
    isHighRisk?: boolean;
    isTrending?: boolean;
    isRecent?: boolean;
  };
  locale: string;
  issueTypeLabels: Record<string, string>;
}

export default function BusinessScoreCard({ business, locale, issueTypeLabels }: BusinessScoreCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get border color based on alert level
  const getBorderColor = (alertLevel?: string) => {
    switch(alertLevel) {
      case "High": return "hsl(var(--destructive))";
      case "Medium": return "hsl(var(--warning))";
      case "Low": return "hsl(var(--success))";
      default: return "hsl(var(--muted))";
    }
  };
  
  // Get alert badge style
  const getAlertBadgeStyle = (alertLevel?: string) => {
    switch(alertLevel) {
      case "High": 
        return {
          backgroundColor: "hsla(var(--destructive) / 0.1)",
          color: "hsl(var(--destructive))"
        };
      case "Medium": 
        return {
          backgroundColor: "hsla(var(--warning) / 0.1)",
          color: "hsl(var(--warning))"
        };
      case "Low": 
        return {
          backgroundColor: "hsla(var(--success) / 0.1)",
          color: "hsl(var(--success))"
        };
      default: 
        return {
          backgroundColor: "hsla(var(--muted) / 0.1)",
          color: "hsl(var(--muted-foreground))"
        };
    }
  };

  return (
    <div 
      style={{ 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderLeft: `4px solid ${getBorderColor(business.alertLevel)}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0px)',
        boxShadow: isHovered ? 'rgba(0, 0, 0, 0.1) 0px 12px 20px' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: '1.5rem 1.5rem 0.75rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          marginBottom: '0.75rem' 
        }}>
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '0.5rem', 
              fontFamily: 'var(--font-heading)'
            }}>
              {business.name}
            </h3>
            <div style={{ 
              fontSize: '0.9375rem', 
              color: 'hsl(var(--muted-foreground))'
            }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '0.5rem' 
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {business.location || `${business.city || 'Unknown'}, ${business.state || 'Unknown'}`}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                  <path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.4.8.3 1.3-.1.5-.4.9-.9 1.1l-1 .2c-.6.1-1.1.5-1.4 1-.3.5-.3 1.1-.2 1.7"/>
                  <path d="M12 18h.01"/>
                </svg>
                {business.category || "General"}
              </span>
            </div>
          </div>
          
          <div style={{ 
            ...getAlertBadgeStyle(business.alertLevel),
            borderRadius: '9999px',
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
            {business.alertLevel || 'Unknown'} Risk
          </div>
        </div>
        
        {/* Score display */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: `${getBorderColor(business.alertLevel)}20`,
            color: getBorderColor(business.alertLevel),
            fontWeight: '700',
            fontSize: '1.125rem',
            position: 'relative'
          }}>
            {business.scam_score !== undefined && business.scam_score !== null 
              ? business.scam_score.toFixed(1) 
              : 'N/A'}
            
            {/* Circular progress indicator */}
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0
              }}
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={`${getBorderColor(business.alertLevel)}30`}
                strokeWidth="4"
              />
              {business.scam_score !== undefined && business.scam_score !== null && (
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke={getBorderColor(business.alertLevel)}
                  strokeWidth="4"
                  strokeDasharray={`${(business.scam_score / 10) * 125.6} 125.6`}
                  strokeDashoffset="0"
                  transform="rotate(-90 24 24)"
                />
              )}
            </svg>
          </div>
          
          <div>
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600',
              marginBottom: '0.25rem',
              color: 'hsl(var(--muted-foreground))'
            }}>
              Scam Score
            </div>
            <div style={{ 
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))'
            }}>
              Based on {business.reportCount || 0} reports
            </div>
          </div>
        </div>
        
        {/* Reason why this business is in the list */}
        {business.reasonText && (
          <div style={{ 
            backgroundColor: 'hsla(var(--muted) / 0.1)', 
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
            marginBottom: '1rem'
          }}>
            <span style={{ fontWeight: '500', marginRight: '0.25rem' }}>
              Why it's listed:
            </span>
            {business.reasonText}
          </div>
        )}
        
        {/* Business flags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {business.isHighRisk && (
            <span style={{ 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              backgroundColor: 'hsla(var(--destructive) / 0.1)',
              color: 'hsl(var(--destructive))'
            }}>
              High Risk
            </span>
          )}
          {business.isTrending && (
            <span style={{ 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              backgroundColor: 'hsla(var(--warning) / 0.1)',
              color: 'hsl(var(--warning))'
            }}>
              Trending
            </span>
          )}
          {business.isRecent && (
            <span style={{ 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              backgroundColor: 'hsla(var(--primary) / 0.1)',
              color: 'hsl(var(--primary))'
            }}>
              Recent
            </span>
          )}
        </div>
      </div>
      
      <div style={{ 
        padding: '0.75rem 1.5rem 1.5rem',
        flex: '1 1 auto'
      }}>
        {/* Issue types */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            marginBottom: '0.5rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            Common Issues
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {business.issueTypes && business.issueTypes.length > 0 ? (
              business.issueTypes.map((issue, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: 'hsla(var(--muted) / 0.1)',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ fontWeight: '500' }}>
                    {issueTypeLabels[issue.type] || issue.type}
                  </span>
                  <span style={{ 
                    marginLeft: '0.25rem',
                    backgroundColor: 'hsla(var(--muted) / 0.2)',
                    borderRadius: '9999px',
                    padding: '0 0.375rem',
                    color: 'hsl(var(--muted-foreground))'
                  }}>
                    {issue.count}
                  </span>
                </div>
              ))
            ) : (
              <span style={{ 
                fontSize: '0.875rem', 
                color: 'hsl(var(--muted-foreground))'
              }}>
                No specific issues reported
              </span>
            )}
          </div>
        </div>
        
        {/* Details */}
        <div>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            marginBottom: '0.5rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            Details
          </h4>
          <div style={{ 
            fontSize: '0.9375rem', 
            lineHeight: 1.6,
            color: 'hsl(var(--foreground))'
          }}>
            {business.details || "No detailed information available."}
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '1rem 1.5rem',
        borderTop: '1px solid hsla(var(--border) / 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          color: 'hsl(var(--muted-foreground))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M5 13a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1"/>
            </svg>
            <span>{business.reportCount || 0} Reports</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Last reported: {business.lastReported || "Unknown"}</span>
          </div>
        </div>
        
        <Link 
          href={`/${locale}/businesses/${business.id}`}
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
          View Business
        </Link>
      </div>
    </div>
  );
}
