"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function WatchlistPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("all");

  // Issue type filter options
  const issueTypes = [
    { id: "all", label: "All Issues" },
    { id: "suspicious_charges", label: "Suspicious Charges" },
    { id: "counterfeit", label: "Counterfeit Products" },
    { id: "no_receipt", label: "No Receipts" },
    { id: "misrepresentation", label: "Misrepresentation" },
    { id: "unauthorized_repairs", label: "Unauthorized Repairs" }
  ];
  
  // Mock data for suspicious businesses with consumer protection issues
  const watchlistBusinesses = [
    {
      id: 1,
      name: "FastTech Gadgets",
      category: "Electronics",
      location: "Downtown Tech District",
      reportCount: 23,
      lastReported: "April 12, 2025",
      issueTypes: [
        { type: "suspicious_charges", count: 15 },
        { type: "counterfeit", count: 8 }
      ],
      details: "Multiple customers reported unauthorized charges after shopping here. Some products appear to be counterfeit versions of name brands.",
      alertLevel: "High"
    },
    {
      id: 2,
      name: "Discount Pharmacy",
      category: "Health",
      location: "Medical Plaza, South End",
      reportCount: 15,
      lastReported: "April 10, 2025",
      issueTypes: [
        { type: "counterfeit", count: 12 },
        { type: "misrepresentation", count: 3 }
      ],
      details: "Concerns about authenticity of some prescription medications. Product packaging appears different from official versions.",
      alertLevel: "Medium"
    },
    {
      id: 3,
      name: "Metro Convenience",
      category: "Convenience Store",
      location: "Central Station",
      reportCount: 18,
      lastReported: "April 8, 2025",
      issueTypes: [
        { type: "no_receipt", count: 14 },
        { type: "suspicious_charges", count: 4 }
      ],
      details: "Consistently refuses to provide receipts for purchases. Multiple reports of price discrepancies between shelf and register.",
      alertLevel: "High"
    },
    {
      id: 4,
      name: "Luxury Home Goods",
      category: "Home Furnishings",
      location: "Waterfront Shopping Center",
      reportCount: 9,
      lastReported: "April 5, 2025",
      issueTypes: [
        { type: "misrepresentation", count: 9 }
      ],
      details: "Products advertised as genuine designer brands but appear to be replicas. Materials don't match descriptions.",
      alertLevel: "Medium"
    },
    {
      id: 5,
      name: "Express Auto Service",
      category: "Automotive",
      location: "Industrial District",
      reportCount: 12,
      lastReported: "April 3, 2025",
      issueTypes: [
        { type: "unauthorized_repairs", count: 9 },
        { type: "misrepresentation", count: 3 }
      ],
      details: "Performs unnecessary repairs and charges for services not rendered. Consistent pattern of overcharging.",
      alertLevel: "Medium"
    },
    {
      id: 6,
      name: "Budget Electronics",
      category: "Electronics",
      location: "Outlet Mall, East Wing",
      reportCount: 14,
      lastReported: "March 28, 2025",
      issueTypes: [
        { type: "counterfeit", count: 10 },
        { type: "no_receipt", count: 4 }
      ],
      details: "Selling refurbished items as new. Receipts often not provided, or only handwritten.",
      alertLevel: "High"
    },
    {
      id: 7,
      name: "QuickCash ATM Services",
      category: "Financial",
      location: "Various Locations",
      reportCount: 11,
      lastReported: "March 25, 2025",
      issueTypes: [
        { type: "suspicious_charges", count: 11 }
      ],
      details: "ATM skimming devices detected. Multiple reports of fraudulent transactions after using these machines.",
      alertLevel: "High"
    },
    {
      id: 8,
      name: "Bargain Furniture Outlet",
      category: "Furniture",
      location: "Warehouse District",
      reportCount: 7,
      lastReported: "March 22, 2025",
      issueTypes: [
        { type: "misrepresentation", count: 5 },
        { type: "no_receipt", count: 2 }
      ],
      details: "Furniture materials don't match descriptions. Items advertised as solid wood are actually veneer.",
      alertLevel: "Medium"
    },
    {
      id: 9,
      name: "Quick Fix Phone Repair",
      category: "Electronics Repair",
      location: "Main Street Shopping Center",
      reportCount: 10,
      lastReported: "March 20, 2025",
      issueTypes: [
        { type: "unauthorized_repairs", count: 8 },
        { type: "counterfeit", count: 2 }
      ],
      details: "Replaces genuine parts with aftermarket components without customer consent. Uses counterfeit parts.",
      alertLevel: "Medium"
    },
    {
      id: 10,
      name: "Flash Jewelry",
      category: "Jewelry",
      location: "Fashion Mall, 2nd Floor",
      reportCount: 16,
      lastReported: "March 18, 2025",
      issueTypes: [
        { type: "misrepresentation", count: 12 },
        { type: "counterfeit", count: 4 }
      ],
      details: "Sells gold-plated items as solid gold. Gemstones are often synthetic but sold as natural.",
      alertLevel: "High"
    }
  ];

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    return watchlistBusinesses.filter(business => {
      // Filter by search term
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by issue type
      const matchesIssueType = selectedIssueType === "all" || 
                            business.issueTypes.some(issue => issue.type === selectedIssueType);
                           
      return matchesSearch && matchesIssueType;
    }).sort((a, b) => {
      // Sort by alert level (High > Medium > Low) and then by report count
      if (a.alertLevel !== b.alertLevel) {
        if (a.alertLevel === "High") return -1;
        if (b.alertLevel === "High") return 1;
        if (a.alertLevel === "Medium") return -1;
        if (b.alertLevel === "Medium") return 1;
        return 0;
      }
      
      return b.reportCount - a.reportCount;
    });
  }, [watchlistBusinesses, searchTerm, selectedIssueType]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))" }}>
      {/* Header Section */}
      <section style={{ 
        backgroundColor: "hsla(var(--background) / 0.8)",
        borderBottom: "1px solid hsla(var(--border) / 0.2)",
        padding: "3rem 0 2rem"
      }}>
        <div className="container" style={{ padding: "0 1.5rem" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto"
          }}>
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(to right, hsl(var(--warning)), hsl(var(--foreground)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent"
            }}>
              Consumer Watchlist
            </h1>
            
            <div style={{ 
              fontSize: "1.125rem",
              color: "hsl(var(--muted-foreground))",
              marginBottom: "2rem",
              maxWidth: "700px",
              lineHeight: 1.6
            }}>
              Monitor businesses with suspicious activities, missing receipts, counterfeit products, and other consumer protection concerns
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "2rem 0 4rem" }}>
        <div className="container" style={{ padding: "0 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Search and Filter Tools */}
          <Card style={{ marginBottom: "2rem" }}>
            <CardContent style={{ padding: "1.5rem" }}>
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "1.5rem" 
              }}>
                {/* Search Bar */}
                <div>
                  <label htmlFor="search" style={{ 
                    display: "block", 
                    marginBottom: "0.5rem", 
                    fontSize: "0.875rem", 
                    fontWeight: "500" 
                  }}>
                    Search Businesses
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name, category, location, or issue details..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      fontSize: "0.9375rem"
                    }}
                  />
                </div>

                {/* Issue Type Filters */}
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "0.5rem", 
                    fontSize: "0.875rem", 
                    fontWeight: "500" 
                  }}>
                    Filter by Issue Type
                  </label>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem"
                  }}>
                    {issueTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedIssueType(type.id)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid",
                          borderColor: selectedIssueType === type.id 
                            ? "hsl(var(--warning))" 
                            : "hsla(var(--border) / 0.5)",
                          backgroundColor: selectedIssueType === type.id 
                            ? "hsla(var(--warning) / 0.1)" 
                            : "transparent",
                          color: selectedIssueType === type.id 
                            ? "hsl(var(--warning))" 
                            : "hsl(var(--foreground))",
                          fontWeight: "500",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div style={{ 
            marginBottom: "1.5rem", 
            color: "hsl(var(--muted-foreground))",
            fontSize: "0.9375rem"
          }}>
            Showing {filteredBusinesses.length} businesses on watchlist
          </div>

          {/* Business Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem"
          }}>
            {filteredBusinesses.map(business => (
              <Card key={business.id} style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderLeft: business.alertLevel === "High" 
                  ? "4px solid hsl(var(--destructive))"
                  : business.alertLevel === "Medium"
                    ? "4px solid hsl(var(--warning))"
                    : "4px solid hsl(var(--muted))",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}>
                <CardHeader style={{ padding: "1.5rem 1.5rem 0.75rem" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem"
                  }}>
                    <div>
                      <CardTitle style={{ fontSize: "1.25rem", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>
                        {business.name}
                      </CardTitle>
                      <CardDescription style={{ fontSize: "0.9375rem" }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {business.location}
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                            <path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.4.8.3 1.3-.1.5-.4.9-.9 1.1l-1 .2c-.6.1-1.1.5-1.4 1-.3.5-.3 1.1-.2 1.7"/>
                            <path d="M12 18h.01"/>
                          </svg>
                          {business.category}
                        </div>
                      </CardDescription>
                    </div>
                    <div style={{
                      backgroundColor: business.alertLevel === "High"
                        ? "hsla(var(--destructive) / 0.1)"
                        : business.alertLevel === "Medium"
                          ? "hsla(var(--warning) / 0.1)"
                          : "hsla(var(--muted) / 0.1)",
                      color: business.alertLevel === "High"
                        ? "hsl(var(--destructive))"
                        : business.alertLevel === "Medium"
                          ? "hsl(var(--warning))"
                          : "hsl(var(--muted-foreground))",
                      borderRadius: "9999px",
                      padding: "0.375rem 0.75rem",
                      fontSize: "0.8125rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem"
                    }}>
                      {business.alertLevel === "High" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      )}
                      {business.alertLevel}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent style={{ padding: "0.75rem 1.5rem 1.5rem", flexGrow: 1 }}>
                  {/* Issue Types */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <h4 style={{ 
                      fontSize: "0.875rem", 
                      fontWeight: "600", 
                      marginBottom: "0.75rem",
                      color: "hsl(var(--muted-foreground))"
                    }}>
                      Reported Issues
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {business.issueTypes.map((issue, index) => {
                        // Get issue label from the issue types array
                        const issueLabel = issueTypes.find(t => t.id === issue.type)?.label || issue.type;
                        
                        // Choose icon and color based on issue type
                        let iconColor = "";
                        let Icon = null;
                        
                        switch(issue.type) {
                          case "suspicious_charges":
                            iconColor = "hsl(var(--destructive))";
                            Icon = () => (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="14" x="2" y="5" rx="2"/>
                                <line x1="2" x2="22" y1="10" y2="10"/>
                              </svg>
                            );
                            break;
                          case "counterfeit":
                            iconColor = "hsl(var(--warning))";
                            Icon = () => (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                <path d="M5 13a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1"/>
                              </svg>
                            );
                            break;
                          case "no_receipt":
                            iconColor = "hsl(var(--destructive))";
                            Icon = () => (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <line x1="9" x2="15" y1="9" y2="9" />
                                <line x1="9" x2="15" y1="15" y2="15" />
                              </svg>
                            );
                            break;
                          case "misrepresentation":
                            iconColor = "hsl(var(--warning))";
                            Icon = () => (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 8 4-4 4 4"/>
                                <path d="M11 12H3"/>
                                <path d="m9 16 4 4 4-4"/>
                                <path d="M20 12h-8"/>
                              </svg>
                            );
                            break;
                          case "unauthorized_repairs":
                            iconColor = "hsl(var(--destructive))";
                            Icon = () => (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                              </svg>
                            );
                            break;
                          default:
                            iconColor = "hsl(var(--muted-foreground))";
                            Icon = () => (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                <path d="M12 17h.01"/>
                              </svg>
                            );
                        }
                        
                        return (
                          <div key={index} style={{
                            backgroundColor: "hsla(var(--muted) / 0.2)",
                            borderRadius: "0.375rem",
                            padding: "0.375rem 0.75rem",
                            fontSize: "0.8125rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                          }}>
                            <span style={{ color: iconColor }}>
                              {Icon && <Icon />}
                            </span>
                            <span>
                              {issueLabel} ({issue.count})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Business Details */}
                  <div>
                    <h4 style={{ 
                      fontSize: "0.875rem", 
                      fontWeight: "600", 
                      marginBottom: "0.5rem",
                      color: "hsl(var(--muted-foreground))"
                    }}>
                      Details
                    </h4>
                    <div style={{ 
                      fontSize: "0.9375rem", 
                      lineHeight: 1.6,
                      color: "hsl(var(--foreground))"
                    }}>
                      {business.details}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter style={{ 
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid hsla(var(--border) / 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.875rem",
                    color: "hsl(var(--muted-foreground))"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span>{business.reportCount} reports</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>Last reported: {business.lastReported}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/businesses/${business.id}`}>View Business</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredBusinesses.length === 0 && (
            <div style={{
              padding: "3rem 2rem",
              textAlign: "center",
              backgroundColor: "hsla(var(--muted) / 0.1)",
              borderRadius: "0.75rem",
              color: "hsl(var(--muted-foreground))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 1rem" }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", fontWeight: "600" }}>No businesses found</h3>
              <div>No businesses match your current search filters.</div>
            </div>
          )}
          
          {/* Actions */}
          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Button asChild>
              <Link href="/reports/new">Report a Business</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
