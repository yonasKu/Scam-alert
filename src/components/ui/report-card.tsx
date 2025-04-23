"use client";

import { useState, useEffect } from "react";
import { Report } from "@/lib/api/reports";
import { ImageWithFallback } from "@/components/ui/image-fallback";
import { Modal } from "@/components/ui/modal";
import { createPortal } from "react-dom";

interface ReportCardProps {
  report: Report;
  locale: string;
  translations?: Record<string, any>;
}

import { useTranslations } from 'next-intl';

export default function ReportCard({ report, locale, translations }: ReportCardProps) {
  // Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Get translations from the reports namespace
  const t = useTranslations();
  
  // For convenience, create a function to access reportCard translations
  const tCard = (key: string, params?: Record<string, string>) => {
    // First check if translations were passed as props
    if (translations && translations.reportCard && translations.reportCard[key]) {
      let value = translations.reportCard[key];
      
      // Handle parameters if they exist
      if (params) {
        Object.entries(params).forEach(([param, val]) => {
          value = value.replace(`{${param}}`, String(val));
        });
      }
      
      return value;
    }
    
    // If not found in props or if props weren't passed, try the next-intl translations
    try {
      // First try the reports namespace
      return t(`reports.reportCard.${key}`, params);
    } catch (error) {
      try {
        // Then try the main reportCard namespace
        return t(`reportCard.${key}`, params);
      } catch (error2) {
        console.error(`Translation key not found: reportCard.${key}`);
        return key; // Fallback to the key itself
      }
    }
  };

  // Use useEffect to handle client-side rendering for the portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
  
  // Get report type label
  const getReportTypeLabel = (reportType: string) => {
    // First check if translations were passed as props
    if (translations && 
        translations.reportCard && 
        translations.reportCard.reportTypes && 
        translations.reportCard.reportTypes[reportType]) {
      return translations.reportCard.reportTypes[reportType];
    }
    
    // If not found in props or if props weren't passed, try the next-intl translations
    try {
      return tCard(`reportTypes.${reportType}`);
    } catch (error) {
      // Fallback to formatted string if translation not found
      return reportType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
  // Get report type description
  const getReportTypeDescription = (reportType: string) => {
    // First check if translations were passed as props
    if (translations && 
        translations.reportCard && 
        translations.reportCard.reportTypes && 
        translations.reportCard.reportTypes[`${reportType}_desc`]) {
      return translations.reportCard.reportTypes[`${reportType}_desc`];
    }
    
    // If not found in props or if props weren't passed, try the next-intl translations
    try {
      return tCard(`reportTypes.${reportType}_desc`);
    } catch (error) {
      // Fallback to "Reported issue" if translation not found
      return "Reported issue";
    }
  };
  
  // Get report type icon
  const getReportTypeIcon = (reportType: string) => {
    switch (reportType) {
      case "price_gouging":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        );
      case "no_receipt":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <line x1="9" x2="15" y1="9" y2="9" />
            <line x1="9" x2="15" y1="15" y2="15" />
          </svg>
        );
      case "suspicious_activity":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        );
      case "unauthorized_charges":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case "false_advertising":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6"/>
            <path d="M3 6h18"/>
            <path d="m9 16 4 4 4-4"/>
            <path d="M20 12h-8"/>
          </svg>
        );
      case "hidden_fees":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4"/>
            <path d="M12 16h.01"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
        );
    }
  };

  // Get color for report type
  const getReportTypeColor = (reportType: string) => {
    switch (reportType) {
      case "price_gouging": return "hsl(var(--destructive))";
      case "no_receipt": return "hsl(var(--warning))";
      case "suspicious_activity": return "hsl(var(--amber))";
      case "unauthorized_charges": return "hsl(var(--blue))";
      case "false_advertising": return "hsl(var(--orange))";
      case "hidden_fees": return "hsl(var(--destructive))";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  // Get background color for report type
  const getReportTypeBackgroundColor = (reportType: string) => {
    switch (reportType) {
      case "price_gouging": return "hsla(var(--destructive) / 0.15)";
      case "no_receipt": return "hsla(var(--warning) / 0.15)";
      case "suspicious_activity": return "hsla(var(--amber) / 0.15)";
      case "unauthorized_charges": return "hsla(var(--blue) / 0.15)";
      case "false_advertising": return "hsla(var(--orange) / 0.15)";
      case "hidden_fees": return "hsla(var(--destructive) / 0.15)";
      default: return "hsla(var(--muted) / 0.15)";
    }
  };

  // Get a random image URL for the report
  const getRandomImageUrl = () => {
    const images = ['/shop1.jpg', '/shop2.jpg', '/shop3.jpg', '/shop4.jpg', '/shop5.jpg', '/shop6.jpg', '/shop7.jpg'];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Default image if none is provided - use imageUrl property that was added in the reports page
  const imageUrl = report.imageUrl || getRandomImageUrl();
  
  // Get first letter of reporter name or email (for avatar)
  const getReporterInitial = () => {
    if (report.reporter_contact) {
      return report.reporter_contact.charAt(0).toUpperCase();
    }
    return "A"; // Anonymous
  };

  return (
    <>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        backgroundColor: 'hsl(var(--card))',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
      >
        {/* Report Image */}
        <div style={{
          height: "200px",
          width: "100%",
          position: "relative",
          backgroundColor: "hsla(var(--muted) / 0.2)"
        }}>
          {imageUrl && (
            imageUrl.startsWith('data:image') ? (
              // For base64 encoded images
              <img 
                src={imageUrl} 
                alt={report.business_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            ) : (
              // For regular URL images
              <ImageWithFallback 
                src={imageUrl} 
                alt={report.business_name}
                fill
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%"
                }}
              />
            )
          )}
          <div style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "hsla(var(--primary) / 0.9)",
            color: "white",
            borderRadius: "9999px",
            padding: "0.35rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: "600"
          }}>
            {getReportTypeLabel(report.report_type)}
          </div>
        </div>
        
        {/* Header Section */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1.5rem 0"
        }}>
          <div style={{
            marginBottom: "0.5rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{
                fontSize: "0.875rem",
                color: "hsl(var(--muted-foreground))"
              }}>{report.location}</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{
                fontSize: "0.875rem",
                color: "hsl(var(--muted-foreground))"
              }}>{formatDate(report.created_at)}</span>
            </div>
          </div>
          <h3 style={{
            marginBottom: "0.5rem",
            fontSize: "1.25rem",
            lineHeight: "1.3"
          }}>{report.business_name}</h3>
          <p style={{
            lineHeight: "1.4"
          }}>{report.title}</p>
        </div>
        
        {/* Content Section */}
        <div style={{
          padding: "0 1.5rem",
          flexGrow: 1
        }}>
          {/* Report Type Banner */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            backgroundColor: getReportTypeBackgroundColor(report.report_type),
            borderRadius: "0.5rem",
            marginBottom: "1.25rem"
          }}>
            <div style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              backgroundColor: getReportTypeBackgroundColor(report.report_type),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: getReportTypeColor(report.report_type)
            }}>
              {getReportTypeIcon(report.report_type)}
            </div>
            <div>
              <div style={{
                fontWeight: "600",
                marginBottom: "0.25rem"
              }}>
                {getReportTypeLabel(report.report_type)}
              </div>
              <div style={{
                fontSize: "0.875rem",
                color: "hsl(var(--muted-foreground))"
              }}>
                {getReportTypeDescription(report.report_type)}
              </div>
            </div>
          </div>
          
          {/* Reporter Info */}
          <div style={{
            marginBottom: "1rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem"
            }}>
              <div style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                backgroundColor: "hsla(var(--primary) / 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(var(--primary))",
                fontSize: "1.25rem",
                fontWeight: "600"
              }}>
                {getReporterInitial()}
              </div>
              <div>
                <div style={{
                  fontSize: "0.875rem",
                  fontWeight: "500"
                }}>
                  {report.reporter_contact || tCard('anonymous')}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "hsl(var(--muted-foreground))"
                }}>
                  {tCard('reportedOn', { date: formatDate(report.created_at) })}
                </div>
              </div>
            </div>
            
            <p style={{
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))",
              lineHeight: "1.5",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical"
            }}>
              "{report.description}"
            </p>
          </div>
          
          {/* Status Message */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "hsl(var(--success))",
            fontSize: "0.875rem",
            marginBottom: "1rem"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>{tCard('addedToDatabase')}</span>
          </div>
        </div>
        
        {/* Footer Section */}
        <div style={{
          display: "flex",
          padding: "0 1.5rem 1.5rem",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              fontSize: "0.875rem",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {tCard('viewDetails')}
          </button>
        </div>
      </div>

      {/* Render modal using createPortal to ensure it's at the root level */}
      {isMounted && isModalOpen && createPortal(
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={report.business_name || "Report Details"}
          size="lg"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Image and basic info */}
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ 
                width: "300px", 
                height: "200px", 
                position: "relative",
                borderRadius: "0.5rem",
                overflow: "hidden",
                flexShrink: 0
              }}>
                {imageUrl && (
                  imageUrl.startsWith('data:image') ? (
                    <img 
                      src={imageUrl} 
                      alt={report.business_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"
                      }}
                    />
                  ) : (
                    <ImageWithFallback 
                      src={imageUrl} 
                      alt={report.business_name}
                      fill
                      style={{
                        objectFit: "cover"
                      }}
                    />
                  )
                )}
              </div>
              
              <div style={{ flex: "1" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{report.business_name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{report.location}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Reported on {formatDate(report.created_at)}</span>
                </div>
                
                {/* Report Type Banner */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  backgroundColor: getReportTypeBackgroundColor(report.report_type),
                  borderRadius: "0.5rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    backgroundColor: getReportTypeBackgroundColor(report.report_type),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: getReportTypeColor(report.report_type)
                  }}>
                    {getReportTypeIcon(report.report_type)}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: "600",
                      marginBottom: "0.25rem"
                    }}>
                      {getReportTypeLabel(report.report_type)}
                    </div>
                    <div style={{
                      fontSize: "0.875rem",
                      color: "hsl(var(--muted-foreground))"
                    }}>
                      {getReportTypeDescription(report.report_type)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category and additional details */}
            <div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{
                  display: "inline-block",
                  padding: "0.35rem 0.75rem",
                  backgroundColor: "hsla(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: "600"
                }}>
                  {report.category}
                </div>
              </div>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{tCard('reportTitle')}</h4>
                <p style={{ fontSize: "1rem" }}>{report.title}</p>
              </div>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{tCard('description')}</h4>
                <p style={{ fontSize: "1rem", lineHeight: "1.6" }}>{report.description}</p>
              </div>
            </div>
            
            {/* Reporter information */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "hsla(var(--muted) / 0.1)",
              borderRadius: "0.5rem" 
            }}>
              <div style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                backgroundColor: "hsla(var(--primary) / 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(var(--primary))",
                fontSize: "1.25rem",
                fontWeight: "600"
              }}>
                {getReporterInitial()}
              </div>
              <div>
                <div style={{
                  fontWeight: "600",
                  marginBottom: "0.25rem"
                }}>
                  {tCard('reportedBy', { name: report.reporter_contact || tCard('anonymous') })}
                </div>
                <div style={{
                  fontSize: "0.875rem",
                  color: "hsl(var(--muted-foreground))"
                }}>
                  {tCard('on', { date: formatDate(report.created_at) })}
                </div>
              </div>
            </div>
          </div>
        </Modal>,
        document.body
      )}
    </>
  );
}
