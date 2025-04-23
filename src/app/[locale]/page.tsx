"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import ReportsList from "@/components/home/ReportsList";
import MapSection from "@/components/home/MapSection";
import ReceiptTransparencySection from "@/components/home/ReceiptTransparencySection";
import WatchlistSection, { WatchlistBusiness } from "@/components/home/WatchlistSection";
import HowItWorks from "@/components/home/HowItWorks";
import { ImageWithFallback } from "@/components/ui/image-fallback";
import { getHighRiskBusinesses } from "@/lib/api/businesses";
import { fetchReportsByBusiness, fetchReportsByType, Report as ApiReport } from "@/lib/api/reports";

// Convert API report format to the format expected by ReportsList
const convertApiReportToUiReport = (report: ApiReport) => {
  return {
    id: Number(report.id) || Math.floor(Math.random() * 1000),
    title: report.title,
    description: report.description,
    businessName: report.business_name,
    location: report.location,
    coordinates: { lat: 0, lng: 0 }, // Default coordinates if not available
    date: report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString(),
    category: report.category || report.report_type,
    reporterComment: report.description,
    price: { 
      before: report.price_before ? `$${report.price_before.toFixed(2)}` : "N/A", 
      after: report.price_after ? `$${report.price_after.toFixed(2)}` : "N/A" 
    },
    item: report.category || "Item",
    imageUrl: report.image_url || report.photo_url || report.imageUrl || "/shop1.jpg"
  };
};

// Convert API report to receipt transparency business format
const convertToReceiptTransparencyBusiness = (report: ApiReport, reportCount: number = 1) => {
  return {
    id: Number(report.id) || Math.floor(Math.random() * 1000),
    name: report.business_name,
    location: report.location,
    reportCount: reportCount,
    lastReported: report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString(),
    issueType: report.receipt_issue_type || "No receipt provided",
    rating: (Math.random() * 3 + 6).toFixed(1) // Generate a random rating between 6.0 and 9.0
  };
};

// Convert API business to watchlist business format
const convertToWatchlistBusiness = (business: any, reportCount: number): WatchlistBusiness => {
  // Determine alert level based on scam score or report count
  let alertLevel = "Low";
  if (business.scam_score >= 7 || reportCount >= 20) {
    alertLevel = "High";
  } else if (business.scam_score >= 5 || reportCount >= 10) {
    alertLevel = "Medium";
  }
  
  return {
    id: Number(business.id) || Math.floor(Math.random() * 1000),
    name: business.name,
    issue: business.primary_issue || "Multiple reported issues",
    reports: reportCount,
    alertLevel: alertLevel
  };
};

export default function Home() {
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [receiptBusinesses, setReceiptBusinesses] = useState<any[]>([]);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);
  const [watchlistBusinesses, setWatchlistBusinesses] = useState<WatchlistBusiness[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);

  // Fetch high-risk business reports
  useEffect(() => {
    const fetchHighRiskReports = async () => {
      setIsLoading(true);
      try {
        // Get high-risk businesses
        const highRiskBusinesses = await getHighRiskBusinesses(5);
        
        // Fetch reports for each high-risk business
        let allReports: ApiReport[] = [];
        
        for (const business of highRiskBusinesses) {
          if (business.name) {
            const businessReports = await fetchReportsByBusiness(business.name);
            allReports = [...allReports, ...businessReports];
          }
        }
        
        // Sort by created_at date (most recent first) and take top 3
        allReports.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        
        const topReports = allReports.slice(0, 3);
        
        // Convert to UI format
        const uiReports = topReports.map(convertApiReportToUiReport);
        
        setRecentReports(uiReports);
      } catch (error) {
        console.error("Error fetching high-risk reports:", error);
        // Fallback to mock data if API fails
        setRecentReports(mockRecentReports);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHighRiskReports();
  }, []);

  // Fetch receipt-related reports
  useEffect(() => {
    const fetchReceiptReports = async () => {
      setIsLoadingReceipts(true);
      try {
        // Fetch reports with receipt issues
        const receiptReports = await fetchReportsByType('no_receipt');
        
        // Group reports by business name
        const businessReportsMap = new Map();
        
        receiptReports.forEach(report => {
          if (!report.business_name) return;
          
          if (businessReportsMap.has(report.business_name)) {
            businessReportsMap.get(report.business_name).reports.push(report);
            businessReportsMap.get(report.business_name).count += 1;
          } else {
            businessReportsMap.set(report.business_name, { 
              reports: [report],
              count: 1
            });
          }
        });
        
        // Convert to array and sort by report count (highest first)
        const businessesArray = Array.from(businessReportsMap.entries())
          .map(([name, data]) => {
            // Use the most recent report for this business
            const mostRecentReport = data.reports.sort((a: ApiReport, b: ApiReport) => {
              const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
              const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
              return dateB - dateA;
            })[0];
            
            return convertToReceiptTransparencyBusiness(mostRecentReport, data.count);
          })
          .sort((a, b) => b.reportCount - a.reportCount);
        
        // Take top 4 businesses
        const topBusinesses = businessesArray.slice(0, 4);
        
        setReceiptBusinesses(topBusinesses.length > 0 ? topBusinesses : mockReceiptBusinesses);
      } catch (error) {
        console.error("Error fetching receipt reports:", error);
        // Fallback to mock data if API fails
        setReceiptBusinesses(mockReceiptBusinesses);
      } finally {
        setIsLoadingReceipts(false);
      }
    };
    
    fetchReceiptReports();
  }, []);

  // Fetch watchlist businesses
  useEffect(() => {
    const fetchWatchlistBusinesses = async () => {
      setIsLoadingWatchlist(true);
      try {
        // Get high-risk businesses with scam scores
        const highRiskBusinesses = await getHighRiskBusinesses(10);
        
        // Get report counts for each business
        const businessesWithReportCounts = await Promise.all(
          highRiskBusinesses.map(async (business) => {
            if (!business.name) return null;
            
            const reports = await fetchReportsByBusiness(business.name);
            const reportCount = reports.length;
            
            // Extract primary issue from reports
            let primaryIssue = "Multiple reported issues";
            if (reports.length > 0) {
              // Count occurrences of each issue type
              const issueTypes: Record<string, number> = {};
              reports.forEach(report => {
                const issueType = report.report_type || report.category || "Unknown issue";
                issueTypes[issueType] = (issueTypes[issueType] || 0) + 1;
              });
              
              // Find the most common issue type
              let maxCount = 0;
              Object.entries(issueTypes).forEach(([issue, count]) => {
                if (count > maxCount) {
                  maxCount = count;
                  primaryIssue = issue;
                }
              });
              
              // Format the issue type to be more readable
              primaryIssue = primaryIssue
                .replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
            
            // Add primary issue to business object
            return { ...business, primary_issue: primaryIssue, report_count: reportCount };
          })
        );
        
        // Filter out null values and sort by report count
        const validBusinesses = businessesWithReportCounts
          .filter(Boolean)
          .sort((a, b) => (b?.report_count || 0) - (a?.report_count || 0));
        
        // Take top 5 businesses and convert to watchlist format
        const topBusinesses = validBusinesses.slice(0, 5).map(business => 
          convertToWatchlistBusiness(business, business?.report_count || 0)
        );
        
        setWatchlistBusinesses(topBusinesses.length > 0 ? topBusinesses : mockWatchlistBusinesses);
      } catch (error) {
        console.error("Error fetching watchlist businesses:", error);
        // Fallback to mock data if API fails
        setWatchlistBusinesses(mockWatchlistBusinesses);
      } finally {
        setIsLoadingWatchlist(false);
      }
    };
    
    fetchWatchlistBusinesses();
  }, []);

  // Mock data as fallback if API fails
  const mockRecentReports = [
    {
      id: 1,
      title: "Grocery store tripled prices after storm",
      description: "Local market increased essential item prices by 300% during the recent weather emergency.",
      businessName: "SuperMart Grocery",
      location: "Springfield, Main St",
      coordinates: { lat: 42.1154, lng: -72.5400 },
      date: "April 10, 2025",
      category: "Groceries",
      reporterComment: "I went to buy basic supplies after the storm and found that water bottles were $12 each, bread was $15 a loaf, and batteries were $25 per pack. This is clearly taking advantage of people in need.",
      price: { before: "$1.99", after: "$5.99" },
      item: "Bottled Water",
      imageUrl: "/shop1.jpg"
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
      reporterComment: "The station raised prices overnight without any change in supply or market conditions. When questioned, the manager claimed 'supply chain issues' but other stations nearby had normal pricing.",
      price: { before: "$3.50", after: "$7.20" },
      item: "Premium Fuel (per gallon)",
      imageUrl: "/shop2.jpg"
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
      reporterComment: "When the town's water supply was contaminated, this store immediately hiked prices on all bottled water. They were selling individual bottles that normally cost under $1 for $10 each, knowing people had no choice.",
      price: { before: "$0.99", after: "$9.99" },
      item: "Bottled Water (500ml)",
      imageUrl: "/shop3.jpg"
    }
  ];

  // Mock data for receipt transparency as fallback
  const mockReceiptBusinesses = [
    {
      id: 1,
      name: "QuickMart Store",
      location: "Downtown, Main Street",
      reportCount: 14,
      lastReported: "April 12, 2025",
      issueType: "No receipt provided",
      rating: 8.4
    },
    {
      id: 2,
      name: "Tech Galaxy Electronics",
      location: "Westside Mall",
      reportCount: 11,
      lastReported: "April 8, 2025",
      issueType: "Incomplete receipts",
      rating: 7.9
    },
    {
      id: 3,
      name: "Urban Clothing Co.",
      location: "Fashion District",
      reportCount: 9,
      lastReported: "April 5, 2025",
      issueType: "Handwritten receipts only",
      rating: 7.2
    },
    {
      id: 4,
      name: "Tasty Bites Restaurant",
      location: "Riverside Drive",
      reportCount: 7,
      lastReported: "April 2, 2025",
      issueType: "Refuses receipts for small purchases",
      rating: 6.5
    }
  ];

  // Mock data for watchlist as fallback
  const mockWatchlistBusinesses: WatchlistBusiness[] = [
    {
      id: 1,
      name: "FastTech Gadgets",
      issue: "Unauthorized credit card charges",
      reports: 23,
      alertLevel: "High"
    },
    {
      id: 2,
      name: "Discount Pharmacy",
      issue: "Suspicious product authenticity",
      reports: 15,
      alertLevel: "Medium"
    },
    {
      id: 3,
      name: "Metro Convenience",
      issue: "No receipts, price discrepancies",
      reports: 18,
      alertLevel: "High"
    },
    {
      id: 4,
      name: "Luxury Home Goods",
      issue: "Misrepresented product details",
      reports: 9,
      alertLevel: "Medium"
    },
    {
      id: 5,
      name: "Express Auto Service",
      issue: "Unnecessary repairs, overcharging",
      reports: 12,
      alertLevel: "Medium"
    }
  ];

  return (
    <main style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} id="main-content" tabIndex={-1} aria-label="Home page main content">
      {/* Hero Section with Map Background */}
      <HeroSection 
        // We can fetch and pass actual stats here when available
        // reportsCount={actualsReportsCount}
        // communitiesCount={actualCommunitiesCount}
      />

      {/* Map Section */}
      <section style={{
        width: "100%",
        padding: "4rem 0",
        backgroundColor: "hsla(var(--background))",
        position: "relative"
      }} aria-labelledby="map-section-title">
        <div className="container" style={{ padding: "0 1.5rem", maxWidth: "1200px", margin: "2rem auto" }}>
          <MapSection businesses={recentReports} />
        </div>
      </section>

      {/* Recent Reports Section */}
      {isLoading ? (
        <div style={{ padding: "4rem 0", textAlign: "center" }}>
          <div style={{ display: "inline-block", width: "50px", height: "50px", border: "5px solid hsla(var(--border) / 0.3)", borderTopColor: "hsl(var(--primary))", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <ReportsList reports={recentReports} />
      )}

      {/* Receipt Transparency Section */}
      {isLoadingReceipts ? (
        <div style={{ padding: "4rem 0", textAlign: "center" }}>
          <div style={{ display: "inline-block", width: "50px", height: "50px", border: "5px solid hsla(var(--border) / 0.3)", borderTopColor: "hsl(var(--primary))", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <ReceiptTransparencySection businesses={receiptBusinesses} />
      )}

      {/* Consumer Watchlist Section */}
      <WatchlistSection businesses={watchlistBusinesses} isLoading={isLoadingWatchlist} />

      {/* How It Works Section */}
      <HowItWorks />
    </main>
  );
}
