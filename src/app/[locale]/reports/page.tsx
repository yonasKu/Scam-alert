"use client";

import { ImageWithFallback } from "@/components/ui/image-fallback";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchReports, fetchReportsPaginated, Report } from "@/lib/api/reports";
import ReportCard from "@/components/ui/report-card";

export default function ReportsPage() {
  const pathname = usePathname();
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';
  
  // State for translations and reports
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12; // Adjust based on your UI design
  
  // Stats state
  const [totalReports, setTotalReports] = useState(0);
  const [uniqueBusinesses, setUniqueBusinesses] = useState(0);
  const [animatedReportCount, setAnimatedReportCount] = useState(0);
  const [animatedBusinessCount, setAnimatedBusinessCount] = useState(0);
  
  // Load translations
  useEffect(() => {
    async function loadTranslations() {
      try {
        const translationsModule = await import(`../../../../messages/reports/reports.${locale}.json`);
        setTranslations(translationsModule.default);
        setActiveFilter(translationsModule.default.filterCategories.allReports);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English if the requested locale is not available
        const fallbackModule = await import(`../../../../messages/reports/reports.en.json`);
        setTranslations(fallbackModule.default);
        setActiveFilter(fallbackModule.default.filterCategories.allReports);
      }
    }
    
    loadTranslations();
  }, [locale]);
  
  // Fetch initial reports
  useEffect(() => {
    async function getInitialReports() {
      try {
        setInitialLoading(true);
        const { data, total, totalPages } = await fetchReportsPaginated(1, itemsPerPage);
        
        // Enhance reports with image URLs
        const enhancedReports = data.map((report) => ({
          ...report,
          imageUrl: report.photo_url || getRandomImageUrl()
        }));
        
        setReports(enhancedReports);
        setFilteredReports(enhancedReports);
        setTotalItems(total);
        setHasMore(enhancedReports.length < total);
        setError(null);
        
        // Calculate stats
        setTotalReports(total);
        
        // Calculate unique businesses
        const uniqueBusinessNames = new Set(enhancedReports.map(report => report.business_name));
        setUniqueBusinesses(uniqueBusinessNames.size);
        
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    }
    
    getInitialReports();
  }, []);
  
  // Function to load more reports
  async function loadMoreReports() {
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const { data, total } = await fetchReportsPaginated(nextPage, itemsPerPage);
      
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      
      const enhancedReports = data.map((report) => ({
        ...report,
        imageUrl: report.photo_url || getRandomImageUrl()
      }));
      
      setReports(prev => [...prev, ...enhancedReports]);
      setFilteredReports(prev => [...prev, ...enhancedReports]);
      setPage(nextPage);
      setHasMore((reports.length + enhancedReports.length) < total);
    } catch (err) {
      console.error('Error fetching more reports:', err);
    } finally {
      setLoadingMore(false);
    }
  }
  
  // Animate stats counters
  useEffect(() => {
    if (loading || totalReports === 0) return;
    
    let reportCounter = 0;
    let businessCounter = 0;
    
    const reportInterval = setInterval(() => {
      reportCounter += Math.ceil(totalReports / 20);
      if (reportCounter >= totalReports) {
        reportCounter = totalReports;
        clearInterval(reportInterval);
      }
      setAnimatedReportCount(reportCounter);
    }, 50);
    
    const businessInterval = setInterval(() => {
      businessCounter += Math.ceil(uniqueBusinesses / 20);
      if (businessCounter >= uniqueBusinesses) {
        businessCounter = uniqueBusinesses;
        clearInterval(businessInterval);
      }
      setAnimatedBusinessCount(businessCounter);
    }, 50);
    
    return () => {
      clearInterval(reportInterval);
      clearInterval(businessInterval);
    };
  }, [loading, totalReports, uniqueBusinesses]);
  
  // Get random image URL
  function getRandomImageUrl() {
    const images = ['/shop1.jpg', '/shop2.jpg', '/shop3.jpg', '/shop4.jpg', '/shop5.jpg', '/shop6.jpg', '/shop7.jpg'];
    return images[Math.floor(Math.random() * images.length)];
  }
  
  // Helper function for translations
  function t(key: string, params?: Record<string, string | number>) {
    if (!translations) return key;
    
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
    
    return value;
  }
  
  // Filter reports when search or filter changes
  useEffect(() => {
    if (!translations || reports.length === 0) return;
    
    const filterMapping: Record<string, string> = {
      [t('filterCategories.allReports')]: "All Reports",
      [t('filterCategories.groceries')]: "Groceries",
      [t('filterCategories.fuel')]: "Fuel",
      [t('filterCategories.essentials')]: "Essentials",
      [t('filterCategories.electronics')]: "Electronics",
      [t('filterCategories.restaurants')]: "Restaurants",
      [t('filterCategories.accommodation')]: "Accommodation",
      [t('filterCategories.noReceipt')]: "No Receipt",
      [t('filterCategories.suspiciousActivity')]: "Suspicious Activity",
      [t('filterCategories.unauthorizedBusiness')]: "Unauthorized Business"
    };
    
    let filtered = [...reports];
    
    // Apply category filter
    if (activeFilter && activeFilter !== t('filterCategories.allReports')) {
      const englishCategory = filterMapping[activeFilter] || activeFilter;
      filtered = filtered.filter(report => 
        report.category === englishCategory ||
        report.category.toLowerCase().includes(englishCategory.toLowerCase()) ||
        (activeFilter === t('filterCategories.noReceipt') && report.report_type === "no_receipt") ||
        (activeFilter === t('filterCategories.suspiciousActivity') && report.report_type === "suspicious_activity") ||
        (activeFilter === t('filterCategories.unauthorizedBusiness') && report.report_type === "unauthorized_charges")
      );
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report => 
        (report.title?.toLowerCase() || '').includes(query) ||
        (report.business_name?.toLowerCase() || '').includes(query) ||
        (report.description?.toLowerCase() || '').includes(query) ||
        (report.location?.toLowerCase() || '').includes(query) ||
        (report.category?.toLowerCase() || '').includes(query)
      );
    }
    
    setFilteredReports(filtered);
    
    // Reset pagination when filters change
    if (searchQuery.trim() || (activeFilter && activeFilter !== t('filterCategories.allReports'))) {
      // If we're filtering, we don't know if there are more items without a new server request
      // For simplicity, we'll disable "Load More" when filters are applied
      setHasMore(false);
    } else {
      // If no filters are applied, we can use our original hasMore calculation
      setHasMore(reports.length < totalItems);
    }
  }, [searchQuery, activeFilter, reports, translations, totalItems, t]);
  
  // Define report categories for filtering
  const categories = translations ? [
    t('filterCategories.allReports'),
    t('filterCategories.groceries'),
    t('filterCategories.fuel'),
    t('filterCategories.essentials'),
    t('filterCategories.electronics'),
    t('filterCategories.restaurants'),
    t('filterCategories.accommodation'),
    t('filterCategories.noReceipt'),
    t('filterCategories.suspiciousActivity'),
    t('filterCategories.unauthorizedBusiness')
  ] : [];
  
  // Loading state
  if (!translations) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      <div style={{ 
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        padding: "2rem 1.5rem"
      }}>
        {/* Page Header */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          textAlign: "center", 
          maxWidth: "900px", 
          margin: "0 auto",
          marginBottom: "2rem"
        }}>
          <h1 style={{ 
            fontSize: "clamp(2rem, 4vw, 3rem)", 
            fontWeight: "bold", 
            marginBottom: "1rem", 
            fontFamily: "var(--font-heading)",
            backgroundImage: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {t('pageTitle') || "Scam Reports"}
          </h1>
          <div style={{ 
            fontSize: "1.125rem", 
            color: "hsl(var(--muted-foreground))", 
            marginBottom: "2rem", 
            maxWidth: "700px", 
            lineHeight: "1.6" 
          }}>
            {t('pageDescription') || "View and analyze consumer reports of potential scams."}
          </div>
          
          {/* Stats Section */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
            width: "100%",
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1.5rem",
              backgroundColor: "hsla(var(--muted) / 0.05)",
              borderRadius: "0.75rem",
              minWidth: "180px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid hsla(var(--border) / 0.1)"
            }}>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "hsl(var(--primary))",
                marginBottom: "0.5rem"
              }}>
                {animatedReportCount}
              </div>
              <div style={{
                fontSize: "0.875rem",
                color: "hsl(var(--muted-foreground))",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                {translations ? t('totalReports') : 'Total Reports'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            {/* Search Input and Submit Button Row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap"
            }}>
              <div style={{ 
                position: "relative", 
                flex: "1",
                minWidth: "250px"
              }}>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder') || "Search reports..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid hsla(var(--border) / 0.8)",
                    backgroundColor: "transparent",
                    fontSize: "0.875rem",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s"
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
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "hsl(var(--muted-foreground))"
                  }}
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              
              <Link href={`/${locale}/reports/new`} style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                borderRadius: "0.375rem",
                fontWeight: "500",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
                outline: "none",
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                height: "2.75rem",
                padding: "0 1.25rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                fontSize: "0.875rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(var(--primary-hover))";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "hsl(var(--primary))";
                e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
              }}
              >
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
                  style={{ marginRight: "0.5rem" }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {translations ? t('submitNewReport') : 'Submit New Report'}
              </Link>
            </div>
            
            {/* Filter Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              {categories.map((category) => (
                <button
                  key={category}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: activeFilter === category 
                      ? "hsl(var(--primary))" 
                      : "hsla(var(--border) / 0.5)",
                    backgroundColor: activeFilter === category 
                      ? "hsl(var(--primary))" 
                      : "transparent",
                    color: activeFilter === category 
                      ? "hsl(var(--primary-foreground))" 
                      : "hsl(var(--foreground))",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: activeFilter === category 
                      ? "0 2px 5px rgba(0,0,0,0.1)" 
                      : "none"
                  }}
                  onClick={() => setActiveFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Report Results Section */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.25rem" }}>
              {translations ? t('resultsTitle') : 'Report Results'}
            </h2>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              {translations ? t('resultsCount', { count: filteredReports.length }) : `${filteredReports.length} reports found`}
            </p>
          </div>
        </div>
        
        {/* Reports Grid */}
        {initialLoading ? (
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
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              {t('loadingReports') || "Loading Reports"}
            </h3>
            <div>{t('pleaseWaitWhileWeLoadReports') || "Please wait while we load the reports..."}</div>
          </div>
        ) : error ? (
          <div style={{ 
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'hsla(var(--destructive) / 0.1)',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            color: 'hsl(var(--destructive))'
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              {t('errorLoadingReports') || "Error Loading Reports"}
            </h3>
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem' }}
            >
              {t('retryButton') || "Retry"}
            </Button>
          </div>
        ) : filteredReports.length === 0 ? (
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
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              {t('noReportsFound') || "No Reports Found"}
            </h3>
            <div>{t('tryAdjustingYourFilters') || "Try adjusting your filters or search terms"}</div>
          </div>
        ) : (
          <>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
              gap: "2rem"
            }}>
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} locale={locale} translations={translations} />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
                <Button 
                  onClick={loadMoreReports} 
                  disabled={loadingMore}
                  variant="outline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1.5rem"
                  }}
                >
                  {loadingMore ? (
                    <>
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
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      {t('loading') || "Loading..."}
                    </>
                  ) : (
                    <>
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
                      >
                        <polyline points="7 13 12 18 17 13"></polyline>
                        <polyline points="7 6 12 11 17 6"></polyline>
                      </svg>
                      {t('loadMore') || "Load More"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
