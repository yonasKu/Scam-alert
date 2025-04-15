"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BusinessesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("scamScore");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedReportType, setSelectedReportType] = useState("all");

  // Report type filter options
  const reportTypes = [
    { id: "all", label: "All Reports" },
    { id: "price_gouging", label: "Price Gouging" },
    { id: "no_receipt", label: "No Receipt" },
    { id: "suspicious_activity", label: "Suspicious Activity" },
    { id: "unauthorized_business", label: "Unauthorized Business" },
    { id: "false_advertising", label: "False Advertising" },
    { id: "hidden_fees", label: "Hidden Fees" },
    { id: "other", label: "Other Issues" }
  ];

  // Mock data for businesses with scam information
  const businesses = [
    {
      id: 1,
      name: "SuperMart Grocery",
      category: "Groceries",
      location: "Springfield, Main St",
      coordinates: { lat: 42.1154, lng: -72.5400 },
      scamScore: 8.7,
      reportCount: 12,
      lastReported: "April 10, 2025",
      reportTypes: [
        { type: "price_gouging", count: 8 },
        { type: "false_advertising", count: 3 },
        { type: "no_receipt", count: 1 }
      ],
      commonScams: ["Price inflation during emergencies", "False discounts", "Mislabeled products"],
      imageUrl: "/shop1.jpg",
      verified: true
    },
    {
      id: 2,
      name: "QuickFuel Gas Station",
      category: "Fuel",
      location: "Riverside, Highway 95",
      coordinates: { lat: 33.9806, lng: -117.3755 },
      scamScore: 9.2,
      reportCount: 23,
      lastReported: "April 8, 2025",
      reportTypes: [
        { type: "price_gouging", count: 15 },
        { type: "hidden_fees", count: 5 },
        { type: "suspicious_activity", count: 3 }
      ],
      commonScams: ["Price gouging during shortages", "Fuel quality issues", "Hidden fees"],
      imageUrl: "/shop2.jpg",
      verified: true
    },
    {
      id: 3,
      name: "MiniMart Corner Store",
      category: "Essentials",
      location: "Oakville, Central Ave",
      coordinates: { lat: 36.1627, lng: -86.7816 },
      scamScore: 9.5,
      reportCount: 18,
      lastReported: "April 5, 2025",
      reportTypes: [
        { type: "price_gouging", count: 12 },
        { type: "no_receipt", count: 6 }
      ],
      commonScams: ["Water price gouging during contamination", "Expired products", "Price switching"],
      imageUrl: "/shop3.jpg",
      verified: true
    },
    {
      id: 4,
      name: "GameStop Electronics",
      category: "Electronics",
      location: "Tech City Mall",
      coordinates: { lat: 37.7749, lng: -122.4194 },
      scamScore: 6.8,
      reportCount: 7,
      lastReported: "April 3, 2025",
      reportTypes: [
        { type: "false_advertising", count: 4 },
        { type: "hidden_fees", count: 2 },
        { type: "price_gouging", count: 1 }
      ],
      commonScams: ["Artificial markup on popular items", "Misleading warranties", "Deceptive bundles"],
      imageUrl: "/shop4.jpg",
      verified: false
    },
    {
      id: 5,
      name: "Gourmet Dining",
      category: "Restaurants",
      location: "Downtown Dining District",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      scamScore: 5.9,
      reportCount: 4,
      lastReported: "April 1, 2025",
      reportTypes: [
        { type: "hidden_fees", count: 3 },
        { type: "price_gouging", count: 1 }
      ],
      commonScams: ["Sudden price increases", "Service fee manipulation", "Portion reduction without notice"],
      imageUrl: "/shop5.jpg",
      verified: false
    },
    {
      id: 6,
      name: "City Center Hotel",
      category: "Accommodation",
      location: "Convention Center Area",
      coordinates: { lat: 32.7767, lng: -96.7970 },
      scamScore: 7.6,
      reportCount: 9,
      lastReported: "March 30, 2025",
      reportTypes: [
        { type: "price_gouging", count: 4 },
        { type: "hidden_fees", count: 5 }
      ],
      commonScams: ["Event-based price surging", "Hidden resort fees", "Amenity bait and switch"],
      imageUrl: "/shop6.jpg",
      verified: true
    },
    {
      id: 7,
      name: "Budget Electronics",
      category: "Electronics",
      location: "Outlet Mall, East Wing",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      scamScore: 8.2,
      reportCount: 14,
      lastReported: "March 28, 2025",
      reportTypes: [
        { type: "suspicious_activity", count: 8 },
        { type: "false_advertising", count: 4 },
        { type: "no_receipt", count: 2 }
      ],
      commonScams: ["Refurbished items sold as new", "Counterfeit products", "Warranty denial"],
      imageUrl: "/shop7.jpg",
      verified: true
    },
    {
      id: 8,
      name: "FastGas Station",
      category: "Fuel",
      location: "Interstate 95, Exit 42",
      coordinates: { lat: 39.9526, lng: -75.1652 },
      scamScore: 6.4,
      reportCount: 8,
      lastReported: "March 25, 2025",
      reportTypes: [
        { type: "suspicious_activity", count: 5 },
        { type: "price_gouging", count: 2 },
        { type: "no_receipt", count: 1 }
      ],
      commonScams: ["Credit card skimming", "Fuel meter manipulation", "Deceptive pricing displays"],
      imageUrl: "/shop8.jpg",
      verified: false
    },
    {
      id: 9,
      name: "PharmaPlus Drugstore",
      category: "Pharmacy",
      location: "Medical District, Block 3",
      coordinates: { lat: 32.7767, lng: -96.7970 },
      scamScore: 5.2,
      reportCount: 5,
      lastReported: "March 25, 2025",
      reportTypes: [
        { type: "price_gouging", count: 3 },
        { type: "no_receipt", count: 2 }
      ],
      commonScams: ["Medicine price markup", "Insurance-related issues", "Expired medication"],
      imageUrl: "/shop9.jpg",
      verified: false
    },
    {
      id: 10,
      name: "Valley Supermarket",
      category: "Groceries",
      location: "Westside Plaza",
      coordinates: { lat: 37.3382, lng: -121.8863 },
      scamScore: 7.8,
      reportCount: 11,
      lastReported: "March 20, 2025",
      reportTypes: [
        { type: "price_gouging", count: 6 },
        { type: "no_receipt", count: 3 },
        { type: "false_advertising", count: 2 }
      ],
      commonScams: ["Sale item stock manipulation", "Checkout price discrepancies", "Expired item sales"],
      imageUrl: "/shop10.jpg",
      verified: true
    },
    {
      id: 11,
      name: "Mountain View Resort",
      category: "Accommodation",
      location: "Highland Hills",
      coordinates: { lat: 39.9526, lng: -75.1652 },
      scamScore: 8.4,
      reportCount: 13,
      lastReported: "March 18, 2025",
      reportTypes: [
        { type: "price_gouging", count: 7 },
        { type: "hidden_fees", count: 4 },
        { type: "suspicious_activity", count: 2 }
      ],
      commonScams: ["Seasonal price gouging", "Cancellation fee scams", "Room condition misrepresentation"],
      imageUrl: "/shop11.jpg",
      verified: true
    },
    {
      id: 12,
      name: "Urban Diner",
      category: "Restaurants",
      location: "City Center, 5th Ave",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      scamScore: 4.7,
      reportCount: 3,
      lastReported: "March 15, 2025",
      reportTypes: [
        { type: "hidden_fees", count: 2 },
        { type: "price_gouging", count: 1 }
      ],
      commonScams: ["Mandatory gratuity misinformation", "Menu price switching", "Surcharge hiding"],
      imageUrl: "/shop12.jpg",
      verified: false
    }
  ];

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      // Filter by search term
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        business.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by report type
      const matchesReportType = selectedReportType === "all" || 
                           business.reportTypes.some(report => report.type === selectedReportType);
                           
      return matchesSearch && matchesReportType;
    }).sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "category") {
        return sortDirection === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (sortField === "reportCount") {
        return sortDirection === "asc"
          ? a.reportCount - b.reportCount
          : b.reportCount - a.reportCount;
      } else {
        // Default sort by scamScore
        return sortDirection === "asc"
          ? a.scamScore - b.scamScore
          : b.scamScore - a.scamScore;
      }
    });
  }, [businesses, searchTerm, sortField, sortDirection, selectedReportType]);

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get sort indicator icon
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <span>↑</span> 
      : <span>↓</span>;
  };

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
          backgroundColor: "hsla(var(--primary) / 0.05)",
          marginBottom: "2rem"
        }}>
          <h1 style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: "var(--font-heading)",
            background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "hsl(var(--foreground))" // Fallback for browsers that don't support background-clip
          }}>
            Scam Watch Business Database
          </h1>
          <p style={{ 
            fontSize: "1.125rem",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Find detailed information about businesses with reported price gouging incidents
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
                {businesses.length} Businesses Reported
              </span>
            </div>
            
            <Button asChild style={{
              height: "2.75rem",
              padding: "0 1.25rem"
            }}>
              <Link href="/reports/new">Report a Business</Link>
            </Button>
          </div>

          {/* Search Bar */}
          <div style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "hsl(var(--card))",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              color: "hsl(var(--muted-foreground))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by business name, location, or scam type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "1rem",
                color: "hsl(var(--foreground))"
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "hsl(var(--muted-foreground))"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Report Type Filter */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "1rem"
          }}>
            <label style={{
              fontWeight: "500",
              fontSize: "0.875rem"
            }}>
              Filter by Report Type
            </label>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem"
            }}>
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedReportType(type.id)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid",
                    borderColor: selectedReportType === type.id 
                      ? "hsl(var(--primary))" 
                      : "hsla(var(--border) / 0.5)",
                    backgroundColor: selectedReportType === type.id 
                      ? "hsla(var(--primary) / 0.1)" 
                      : "transparent",
                    color: selectedReportType === type.id 
                      ? "hsl(var(--primary))" 
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

          {/* Scam Legend */}
          <div style={{
            padding: "1rem",
            backgroundColor: "hsla(var(--muted) / 0.1)",
            borderRadius: "0.5rem",
            marginBottom: "1rem"
          }}>
            <h3 style={{
              fontWeight: "600",
              marginBottom: "0.75rem",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              Scam Score Explanation
            </h3>
            <div style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem" 
              }}>
                <div style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "hsl(var(--success))"
                }}></div>
                <span style={{ fontSize: "0.875rem" }}>1-3.9: Low Risk</span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem" 
              }}>
                <div style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "hsl(var(--warning))"
                }}></div>
                <span style={{ fontSize: "0.875rem" }}>4-6.9: Moderate Risk</span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem" 
              }}>
                <div style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "hsl(var(--destructive))"
                }}></div>
                <span style={{ fontSize: "0.875rem" }}>7-10: High Risk</span>
              </div>
            </div>
          </div>

          {/* Data Table */}
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
                    Business Name {getSortIcon('name')}
                  </th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }} onClick={() => handleSort('category')}>
                    Category {getSortIcon('category')}
                  </th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }} onClick={() => handleSort('location')}>
                    Location {getSortIcon('location')}
                  </th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }} onClick={() => handleSort('scamScore')}>
                    Scam Score {getSortIcon('scamScore')}
                  </th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }} onClick={() => handleSort('reportCount')}>
                    Reports {getSortIcon('reportCount')}
                  </th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }} onClick={() => handleSort('lastReported')}>
                    Last Reported {getSortIcon('lastReported')}
                  </th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    whiteSpace: "nowrap"
                  }}>
                    Most Common Scams
                  </th>
                  <th style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    whiteSpace: "nowrap"
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map((business, index) => {
                  // Determine scam score color
                  let scoreColor = "hsl(var(--success))";
                  if (business.scamScore >= 7) {
                    scoreColor = "hsl(var(--destructive))";
                  } else if (business.scamScore >= 4) {
                    scoreColor = "hsl(var(--warning))";
                  }
                  
                  return (
                    <tr 
                      key={business.id}
                      style={{
                        borderBottom: index < filteredBusinesses.length - 1 ? "1px solid hsla(var(--border) / 0.2)" : "none",
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
                            <Image 
                              src={business.imageUrl}
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
                          {business.category}
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
                          {business.location}
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
                          {business.scamScore.toFixed(1)}
                        </div>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <span style={{
                          fontWeight: "600"
                        }}>
                          {business.reportCount}
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
                          {business.lastReported}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem"
                        }}>
                          {business.reportTypes.map((report, i) => {
                            // Look up label from reportTypes array
                            const reportTypeLabel = reportTypes.find(rt => rt.id === report.type)?.label || report.type;
                            
                            // Choose appropriate icon and color based on report type
                            let iconColor = "";
                            let Icon = null;
                            
                            switch(report.type) {
                              case "price_gouging":
                                iconColor = "hsl(var(--destructive))";
                                Icon = () => (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                                    <path d="M3 6h18"/>
                                    <path d="M16 10a4 4 0 0 1-8 0"/>
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
                              case "suspicious_activity":
                                iconColor = "hsl(var(--warning))";
                                Icon = () => (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                  </svg>
                                );
                                break;
                              case "unauthorized_business":
                                iconColor = "hsl(var(--primary))";
                                Icon = () => (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                  </svg>
                                );
                                break;
                              case "false_advertising":
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
                              case "hidden_fees":
                                iconColor = "hsl(var(--destructive))";
                                Icon = () => (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 8v4"/>
                                    <path d="M12 16h.01"/>
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
                              <div key={i} style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.875rem"
                              }}>
                                <span style={{ color: iconColor }}>
                                  {Icon && <Icon />}
                                </span>
                                <span>{reportTypeLabel} ({report.count})</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/businesses/${business.id}`}>View Details</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredBusinesses.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "hsl(var(--muted-foreground))"
                    }}>
                      No businesses found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
