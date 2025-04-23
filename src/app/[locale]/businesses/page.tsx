"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  fetchBusinessesWithScores, 
  fetchReportTypesByBusiness,
  Business,
  ReportTypeCount
} from "@/lib/api/businesses";
import { fetchReportsByBusiness } from "@/lib/api/reports";

// Import modular components
import BusinessTable from "@/components/businesses/business-table";
import BusinessCharts from "@/components/businesses/business-charts";
import BusinessFilters from "@/components/businesses/business-filters";

export default function BusinessesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("scamScore");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [businessesData, setBusinessesData] = useState<Array<Business & {
    lastReported?: string;
    reportTypes?: ReportTypeCount[];
    category?: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    imageUrl?: string;
    verified?: boolean;
  }>>([]);
  
  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Try to load the translations for the current locale
        const translationsModule = await import(`../../../../messages/businesses/businesses.${locale}.json`);
        setTranslations(translationsModule.default);
      } catch (error) {
        // Fallback to English if the requested locale is not available
        console.error(`Failed to load translations for locale ${locale}, falling back to English`, error);
        const fallbackModule = await import(`../../../../messages/businesses/businesses.en.json`);
        setTranslations(fallbackModule.default);
      }
    };
    
    loadTranslations();
  }, [locale]);
  
  // Load businesses data
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch businesses with scam scores
        const businesses = await fetchBusinessesWithScores();
        
        // Enhance businesses with additional data
        const enhancedBusinesses = await Promise.all(
          businesses.map(async (business) => {
            try {
              // Get report types for this business
              const reportTypes = await fetchReportTypesByBusiness(business.name);
              
              // Get most recent report date
              const reports = await fetchReportsByBusiness(business.name);
              const lastReported = reports && reports.length > 0 
                ? new Date(reports[0].created_at || Date.now()).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
                : "Unknown";
              
              // Add additional display properties
              return {
                ...business,
                reportTypes,
                lastReported,
                category: business.report_count && business.report_count > 10 ? "High Risk" : 
                          business.report_count && business.report_count > 5 ? "Medium Risk" : "Low Risk",
                location: `${business.city}, ${business.state}`,
                coordinates: { lat: 0, lng: 0 }, // Placeholder for now
                imageUrl: `/shop${Math.floor(Math.random() * 7) + 1}.jpg`,
                verified: business.scam_score ? business.scam_score < 5 : false
              };
            } catch (err) {
              console.error(`Error enhancing business ${business.name}:`, err);
              return business;
            }
          })
        );
        
        setBusinessesData(enhancedBusinesses);
      } catch (err) {
        console.error("Error loading businesses:", err);
        setError("Failed to load businesses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadBusinesses();
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
        // Try to get a fallback value from params if provided
        if (params && 'fallback' in params) {
          return params.fallback as string;
        }
        return key; // Return the key if translation is not found
      }
    }
    
    if (typeof value === 'string' && params) {
      // Replace parameters in the translation string
      return Object.entries(params).reduce((str, [param, val]) => {
        if (param === 'fallback') return str; // Skip fallback parameter
        return str.replace(`{${param}}`, String(val));
      }, value);
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Report type filter options
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

  // Handle column sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    if (!businessesData) return [];
    
    return businessesData.filter(business => {
      // Filter by search term
      const matchesSearch = 
        !searchTerm || 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (business.address && business.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (business.city && business.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (business.state && business.state.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by report type
      const matchesReportType = 
        selectedReportType === "all" || 
        (business.reportTypes && business.reportTypes.some(rt => rt.report_type === selectedReportType));
      
      return matchesSearch && matchesReportType;
    }).sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "category") {
        return sortDirection === "asc"
          ? (a.category || '').localeCompare(b.category || '')
          : (b.category || '').localeCompare(a.category || '');
      } else if (sortField === "reportCount") {
        return sortDirection === "asc"
          ? (a.report_count || 0) - (b.report_count || 0)
          : (b.report_count || 0) - (a.report_count || 0);
      } else {
        // Default sort by scamScore
        return sortDirection === "asc"
          ? (a.scam_score || 0) - (b.scam_score || 0)
          : (b.scam_score || 0) - (a.scam_score || 0);
      }
    });
  }, [businessesData, searchTerm, sortField, sortDirection, selectedReportType]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      padding: "2rem 1.5rem 4rem",
      backgroundColor: "hsl(var(--background))"
    }}>
      {/* Header Section */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto 3rem"
      }}>
        <div style={{
          textAlign: "center",
          padding: "2rem",
          borderRadius: "0.75rem",
          backgroundColor: "hsla(var(--background) / 0.8)",
          borderBottom: "1px solid hsla(var(--border) / 0.2)",
          marginBottom: "2rem"
        }}>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: "var(--font-heading)",
            background: "linear-gradient(to right, hsl(var(--destructive)), hsl(var(--foreground)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent" // Using color instead of textFillColor for TypeScript compatibility
          }}>
            {t("title")}
          </h1>
          <p style={{ 
            fontSize: "1.125rem",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            {t("description")}
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "2rem"
        }}>
          {/* Top Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <div style={{
                backgroundColor: "hsla(var(--primary) / 0.1)",
                borderRadius: "50%",
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(var(--primary))"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span style={{ fontSize: "1.125rem", fontWeight: "500" }}>
                {t("businessesReported", { count: businessesData.length })}
              </span>
            </div>
            
            <Button 
              asChild 
              style={{
                height: "2.75rem",
                padding: "0 1.25rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "500",
                borderRadius: "0.375rem",
                backgroundColor: "hsl(var(--primary))",
                color: "white",
                cursor: "pointer"
              }}
            >
              <Link href={`/${locale}/reports/new`} style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "inherit",
                textDecoration: "none",
                height: "100%",
                width: "100%",
                justifyContent: "center"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                {t("reportBusiness")}
              </Link>
            </Button>
          </div>

          {/* Filters Section */}
          <BusinessFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedReportType={selectedReportType}
            setSelectedReportType={setSelectedReportType}
            reportTypes={reportTypes}
            t={t}
          />

          {/* Charts Section */}
          {!loading && !error && businessesData.length > 0 && (
            <BusinessCharts 
              businessesData={businessesData}
              t={t}
            />
          )}

          {/* Main Content */}
          {loading ? (
            <div style={{
              padding: "3rem 2rem",
              textAlign: "center",
              backgroundColor: "hsla(var(--muted) / 0.1)",
              borderRadius: "0.75rem"
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
                style={{ 
                  margin: "0 auto 1rem",
                  animation: "spin 1s linear infinite"
                }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", fontWeight: "600" }}>
                {t("loading")}
              </h3>
            </div>
          ) : error ? (
            <div
  role="alert"
  aria-live="assertive"
  style={{
    padding: "3rem 2rem",
    textAlign: "center",
    background: "linear-gradient(90deg, hsla(var(--destructive)/0.08), hsla(var(--foreground)/0.03))",
    border: "1.5px solid hsla(var(--destructive)/0.25)",
    borderRadius: "var(--radius, 0.75rem)",
    color: "hsl(var(--destructive))",
    boxShadow: "0 4px 24px 0 hsla(var(--destructive)/0.09)",
    maxWidth: "34rem",
    margin: "2rem auto"
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ margin: "0 auto 1.25rem", display: "block" }}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
  <h3
    style={{
      fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
      marginBottom: "0.5rem",
      fontWeight: 700,
      fontFamily: "var(--font-heading)",
      letterSpacing: "-0.01em"
    }}
  >
    {t("errorTitle")}
  </h3>
  <div
    style={{
      color: "hsl(var(--destructive))",
      fontSize: "1.1rem",
      marginBottom: "1.25rem"
    }}
  >
    {error}
  </div>
  <Button
    variant="destructive"
    onClick={() => window.location.reload()}
    style={{
      marginTop: "0.5rem",
      borderRadius: "9999px",
      padding: "0.75rem 2.25rem",
      fontWeight: 600,
      fontSize: "1rem",
      boxShadow: "0 2px 8px hsla(var(--destructive)/0.10)",
      transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
    }}
    onMouseOver={e => (e.currentTarget.style.background = "hsl(var(--destructive))", e.currentTarget.style.color = "#fff")}
    onFocus={e => (e.currentTarget.style.background = "hsl(var(--destructive))", e.currentTarget.style.color = "#fff")}
    onMouseOut={e => (e.currentTarget.style.background = "", e.currentTarget.style.color = "")}
    onBlur={e => (e.currentTarget.style.background = "", e.currentTarget.style.color = "")}
  >
    {t("tryAgain")}
  </Button>
</div>
          ) : (
            <BusinessTable
              businesses={filteredBusinesses}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              t={t}
              locale={locale}
            />
          )}
        </div>
      </div>
    </div>
  );
}
