import React from 'react';
import { Button } from "@/components/ui/button";
import { Business, ReportTypeCount } from "@/lib/api/businesses";

interface EnhancedBusiness extends Business {
  reportTypes?: ReportTypeCount[];
}

interface WatchlistBusinessCardProps {
  business: EnhancedBusiness;
  hoveredCardId: string | null;
  setHoveredCardId: (id: string | null) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getAlertLevel: (business: EnhancedBusiness) => string;
  getBorderColor: (alertLevel: string) => string;
  getAlertBadgeStyle: (alertLevel: string) => any;
  getReportTypeIcon: (reportType: string) => React.ReactNode;
  getReportTypeLabel: (reportType: string) => string;
  getReasonText: (business: EnhancedBusiness) => string;
  getIssueDescription: (business: EnhancedBusiness) => string;
  openModal: (business: EnhancedBusiness) => void;
}

export const WatchlistBusinessCard: React.FC<WatchlistBusinessCardProps> = ({
  business,
  hoveredCardId,
  setHoveredCardId,
  t,
  getAlertLevel,
  getBorderColor,
  getAlertBadgeStyle,
  getReportTypeIcon,
  getReportTypeLabel,
  getReasonText,
  getIssueDescription,
  openModal
}) => {
  const alertLevel = getAlertLevel(business);
  const businessId = business.id ? business.id.toString() : "";

  return (
    <div
      key={businessId}
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderLeft: `4px solid ${getBorderColor(alertLevel)}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hoveredCardId === businessId ? 'translateY(-5px)' : 'translateY(0px)',
        boxShadow: hoveredCardId === businessId
          ? 'rgba(0, 0, 0, 0.1) 0px 12px 20px'
          : 'none',
        backgroundColor: 'white'
      }}
      onMouseEnter={() => setHoveredCardId(businessId)}
      onMouseLeave={() => setHoveredCardId(null)}
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
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {business.city}{business.state ? `, ${business.state}` : ""}
              </span>
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

        {/* Reason why this business is in the list */}
        {getReasonText(business) && (
          <div style={{
            backgroundColor: 'hsla(var(--muted) / 0.1)',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
            marginBottom: '1rem'
          }}>
            <span style={{ fontWeight: '500', marginRight: '0.25rem' }}>
              {t("whyListed")}:
            </span>
            {getReasonText(business)}
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
              {t("issueTypes.high_risk")}
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
              {t("issueTypes.trending")}
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
              {t("issueTypes.recent")}
            </span>
          )}
        </div>
      </div>

      <div style={{
        padding: '0.75rem 1.5rem 1.5rem',
        flex: '1 1 auto'
      }}>
        {/* Reported Issues Section */}
        {business.reportTypes && business.reportTypes.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {t("businessDetails.reportedIssues")}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {business.reportTypes.map((reportType, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getReportTypeIcon(reportType.report_type)}
                  <span style={{ fontSize: '0.8125rem', color: 'hsl(var(--muted-foreground))' }}>{getReportTypeLabel(reportType.report_type)} ({reportType.count})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issue description */}
        <div>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            {t("businessDetails.details")}
          </h4>
          <div style={{
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: 'hsl(var(--foreground))'
          }}>
            {getIssueDescription(business)}
          </div>
        </div>
      </div>

      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid hsla(var(--border) / 0.1)',
        backgroundColor: 'hsla(var(--muted) / 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1" />
          </svg>
          <span>{business.report_count || 0} {t("businessDetails.reports")}</span>
        </div>

        <Button variant="outline" size="sm" onClick={() => openModal(business)}>
          {t("viewDetails")}
        </Button>
      </div>
    </div>
  );
};
