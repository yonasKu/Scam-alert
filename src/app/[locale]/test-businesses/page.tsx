"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  getHighRiskBusinesses,
  getRecentlyReportedBusinesses,
  getTrendingBusinesses,
  getBusinessesToWatch,
  fetchMostCommonScams
} from "@/lib/api/businesses";
import { fetchReportsByBusiness } from "@/lib/api/reports"; 
import { Business } from "@/lib/api/businesses";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Issue types for filtering
const ISSUE_TYPES = [
  { id: "all", label: "All Issues" },
  { id: "suspicious_charges", label: "Suspicious Charges" },
  { id: "counterfeit", label: "Counterfeit Products" },
  { id: "no_receipt", label: "No Receipt Provided" },
  { id: "misrepresentation", label: "Misrepresentation" },
  { id: "unauthorized_repairs", label: "Unauthorized Repairs" }
];

export default function TestBusinessesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [businessesData, setBusinessesData] = useState<any[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Get businesses to watch
        const businesses = await getBusinessesToWatch(15);
        
        // Enhance businesses with additional data
        const enhancedBusinesses = await Promise.all(
          businesses.map(async (business) => {
            try {
              if (!business || !business.name) {
                throw new Error("Invalid business data");
              }
              
              // Get common scams for this business
              const commonScams = await fetchMostCommonScams(business.name);
              
              // Convert to the format expected by the UI
              const issueTypes = commonScams && commonScams.length > 0 
                ? commonScams.map(scam => ({
                    type: scam && scam.report_type 
                      ? scam.report_type.toLowerCase().replace(/ /g, '_') 
                      : 'unknown',
                    count: scam ? scam.count : 0
                  }))
                : [];
              
              // Get most recent report date
              const reports = await fetchReportsByBusiness(business.name);
              const lastReported = reports && reports.length > 0 
                ? new Date(reports[0].created_at || Date.now()).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })
                : "Unknown";
              
              // Create details text based on common scams
              let details = "";
              if (commonScams && commonScams.length > 0) {
                const topScam = commonScams[0].report_type;
                if (topScam) {
                  details = `Most commonly reported for ${topScam.toLowerCase()}. `;
                  
                  if (commonScams.length > 1) {
                    const additionalScams = commonScams.slice(1, 3)
                      .filter(s => s && s.report_type)
                      .map(s => s.report_type.toLowerCase());
                    
                    if (additionalScams.length > 0) {
                      details += `Also reported for ${additionalScams.join(', ')}.`;
                    }
                  }
                } else {
                  details = "Multiple issues reported for this business.";
                }
              } else {
                details = "No detailed report information available.";
              }
              
              // Determine alert level based on scam score
              let alertLevel = "Low";
              if (business.scam_score >= 7) alertLevel = "High";
              else if (business.scam_score >= 4) alertLevel = "Medium";
              
              // Create reason text to explain why this business is in the list
              let reasonText = "";
              if (business.isHighRisk) {
                reasonText = `High risk business with a scam score of ${business.scam_score?.toFixed(1) || 'N/A'}.`;
              } else if (business.isTrending) {
                reasonText = "Trending with increased report activity in the last 7 days.";
              } else if (business.isRecent) {
                reasonText = "Recently reported by consumers.";
              }
              
              // Determine business category
              let category = "General";
              if (issueTypes.length > 0) {
                const topIssueType = issueTypes[0].type;
                category = ISSUE_TYPES.find(t => t.id === topIssueType)?.label || "General";
              }
              
              return {
                ...business,
                category,
                location: `${business.city || 'Unknown'}, ${business.state || 'Unknown'}`,
                reportCount: business.report_count || 0,
                lastReported,
                issueTypes,
                details,
                alertLevel,
                reasonText
              };
            } catch (err) {
              console.error(`Error enhancing business ${business?.name || 'unknown'}:`, err);
              return {
                ...business,
                category: "General",
                location: `${business?.city || 'Unknown'}, ${business?.state || 'Unknown'}`,
                reportCount: business?.report_count || 0,
                lastReported: "Unknown",
                issueTypes: [],
                details: "Error loading report details.",
                alertLevel: "Unknown",
                reasonText: ""
              };
            }
          })
        );
        
        setBusinessesData(enhancedBusinesses);
      } catch (err) {
        console.error("Error in test page:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Filter businesses based on search term and selected issue type
  const filteredBusinesses = businessesData.filter(business => {
    if (!business) return false;
    
    const matchesSearch = searchTerm === "" || 
      (business.name && business.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (business.location && business.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (business.details && business.details.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesIssueType = activeTab === "all" || 
      (business.issueTypes && business.issueTypes.some(issue => issue && issue.type === activeTab));
      
    return matchesSearch && matchesIssueType;
  });
  
  // Get border color based on alert level
  const getBorderColor = (alertLevel) => {
    switch(alertLevel) {
      case "High": return "hsl(var(--destructive))";
      case "Medium": return "hsl(var(--warning))";
      case "Low": return "hsl(var(--success))";
      default: return "hsl(var(--muted))";
    }
  };
  
  // Get alert badge style
  const getAlertBadgeStyle = (alertLevel) => {
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
    <section style={{ padding: '2rem 0 4rem' }}>
      <div style={{ padding: '0 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
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
                  Search Businesses
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name, location, or issue details..."
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
              
              {/* Filter buttons */}
              <div>
                <label 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontSize: '0.875rem', 
                    fontWeight: 500 
                  }}
                >
                  Filter by Issue Type
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ISSUE_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: activeTab === type.id 
                          ? 'hsl(var(--warning))' 
                          : 'hsla(var(--border) / 0.5)',
                        backgroundColor: activeTab === type.id 
                          ? 'hsla(var(--warning) / 0.1)' 
                          : 'transparent',
                        color: activeTab === type.id 
                          ? 'hsl(var(--warning))' 
                          : 'hsl(var(--foreground))',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: '0.2s'
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
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
              Loading businesses to watch...
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
              Error Loading Data
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
                {filteredBusinesses.map((business) => (
                  <div 
                    key={business.id} 
                    style={{ 
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      borderLeft: `4px solid ${getBorderColor(business.alertLevel)}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      transform: hoveredCardId === business.id ? 'translateY(-5px)' : 'translateY(0px)',
                      boxShadow: hoveredCardId === business.id 
                        ? 'rgba(0, 0, 0, 0.1) 0px 12px 20px' 
                        : 'none'
                    }}
                    onMouseEnter={() => setHoveredCardId(business.id)}
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
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {business.location}
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
                          {business.alertLevel} Risk
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
                                  {ISSUE_TYPES.find(t => t.id === issue.type)?.label || issue.type}
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
                          {business.details}
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
                          <span>{business.reportCount} Reports</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>Last reported: {business.lastReported}</span>
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
                  No Businesses Found
                </h3>
                <div>No businesses match your current search criteria. Try adjusting your filters or search term.</div>
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
              <p>Total businesses loaded: {businessesData.length}</p>
              <p>Filtered businesses: {filteredBusinesses.length}</p>
              <p>Active filter: {activeTab}</p>
              <p>Search term: {searchTerm || "(none)"}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
