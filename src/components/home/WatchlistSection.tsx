"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export type WatchlistBusiness = {
  id: number;
  name: string;
  issue: string;
  reports: number;
  alertLevel: string;
};

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

interface WatchlistSectionProps {
  businesses: WatchlistBusiness[];
  isLoading?: boolean;
}

export default function WatchlistSection({ businesses, isLoading = false }: WatchlistSectionProps) {
  const t = useTranslations('WatchlistSection');
  const pathname = usePathname();

  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';

  // Loading state UI
  if (isLoading) {
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
                margin: 0
              }}>
                {t('sectionTitle')}
              </h2>
            </div>
            <p style={{
              fontSize: "1.125rem",
              color: "hsl(var(--muted-foreground))",
              maxWidth: "42rem",
              textAlign: "center",
              margin: 0
            }}>
              {t('sectionDescription')}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
            <div style={{ display: "inline-block", width: "50px", height: "50px", border: "5px solid hsla(var(--border) / 0.3)", borderTopColor: "hsl(var(--primary))", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </section>
    );
  }

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
              {t('sectionTitle')}
            </h2>
          </div>
          <p style={{
            fontSize: "1.125rem",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "42rem",
            textAlign: "center",
            margin: 0
          }}>
            {t('sectionDescription')}
          </p>
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
              <div>{t('businessNameColumn')}</div>
              <div>{t('issueColumn')}</div>
              <div>{t('reportsColumn')}</div>
              <div>{t('alertLevelColumn')}</div>
            </div>

            {businesses.map((business, index) => (
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
                backgroundColor: index % 2 === 0 ? "hsla(var(--card) / 0.8)" : "hsla(var(--background) / 0.8)"
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
                    backgroundColor: business.alertLevel === "High" ? "hsla(var(--destructive) / 0.1)" :
                      business.alertLevel === "Medium" ? "hsla(var(--warning) / 0.1)" :
                        "hsla(var(--muted) / 0.3)",
                    color: business.alertLevel === "High" ? "hsl(var(--destructive))" :
                      business.alertLevel === "Medium" ? "hsl(var(--warning))" :
                        "hsl(var(--muted-foreground))"
                  }}>
                    {business.alertLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Link href={`/${locale}/watchlist`} passHref>
            <Button variant="outline" style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.9375rem",
              fontWeight: "500"
            }}>
              {t('viewFullWatchlistButton')}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
