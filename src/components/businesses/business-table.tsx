"use client";

import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/components/ui/image-fallback";
import { Button } from "@/components/ui/button";
import { Business, ReportTypeCount } from "@/lib/api/businesses";
import { Report, fetchReportsByBusiness } from "@/lib/api/reports";
import { Modal } from "@/components/ui/modal";
import { createPortal } from "react-dom";

interface BusinessTableProps {
  businesses: Array<Business & {
    lastReported?: string;
    reportTypes?: ReportTypeCount[];
    category?: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    imageUrl?: string;
    verified?: boolean;
  }>;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
}

export default function BusinessTable({ 
  businesses, 
  sortField, 
  sortDirection, 
  handleSort, 
  t,
  locale 
}: BusinessTableProps) {
  // Modal state
  const [selectedBusiness, setSelectedBusiness] = useState<(Business & {
    lastReported?: string;
    reportTypes?: ReportTypeCount[];
    category?: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    imageUrl?: string;
    verified?: boolean;
  }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businessReports, setBusinessReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side rendering for the portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch reports when a business is selected
  useEffect(() => {
    if (selectedBusiness && isModalOpen) {
      const fetchReports = async () => {
        setIsLoading(true);
        try {
          const reports = await fetchReportsByBusiness(selectedBusiness.name);
          setBusinessReports(reports);
        } catch (error) {
          console.error("Error fetching reports:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchReports();
    }
  }, [selectedBusiness, isModalOpen]);

  // Handle business selection
  const handleBusinessSelect = (business: Business & {
    lastReported?: string;
    reportTypes?: ReportTypeCount[];
    category?: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    imageUrl?: string;
    verified?: boolean;
  }) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };
  
  // Get sort indicator icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
  };

  // Format date (helper function for reports)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Report types for lookup
  const reportTypes = [
    { id: "all", label: t("reportTypes.all") },
    { id: "price_gouging", label: t("reportTypes.price_gouging") },
    { id: "no_receipt", label: t("reportTypes.no_receipt") },
    { id: "suspicious_activity", label: t("reportTypes.suspicious_activity") },
    { id: "unauthorized_business", label: t("reportTypes.unauthorized_business") },
    { id: "false_advertising", label: t("reportTypes.false_advertising") },
    { id: "hidden_fees", label: t("reportTypes.hidden_fees") },
    { id: "other", label: t("reportTypes.other") }
  ];

  // Get report type label
  const getReportTypeLabel = (reportType: string) => {
    const foundType = reportTypes.find(type => type.id === reportType);
    return foundType ? foundType.label : reportType;
  };

  // Helper function to determine scam score color
  const getScoreColor = (score?: number) => {
    if (!score) return "hsl(var(--success))";
    if (score >= 6) return "hsl(var(--destructive))";
    if (score >= 3) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  return (
    <>
      <div style={{
        overflowX: "auto",
        backgroundColor: "hsl(var(--card))",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9375rem"
        }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid hsla(var(--border) / 0.5)",
              backgroundColor: "hsla(var(--muted) / 0.3)"
            }}>
              <th style={{
                padding: "1rem",
                textAlign: "left",
                fontWeight: "600",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }} onClick={() => handleSort('name')}>
                {t("tableHeaders.businessName")} {getSortIcon('name')}
              </th>
              <th style={{
                padding: "1rem",
                textAlign: "left",
                fontWeight: "600",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }} onClick={() => handleSort('category')}>
                {t("tableHeaders.category")} {getSortIcon('category')}
              </th>
              <th style={{
                padding: "1rem",
                textAlign: "left",
                fontWeight: "600",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }} onClick={() => handleSort('location')}>
                {t("tableHeaders.location")} {getSortIcon('location')}
              </th>
              <th style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }} onClick={() => handleSort('scamScore')}>
                {t("tableHeaders.scamScore")} {getSortIcon('scamScore')}
              </th>
              <th style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }} onClick={() => handleSort('reportCount')}>
                {t("tableHeaders.reports")} {getSortIcon('reportCount')}
              </th>
              <th style={{
                padding: "1rem",
                textAlign: "left",
                fontWeight: "600",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }} onClick={() => handleSort('lastReported')}>
                {t("tableHeaders.lastReported")} {getSortIcon('lastReported')}
              </th>
              <th style={{
                padding: "1rem",
                textAlign: "left",
                fontWeight: "600",
                whiteSpace: "nowrap"
              }}>
                {t("tableHeaders.mostCommonScams")}
              </th>
              <th style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
                whiteSpace: "nowrap"
              }}>
                {t("tableHeaders.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business, index) => {
              // Determine scam score color
              const scoreColor = getScoreColor(business.scam_score);
              
              return (
                <tr 
                  key={business.id}
                  style={{
                    borderBottom: index < businesses.length - 1 ? "1px solid hsla(var(--border) / 0.2)" : "none",
                    backgroundColor: index % 2 === 0 ? "transparent" : "hsla(var(--muted) / 0.05)"
                  }}
                >
                  <td style={{ padding: "1rem" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        position: "relative",
                        borderRadius: "0.25rem",
                        overflow: "hidden"
                      }}>
                        <ImageWithFallback 
                          src={business.imageUrl || "/shop1.jpg"}
                          alt={business.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div style={{
                          fontWeight: "500",
                          marginBottom: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}>
                          {business.name}
                          {business.verified && (
                            <span style={{
                              color: "hsl(var(--success))",
                              display: "inline-flex",
                              alignItems: "center"
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.35rem 0.75rem",
                      backgroundColor: "hsla(var(--primary) / 0.1)",
                      color: "hsl(var(--primary))",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: "500"
                    }}>
                      {business.category || "Business"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {business.location || `${business.city || ''}, ${business.state || ''}`}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "50%",
                      backgroundColor: scoreColor,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1rem"
                    }}>
                      {business.scam_score ? business.scam_score.toFixed(1) : "N/A"}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <span style={{
                      fontWeight: "600"
                    }}>
                      {business.report_count || 0}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.875rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {business.lastReported || "Unknown"}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem"
                    }}>
                      {business.reportTypes && business.reportTypes.length > 0 ? (
                        business.reportTypes.slice(0, 3).map((report, i) => {
                          // Use translation for report type
                          return (
                            <div key={i} style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontSize: "0.875rem"
                            }}>
                              <span style={{ color: "hsl(var(--foreground))" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"/>
                                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                  <path d="M12 17h.01"/>
                                </svg>
                              </span>
                              <span>{t(`reportTypes.${report.report_type}`)} ({report.count})</span>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>
                          {t("noReportsYet")}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBusinessSelect(business)}
                    >
                      {t("viewDetails")}
                    </Button>
                  </td>
                </tr>
              );
            })}
            
            {businesses.length === 0 && (
              <tr>
                <td colSpan={8} style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "hsl(var(--muted-foreground))"
                }}>
                  {t("noBusinessesFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for business details and reports */}
      {isMounted && isModalOpen && selectedBusiness && createPortal(
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedBusiness.name}
          size="lg"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Business Information */}
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ 
                width: "300px", 
                height: "200px", 
                position: "relative",
                borderRadius: "0.5rem",
                overflow: "hidden",
                flexShrink: 0
              }}>
                <ImageWithFallback 
                  src={selectedBusiness.imageUrl || "/shop1.jpg"}
                  alt={selectedBusiness.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              
              <div style={{ flex: "1" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {selectedBusiness.name}
                  {selectedBusiness.verified && (
                    <span style={{ color: "hsl(var(--success))", display: "inline-flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </span>
                  )}
                </h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{selectedBusiness.location || `${selectedBusiness.city || ''}, ${selectedBusiness.state || ''}`}</span>
                </div>
                
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "50%",
                      backgroundColor: getScoreColor(selectedBusiness.scam_score),
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.125rem",
                      marginBottom: "0.25rem"
                    }}>
                      {selectedBusiness.scam_score ? selectedBusiness.scam_score.toFixed(1) : "N/A"}
                    </div>
                    <span style={{ fontSize: "0.75rem" }}>Scam Score</span>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "50%",
                      backgroundColor: "hsla(var(--primary) / 0.1)",
                      color: "hsl(var(--primary))",
                      fontWeight: "bold",
                      fontSize: "1.125rem",
                      marginBottom: "0.25rem"
                    }}>
                      {selectedBusiness.report_count || 0}
                    </div>
                    <span style={{ fontSize: "0.75rem" }}>Reports</span>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <div style={{
                    display: "inline-block",
                    padding: "0.35rem 0.75rem",
                    backgroundColor: "hsla(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "500"
                  }}>
                    {selectedBusiness.category || t("modalContent.business", { fallback: "Business" })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Common Report Types */}
            {selectedBusiness.reportTypes && selectedBusiness.reportTypes.length > 0 && (
              <div>
                <h4 style={{ fontSize: "1.125rem", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {t("modalContent.commonReportTypes", { fallback: "Common Report Types" })}
                </h4>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {selectedBusiness.reportTypes.map((reportType, index) => (
                    <div key={index} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      backgroundColor: "hsla(var(--muted) / 0.1)",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <path d="M12 17h.01"/>
                      </svg>
                      {t(`reportTypes.${reportType.report_type}`)} ({reportType.count})
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Reports Section */}
            <div>
              <h4 style={{ fontSize: "1.125rem", marginBottom: "1rem", fontWeight: "600" }}>
                {t("modalContent.reports", { fallback: "Reports" })} ({businessReports.length})
              </h4>
              
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ margin: "0 auto 1rem", animation: "spin 1s linear infinite" }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <p>{t("modalContent.loadingReports", { fallback: "Loading reports..." })}</p>
                </div>
              ) : businessReports.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "hsla(var(--muted) / 0.1)", borderRadius: "0.5rem" }}>
                  <p>{t("modalContent.noReportsFound", { fallback: "No reports found for this business." })}</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {businessReports.map((report) => (
                    <div key={report.id} style={{
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid hsla(var(--border) / 0.2)",
                      backgroundColor: "hsla(var(--muted) / 0.05)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <h5 style={{ fontWeight: "600" }}>{report.title || t("modalContent.unnamedReport", { fallback: "Unnamed Report" })}</h5>
                        <span style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "hsla(var(--primary) / 0.1)",
                          color: "hsl(var(--primary))",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          {t(`reportTypes.${report.report_type}`)}
                        </span>
                        {report.category && (
                          <span style={{
                            display: "inline-block",
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "hsla(var(--secondary) / 0.1)",
                            color: "hsl(var(--secondary))",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: "500"
                          }}>
                            {report.category}
                          </span>
                        )}
                      </div>
                      
                      <p style={{ fontSize: "0.9375rem", lineHeight: "1.5" }}>
                        {report.description}
                      </p>
                      
                      {report.reporter_contact && (
                        <div style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                          Reported by: {report.reporter_contact}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>,
        document.body
      )}
    </>
  );
}
