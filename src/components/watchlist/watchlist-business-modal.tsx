import React from 'react';
import { Modal } from "@/components/ui/modal";
import { Business, ReportTypeCount } from "@/lib/api/businesses";
import { Report } from "@/lib/api/reports";

interface EnhancedBusiness extends Business {
  reportTypes?: ReportTypeCount[];
  imageUrl?: string; // Add imageUrl property to EnhancedBusiness interface
}

interface WatchlistBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: EnhancedBusiness | null;
  reports: Report[];
  isLoading: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  getReportTypeIcon: (reportType: string) => React.ReactNode;
  getReportTypeLabel: (reportType: string) => string;
  getIssueDescription: (business: EnhancedBusiness) => string;
}

export const WatchlistBusinessModal: React.FC<WatchlistBusinessModalProps> = ({
  isOpen,
  onClose,
  business,
  reports,
  isLoading,
  t,
  getReportTypeIcon,
  getReportTypeLabel,
  getIssueDescription
}) => {
  if (!isOpen || !business) return null;
  
  // Get alert level based on scam score
  const getAlertLevel = (business: EnhancedBusiness) => {
    if (business.scam_score && business.scam_score >= 7) return "High";
    if (business.scam_score && business.scam_score >= 4) return "Medium";
    return "Low";
  };
  
  // Get alert badge style
  const getAlertBadgeStyle = (alertLevel: string) => {
    switch (alertLevel) {
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
  
  // Get border color based on alert level
  const getBorderColor = (alertLevel: string) => {
    switch (alertLevel) {
      case "High": return "hsl(var(--destructive))";
      case "Medium": return "hsl(var(--warning))";
      case "Low": return "hsl(var(--success))";
      default: return "hsl(var(--muted))";
    }
  };
  
  const alertLevel = getAlertLevel(business);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={business.name}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Business header with alert level */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "hsla(var(--muted) / 0.05)",
          borderRadius: "0.5rem",
          borderLeft: `4px solid ${getBorderColor(alertLevel)}`
        }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ 
              width: "60px", 
              height: "60px", 
              borderRadius: "50%", 
              backgroundColor: "hsla(var(--muted) / 0.1)", 
              overflow: "hidden",
              flexShrink: 0
            }}>
              {business.imageUrl && (
                <img 
                  src={business.imageUrl} 
                  alt={business.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              )}
            </div>
            <div>
              <h2 style={{ 
                fontSize: "1.5rem", 
                fontWeight: "600", 
                marginBottom: "0.25rem",
                fontFamily: "var(--font-heading)"
              }}>
                {business.name}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                  {business.city}{business.state ? `, ${business.state}` : ""}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{
            ...getAlertBadgeStyle(alertLevel),
            borderRadius: '9999px',
            padding: '0.375rem 0.75rem',
            fontSize: '0.8125rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            {alertLevel === "High" && (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            )}
            {t(`alertLevels.${alertLevel.toLowerCase()}`)} {t("risk")}
          </div>
        </div>
        
        {/* Business metrics */}
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          marginBottom: "1.5rem",
          flexWrap: "wrap"
        }}>
          <div style={{ 
            flex: "1", 
            minWidth: "180px", 
            padding: "1.25rem", 
            borderRadius: "0.5rem", 
            backgroundColor: "hsla(var(--muted) / 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              backgroundColor: getBorderColor(alertLevel),
              color: "white",
              fontWeight: "bold",
              fontSize: "1.25rem",
              marginBottom: "0.5rem"
            }}>
              {business.scam_score ? business.scam_score.toFixed(1) : "N/A"}
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>{t("scamScore", { fallback: "Scam Score" })}</span>
          </div>
          
          <div style={{ 
            flex: "1", 
            minWidth: "180px", 
            padding: "1.25rem", 
            borderRadius: "0.5rem", 
            backgroundColor: "hsla(var(--muted) / 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              backgroundColor: "hsla(var(--primary) / 0.2)",
              color: "hsl(var(--primary))",
              fontWeight: "bold",
              fontSize: "1.25rem",
              marginBottom: "0.5rem"
            }}>
              {business.report_count || reports.length || 0}
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>{t("businessDetails.totalReports", { fallback: "Total Reports" })}</span>
          </div>
          
          <div style={{ 
            flex: "1", 
            minWidth: "180px", 
            padding: "1.25rem", 
            borderRadius: "0.5rem", 
            backgroundColor: "hsla(var(--muted) / 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              backgroundColor: "hsla(var(--muted) / 0.2)",
              color: "hsl(var(--muted-foreground))",
              marginBottom: "0.5rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>{t("businessDetails.addToWatchlist", { fallback: "Add to Watchlist" })}</span>
          </div>
        </div>
        
        {/* Business description/reason */}
        <div style={{
          padding: "1.25rem",
          backgroundColor: "hsla(var(--muted) / 0.05)",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          <h3 style={{ 
            fontSize: "1.125rem", 
            fontWeight: "600", 
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {t("businessDetails.whyConcerning", { fallback: "Why This Business Is Concerning" })}
          </h3>
          <p style={{ fontSize: "0.9375rem", lineHeight: "1.6" }}>
            {t("businessDetails.concerningDescription", { 
              count: business.report_count || reports.length || 0,
              score: business.scam_score?.toFixed(1) || 'N/A',
              fallback: `This business has received ${business.report_count || reports.length || 0} reports from customers, with a scam score of ${business.scam_score?.toFixed(1) || 'N/A'}.`
            })}
            {business.scam_score && business.scam_score >= 7 && t("businessDetails.highScoreWarning", { fallback: " The high scam score indicates significant consumer concerns." })}
            {business.scam_score && business.scam_score >= 4 && business.scam_score < 7 && t("businessDetails.mediumScoreWarning", { fallback: " The medium scam score suggests some potential issues that consumers should be aware of." })}
            {business.scam_score && business.scam_score < 4 && t("businessDetails.lowScoreWarning", { fallback: " The low scam score indicates minimal reported issues, but caution is still advised." })}
          </p>
        </div>

        {/* Reported Issues Section */}
        {business.reportTypes && business.reportTypes.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ 
              fontSize: "1.125rem", 
              fontWeight: "600", 
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 16h.01" />
                <path d="M8 16h.01" />
                <path d="M12 20h.01" />
                <path d="M20 8h.01" />
                <path d="M20 12h.01" />
                <path d="M4 8h.01" />
                <path d="M4 12h.01" />
                <path d="M12 4h.01" />
                <path d="M6 16 20 4" />
                <path d="m4 20 14-12" />
              </svg>
              {t("businessDetails.reportedIssues", { fallback: "Reported Issues" })}
            </h3>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
              gap: "0.75rem" 
            }}>
              {business.reportTypes.map((reportType, index) => (
                <div key={index} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "hsla(var(--muted) / 0.05)",
                  borderRadius: "0.375rem"
                }}>
                  {getReportTypeIcon(reportType.report_type)}
                  <span style={{ fontSize: "0.875rem" }}>
                    {getReportTypeLabel(reportType.report_type)} 
                    <span style={{ fontWeight: "600" }}>({reportType.count})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ 
            fontSize: "1.125rem", 
            fontWeight: "600", 
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
              <line x1="9" y1="9" x2="10" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
            </svg>
            {t("businessDetails.customerReports", { fallback: "Customer Reports" })}
          </h3>
          
          {isLoading ? (
            <div style={{
              padding: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "hsla(var(--muted) / 0.05)",
              borderRadius: "0.5rem"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "3px solid hsla(var(--border) / 0.3)",
                borderTopColor: "hsl(var(--primary))",
                animation: "spin 1s linear infinite"
              }} />
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : reports.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {reports.map((report, index) => (
                <div key={index} style={{ 
                  padding: "1rem", 
                  borderRadius: "0.5rem", 
                  backgroundColor: "hsla(var(--muted) / 0.05)",
                  border: "1px solid hsla(var(--border) / 0.1)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <h4 style={{ fontWeight: "600" }}>{report.title || t("businessDetails.unnamedReport", { fallback: "Unnamed Report" })}</h4>
                    <span style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                      {report.created_at ? new Date(report.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  
                  {report.report_type && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "hsla(var(--primary) / 0.1)",
                        color: "hsl(var(--primary))",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500"
                      }}>
                        {getReportTypeLabel(report.report_type)}
                      </span>
                    </div>
                  )}
                  
                  <p style={{ fontSize: "0.9375rem", lineHeight: "1.5" }}>
                    {report.description}
                  </p>
                  
                  {report.reporter_contact && (
                    <div style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
                      {t("businessDetails.reportedBy", { fallback: "Reported by" })}: {report.reporter_contact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: "2rem", 
              textAlign: "center", 
              backgroundColor: "hsla(var(--muted) / 0.05)",
              borderRadius: "0.5rem",
              color: "hsl(var(--muted-foreground))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 1rem" }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              <p>{t("businessDetails.noReports")}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
