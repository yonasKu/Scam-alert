"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ReceiptBusiness = {
  id: number;
  name: string;
  location: string;
  reportCount: number;
  lastReported: string;
  issueType: string;
  rating: number;
};

type ReceiptTransparencySectionProps = {
  businesses: ReceiptBusiness[];
};

export default function ReceiptTransparencySection({ businesses }: ReceiptTransparencySectionProps) {
  return (
    <section style={{
      padding: "4rem 0",
      backgroundColor: "hsla(var(--background) / 0.5)",
      borderTop: "1px solid hsla(var(--border) / 0.3)"
    }}>
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
              backgroundColor: "hsla(var(--destructive) / 0.1)",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--destructive))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M16 12h.01" />
                <path d="M8 12h.01" />
                <path d="M12 16v.01" />
                <path d="M12 8v.01" />
                <path d="M8 16h.01" />
                <path d="M16 16h.01" />
                <path d="M8 8h.01" />
                <path d="M16 8h.01" />
              </svg>
            </div>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: "bold",
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(to right, hsl(var(--destructive)), hsl(var(--foreground)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Receipt Transparency Watch
            </h2>
          </div>
          <div style={{
            maxWidth: "700px",
            textAlign: "center",
            fontSize: "1.125rem",
            color: "hsl(var(--muted-foreground))"
          }}>
            Businesses frequently reported for failing to provide proper receipts or proof of purchase
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          {businesses.map(business => (
            <Card key={business.id} style={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              borderLeft: "4px solid hsl(var(--destructive))"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}>
              <CardHeader style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem"
                }}>
                  <CardTitle style={{ fontSize: "1.125rem", fontFamily: "var(--font-heading)" }}>
                    {business.name}
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
                    <span>{business.rating}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3 4 8 5 15 15 5 16 8 8 3z" />
                    </svg>
                  </div>
                </div>
                {/* Changed from CardDescription to div to avoid HTML structure issues */}
                <div style={{
                  color: "hsl(var(--muted-foreground))",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  margin: "0.5rem 0 0 0"
                }}>
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
                    {business.location}
                  </div>
                </div>
              </CardHeader>
              <CardContent style={{ padding: "0.75rem 1.25rem 1.25rem", flexGrow: 1 }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem"
                  }}>
                    <div style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      borderRadius: "50%",
                      backgroundColor: "hsla(var(--destructive) / 0.1)",
                      color: "hsl(var(--destructive))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <line x1="9" x2="15" y1="9" y2="9" />
                        <line x1="9" x2="15" y1="15" y2="15" />
                      </svg>
                    </div>
                    <span style={{ fontWeight: "500" }}>{business.issueType}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    color: "hsl(var(--muted-foreground))"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{business.reportCount} reports</span>
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
                    <span>Last reported: {business.lastReported}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter style={{ padding: "0 1.25rem 1.25rem" }}>
                <Button variant="outline" size="sm" asChild style={{ width: "100%" }}>
                  <Link href={`/businesses/${business.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem"
        }}>
          <Button asChild variant="outline">
            <Link href="/reports?filter=no_receipt">
              View All No-Receipt Businesses
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
