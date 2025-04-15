"use client";

import HeroSection from "@/components/home/HeroSection";
import ReportsList from "@/components/home/ReportsList";
import MapSection from "@/components/home/MapSection";
import HowItWorks from "@/components/home/HowItWorks";
import WatchlistSection from "@/components/home/WatchlistSection";

export default function Home() {
  // Mock data for recent reports with more detailed information
  const recentReports = [
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

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Hero Section with Map Background */}
      <HeroSection />

      {/* Recent Reports Section with Map */}
      <div className="container" style={{ padding: "0 1.5rem", maxWidth: "1200px", margin: "2rem auto" }}>
        <MapSection businesses={recentReports} />
      </div>
      
      {/* Reports List */}
      <ReportsList reports={recentReports} />
      
      {/* Watchlist Section */}
      <WatchlistSection />
      
      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
}
