"use client";

import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-fallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { MapPin, Calendar, Tag, Store, MessageSquare } from "lucide-react";

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

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function ReportsList({ reports }: ReportsListProps) {
  const t = useTranslations('ReportsList');
  const pathname = usePathname();
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';
  
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
              {t('sectionTitle')}
            </h2>
          </div>
          <div style={{
            maxWidth: "700px",
            color: "hsl(var(--muted-foreground))",
            fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
            textAlign: "center"
          }}>
            {t('sectionDescription')}
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "2.5rem",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {reports.map(report => (
            <Card key={report.id} style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
              transition: "all 0.3s ease",
              cursor: "pointer",
              borderRadius: "1rem",
              border: "1px solid hsla(var(--border)/0.8)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 16px 30px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = "hsla(var(--primary)/0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = "hsla(var(--border)/0.8)";
              }}
            >
              <div style={{
                height: "220px",
                width: "100%",
                position: "relative",
                overflow: "hidden",
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "0.75rem"
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
                  backgroundColor: "hsla(var(--primary) / 0.95)",
                  color: "white",
                  borderRadius: "9999px",
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  backdropFilter: "blur(4px)"
                }}>
                  {report.category}
                </div>
              </div>

              <CardHeader style={{ padding: "1.25rem 1.5rem 0.75rem" }}>
                <div style={{
                  marginBottom: "0.5rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem"
                  }}>
                    <CardTitle style={{ 
                      fontSize: "1.25rem", 
                      fontFamily: "var(--font-heading)",
                      fontWeight: "700",
                      letterSpacing: "-0.01em",
                      color: "hsl(var(--foreground))"
                    }}>
                      {report.businessName}
                    </CardTitle>
                    <div style={{
                      backgroundColor: "hsla(var(--destructive) / 0.12)",
                      color: "hsl(var(--destructive))",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "0.3rem 0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      boxShadow: "0 1px 2px hsla(var(--destructive)/0.1)"
                    }}>
                      <span>{t('reportedBadge')}</span>
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

                <CardDescription style={{ 
                  lineHeight: "1.5", 
                  fontWeight: "500", 
                  color: "hsl(var(--foreground))",
                  fontSize: "1rem",
                  marginTop: "0.5rem"
                }}>
                  {report.title}
                </CardDescription>
              </CardHeader>

              <CardContent style={{
                padding: "0.5rem 1.5rem 1.25rem",
                flexGrow: 1
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem",
                  background: "linear-gradient(to right, hsla(var(--muted)/0.15), hsla(var(--muted)/0.25))",
                  borderRadius: "0.75rem",
                  marginBottom: "1.5rem",
                  border: "1px solid hsla(var(--border)/0.5)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                }}>
                  <div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "hsl(var(--foreground))",
                      marginBottom: "0.35rem",
                      fontWeight: "500",
                      opacity: "0.85"
                    }}>Original Price</div>
                    <div style={{
                      fontWeight: "700",
                      color: "hsl(var(--foreground))",
                      fontSize: "1.1rem"
                    }}>{report.price.before}</div>
                  </div>

                  <div style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "hsla(var(--muted)/0.3)",
                    borderRadius: "50%"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>

                  <div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "hsl(var(--destructive))",
                      marginBottom: "0.35rem",
                      fontWeight: "500"
                    }}>Gouged Price</div>
                    <div style={{
                      fontWeight: "700",
                      color: "hsl(var(--destructive))",
                      fontSize: "1.1rem"
                    }}>{report.price.after}</div>
                  </div>
                </div>

                <div style={{
                  fontSize: "0.95rem",
                  color: "hsl(var(--muted-foreground))",
                  lineHeight: "1.6",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  backgroundColor: "hsla(var(--muted)/0.08)",
                  padding: "1rem",
                  borderRadius: "0.6rem",
                  borderLeft: "3px solid hsla(var(--primary)/0.5)",
                  fontStyle: "italic"
                }}>
                  {report.reporterComment}
                </div>
              </CardContent>

              <CardFooter style={{ padding: "1rem 1.5rem 1.5rem" }}>
                <div style={{ display: "flex", width: "100%" }}>
                  <Button 
                    size="sm" 
                    style={{ 
                      width: "100%",
                      fontWeight: "600",
                      backgroundColor: "hsl(var(--primary))",
                      color: "white",
                      transition: "all 0.2s ease",
                      padding: "0.7rem 1rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1), 0 0 0 2px hsla(var(--primary)/0.2)",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "0.6rem",
                      fontSize: "0.95rem",
                      letterSpacing: "0.01em"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15), 0 0 0 2.5px hsla(var(--primary)/0.4)";
                      e.currentTarget.style.backgroundColor = "hsl(var(--primary-darker, var(--primary)))";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1), 0 0 0 2px hsla(var(--primary)/0.2)";
                      e.currentTarget.style.backgroundColor = "";
                    }}
                    onClick={() => openReportDetails(report)}
                  >
                    {t('viewDetailsButton')}
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
            <Link href={`/${locale}/reports`}>{t('viewAllReports')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/reports/new`}>{t('submitNewReport')}</Link>
          </Button>
        </div>
      </div>

      {/* Report Details Modal */}
      <Modal 
        isOpen={selectedReport !== null} 
        onClose={closeReportDetails}
        title={selectedReport?.title || t('modalTitle')}
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
              <ImageWithFallback
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
                <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>{t('modalPriceBefore')}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>{selectedReport.price.before}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--destructive))" }}>{t('modalPriceAfter')}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "hsl(var(--destructive))" }}>{selectedReport.price.after}</div>
              </div>
            </div>
            
            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{t('modalTitle')}</h3>
              
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
                {t('modalReporterComment')}
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
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
