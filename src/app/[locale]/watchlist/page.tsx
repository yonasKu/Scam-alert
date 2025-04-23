"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { getBusinessesToWatch, Business, fetchReportTypesByBusiness, ReportTypeCount, fetchReportsByBusiness } from "@/lib/api/businesses";
import { Report } from "@/lib/api/reports";
import { WatchlistBusinessCard } from "@/components/watchlist/watchlist-business-card";
import { WatchlistBusinessModal } from "@/components/watchlist/watchlist-business-modal";

// Extended business type with report types
interface EnhancedBusiness extends Business {
  reportTypes?: ReportTypeCount[];
}

export default function WatchlistPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [businesses, setBusinesses] = useState<EnhancedBusiness[]>([]);
  const [error, setError] = useState("");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  
  // Modal state
  const [selectedBusiness, setSelectedBusiness] = useState<EnhancedBusiness | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businessReports, setBusinessReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Try to load the translations for the current locale
        const translationsModule = await import(`../../../../messages/watchlist/watchlist.${locale}.json`);
        setTranslations(translationsModule.default);
      } catch (error) {
        // Fallback to English if the requested locale is not available
        console.error(`Failed to load translations for locale ${locale}, falling back to English`, error);
        const fallbackModule = await import(`../../../../messages/watchlist/watchlist.en.json`);
        setTranslations(fallbackModule.default);
      }
    };

    loadTranslations();
  }, [locale]);

  // Load businesses to watch
  useEffect(() => {
    const loadBusinessesToWatch = async () => {
      setIsLoading(true);
      try {
        const data = await getBusinessesToWatch(20);

        // Enhance businesses with report types
        const enhancedBusinesses = await Promise.all(
          data.map(async (business) => {
            try {
              // Get report types for this business
              const reportTypes = await fetchReportTypesByBusiness(business.name);
              return {
                ...business,
                reportTypes
              };
            } catch (err) {
              console.error(`Error fetching report types for ${business.name}:`, err);
              return business;
            }
          })
        );

        setBusinesses(enhancedBusinesses);
        setError("");
      } catch (err) {
        console.error("Error fetching businesses to watch:", err);
        setError(t("errors.loadFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessesToWatch();
  }, []);

  // Translation helper function
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations) return key; // Return the key if translations are not loaded yet

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation is not found
      }
    }

    if (typeof value === 'string' && params) {
      // Replace parameters in the translation string
      return Object.entries(params).reduce((str, [param, val]) => {
        return str.replace(`{${param}}`, String(val));
      }, value);
    }

    return typeof value === 'string' ? value : key;
  };

  // Issue type filter options
  const issueTypes = [
    { id: "all", label: t("issueTypes.all") },
    { id: "suspicious_charges", label: t("issueTypes.suspicious_charges") },
    { id: "counterfeit", label: t("issueTypes.counterfeit") },
    { id: "no_receipt", label: t("issueTypes.no_receipt") },
    { id: "misrepresentation", label: t("issueTypes.misrepresentation") },
    { id: "unauthorized_repairs", label: t("issueTypes.unauthorized_repairs") }
  ];

  // Filter businesses based on search term and selected issue type
  const filteredBusinesses = useMemo(() => {
    if (!businesses || businesses.length === 0) return [];

    return businesses.filter((business: EnhancedBusiness) => {
      // Apply search filter
      const matchesSearch = searchTerm === "" ||
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (business.address && business.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (business.city && business.city.toLowerCase().includes(searchTerm.toLowerCase()));

      // Skip issue type filtering since we've moved to the new model without issue types
      // Instead, we'll use the isHighRisk, isRecent, isTrending flags

      return matchesSearch;
    });
  }, [businesses, searchTerm]);

  // Calculate alert level based on scam score like in test-businesses page
  const getAlertLevel = (business: EnhancedBusiness): string => {
    if (business.scam_score && business.scam_score >= 7) return "High";
    if (business.scam_score && business.scam_score >= 4) return "Medium";
    return "Low";
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

  // Map report type to icon and color
  const getReportTypeIcon = (reportType: string) => {
    // Define color and icon path based on report type
    let color = "muted";
    let iconContent = null;

    switch (reportType) {
      case "suspicious_charges":
      case "price_gouging":
        color = "destructive";
        iconContent = (
          <>
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </>
        );
        break;
      case "counterfeit":
      case "fake_products":
        color = "warning";
        iconContent = (
          <>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </>
        );
        break;
      case "no_receipt":
      case "receipt_issues":
        color = "amber";
        iconContent = (
          <>
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 17h.01" />
          </>
        );
        break;
      case "misrepresentation":
      case "false_advertising":
        color = "orange";
        iconContent = (
          <>
            <path d="M9.2 7.2a6 6 0 0 1 8.5 8.5M7.9 7.9a.5.5 0 0 1 0 .7L7.1 9.5M5.5 5.5A11 11 0 1 0 19 19" />
            <path d="m8.3 14.3-1 1.7c-.5.9.1 2 1.2 2 .3 0 .6-.1.8-.2L12 16l2.7 1.7c.2.2.5.3.8.3 1 0 1.7-1.1 1.2-2l-1-1.7c-.2-.3-.2-.7 0-1l1-1.7c.5-.9-.1-2-1.2-2-.3 0-.6.1-.8.2L12 10l-2.7-1.7a1.3 1.3 0 0 0-.8-.2c-1 0-1.7 1.1-1.2 2l1 1.7c.2.3.2.7 0 1Z" />
          </>
        );
        break;
      case "unauthorized_repairs":
      case "repair_issues":
        color = "blue";
        iconContent = (
          <>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </>
        );
        break;
      default:
        iconContent = (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </>
        );
    }

    // Return the icon wrapped in a styled container
    return (
      <div style={{
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '50%',
        backgroundColor: `hsla(var(--${color}) / 0.1)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: `hsl(var(--${color}))`
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {iconContent}
        </svg>
      </div>
    );
  };

  // Get issue description based on flags
  const getIssueDescription = (business: EnhancedBusiness): string => {
    const issues = [];
    if (business.isHighRisk) issues.push(t("issueTypes.high_risk"));
    if (business.isTrending) issues.push(t("issueTypes.trending"));
    if (business.isRecent) issues.push(t("issueTypes.recent"));

    return issues.length > 0 ? issues.join(", ") : t("issueTypes.unknown");
  };

  // Get reason text for why this business is listed
  const getReasonText = (business: EnhancedBusiness): string => {
    if (business.isHighRisk) {
      return `${t("reasonText.highRisk")} ${business.scam_score?.toFixed(1) || 'N/A'}.`;
    } else if (business.isTrending) {
      return t("reasonText.trending");
    } else if (business.isRecent) {
      return t("reasonText.recent");
    }
    return "";
  };

  // Format the report type for display
  const getReportTypeLabel = (reportType: string): string => {
    // Try to get the translation from issueTypes
    const translationKey = `issueTypes.${reportType.toLowerCase()}`;
    const translation = t(translationKey);

    // If we get back the key, it means there's no translation, so format manually
    if (translation === translationKey) {
      return reportType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return translation;
  };

  // Open modal with business details
  const openModal = (business: EnhancedBusiness) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Load reports for the selected business
  useEffect(() => {
    const loadReports = async () => {
      if (!selectedBusiness || !selectedBusiness.id) return;

      setIsLoadingReports(true);
      try {
        // Add type assertion to ensure id is treated as a string
        const reports = await fetchReportsByBusiness(selectedBusiness.id as string);
        setBusinessReports(reports);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setIsLoadingReports(false);
      }
    };

    loadReports();
  }, [selectedBusiness]);

  return (
    <>
      <section style={{ padding: '2rem 0 4rem', backgroundColor: 'hsl(var(--background))' }}>
        <div style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Updated header section to match home page */}
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            borderRadius: '0.75rem',
            backgroundColor: 'hsla(var(--background) / 0.8)',
            borderBottom: '1px solid hsla(var(--border) / 0.2)',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(to right, hsl(var(--warning)), hsl(var(--foreground)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              {t("title")}
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'hsl(var(--muted-foreground))',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              {t("description")}
            </p>
          </div>

          {/* Search section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'hsl(var(--card))' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Search input */}
                <div>
                  <label
                    htmlFor="search"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {t("search.label")}
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid hsla(var(--border) / 0.5)',
                      backgroundColor: 'hsla(var(--background) / 0.5)',
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div style={{
              padding: '3rem 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid hsla(var(--border) / 0.3)',
                borderTopColor: 'hsl(var(--primary))',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }} />
              <p style={{ fontSize: '1.125rem', color: 'hsl(var(--muted-foreground))' }}>
                {t("loading")}
              </p>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : error ? (
            <div style={{
              padding: '2rem',
              backgroundColor: 'hsla(var(--destructive) / 0.1)',
              color: 'hsl(var(--destructive))',
              borderRadius: '0.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {t("errors.title")}
              </h3>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              {filteredBusinesses.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {filteredBusinesses.map((business: EnhancedBusiness) => (
                    <WatchlistBusinessCard
                      key={business.id}
                      business={business}
                      hoveredCardId={hoveredCardId}
                      setHoveredCardId={setHoveredCardId}
                      t={t}
                      getAlertLevel={getAlertLevel}
                      getBorderColor={getBorderColor}
                      getAlertBadgeStyle={getAlertBadgeStyle}
                      getReportTypeIcon={getReportTypeIcon}
                      getReportTypeLabel={getReportTypeLabel}
                      getReasonText={getReasonText}
                      getIssueDescription={getIssueDescription}
                      openModal={openModal}
                    />
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  <p>{t("noResults")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <WatchlistBusinessModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        business={selectedBusiness}
        reports={businessReports}
        isLoading={isLoadingReports}
        t={t}
        getReportTypeIcon={getReportTypeIcon}
        getReportTypeLabel={getReportTypeLabel}
        getIssueDescription={getIssueDescription}
      />
    </>
  );
}
