"use client";

import { Business, ReportTypeCount } from "@/lib/api/businesses";
import BusinessCard from "./business-card";

interface BusinessListProps {
  businesses: Array<Business & {
    lastReported?: string;
    reportTypes?: ReportTypeCount[];
  }>;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function BusinessList({ businesses, locale, t }: BusinessListProps) {
  if (!businesses || businesses.length === 0) {
    return (
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
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", fontWeight: "600" }}>
          {t("noBusinessesFound")}
        </h3>
        <div>{t("noBusinessesFoundDescription")}</div>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1.5rem"
    }}>
      {businesses.map((business) => (
        <BusinessCard 
          key={business.id} 
          business={business} 
          locale={locale} 
          t={t} 
        />
      ))}
    </div>
  );
}
