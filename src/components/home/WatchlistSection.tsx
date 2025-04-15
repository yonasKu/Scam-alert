"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type WatchlistBusiness = {
  id: number;
  name: string;
  issue: string;
  reports: number;
  alertLevel: string;
};

export default function WatchlistSection() {
  const watchlistBusinesses = [
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
    <section style={{
      padding: "4rem 0",
      backgroundColor: "hsl(var(--background))",
      borderTop: "1px solid hsla(var(--border) / 0.3)"
    }}>
      <div className="container" style={{ padding: "0 1.5rem" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--warning) / 0.1)",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--warning))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16h.01" />
                <path d="M12 8v4" />
                <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
              </svg>
            </div>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: "bold",
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(to right, hsl(var(--warning)), hsl(var(--foreground)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Consumer Watchlist
            </h2>
          </div>
          <div style={{
            maxWidth: "700px",
            textAlign: "center",
            fontSize: "1.125rem",
            color: "hsl(var(--muted-foreground))"
          }}>
            Businesses recently flagged for suspicious activities or potential consumer issues
          </div>
        </div>

        <div style={{
          border: "1px solid hsla(var(--border) / 0.7)",
          borderRadius: "0.75rem",
          overflow: "hidden"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            backgroundColor: "hsla(var(--card) / 0.8)"
          }}>
            <div style={{
              padding: "1rem",
              borderBottom: "1px solid hsla(var(--border) / 0.7)",
              backgroundColor: "hsla(var(--muted) / 0.3)",
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr",
              gap: "1rem",
              fontWeight: "600"
            }}>
              <div>Business Name</div>
              <div>Issue</div>
              <div>Reports</div>
              <div>Alert Level</div>
            </div>
            {watchlistBusinesses.map(business => (
              <div key={business.id} style={{
                padding: "1rem",
                borderBottom: "1px solid hsla(var(--border) / 0.5)",
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr",
                gap: "1rem",
                alignItems: "center",
                fontSize: "0.9375rem",
                transition: "background-color 0.2s",
                cursor: "pointer",
                backgroundColor: business.id % 2 === 0 ? "hsla(var(--background) / 0.8)" : "hsla(var(--card) / 0.8)"
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "hsla(var(--muted) / 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = business.id % 2 === 0 ? "hsla(var(--background) / 0.8)" : "hsla(var(--card) / 0.8)";
                }}>
                <div style={{ fontWeight: "500" }}>{business.name}</div>
                <div>{business.issue}</div>
                <div>{business.reports}</div>
                <div>
                  <span style={{
                    display: "inline-block",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    backgroundColor: business.alertLevel === "High"
                      ? "hsla(var(--destructive) / 0.1)"
                      : business.alertLevel === "Medium"
                        ? "hsla(var(--warning) / 0.1)"
                        : "hsla(var(--muted) / 0.1)",
                    color: business.alertLevel === "High"
                      ? "hsl(var(--destructive))"
                      : business.alertLevel === "Medium"
                        ? "hsl(var(--warning))"
                        : "hsl(var(--muted-foreground))"
                  }}>
                    {business.alertLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem"
        }}>
          <Button asChild>
            <Link href="/watchlist">
              View Full Watchlist
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
