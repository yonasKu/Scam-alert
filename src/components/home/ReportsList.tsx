"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, DollarSign, Tag, Store, MessageSquare } from "lucide-react";

type ReportPrice = {
  before: string;
  after: string;
};

type Report = {
  id: number;
  title: string;
  description: string;
  businessName: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  category: string;
  reporterComment: string;
  price: ReportPrice;
  item: string;
  imageUrl: string;
};

type ReportsListProps = {
  reports: Report[];
};

export default function ReportsList({ reports }: ReportsListProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  const openReportDetails = (report: Report) => {
    setSelectedReport(report);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
  };
  
  return (
    <section style={{ padding: "4rem 0", backgroundColor: "hsl(var(--background))" }}>
      <div className="container" style={{ padding: "0 1.5rem" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "3rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--primary) / 0.1)",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--primary))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6" />
                <path d="M23 11h-6" />
              </svg>
            </div>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: "bold",
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Recently Reported Businesses
            </h2>
          </div>
          <div style={{
            maxWidth: "700px",
            color: "hsl(var(--muted-foreground))",
            fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
            textAlign: "center"
          }}>
            These businesses have been reported for potential price gouging in the last 30 days
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "2rem",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {reports.map(report => (
            <Card key={report.id} style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
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
              <div style={{
                height: "200px",
                width: "100%",
                position: "relative"
              }}>
                <Image
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
              </div>

              <CardHeader>
                <div style={{
                  marginBottom: "0.5rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem"
                  }}>
                    <CardTitle style={{ fontSize: "1.125rem", fontFamily: "var(--font-heading)" }}>
                      {report.businessName}
                    </CardTitle>
                    <div style={{
                      backgroundColor: "hsla(var(--destructive) / 0.1)",
                      color: "hsl(var(--destructive))",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      padding: "0.25rem 0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      <span>Reported</span>
                    </div>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    color: "hsl(var(--muted-foreground))",
                    marginBottom: "0.5rem"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{report.location}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    color: "hsl(var(--muted-foreground))"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{report.date}</span>
                  </div>
                </div>

                <CardDescription style={{ lineHeight: "1.4", fontWeight: "500", color: "hsl(var(--foreground))" }}>
                  {report.title}
                </CardDescription>
              </CardHeader>

              <CardContent style={{
                padding: "0 1.5rem",
                flexGrow: 1
              }}>
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
                    }}>Original Price</div>
                    <div style={{
                      fontWeight: "bold",
                      color: "hsl(var(--foreground))"
                    }}>{report.price.before}</div>
                  </div>

                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>

                  <div>
                    <div style={{
                      fontSize: "0.75rem",
                      color: "hsl(var(--destructive))",
                      marginBottom: "0.25rem"
                    }}>Gouged Price</div>
                    <div style={{
                      fontWeight: "bold",
                      color: "hsl(var(--destructive))"
                    }}>{report.price.after}</div>
                  </div>
                </div>

                <div style={{
                  fontSize: "0.875rem",
                  color: "hsl(var(--muted-foreground))",
                  lineHeight: "1.5",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical"
                }}>
                  {report.reporterComment}
                </div>
              </CardContent>

              <CardFooter>
                <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                  <Button 
                    size="sm" 
                    style={{ 
                      flex: "1",
                      fontWeight: "500",
                      backgroundColor: "hsl(var(--primary))",
                      color: "white",
                      transition: "all 0.2s ease",
                      padding: "0.6rem 0.8rem",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      border: "none",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                    }}
                    onClick={() => openReportDetails(report)}
                  >
                    Quick View
                  </Button>
                  <Button 
                    size="sm" 
                    asChild
                    style={{ 
                      flex: "1",
                      fontWeight: "500",
                      backgroundColor: "hsl(var(--secondary))",
                      color: "hsl(var(--secondary-foreground))",
                      transition: "all 0.2s ease",
                      padding: "0.6rem 0.8rem",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      border: "none",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                    }}
                  >
                    <Link href={`/reports/${report.id}`}>Full Report</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "3rem",
          gap: "1rem"
        }}>
          <Button asChild>
            <Link href="/reports">View All Reports</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/reports/new">Submit New Report</Link>
          </Button>
        </div>
      </div>

      {/* Report Details Modal */}
      <Modal 
        isOpen={selectedReport !== null} 
        onClose={closeReportDetails}
        title={selectedReport?.title || "Report Details"}
        size="md"
      >
        {selectedReport && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Business Name */}
            <div style={{ fontSize: "1.125rem", fontWeight: "500", color: "hsl(var(--foreground))" }}>
              {selectedReport.businessName}
            </div>
            
            {/* Image */}
            <div style={{ position: "relative", height: "300px", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
              <Image
                src={selectedReport.imageUrl}
                alt={selectedReport.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            
            {/* Price comparison */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "1rem", 
              padding: "1rem", 
              backgroundColor: "hsla(var(--muted) / 0.3)", 
              borderRadius: "0.5rem" 
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>Original Price</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>{selectedReport.price.before}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--destructive))" }}>Gouged Price</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "hsl(var(--destructive))" }}>{selectedReport.price.after}</div>
              </div>
            </div>
            
            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Details</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.25rem", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "9999px", 
                    border: "1px solid hsl(var(--border))",
                    fontSize: "0.875rem"
                  }}>
                    <Tag size={14} style={{ marginRight: "0.25rem" }} />
                    <span>{selectedReport.category}</span>
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.25rem", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "9999px", 
                    border: "1px solid hsl(var(--border))",
                    fontSize: "0.875rem"
                  }}>
                    <Store size={14} style={{ marginRight: "0.25rem" }} />
                    <span>{selectedReport.item}</span>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                  <MapPin size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
                  <span>{selectedReport.location}</span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                  <Calendar size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
                  <span>{selectedReport.date}</span>
                </div>
              </div>
            </div>
            
            {/* Reporter Comment */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h3 style={{ 
                fontSize: "1.125rem", 
                fontWeight: "600", 
                display: "flex", 
                alignItems: "center" 
              }}>
                <MessageSquare size={18} style={{ marginRight: "0.5rem" }} />
                Reporter Comment
              </h3>
              <div style={{ 
                padding: "1rem", 
                backgroundColor: "hsla(var(--muted) / 0.2)", 
                borderRadius: "0.5rem", 
                color: "hsl(var(--muted-foreground))",
                fontSize: "1rem",
                lineHeight: "1.5"
              }}>
                {selectedReport.reporterComment}
              </div>
            </div>
            
            {/* Full Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Description</h3>
              <div style={{ fontSize: "1rem", lineHeight: "1.5" }}>
                {selectedReport.description}
              </div>
            </div>

            {/* Footer with buttons */}
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "0.75rem", 
              marginTop: "1rem" 
            }}>
              <button 
                onClick={closeReportDetails}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid hsl(var(--border))",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "0.875rem"
                }}
              >
                Close
              </button>
              <Link 
                href={`/reports/${selectedReport.id}`}
                style={{
                  backgroundColor: "hsl(var(--primary))",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.25rem",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Full Report Page
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
