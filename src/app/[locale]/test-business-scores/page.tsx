"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  getAllBusinessesWithScores,
  getBusinessesByScamScoreRange,
  getHighRiskBusinesses,
  getRecentlyReportedBusinesses,
  getTrendingBusinesses,
  fetchMostCommonScams
} from "@/lib/api/businesses";
import { fetchReportsByBusiness } from "@/lib/api/reports"; 
import { Business } from "@/lib/api/businesses";
import ScoreDistribution from "@/components/test/score-distribution";
import BusinessFilters, { IssueType } from "@/components/test/business-filters";

// Issue types for filtering
const ISSUE_TYPES: IssueType[] = [
  { id: "all", label: "All Issues" },
  { id: "price_gouging", label: "Price Gouging" },
  { id: "no_receipt", label: "No Receipt Provided" },
  { id: "suspicious_activity", label: "Suspicious Activity" },
  { id: "unauthorized_business", label: "Unauthorized Business" },
  { id: "false_advertising", label: "False Advertising" },
  { id: "hidden_fees", label: "Hidden Fees" },
  { id: "other", label: "Other Issues" }
];

// Create a map of issue type IDs to labels
const ISSUE_TYPE_LABELS = ISSUE_TYPES.reduce((acc, type) => {
  acc[type.id] = type.label;
  return acc;
}, {} as Record<string, string>);

export default function TestBusinessScoresPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [enhancedBusinesses, setEnhancedBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Score distribution for visualization
  const [scoreDistribution, setScoreDistribution] = useState<{[key: string]: number}>({});
  
  // Fetch businesses based on filters
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      
      const response = await fetch(`/api/test-business-scores?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching businesses: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred');
      }
      
      setBusinesses(result.data.businesses);
      
      // Calculate score distribution
      const distribution: {[key: string]: number} = {};
      result.data.businesses.forEach((business: Business) => {
        if (business.scam_score !== undefined && business.scam_score !== null) {
          const scoreRange = getScoreRange(business.scam_score);
          distribution[scoreRange] = (distribution[scoreRange] || 0) + 1;
        }
      });
      
      setScoreDistribution(distribution);
      
      // Enhance the businesses with additional data
      enhanceBusinessData(result.data.businesses);
      
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };
  
  // Enhance businesses with additional data
  const enhanceBusinessData = async (businessList: Business[]) => {
    try {
      // Get high risk, trending, and recent businesses for comparison
      const [highRiskBusinesses, trendingBusinesses, recentBusinesses] = await Promise.all([
        getHighRiskBusinesses(100),
        getTrendingBusinesses(100),
        getRecentlyReportedBusinesses(100)
      ]);
      
      // Create lookup maps for quick checking
      const highRiskMap = new Map(highRiskBusinesses.map(b => [b.id, true]));
      const trendingMap = new Map(trendingBusinesses.map(b => [b.id, true]));
      const recentMap = new Map(recentBusinesses.map(b => [b.id, true]));
      
      // Process each business to add enhanced data
      const enhancedData = await Promise.all(businessList.map(async (business) => {
        // Get most common scams for this business
        let commonScams: {scam_description: string, occurrence_count: number}[] = [];
        try {
          commonScams = await fetchMostCommonScams(business.name, 3);
        } catch (err) {
          console.error(`Error fetching common scams for ${business.name}:`, err);
        }
        
        // Get the most recent report date
        let lastReportDate: string | null = null;
        try {
          const reports = await fetchReportsByBusiness(business.name, 1);
          if (reports && reports.length > 0) {
            lastReportDate = reports[0].created_at;
          }
        } catch (err) {
          console.error(`Error fetching reports for ${business.name}:`, err);
        }
        
        // Calculate risk level
        const riskLevel = getRiskLevel(business.scam_score);
        
        // Determine status flags
        const isHighRisk = highRiskMap.has(business.id || '');
        const isTrending = trendingMap.has(business.id || '');
        const isRecent = recentMap.has(business.id || '');
        
        // Format location
        const location = [
          business.city,
          business.state,
          business.zip
        ].filter(Boolean).join(', ');
        
        // Map scam descriptions to report types for proper categorization and icons
        const reportTypes = commonScams.map(scam => {
          const desc = scam.scam_description.toLowerCase();
          let type = "other";
          
          if (desc.includes("price") || desc.includes("goug") || desc.includes("expensive")) {
            type = "price_gouging";
          } else if (desc.includes("receipt") || desc.includes("invoice")) {
            type = "no_receipt";
          } else if (desc.includes("suspicious") || desc.includes("fraud")) {
            type = "suspicious_activity";
          } else if (desc.includes("unauthorized") || desc.includes("illegal")) {
            type = "unauthorized_business";
          } else if (desc.includes("advertis") || desc.includes("mislead") || desc.includes("false")) {
            type = "false_advertising";
          } else if (desc.includes("fee") || desc.includes("charge") || desc.includes("hidden")) {
            type = "hidden_fees";
          }
          
          return {
            type,
            description: scam.scam_description,
            count: scam.occurrence_count,
            label: ISSUE_TYPE_LABELS[type] || "Other Issues"
          };
        });
        
        // Determine business category based on business type, not report type
        // This matches the categories in the business page
        let category = "General";
        const businessName = business.name.toLowerCase();
        
        if (businessName.includes("market") || businessName.includes("mart") || businessName.includes("grocer") || businessName.includes("food")) {
          category = "Groceries";
        } else if (businessName.includes("gas") || businessName.includes("fuel") || businessName.includes("petrol") || businessName.includes("station")) {
          category = "Fuel";
        } else if (businessName.includes("tech") || businessName.includes("computer") || businessName.includes("phone") || businessName.includes("electronic")) {
          category = "Electronics";
        } else if (businessName.includes("hotel") || businessName.includes("motel") || businessName.includes("inn") || businessName.includes("stay") || businessName.includes("lodge")) {
          category = "Accommodation";
        } else if (businessName.includes("restaurant") || businessName.includes("cafe") || businessName.includes("diner") || businessName.includes("food")) {
          category = "Restaurants";
        } else if (businessName.includes("shop") || businessName.includes("store") || businessName.includes("retail")) {
          category = "Retail";
        } else if (businessName.includes("service") || businessName.includes("repair") || businessName.includes("fix")) {
          category = "Services";
        } else if (reportTypes.length > 0) {
          // Fallback to report type-based categorization if business name doesn't provide clues
          const topType = reportTypes[0].type;
          switch (topType) {
            case "price_gouging":
              category = "Groceries";
              break;
            case "hidden_fees":
              category = "Fuel";
              break;
            case "false_advertising":
              category = "Electronics";
              break;
            case "no_receipt":
              category = "Retail";
              break;
            case "suspicious_activity":
              category = "Services";
              break;
            case "unauthorized_business":
              category = "Accommodation";
              break;
          }
        }
        
        return {
          ...business,
          riskLevel,
          location,
          category,
          isHighRisk,
          isTrending,
          isRecent,
          commonScams,
          reportTypes,
          lastReportDate,
          statusFlags: {
            highRisk: isHighRisk,
            trending: isTrending,
            recent: isRecent
          }
        };
      }));
      
      setEnhancedBusinesses(enhancedData);
      setLoading(false);
    } catch (err) {
      console.error('Error enhancing business data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };
  
  // Get score range category (0-2, 2-4, 4-6, 6-8, 8-10)
  const getScoreRange = (score: number): string => {
    if (score < 2) return '0-2';
    if (score < 4) return '2-4';
    if (score < 6) return '4-6';
    if (score < 8) return '6-8';
    return '8-10';
  };
  
  // Get risk level from score
  const getRiskLevel = (score: number | undefined | null): string => {
    if (score === undefined || score === null) return 'Unknown';
    if (score >= 7) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  // Get color based on risk level
  const getRiskColor = (score: number | undefined | null): string => {
    const level = getRiskLevel(score);
    switch(level) {
      case 'High': return 'hsl(var(--destructive))';
      case 'Medium': return 'hsl(var(--warning))';
      case 'Low': return 'hsl(var(--success))';
      default: return 'hsl(var(--muted))';
    }
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
      case "unauthorized_business":
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
              <path d="M3 8 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
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
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string | null): string => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };
  
  // Filter businesses by search term and issue type
  const filteredBusinesses = enhancedBusinesses.filter(business => {
    if (!business) return false;
    
    // Filter by search term
    if (searchTerm && !business.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by active tab (issue type)
    if (activeTab !== 'all') {
      // Check if business has any report with this issue type
      const hasIssueType = business.reportTypes?.some(report => report.type === activeTab);
      if (!hasIssueType) return false;
    }
    
    return true;
  });
  
  // Apply filters when component mounts
  useEffect(() => {
    fetchBusinesses();
  }, []); // Only run on mount
  
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
            Business Scam Scores
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'hsl(var(--muted-foreground))',
            marginBottom: '1.5rem'
          }}>
            View and analyze businesses by their scam risk scores.
          </p>
          
          {/* Search and tabs */}
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
                placeholder="Search businesses..."
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
            
            {/* Issue type tabs */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {ISSUE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: activeTab === type.id
                      ? 'hsl(var(--primary))'
                      : 'hsla(var(--border) / 0.5)',
                    backgroundColor: activeTab === type.id
                      ? 'hsla(var(--primary) / 0.1)'
                      : 'transparent',
                    color: activeTab === type.id
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--foreground))',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Score distribution */}
        <div style={{
          backgroundColor: 'hsl(var(--card))',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Score Distribution
          </h3>
          <ScoreDistribution distribution={scoreDistribution} />
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
              Loading Data
            </h3>
            <div>Please wait while we fetch the business data...</div>
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
              Error Loading Data
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
                  Business Results
                </h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {filteredBusinesses.length} businesses found
                </p>
              </div>
            </div>
            
            {/* Business table */}
            {filteredBusinesses.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9375rem'
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid hsla(var(--border) / 0.5)',
                      backgroundColor: 'hsla(var(--muted) / 0.3)'
                    }}>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Business
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Category
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Location
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'center',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Scam Score
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'center',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Reports
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Last Reported
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Most Common Scams
                      </th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'center',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBusinesses.map((business, index) => {
                      // Determine scam score color
                      let scoreColor = "hsl(var(--success))";
                      if (business.scam_score >= 7) {
                        scoreColor = "hsl(var(--destructive))";
                      } else if (business.scam_score >= 4) {
                        scoreColor = "hsl(var(--warning))";
                      }
                      
                      return (
                        <tr key={business.id || index} style={{
                          borderBottom: index < filteredBusinesses.length - 1 ? '1px solid hsla(var(--border) / 0.2)' : 'none',
                          backgroundColor: index % 2 === 0 ? 'transparent' : 'hsla(var(--muted) / 0.05)'
                        }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: '500' }}>{business.name}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.35rem 0.75rem',
                              backgroundColor: 'hsla(var(--primary) / 0.1)',
                              color: 'hsl(var(--primary))',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {business.category}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {business.location || 'Unknown location'}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '2.5rem',
                              height: '2.5rem',
                              borderRadius: '50%',
                              backgroundColor: scoreColor,
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1rem'
                            }}>
                              {business.scam_score?.toFixed(1) || '0.0'}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{
                              fontWeight: '600'
                            }}>
                              {business.report_count || 0}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.875rem'
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                              {formatRelativeTime(business.lastReportDate)}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem'
                            }}>
                              {business.reportTypes && business.reportTypes.length > 0 ? (
                                business.reportTypes.map((report, i) => (
                                  <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem'
                                  }}>
                                    {getReportTypeIcon(report.type)}
                                    <span>{report.label} ({report.count})</span>
                                  </div>
                                ))
                              ) : (
                                <span style={{ color: 'hsl(var(--muted-foreground))' }}>No common scams</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
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
                              View Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                  No Businesses Found
                </h3>
                <div>No businesses match your current search criteria. Try adjusting your filters.</div>
              </div>
            )}
            
            {/* Actions */}
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <Link 
                href={`/${locale}/reports/new`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.375rem',
                  backgroundColor: 'hsl(var(--primary))',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  color: 'hsl(var(--primary-foreground))',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                Report a Business
              </Link>
            </div>
            
            {/* Debug info */}
            <div style={{ 
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: 'hsla(var(--muted) / 0.1)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Debug Information</h3>
              <p>Total businesses: {businesses.length}</p>
              <p>Enhanced businesses: {enhancedBusinesses.length}</p>
              <p>Filtered businesses: {filteredBusinesses.length}</p>
              <p>Active filter: {activeTab}</p>
              <p>Search term: {searchTerm || "(none)"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
