"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchReports } from "@/lib/api/reports";
import type { Report } from "@/lib/api/reports";
import { ImageWithFallback } from "@/components/ui/image-fallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestReportsPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Report type options with labels
  const reportCategories = [
    { id: "all", label: "All Reports" },
    { id: "price_gouging", label: "Price Gouging" },
    { id: "no_receipt", label: "No Receipt" },
    { id: "suspicious_activity", label: "Suspicious Activity" },
    { id: "unauthorized_charges", label: "Unauthorized Charges" },
    { id: "false_advertising", label: "False Advertising" },
    { id: "hidden_fees", label: "Hidden Fees" }
  ];
  
  // Fetch reports on component mount
  useEffect(() => {
    fetchReportData();
  }, []);
  
  // Filter reports when search term or active filter changes
  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, activeFilter]);
  
  // Fetch reports from the API
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      
      // Enhance the reports with additional data for display
      const enhancedReports = data.map((report: Report) => ({
        ...report,
        // Add mock data for display purposes
        category: getCategoryFromReportType(report.report_type),
        date: formatDate(report.created_at),
        verified: Math.random() > 0.5, // Randomly set some reports as verified
        // Use photo_url from database if available, otherwise use a random image
        imageUrl: report.photo_url || getRandomImageUrl(),
        reporterContact: report.reporter_contact || 'Anonymous User',
        reporterComment: report.description,
        price: report.report_type === 'price_gouging' ? {
          before: report.price_before ? `$${report.price_before.toFixed(2)}` : 'N/A',
          after: report.price_after ? `$${report.price_after.toFixed(2)}` : 'N/A'
        } : undefined,
        // Add specific details based on report type
        receiptIssue: report.report_type === 'no_receipt' ? 
          report.receipt_issue_type || 'Suspicious handwritten receipt' : undefined,
        suspiciousActivity: report.report_type === 'suspicious_activity' ? 
          report.suspicious_activity_type || 'Credit card skimming detected' : undefined,
        unauthorizedIssue: report.report_type === 'unauthorized_charges' ? 
          report.unauthorized_issue_type || 'Hidden charges found' : undefined,
        falseAdvertising: report.report_type === 'false_advertising' ? 
          'Misleading product description' : undefined,
        hiddenFees: report.report_type === 'hidden_fees' ? 
          'Undisclosed additional charges' : undefined
      }));
      
      setReports(enhancedReports);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };
  
  // Get initials from a name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'AN';
  };
  
  // Get a random image URL for the report
  const getRandomImageUrl = () => {
    const images = ['/shop1.jpg', '/shop2.jpg', '/shop3.jpg', '/shop4.jpg', '/shop5.jpg', '/shop6.jpg', '/shop7.jpg'];
    return images[Math.floor(Math.random() * images.length)];
  };
  
  // Get category from report type
  const getCategoryFromReportType = (reportType: string) => {
    switch (reportType) {
      case 'price_gouging': return 'Price Gouging';
      case 'no_receipt': return 'No Receipt';
      case 'suspicious_activity': return 'Suspicious Activity';
      case 'unauthorized_charges': return 'Unauthorized Charges';
      case 'false_advertising': return 'False Advertising';
      case 'hidden_fees': return 'Hidden Fees';
      default: return reportType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
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
  
  // Filter reports based on search term and active filter
  const filterReports = () => {
    let filtered = [...reports];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.title?.toLowerCase().includes(term) ||
        report.business_name?.toLowerCase().includes(term) ||
        report.description?.toLowerCase().includes(term) ||
        report.location?.toLowerCase().includes(term)
      );
    }
    
    // Filter by report type
    if (activeFilter !== "all") {
      filtered = filtered.filter(report => report.report_type === activeFilter);
    }
    
    setFilteredReports(filtered);
  };
  
  // Translation helper function (simplified version)
  const t = (key: string, params?: Record<string, string | number>) => {
    const translations: Record<string, string> = {
      'pageTitle': 'Scam Reports',
      'pageDescription': 'View and analyze consumer reports of potential scams.',
      'searchPlaceholder': 'Search reports...',
      'resultsTitle': 'Report Results',
      'resultsCount': '{count} reports found',
      'submitNewReport': 'Submit New Report',
      'loadingTitle': 'Loading Data',
      'loadingDescription': 'Please wait while we fetch the reports data...',
      'errorTitle': 'Error Loading Data',
      'noResultsTitle': 'No Reports Found',
      'noResultsDescription': 'No reports match your current search criteria. Try adjusting your filters.',
      'reportCard.location': '{location}',
      'originalPrice': 'Original Price',
      'gougedPrice': 'Gouged Price',
      'viewFullReport': 'View Full Report',
      'peopleFoundHelpful': '{count} people found this helpful'
    };
    
    let value = translations[key] || key;
    
    if (params) {
      // Replace parameters in the translation string
      Object.entries(params).forEach(([param, val]) => {
        value = value.replace(`{${param}}`, String(val));
      });
    }
    
    return value;
  };
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            {t('pageTitle')}
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'hsl(var(--muted-foreground))',
            marginBottom: '1.5rem'
          }}>
            {t('pageDescription')}
          </p>
          
          {/* Search and filters */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Search */}
            <div style={{
              position: 'relative',
              maxWidth: '400px'
            }}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid hsla(var(--border) / 0.5)',
                  backgroundColor: 'hsla(var(--background) / 0.5)',
                  fontSize: '0.9375rem'
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            
            {/* Report category filters */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {reportCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: activeFilter === category.id
                      ? 'hsl(var(--primary))'
                      : 'hsla(var(--border) / 0.5)',
                    backgroundColor: activeFilter === category.id
                      ? 'hsla(var(--primary) / 0.1)'
                      : 'transparent',
                    color: activeFilter === category.id
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--foreground))',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        {loading ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'hsla(var(--muted) / 0.1)',
            borderRadius: '0.75rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: '0 auto 1rem' }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              {t('loadingTitle')}
            </h3>
            <div>{t('loadingDescription')}</div>
          </div>
        ) : error ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'hsla(var(--destructive) / 0.1)',
            borderRadius: '0.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              {t('errorTitle')}
            </h3>
            <p>{error}</p>
          </div>
        ) : (
          <div>
            {/* Results summary */}
            <div style={{
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  {t('resultsTitle')}
                </h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {t('resultsCount', { count: filteredReports.length })}
                </p>
              </div>
              <Button asChild>
                <Link href={`/${locale}/reports/new`}>
                  {t('submitNewReport')}
                </Link>
              </Button>
            </div>
            
            {/* Reports Grid */}
            {filteredReports.length > 0 ? (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
                gap: "2rem"
              }}>
                {filteredReports.map((report) => (
                  <Card key={report.id} style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer"
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
                      {report.imageUrl && (
                        report.imageUrl.startsWith('data:image') ? (
                          // For base64 encoded images
                          <img 
                            src={report.imageUrl} 
                            alt={report.business_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain"
                            }}
                          />
                        ) : (
                          // For regular URL images
                          <img 
                            src={report.imageUrl} 
                            alt={report.business_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
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
                        {report.category}
                      </div>
                      
                      {report.verified && (
                        <div style={{
                          position: "absolute",
                          top: "1rem",
                          left: "1rem",
                          backgroundColor: "hsla(var(--success) / 0.9)",
                          color: "white",
                          borderRadius: "9999px",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                          Verified
                        </div>
                      )}
                    </div>
                    
                    {/* Card Header */}
                    <CardHeader>
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
                          }}>{t('reportCard.location', {location: report.location})}</span>
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
                          }}>{report.date}</span>
                        </div>
                      </div>

                      <CardTitle style={{
                        marginBottom: "0.5rem",
                        fontSize: "1.25rem",
                        lineHeight: "1.3"
                      }}>{report.business_name}</CardTitle>
                      <CardDescription style={{
                        lineHeight: "1.4"
                      }}>{report.title}</CardDescription>
                    </CardHeader>
                    
                    {/* Card Content */}
                    <CardContent style={{ 
                      padding: "0 1.5rem", 
                      flexGrow: 1
                    }}>
                      {/* Price Comparison for price gouging reports */}
                      {report.report_type === 'price_gouging' && report.price && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          backgroundColor: "hsla(var(--muted) / 0.3)",
                          borderRadius: "0.5rem",
                          marginBottom: "1.25rem"
                        }}>
                          <div>
                            <div style={{
                              fontSize: "0.75rem",
                              color: "hsl(var(--foreground))",
                              marginBottom: "0.25rem"
                            }}>{t('originalPrice')}</div>
                            <div style={{
                              fontWeight: "bold",
                              color: "hsl(var(--foreground))"
                            }}>{report.price.before}</div>
                          </div>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                          
                          <div>
                            <div style={{
                              fontSize: "0.75rem",
                              color: "hsl(var(--destructive))",
                              marginBottom: "0.25rem"
                            }}>{t('gougedPrice')}</div>
                            <div style={{
                              fontWeight: "bold",
                              color: "hsl(var(--destructive))"
                            }}>{report.price.after}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* No Receipt Issue */}
                      {report.report_type === 'no_receipt' && report.receiptIssue && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          backgroundColor: "hsla(var(--warning) / 0.2)",
                          borderRadius: "0.5rem",
                          marginBottom: "1.25rem"
                        }}>
                          <div style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            backgroundColor: "hsla(var(--warning) / 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "hsl(var(--warning))"
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <line x1="9" x2="15" y1="9" y2="9" />
                              <line x1="9" x2="15" y1="15" y2="15" />
                            </svg>
                          </div>
                          <div>
                            <div style={{
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>Receipt Issue</div>
                            <div style={{
                              fontSize: "0.875rem",
                              color: "hsl(var(--muted-foreground))"
                            }}>{report.receiptIssue}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Suspicious Activity */}
                      {report.report_type === 'suspicious_activity' && report.suspiciousActivity && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          backgroundColor: "hsla(var(--amber) / 0.2)",
                          borderRadius: "0.5rem",
                          marginBottom: "1.25rem"
                        }}>
                          <div style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            backgroundColor: "hsla(var(--amber) / 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "hsl(var(--amber))"
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>Suspicious Activity</div>
                            <div style={{
                              fontSize: "0.875rem",
                              color: "hsl(var(--muted-foreground))"
                            }}>{report.suspiciousActivity}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Unauthorized Charges */}
                      {report.report_type === 'unauthorized_charges' && report.unauthorizedIssue && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          backgroundColor: "hsla(var(--muted) / 0.2)",
                          borderRadius: "0.5rem",
                          marginBottom: "1.25rem"
                        }}>
                          <div style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            backgroundColor: "hsla(var(--muted) / 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "hsl(var(--muted))"
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>Unauthorized Charges</div>
                            <div style={{
                              fontSize: "0.875rem",
                              color: "hsl(var(--muted-foreground))"
                            }}>{report.unauthorizedIssue}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* False Advertising */}
                      {report.report_type === 'false_advertising' && report.falseAdvertising && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          backgroundColor: "hsla(var(--orange) / 0.2)",
                          borderRadius: "0.5rem",
                          marginBottom: "1.25rem"
                        }}>
                          <div style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            backgroundColor: "hsla(var(--orange) / 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "hsl(var(--orange))"
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6"/>
                              <path d="M3 6h18"/>
                              <path d="m9 16 4 4 4-4"/>
                              <path d="M20 12h-8"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>False Advertising</div>
                            <div style={{
                              fontSize: "0.875rem",
                              color: "hsl(var(--muted-foreground))"
                            }}>{report.falseAdvertising}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Hidden Fees */}
                      {report.report_type === 'hidden_fees' && report.hiddenFees && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          backgroundColor: "hsla(var(--purple) / 0.2)",
                          borderRadius: "0.5rem",
                          marginBottom: "1.25rem"
                        }}>
                          <div style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            backgroundColor: "hsla(var(--purple) / 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "hsl(var(--purple))"
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 8v4"/>
                              <path d="M12 16h.01"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}>Hidden Fees</div>
                            <div style={{
                              fontSize: "0.875rem",
                              color: "hsl(var(--muted-foreground))"
                            }}>{report.hiddenFees}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Reporter comment */}
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
                            fontWeight: "medium"
                          }}>
                            {getInitials(report.reporterContact || 'AN')}
                          </div>
                          <div>
                            <div style={{
                              fontSize: "0.875rem",
                              fontWeight: "500"
                            }}>
                              {report.reporterContact || 'Anonymous User'}
                            </div>
                            <div style={{
                              fontSize: "0.75rem",
                              color: "hsl(var(--muted-foreground))"
                            }}>
                              {report.created_at ? `Reported on ${formatDate(report.created_at)}` : 'Date not available'}
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
                          &ldquo;{report.reporterComment}&rdquo;
                        </p>
                      </div>
                      
                      {/* Report info instead of votes */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        backgroundColor: "hsla(var(--muted) / 0.1)",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.375rem"
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                        <span>This report has been added to our database for review</span>
                      </div>
                    </CardContent>
                    
                    {/* Card Footer */}
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild style={{ width: "100%" }}>
                        <Link href={`/${locale}/reports/${report.id}`}>{t('viewFullReport')}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: 'hsla(var(--muted) / 0.1)',
                borderRadius: '0.75rem',
                color: 'hsl(var(--muted-foreground))'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {t('noResultsTitle')}
                </h3>
                <div>{t('noResultsDescription')}</div>
              </div>
            )}
            
            {/* Actions */}
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <Button asChild>
                <Link href={`/${locale}/reports/new`}>
                  {t('submitNewReport')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
