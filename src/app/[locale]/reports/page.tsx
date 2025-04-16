"use client";

import { ImageWithFallback } from "@/components/ui/image-fallback";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  const pathname = usePathname();
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';
  
  // State for translations
  const [translations, setTranslations] = useState<Record<string, any> | null>(null);
  const [activeFilter, setActiveFilter] = useState('');
  
  // Load the page-specific translations
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
  
  // If translations are not loaded yet, show a loading state
  if (!translations) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Helper function to use translations
  const t = (key: string, params?: Record<string, string | number>) => {
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
  };

  // Mock data for reports with expanded information
  const reports = [
    {
      id: 1,
      title: "Grocery store tripled prices after storm",
      description: "Local market increased essential item prices by 300% during the recent weather emergency.",
      businessName: "SuperMart Grocery",
      location: "Springfield, Main St",
      coordinates: { lat: 42.1154, lng: -72.5400 },
      date: "April 10, 2025",
      category: "Groceries",
      reportType: "price_gouging",
      reporterComment: "I went to buy basic supplies after the storm and found that water bottles were $12 each, bread was $15 a loaf, and batteries were $25 per pack. This is clearly taking advantage of people in need.",
      price: { before: "$1.99", after: "$5.99" },
      item: "Bottled Water",
      reporter: "John D.",
      reporterRating: 4.5,
      verified: true,
      imageUrl: "/shop1.jpg",
      votes: 37
    },
    {
      id: 2,
      title: "Gas station price gouging",
      description: "Premium fuel suddenly increased from $3.50 to $7.20 per gallon with no explanation.",
      businessName: "QuickFuel Gas Station",
      location: "Riverside, Highway 95",
      coordinates: { lat: 33.9806, lng: -117.3755 },
      date: "April 8, 2025",
      category: "Fuel",
      reportType: "price_gouging",
      reporterComment: "The station raised prices overnight without any change in supply or market conditions. When questioned, the manager claimed 'supply chain issues' but this seems excessive.",
      price: { before: "$3.50", after: "$7.20" },
      item: "Premium Fuel (per gallon)",
      reporter: "Maria L.",
      reporterRating: 4.8,
      verified: true,
      imageUrl: "/shop2.jpg",
      votes: 52
    },
    {
      id: 3,
      title: "Water bottle price surge",
      description: "Bottled water being sold at $10 per bottle during local water outage.",
      businessName: "MiniMart Corner Store",
      location: "Oakville, Central Ave",
      coordinates: { lat: 36.1627, lng: -86.7816 },
      date: "April 5, 2025",
      category: "Essentials",
      reportType: "price_gouging",
      reporterComment: "When the town's water supply was contaminated, this store immediately hiked prices on all bottled water. They were selling individual bottles that normally cost under $1 for $10 each, knowing people had no choice.",
      price: { before: "$0.99", after: "$9.99" },
      item: "Bottled Water (500ml)",
      reporter: "Sam T.",
      reporterRating: 4.2,
      verified: true,
      imageUrl: "/shop3.jpg",
      votes: 89
    },
    {
      id: 4,
      title: "Electronics store markup",
      description: "Popular gaming console suddenly priced 40% above MSRP without any supply shortage.",
      businessName: "GameStop Electronics",
      location: "Tech City Mall",
      coordinates: { lat: 37.7749, lng: -122.4194 },
      date: "April 3, 2025",
      category: "Electronics",
      reportType: "price_gouging",
      reporterComment: "The store had at least 20 units in stock but was charging $700 for a console with an MSRP of $500. When asked about the markup, the sales associate said it was due to 'high demand' despite plenty of stock available.",
      price: { before: "$499.99", after: "$699.99" },
      item: "Gaming Console",
      reporter: "Alex K.",
      reporterRating: 4.7,
      verified: false,
      imageUrl: "/shop4.jpg",
      votes: 23
    },
    {
      id: 5,
      title: "Restaurant menu price increase",
      description: "All menu items increased by 25% overnight with no improvements in service or food quality.",
      businessName: "Gourmet Dining",
      location: "Downtown Dining District",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      date: "April 1, 2025",
      category: "Restaurants",
      reportType: "price_gouging",
      reporterComment: "I've been a regular at this restaurant for years, and they suddenly increased all prices by 25% with no explanation or improvement in service. When I asked the manager about it, they said it was due to 'inflation' but this seems excessive.",
      price: { before: "Menu average $22", after: "Menu average $27.50" },
      item: "Full menu",
      reporter: "Patricia M.",
      reporterRating: 4.9,
      verified: false,
      imageUrl: "/shop5.jpg",
      votes: 18
    },
    {
      id: 6,
      title: "No receipt provided for expensive electronics",
      description: "Store refused to provide receipt for $1200 purchase of a smartphone.",
      businessName: "QuickTech Electronics",
      location: "Eastside Mall, 2nd Floor",
      coordinates: { lat: 41.8781, lng: -87.6298 },
      date: "April 12, 2025",
      category: "No Receipt",
      reportType: "no_receipt",
      reporterComment: "I purchased an expensive smartphone for $1200 and the cashier told me they would email the receipt but never did. When I returned to request a paper receipt, they claimed their system was down and couldn't provide one. Seemed very suspicious.",
      item: "Smartphone",
      reporter: "David R.",
      reporterRating: 4.6,
      verified: true,
      imageUrl: "/shop6.jpg",
      votes: 32,
      receiptIssue: "refused_receipt"
    },
    {
      id: 7,
      title: "Credit card skimmer suspected at gas station",
      description: "Unauthorized charges appeared shortly after using card at this location.",
      businessName: "Highway Express Gas",
      location: "Interstate 95, Exit 103",
      coordinates: { lat: 39.0840, lng: -77.1528 },
      date: "April 9, 2025",
      category: "Suspicious Activity",
      reportType: "suspicious_activity",
      reporterComment: "I filled up at this gas station and noticed unauthorized charges on my card just 2 hours later. When I went back to inspect the card reader, it seemed loose and possibly tampered with. Several other customers reported similar issues online.",
      item: "Gas pump payment terminal",
      reporter: "Michael T.",
      reporterRating: 4.8,
      verified: true,
      imageUrl: "/shop7.jpg",
      votes: 65,
      suspiciousActivity: "card_skimming"
    },
    {
      id: 8,
      title: "Handwritten receipts only at jewelry store",
      description: "High-value purchases documented only with handwritten notes.",
      businessName: "Golden Treasures Jewelry",
      location: "Fashion Avenue, Suite 210",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      date: "April 7, 2025",
      category: "No Receipt",
      reportType: "no_receipt",
      reporterComment: "Purchased a $950 necklace and they only provided a handwritten note on letterhead with no tax information or breakdown. When I requested a proper receipt, they said their 'printer was broken' but this seemed to be their standard practice.",
      item: "Gold necklace",
      reporter: "Sarah L.",
      reporterRating: 4.4,
      verified: false,
      imageUrl: "/shop8.jpg",
      votes: 27,
      receiptIssue: "handwritten"
    },
    {
      id: 9,
      title: "Health code violations at restaurant",
      description: "Observed unsafe food handling practices and sanitation issues.",
      businessName: "Quick Burger Joint",
      location: "Central Plaza, Unit 5",
      coordinates: { lat: 32.7157, lng: -117.1611 },
      date: "April 4, 2025",
      category: "Unauthorized Business",
      reportType: "unauthorized_business",
      reporterComment: "While waiting for my order, I observed staff not washing hands between handling raw meat and ready-to-eat foods. The kitchen area visible from the counter was visibly dirty with what appeared to be old food debris. Reported to local health department.",
      item: "Food preparation",
      reporter: "Emily H.",
      reporterRating: 4.7,
      verified: true,
      imageUrl: "/shop9.jpg",
      votes: 41,
      unauthorizedIssue: "health_violations"
    }
  ];

  // Define report categories for filtering using translations
  const categories = [
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
  ];

  // Create mapping for translated filter names to their corresponding values for filtering
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

  // Filter reports based on active filter
  const filteredReports = reports.filter(report => {
    // Use a type assertion to tell TypeScript that activeFilter is a valid key
    const rawFilter = filterMapping[activeFilter as keyof typeof filterMapping];
    return rawFilter === "All Reports" || 
      report.category === rawFilter ||
      (rawFilter === "No Receipt" && report.reportType === "no_receipt") ||
      (rawFilter === "Suspicious Activity" && report.reportType === "suspicious_activity") ||
      (rawFilter === "Unauthorized Business" && report.reportType === "unauthorized_business");
  });

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      padding: "2rem 1.5rem 4rem", 
      backgroundColor: "hsl(var(--background))"
    }}>
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto 2rem"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 2rem",
          width: "100%",
          position: "relative",
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
            background: "linear-gradient(to right, hsl(var(--warning)), hsl(var(--foreground)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent" // Using color instead of textFillColor for TypeScript compatibility
          }}>
            {t('pageTitle')}
          </h1>
          <p style={{ 
            fontSize: "1.125rem",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            {t('pageDescription')}
          </p>
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
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span style={{ fontSize: "1.125rem", fontWeight: "500" }}>
                  {t('reportsCountText', { count: reports.length })}
                </span>
              </div>
              
              <Button asChild style={{
                height: "2.75rem",
                padding: "0 1.25rem"
              }}>
                <Link href={`/${locale}/reports/new`}>{t('submitNewReport')}</Link>
              </Button>
            </div>

            {/* Filter Pills */}
            <div style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              padding: "1rem 0",
              borderBottom: "1px solid hsla(var(--border) / 0.5)"
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    border: "none",
                    backgroundColor: activeFilter === category 
                      ? "hsl(var(--primary))" 
                      : "hsla(var(--muted) / 0.5)",
                    color: activeFilter === category 
                      ? "hsl(var(--primary-foreground))" 
                      : "hsl(var(--foreground))",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Reports Grid */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
              gap: "2rem"
            }}>
              {filteredReports.map((report) => (
                <Card key={report.id} style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
                >
                  {/* Report Image */}
                  <div style={{
                    height: "200px",
                    width: "100%",
                    position: "relative"
                  }}>
                    <ImageWithFallback 
                      src={report.imageUrl} 
                      alt={report.businessName}
                      fill
                      style={{
                        objectFit: "cover"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      backgroundColor: "hsla(var(--primary) / 0.9)",
                      color: "white",
                      borderRadius: "9999px",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.75rem",
                      fontWeight: "600"
                    }}>
                      {report.category}
                    </div>
                    
                    {report.verified && (
                      <div style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        backgroundColor: "hsla(var(--success) / 0.9)",
                        color: "white",
                        borderRadius: "9999px",
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem"
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>
                  
                  {/* Card Header */}
                  <CardHeader>
                    <div style={{
                      marginBottom: "0.5rem"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem"
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span style={{
                          fontSize: "0.875rem",
                          color: "hsl(var(--muted-foreground))"
                        }}>{t('reportCard.location', {location: report.location})}</span>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span style={{
                          fontSize: "0.875rem",
                          color: "hsl(var(--muted-foreground))"
                        }}>{report.date}</span>
                      </div>
                    </div>

                    <CardTitle style={{
                      marginBottom: "0.5rem",
                      fontSize: "1.25rem",
                      lineHeight: "1.3"
                    }}>{report.businessName}</CardTitle>
                    <CardDescription style={{
                      lineHeight: "1.4"
                    }}>{report.title}</CardDescription>
                  </CardHeader>
                  
                  {/* Card Content */}
                  <CardContent style={{ 
                    padding: "0 1.5rem", 
                    flexGrow: 1
                  }}>
                    {/* Price Comparison */}
                    {report.reportType === 'price_gouging' && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        backgroundColor: "hsla(var(--muted) / 0.3)",
                        borderRadius: "0.5rem",
                        marginBottom: "1.25rem"
                      }}>
                        <div>
                          <div style={{
                            fontSize: "0.75rem",
                            color: "hsl(var(--foreground))",
                            marginBottom: "0.25rem"
                          }}>{t('originalPrice')}</div>
                          <div style={{
                            fontWeight: "bold",
                            color: "hsl(var(--foreground))"
                          }}>{report.price?.before || "N/A"}</div>
                        </div>
                        
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                        
                        <div>
                          <div style={{
                            fontSize: "0.75rem",
                            color: "hsl(var(--destructive))",
                            marginBottom: "0.25rem"
                          }}>{t('gougedPrice')}</div>
                          <div style={{
                            fontWeight: "bold",
                            color: "hsl(var(--destructive))"
                          }}>{report.price?.after || "N/A"}</div>
                        </div>
                      </div>
                    )}

                    {report.reportType === 'no_receipt' && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "hsla(var(--muted) / 0.3)",
                        borderRadius: "0.5rem",
                        marginBottom: "1.25rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--destructive) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--destructive))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <line x1="9" x2="15" y1="9" y2="9" />
                            <line x1="9" x2="15" y1="15" y2="15" />
                          </svg>
                        </div>
                        <div>
                          <div style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            marginBottom: "0.25rem",
                            color: "hsl(var(--destructive))"
                          }}>{t('receiptIssue')}</div>
                          <div style={{
                            fontSize: "0.875rem"
                          }}>
                            {report.receiptIssue === 'no_receipt' && 'No receipt offered at all'}
                            {report.receiptIssue === 'refused_receipt' && 'Receipt refused when requested'}
                            {report.receiptIssue === 'incomplete_receipt' && 'Incomplete/illegible receipt'}
                            {report.receiptIssue === 'verbal_receipt' && 'Only verbal confirmation, no paper receipt'}
                            {report.receiptIssue === 'handwritten' && 'Suspicious handwritten receipt'}
                          </div>
                        </div>
                      </div>
                    )}

                    {report.reportType === 'suspicious_activity' && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "hsla(var(--warning) / 0.2)",
                        borderRadius: "0.5rem",
                        marginBottom: "1.25rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--warning) / 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--warning))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                          </svg>
                        </div>
                        <div>
                          <div style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            marginBottom: "0.25rem",
                            color: "hsl(var(--warning))"
                          }}>{t('suspiciousActivityLabel')}</div>
                          <div style={{
                            fontSize: "0.875rem"
                          }}>
                            {report.suspiciousActivity === 'card_skimming' && 'Credit card skimming detected'}
                            {report.suspiciousActivity === 'counterfeit' && 'Selling counterfeit products'}
                            {report.suspiciousActivity === 'identity_theft' && 'Identity theft concerns'}
                            {report.suspiciousActivity === 'data_collection' && 'Excessive personal data collection'}
                            {report.suspiciousActivity === 'unauthorized_charges' && 'Unauthorized charges'}
                            {report.suspiciousActivity === 'digital_scam' && 'Digital/online scam'}
                          </div>
                        </div>
                      </div>
                    )}

                    {report.reportType === 'unauthorized_business' && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "hsla(var(--muted) / 0.3)",
                        borderRadius: "0.5rem",
                        marginBottom: "1.25rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--primary) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--primary))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </div>
                        <div>
                          <div style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            marginBottom: "0.25rem",
                            color: "hsl(var(--primary))"
                          }}>{t('unauthorizedIssue')}</div>
                          <div style={{
                            fontSize: "0.875rem"
                          }}>
                            {report.unauthorizedIssue === 'unlicensed' && 'Operating without proper license'}
                            {report.unauthorizedIssue === 'health_violations' && 'Health code violations'}
                            {report.unauthorizedIssue === 'illegal_products' && 'Selling illegal/prohibited products'}
                            {report.unauthorizedIssue === 'tax_evasion' && 'Suspected tax evasion'}
                            {report.unauthorizedIssue === 'labor_violations' && 'Labor law violations'}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Reporter Comment */}
                    <div style={{
                      marginBottom: "1rem"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.75rem"
                      }}>
                        <div style={{
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--primary) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--primary))",
                          fontWeight: "medium"
                        }}>
                          {report.reporter.charAt(0)}
                        </div>
                        <div>
                          <div style={{
                            fontSize: "0.875rem",
                            fontWeight: "500"
                          }}>
                            {report.reporter}
                          </div>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            color: "hsl(var(--muted-foreground))"
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                              <path d="M2 17l10 5 10-5"/>
                              <path d="M2 12l10 5 10-5"/>
                            </svg>
                            {report.reporterRating}
                          </div>
                        </div>
                      </div>
                      
                      <p style={{
                        fontSize: "0.875rem", 
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: "1.5",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "3",
                        WebkitBoxOrient: "vertical"
                      }}>
                        &ldquo;{report.reporterComment}&rdquo;
                      </p>
                    </div>
                    
                    {/* Votes */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                      color: "hsl(var(--muted-foreground))"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10v12"/>
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                      </svg>
                      <span>{report.votes} people found this helpful</span>
                    </div>
                  </CardContent>
                  
                  {/* Card Footer */}
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild style={{ width: "100%" }}>
                      <Link href={`/reports/${report.id}`}>View Full Report</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
