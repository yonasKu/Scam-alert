// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import dynamic from 'next/dynamic';

// // Dynamically import the map component with no SSR to avoid hydration issues
// const BusinessMap = dynamic(
//   () => import('@/components/maps/BusinessMap'),
//   { ssr: false }
// );

// export default function Home() {
//   // Mock data for recent reports with more detailed information
//   const recentReports = [
//     {
//       id: 1,
//       title: "Grocery store tripled prices after storm",
//       description: "Local market increased essential item prices by 300% during the recent weather emergency.",
//       businessName: "SuperMart Grocery",
//       location: "Springfield, Main St",
//       coordinates: { lat: 42.1154, lng: -72.5400 },
//       date: "April 10, 2025",
//       category: "Groceries",
//       reporterComment: "I went to buy basic supplies after the storm and found that water bottles were $12 each, bread was $15 a loaf, and batteries were $25 per pack. This is clearly taking advantage of people in need.",
//       price: { before: "$1.99", after: "$5.99" },
//       item: "Bottled Water",
//       imageUrl: "/shop1.jpg"
//     },
//     {
//       id: 2,
//       title: "Gas station price gouging",
//       description: "Premium fuel suddenly increased from $3.50 to $7.20 per gallon with no explanation.",
//       businessName: "QuickFuel Gas Station",
//       location: "Riverside, Highway 95",
//       coordinates: { lat: 33.9806, lng: -117.3755 },
//       date: "April 8, 2025",
//       category: "Fuel",
//       reporterComment: "The station raised prices overnight without any change in supply or market conditions. When questioned, the manager claimed 'supply chain issues' but other stations nearby had normal pricing.",
//       price: { before: "$3.50", after: "$7.20" },
//       item: "Premium Fuel (per gallon)",
//       imageUrl: "/shop2.jpg"
//     },
//     {
//       id: 3,
//       title: "Water bottle price surge",
//       description: "Bottled water being sold at $10 per bottle during local water outage.",
//       businessName: "MiniMart Corner Store",
//       location: "Oakville, Central Ave",
//       coordinates: { lat: 36.1627, lng: -86.7816 },
//       date: "April 5, 2025",
//       category: "Essentials",
//       reporterComment: "When the town's water supply was contaminated, this store immediately hiked prices on all bottled water. They were selling individual bottles that normally cost under $1 for $10 each, knowing people had no choice.",
//       price: { before: "$0.99", after: "$9.99" },
//       item: "Bottled Water (500ml)",
//       imageUrl: "/shop3.jpg"
//     }
//   ];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       {/* Hero Section with Map Background */}
//       <section style={{
//         width: "100%",
//         padding: "0",
//         backgroundColor: "hsl(var(--background))",
//         position: "relative",
//         height: "90vh",
//         display: "flex",
//         alignItems: "center",
//         overflow: "hidden"
//       }}>
//         {/* Map Background */}
//         <div style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           zIndex: 0,
//           opacity: 0.1,
//           backgroundImage: "url('/map-background.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center"
//         }} />

//         <div className="container" style={{
//           padding: "0 1.5rem",
//           position: "relative",
//           zIndex: 1
//         }}>
//           <div style={{
//             display: "grid",
//             gap: "3rem",
//             alignItems: "center",
//             gridTemplateColumns: "1fr",
//             maxWidth: "1400px",
//             margin: "0 auto"
//           }}>
//             <div style={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               gap: "1.5rem"
//             }}>
//               <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "1rem"
//               }}>
//                 <h1 style={{
//                   fontSize: "clamp(2.5rem, 5vw, 4rem)",
//                   lineHeight: 1.2,
//                   fontWeight: "800",
//                   marginBottom: "1.5rem",
//                   fontFamily: "var(--font-heading)",
//                   textAlign: "center"
//                 }}>
//                   <span style={{
//                     background: "linear-gradient(to right, hsla(var(--foreground)), hsla(var(--primary)))",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     backgroundClip: "text"
//                   }}>Report Price Gouging &</span>
//                   <br />
//                   <span style={{
//                     background: "linear-gradient(to right, hsla(var(--primary)), hsla(var(--foreground)))",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     backgroundClip: "text"
//                   }}>Unfair Business Practices</span>
//                 </h1>

//                 <div style={{
//                   fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
//                   lineHeight: 1.5,
//                   maxWidth: "800px",
//                   margin: "0 auto 2rem",
//                   textAlign: "center",
//                   color: "hsla(var(--foreground) / 0.9)"
//                 }}>
//                   Report businesses that engage in price gouging during emergencies, sell without providing receipts, or employ other unfair pricing tactics. Help keep your community informed.
//                 </div>
//               </div>
//               <div style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: "1rem",
//                 flexWrap: "wrap",
//                 justifyContent: "center",
//                 marginTop: "2rem"
//               }}>
//                 <Button asChild size="lg" style={{
//                   fontSize: "1.1rem",
//                   padding: "1rem 2rem",
//                   height: "auto",
//                   backgroundColor: "hsl(var(--primary))",
//                   borderRadius: "0.5rem",
//                   color: '#FFFFFF',
//                   boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)"
//                 }}>
//                   <Link href="/reports/new">Report Consumer Issues</Link>
//                 </Button>
//                 <Button variant="outline" size="lg" asChild style={{
//                   fontSize: "1.1rem",
//                   padding: "1rem 2rem",
//                   height: "auto",
//                   borderRadius: "0.5rem",
//                   borderWidth: "2px",
//                   borderColor: "hsla(var(--primary) / 0.5)",
//                   color: "hsl(var(--primary))",
//                   fontWeight: "500"
//                 }}>
//                   <Link href="/reports">View All Reports</Link>
//                 </Button>
//                 <Button variant="outline" size="lg" asChild style={{
//                   fontSize: "1.1rem",
//                   padding: "1rem 2rem",
//                   height: "auto",
//                   borderRadius: "0.5rem",
//                   borderWidth: "2px",
//                   backgroundColor: "hsla(var(--warning) / 0.1)",
//                   borderColor: "hsla(var(--warning) / 0.5)",
//                   color: "hsl(var(--warning))",
//                   fontWeight: "500"
//                 }}>
//                   <Link href="/watchlist">View Watchlist</Link>
//                 </Button>
//               </div>

//               <div style={{
//                 display: "flex",
//                 gap: "2rem",
//                 marginTop: "2rem",
//                 flexWrap: "wrap"
//               }}>
//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.5rem"
//                 }}>
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: "2.5rem",
//                     height: "2.5rem",
//                     backgroundColor: "hsla(var(--primary) / 0.1)",
//                     borderRadius: "50%",
//                     color: "hsl(var(--primary))"
//                   }}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M12 2L2 7l10 5 10-5-10-5z" />
//                       <path d="M2 17l10 5 10-5" />
//                       <path d="M2 12l10 5 10-5" />
//                     </svg>
//                   </div>
//                   <span style={{ fontSize: "1.1rem" }}>243 Reports Filed</span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.5rem"
//                 }}>
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: "2.5rem",
//                     height: "2.5rem",
//                     backgroundColor: "hsla(var(--primary) / 0.1)",
//                     borderRadius: "50%",
//                     color: "hsl(var(--primary))"
//                   }}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//                       <circle cx="12" cy="10" r="3" />
//                     </svg>
//                   </div>
//                   <span style={{ fontSize: "1.1rem" }}>37 Communities Protected</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Map Section with Reported Locations */}
//       <section style={{
//         width: "100%",
//         padding: "4rem 0",
//         backgroundColor: "hsla(var(--background))",
//         position: "relative"
//       }}>
//         <div className="container" style={{ padding: "0 1.5rem" }}>
//           <div style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             marginBottom: "3rem"
//           }}>
//             <div style={{ maxWidth: "800px" }}>
//               <h2 style={{
//                 fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
//                 fontWeight: "bold",
//                 marginBottom: "1rem"
//               }}>
//                 Recently Reported Businesses
//               </h2>
//               <div style={{
//                 maxWidth: "700px",
//                 color: "hsl(var(--muted-foreground))",
//                 fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
//                 margin: "0 auto"
//               }}>
//                 These businesses have been reported for potential price gouging in the last 30 days
//               </div>
//             </div>
//           </div>

//           {/* Interactive Map with Real Leaflet Map */}
//           <div style={{
//             width: "100%",
//             height: "300px",
//             borderRadius: "0.75rem",
//             overflow: "hidden",
//             position: "relative",
//             marginBottom: "3rem",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
//           }}>
//             <BusinessMap businesses={recentReports} height="300px" />
//           </div>

//           {/* Reported Businesses Cards */}
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
//             gap: "2rem",
//             marginTop: "2rem",
//             maxWidth: "1400px",
//             margin: "0 auto"
//           }}>
//             {recentReports.map((report) => (
//               <Card key={report.id} style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 height: "100%",
//                 overflow: "hidden",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//                 cursor: "pointer"
//               }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-5px)";
//                   e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "";
//                 }}
//               >
//                 <div style={{
//                   height: "200px",
//                   width: "100%",
//                   position: "relative"
//                 }}>
//                   <Image
//                     src={report.imageUrl}
//                     alt={report.businessName}
//                     fill
//                     style={{
//                       objectFit: "cover"
//                     }}
//                   />
//                   <div style={{
//                     position: "absolute",
//                     top: "1rem",
//                     right: "1rem",
//                     backgroundColor: "hsla(var(--primary) / 0.9)",
//                     color: "white",
//                     borderRadius: "9999px",
//                     padding: "0.35rem 0.75rem",
//                     fontSize: "0.75rem",
//                     fontWeight: "600"
//                   }}>
//                     {report.category}
//                   </div>
//                 </div>

//                 <CardHeader>
//                   <div style={{
//                     marginBottom: "0.5rem"
//                   }}>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "flex-start",
//                       justifyContent: "space-between",
//                       marginBottom: "0.5rem"
//                     }}>
//                       <CardTitle style={{ fontSize: "1.125rem", fontFamily: "var(--font-heading)" }}>
//                         {report.title}
//                       </CardTitle>
//                       <div style={{
//                         backgroundColor: "hsla(var(--destructive) / 0.1)",
//                         color: "hsl(var(--destructive))",
//                         borderRadius: "9999px",
//                         fontSize: "0.875rem",
//                         fontWeight: "600",
//                         padding: "0.25rem 0.75rem",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "0.25rem"
//                       }}>
//                         <span>Reported</span>
//                       </div>
//                     </div>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       fontSize: "0.875rem",
//                       color: "hsl(var(--muted-foreground))",
//                       marginBottom: "0.5rem"
//                     }}>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//                         <circle cx="12" cy="10" r="3" />
//                       </svg>
//                       <span>{report.location}</span>
//                     </div>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       fontSize: "0.875rem",
//                       color: "hsl(var(--muted-foreground))"
//                     }}>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <circle cx="12" cy="12" r="10" />
//                         <polyline points="12 6 12 12 16 14" />
//                       </svg>
//                       <span>{report.date}</span>
//                     </div>
//                   </div>

//                   <CardDescription style={{ lineHeight: "1.4", fontWeight: "500", color: "hsl(var(--foreground))" }}>
//                     <span>{report.businessName}</span>
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent style={{
//                   padding: "0 1.5rem",
//                   flexGrow: 1
//                 }}>
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     padding: "0.75rem 1rem",
//                     backgroundColor: "hsla(var(--muted) / 0.3)",
//                     borderRadius: "0.5rem",
//                     marginBottom: "1.25rem"
//                   }}>
//                     <div>
//                       <div style={{
//                         fontSize: "0.75rem",
//                         color: "hsl(var(--foreground))",
//                         marginBottom: "0.25rem"
//                       }}>Original Price</div>
//                       <div style={{
//                         fontWeight: "bold",
//                         color: "hsl(var(--foreground))"
//                       }}>{report.price.before}</div>
//                     </div>

//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <polyline points="9 18 15 12 9 6" />
//                     </svg>

//                     <div>
//                       <div style={{
//                         fontSize: "0.75rem",
//                         color: "hsl(var(--destructive))",
//                         marginBottom: "0.25rem"
//                       }}>Gouged Price</div>
//                       <div style={{
//                         fontWeight: "bold",
//                         color: "hsl(var(--destructive))"
//                       }}>{report.price.after}</div>
//                     </div>
//                   </div>

//                   <div style={{
//                     fontSize: "0.875rem",
//                     color: "hsl(var(--muted-foreground))",
//                     lineHeight: "1.5",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     display: "-webkit-box",
//                     WebkitLineClamp: "3",
//                     WebkitBoxOrient: "vertical"
//                   }}>
//                     {report.reporterComment}
//                   </div>
//                 </CardContent>

//                 <CardFooter>
//                   <Button size="sm" style={{ 
//                     width: "100%", 
//                     fontWeight: "500",
//                     backgroundColor: "hsl(var(--primary))",
//                     color: "white",
//                     transition: "all 0.2s ease",
//                     padding: "0.6rem 1.2rem",
//                     boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                     border: "none",
//                     cursor: "pointer"
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-2px)";
//                     e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "";
//                     e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
//                   }}
//                   onClick={() => window.location.href = `#${report.id}`}>
//                     View Details
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>

//           <div style={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "3rem"
//           }}>
//             <Button asChild>
//               <Link href="/reports">View All Reports</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Receipt Transparency Section */}
//       <section style={{
//         padding: "4rem 0",
//         backgroundColor: "hsla(var(--background) / 0.5)",
//         borderTop: "1px solid hsla(var(--border) / 0.3)"
//       }}>
//         <div className="container" style={{ padding: "0 1.5rem" }}>
//           <div style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             marginBottom: "3rem"
//           }}>
//             <div style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               marginBottom: "1.5rem"
//             }}>
//               <div style={{
//                 backgroundColor: "hsla(var(--destructive) / 0.1)",
//                 borderRadius: "50%",
//                 width: "3rem",
//                 height: "3rem",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "hsl(var(--destructive))"
//               }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect width="18" height="18" x="3" y="3" rx="2" />
//                   <path d="M16 12h.01" />
//                   <path d="M8 12h.01" />
//                   <path d="M12 16v.01" />
//                   <path d="M12 8v.01" />
//                   <path d="M8 16h.01" />
//                   <path d="M16 16h.01" />
//                   <path d="M8 8h.01" />
//                   <path d="M16 8h.01" />
//                 </svg>
//               </div>
//               <h2 style={{
//                 fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
//                 fontWeight: "bold",
//                 fontFamily: "var(--font-heading)",
//                 background: "linear-gradient(to right, hsl(var(--destructive)), hsl(var(--foreground)))",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text"
//               }}>
//                 Receipt Transparency Watch
//               </h2>
//             </div>
//             <div style={{
//               maxWidth: "700px",
//               textAlign: "center",
//               fontSize: "1.125rem",
//               color: "hsl(var(--muted-foreground))"
//             }}>
//               Businesses frequently reported for failing to provide proper receipts or proof of purchase
//             </div>
//           </div>

//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//             gap: "1.5rem",
//             marginBottom: "2rem"
//           }}>
//             {/* Mock Receipt Transparency Cards */}
//             {[
//               {
//                 id: 1,
//                 name: "QuickMart Store",
//                 location: "Downtown, Main Street",
//                 reportCount: 14,
//                 lastReported: "April 12, 2025",
//                 issueType: "No receipt provided",
//                 rating: 8.4
//               },
//               {
//                 id: 2,
//                 name: "Tech Galaxy Electronics",
//                 location: "Westside Mall",
//                 reportCount: 11,
//                 lastReported: "April 8, 2025",
//                 issueType: "Incomplete receipts",
//                 rating: 7.9
//               },
//               {
//                 id: 3,
//                 name: "Urban Clothing Co.",
//                 location: "Fashion District",
//                 reportCount: 9,
//                 lastReported: "April 5, 2025",
//                 issueType: "Handwritten receipts only",
//                 rating: 7.2
//               },
//               {
//                 id: 4,
//                 name: "Tasty Bites Restaurant",
//                 location: "Riverside Drive",
//                 reportCount: 7,
//                 lastReported: "April 2, 2025",
//                 issueType: "Refuses receipts for small purchases",
//                 rating: 6.5
//               }
//             ].map(business => (
//               <Card key={business.id} style={{
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//                 cursor: "pointer",
//                 borderLeft: "4px solid hsl(var(--destructive))"
//               }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-5px)";
//                   e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "";
//                 }}>
//                 <CardHeader style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
//                   <div style={{
//                     display: "flex",
//                     alignItems: "flex-start",
//                     justifyContent: "space-between",
//                     marginBottom: "0.5rem"
//                   }}>
//                     <CardTitle style={{ fontSize: "1.125rem", fontFamily: "var(--font-heading)" }}>
//                       {business.name}
//                     </CardTitle>
//                     <div style={{
//                       backgroundColor: "hsla(var(--destructive) / 0.1)",
//                       color: "hsl(var(--destructive))",
//                       borderRadius: "9999px",
//                       fontSize: "0.875rem",
//                       fontWeight: "600",
//                       padding: "0.25rem 0.75rem",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.25rem"
//                     }}>
//                       <span>{business.rating}</span>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M8 3 4 8 5 15 15 5 16 8 8 3z" />
//                       </svg>
//                     </div>
//                   </div>
//                   <CardDescription>
//                     <span style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       fontSize: "0.875rem",
//                       color: "hsl(var(--muted-foreground))",
//                       marginBottom: "0.5rem"
//                     }}>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//                         <circle cx="12" cy="10" r="3" />
//                       </svg>
//                       {business.location}
//                     </span>
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent style={{ padding: "0.75rem 1.25rem 1.25rem", flexGrow: 1 }}>
//                   <div style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "0.75rem"
//                   }}>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       fontSize: "0.875rem"
//                     }}>
//                       <div style={{
//                         width: "1.75rem",
//                         height: "1.75rem",
//                         borderRadius: "50%",
//                         backgroundColor: "hsla(var(--destructive) / 0.1)",
//                         color: "hsl(var(--destructive))",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center"
//                       }}>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <rect width="18" height="18" x="3" y="3" rx="2" />
//                           <line x1="9" x2="15" y1="9" y2="9" />
//                           <line x1="9" x2="15" y1="15" y2="15" />
//                         </svg>
//                       </div>
//                       <span style={{ fontWeight: "500" }}>{business.issueType}</span>
//                     </div>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       fontSize: "0.875rem",
//                       color: "hsl(var(--muted-foreground))"
//                     }}>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M16 21v-2a4 4 0 0 0-3-3.87" />
//                         <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                       </svg>
//                       <span>{business.reportCount} reports</span>
//                     </div>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.5rem",
//                       fontSize: "0.875rem",
//                       color: "hsl(var(--muted-foreground))"
//                     }}>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <circle cx="12" cy="12" r="10" />
//                         <polyline points="12 6 12 12 16 14" />
//                       </svg>
//                       <span>Last reported: {business.lastReported}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//                 <CardFooter style={{ padding: "0 1.25rem 1.25rem" }}>
//                   <Button variant="outline" size="sm" asChild style={{ width: "100%" }}>
//                     <Link href={`/businesses/${business.id}`}>View Details</Link>
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>

//           <div style={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "1rem"
//           }}>
//             <Button asChild variant="outline">
//               <Link href="/reports?filter=no_receipt">
//                 View All No-Receipt Businesses
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Consumer Watchlist Section */}
//       <section style={{
//         padding: "4rem 0",
//         backgroundColor: "hsla(var(--muted) / 0.2)",
//         borderTop: "1px solid hsla(var(--border) / 0.3)"
//       }}>
//         <div className="container" style={{ padding: "0 1.5rem" }}>
//           <div style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             marginBottom: "3rem"
//           }}>
//             <div style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               marginBottom: "1.5rem"
//             }}>
//               <div style={{
//                 backgroundColor: "hsla(var(--warning) / 0.1)",
//                 borderRadius: "50%",
//                 width: "3rem",
//                 height: "3rem",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "hsl(var(--warning))"
//               }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M12 16h.01" />
//                   <path d="M12 8v4" />
//                   <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
//                 </svg>
//               </div>
//               <h2 style={{
//                 fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
//                 fontWeight: "bold",
//                 fontFamily: "var(--font-heading)",
//                 background: "linear-gradient(to right, hsl(var(--warning)), hsl(var(--foreground)))",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text"
//               }}>
//                 Consumer Watchlist
//               </h2>
//             </div>
//             <div style={{
//               maxWidth: "700px",
//               textAlign: "center",
//               fontSize: "1.125rem",
//               color: "hsl(var(--muted-foreground))"
//             }}>
//               Businesses recently flagged for suspicious activities or potential consumer issues
//             </div>
//           </div>

//           <div style={{
//             border: "1px solid hsla(var(--border) / 0.7)",
//             borderRadius: "0.75rem",
//             overflow: "hidden"
//           }}>
//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "1fr",
//               backgroundColor: "hsla(var(--card) / 0.8)"
//             }}>
//               <div style={{
//                 padding: "1rem",
//                 borderBottom: "1px solid hsla(var(--border) / 0.7)",
//                 backgroundColor: "hsla(var(--muted) / 0.3)",
//                 display: "grid",
//                 gridTemplateColumns: "2fr 1.5fr 1fr 1fr",
//                 gap: "1rem",
//                 fontWeight: "600"
//               }}>
//                 <div>Business Name</div>
//                 <div>Issue</div>
//                 <div>Reports</div>
//                 <div>Alert Level</div>
//               </div>
//               {[
//                 {
//                   id: 1,
//                   name: "FastTech Gadgets",
//                   issue: "Unauthorized credit card charges",
//                   reports: 23,
//                   alertLevel: "High"
//                 },
//                 {
//                   id: 2,
//                   name: "Discount Pharmacy",
//                   issue: "Suspicious product authenticity",
//                   reports: 15,
//                   alertLevel: "Medium"
//                 },
//                 {
//                   id: 3,
//                   name: "Metro Convenience",
//                   issue: "No receipts, price discrepancies",
//                   reports: 18,
//                   alertLevel: "High"
//                 },
//                 {
//                   id: 4,
//                   name: "Luxury Home Goods",
//                   issue: "Misrepresented product details",
//                   reports: 9,
//                   alertLevel: "Medium"
//                 },
//                 {
//                   id: 5,
//                   name: "Express Auto Service",
//                   issue: "Unnecessary repairs, overcharging",
//                   reports: 12,
//                   alertLevel: "Medium"
//                 }
//               ].map(business => (
//                 <div key={business.id} style={{
//                   padding: "1rem",
//                   borderBottom: "1px solid hsla(var(--border) / 0.5)",
//                   display: "grid",
//                   gridTemplateColumns: "2fr 1.5fr 1fr 1fr",
//                   gap: "1rem",
//                   alignItems: "center",
//                   fontSize: "0.9375rem",
//                   transition: "background-color 0.2s",
//                   cursor: "pointer",
//                   backgroundColor: business.id % 2 === 0 ? "hsla(var(--background) / 0.8)" : "hsla(var(--card) / 0.8)"
//                 }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = "hsla(var(--muted) / 0.2)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = business.id % 2 === 0 ? "hsla(var(--background) / 0.8)" : "hsla(var(--card) / 0.8)";
//                   }}>
//                   <div style={{ fontWeight: "500" }}>{business.name}</div>
//                   <div>{business.issue}</div>
//                   <div>{business.reports}</div>
//                   <div>
//                     <span style={{
//                       display: "inline-block",
//                       padding: "0.25rem 0.5rem",
//                       borderRadius: "9999px",
//                       fontSize: "0.75rem",
//                       fontWeight: "600",
//                       backgroundColor: business.alertLevel === "High"
//                         ? "hsla(var(--destructive) / 0.1)"
//                         : business.alertLevel === "Medium"
//                           ? "hsla(var(--warning) / 0.1)"
//                           : "hsla(var(--muted) / 0.1)",
//                       color: business.alertLevel === "High"
//                         ? "hsl(var(--destructive))"
//                         : business.alertLevel === "Medium"
//                           ? "hsl(var(--warning))"
//                           : "hsl(var(--muted-foreground))"
//                     }}>
//                       {business.alertLevel}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div style={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "2rem"
//           }}>
//             <Button asChild>
//               <Link href="/watchlist">
//                 View Full Watchlist
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section style={{
//         width: "100%",
//         padding: "5rem 0",
//         backgroundColor: "hsla(var(--muted) / 0.2)"
//       }}>
//         <div className="container" style={{ padding: "0 1.5rem" }}>
//           <div style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             paddingBottom: "4rem",
//             paddingTop: "2rem"
//           }}>
//             <h2 style={{
//               fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
//               fontWeight: "bold",
//               marginBottom: "1.5rem",
//               fontFamily: "var(--font-heading)",
//               textAlign: "center",
//               background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text"
//             }}>
//               How Scam Watch Works
//             </h2>

//             <div style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//               gap: "2rem",
//               width: "100%",
//               maxWidth: "1200px"
//             }}>
//               {/* Step 1 */}
//               <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textAlign: "center",
//                 padding: "2rem",
//                 backgroundColor: "hsla(var(--card) / 0.8)",
//                 borderRadius: "0.75rem",
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
//               }}>
//                 <div style={{
//                   backgroundColor: "hsla(var(--primary) / 0.1)",
//                   borderRadius: "50%",
//                   width: "4rem",
//                   height: "4rem",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginBottom: "1.5rem"
//                 }}>
//                   <span style={{
//                     fontSize: "1.5rem",
//                     fontWeight: "bold",
//                     color: "hsl(var(--primary))"
//                   }}>1</span>
//                 </div>
//                 <h3 style={{
//                   fontSize: "1.25rem",
//                   fontWeight: "bold",
//                   marginBottom: "1rem",
//                   fontFamily: "var(--font-heading)"
//                 }}>Encounter Unfair Practice</h3>
//                 <div style={{
//                   fontSize: "1rem",
//                   lineHeight: 1.6,
//                   color: "hsl(var(--muted-foreground))"
//                 }}>
//                   Notice a business charging excessive prices during emergencies or not providing proper receipts for purchases
//                 </div>
//               </div>

//               {/* Step 2 */}
//               <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textAlign: "center",
//                 padding: "2rem",
//                 backgroundColor: "hsla(var(--card) / 0.8)",
//                 borderRadius: "0.75rem",
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
//               }}>
//                 <div style={{
//                   backgroundColor: "hsla(var(--primary) / 0.1)",
//                   borderRadius: "50%",
//                   width: "4rem",
//                   height: "4rem",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginBottom: "1.5rem"
//                 }}>
//                   <span style={{
//                     fontSize: "1.5rem",
//                     fontWeight: "bold",
//                     color: "hsl(var(--primary))"
//                   }}>2</span>
//                 </div>
//                 <h3 style={{
//                   fontSize: "1.25rem",
//                   fontWeight: "bold",
//                   marginBottom: "1rem",
//                   fontFamily: "var(--font-heading)"
//                 }}>Report the Incident</h3>
//                 <div style={{
//                   fontSize: "1rem",
//                   lineHeight: 1.6,
//                   color: "hsl(var(--muted-foreground))"
//                 }}>
//                   Document the unfair pricing by providing business details, location, and photos of receipts or price tags.
//                 </div>
//               </div>

//               {/* Step 3 */}
//               <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textAlign: "center",
//                 padding: "2rem",
//                 backgroundColor: "hsla(var(--card) / 0.8)",
//                 borderRadius: "0.75rem",
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
//               }}>
//                 <div style={{
//                   backgroundColor: "hsla(var(--primary) / 0.1)",
//                   borderRadius: "50%",
//                   width: "4rem",
//                   height: "4rem",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginBottom: "1.5rem"
//                 }}>
//                   <span style={{
//                     fontSize: "1.5rem",
//                     fontWeight: "bold",
//                     color: "hsl(var(--primary))"
//                   }}>3</span>
//                 </div>
//                 <h3 style={{
//                   fontSize: "1.25rem",
//                   fontWeight: "bold",
//                   marginBottom: "1rem",
//                   fontFamily: "var(--font-heading)"
//                 }}>Track and Share</h3>
//                 <div style={{
//                   fontSize: "1rem",
//                   lineHeight: 1.6,
//                   color: "hsl(var(--muted-foreground))"
//                 }}>
//                   Browse reports by location or business type to identify recurring offenders and pricing patterns in your area. Share your findings with others to help keep your community informed.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


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
