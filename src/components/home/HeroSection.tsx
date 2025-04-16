"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

import { usePathname } from 'next/navigation';

export default function HeroSection() {
  const t = useTranslations('HeroSection');
  const pathname = usePathname();
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';

  // Placeholder counts - these could come from props or state later
  const reportsCount = 243;
  const communitiesCount = 37;

  return (
    <section style={{
      width: "100%",
      padding: "0",
      backgroundColor: "hsl(var(--background))",
      position: "relative",
      height: "90vh",
      display: "flex",
      alignItems: "center",
      overflow: "hidden"
    }}>
      {/* Map Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.1,
        backgroundImage: "url('/map-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }} />

      <div className="container" style={{
        padding: "0 1.5rem",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{
          display: "grid",
          gap: "3rem",
          alignItems: "center",
          gridTemplateColumns: "1fr",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.5rem"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              <h1 style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.2,
                fontWeight: "800",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-heading)",
                textAlign: "center"
              }}>
                <span style={{
                  background: "linear-gradient(to right, hsla(var(--foreground)), hsla(var(--primary)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  {t('titlePart1')}
                </span>
                <br />
                <span style={{
                  background: "linear-gradient(to right, hsla(var(--primary)), hsla(var(--foreground)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  {t('titlePart2')}
                </span>
              </h1>

              <div style={{
                fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                lineHeight: 1.5,
                maxWidth: "800px",
                margin: "0 auto 2rem",
                textAlign: "center",
                color: "hsla(var(--foreground) / 0.9)"
              }}>
                {t('subtitle')}
              </div>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "2rem"
            }}>
              <Button asChild size="lg" style={{
                fontSize: "1.1rem",
                padding: "1rem 2rem",
                height: "auto",
                backgroundColor: "hsl(var(--primary))",
                borderRadius: "0.5rem",
                color: '#FFFFFF',
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)"
              }}>
                <Link href={`/${locale}/reports/new`}>{t('reportButton')}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild style={{
                fontSize: "1.1rem",
                padding: "1rem 2rem",
                height: "auto",
                borderRadius: "0.5rem",
                borderWidth: "2px",
                borderColor: "hsla(var(--primary) / 0.5)",
                color: "hsl(var(--primary))",
                fontWeight: "500"
              }}>
                <Link href={`/${locale}/reports`}>{t('viewReportsButton')}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild style={{
                fontSize: "1.1rem",
                padding: "1rem 2rem",
                height: "auto",
                borderRadius: "0.5rem",
                borderWidth: "2px",
                backgroundColor: "hsla(var(--warning) / 0.1)",
                borderColor: "hsla(var(--warning) / 0.5)",
                color: "hsl(var(--warning))",
                fontWeight: "500"
              }}>
                <Link href={`/${locale}/watchlist`}>{t('viewWatchlistButton')}</Link>
              </Button>
            </div>

            <div style={{
              display: "flex",
              gap: "2rem",
              marginTop: "2rem",
              flexWrap: "wrap"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: "hsla(var(--primary) / 0.1)",
                  borderRadius: "50%",
                  color: "hsl(var(--primary))"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span style={{ fontSize: "1.1rem" }}>{t('reportsFiledStat', { count: reportsCount })}</span>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.5rem",
                  height: "2.5rem",
                  backgroundColor: "hsla(var(--primary) / 0.1)",
                  borderRadius: "50%",
                  color: "hsl(var(--primary))"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span style={{ fontSize: "1.1rem" }}>{t('communitiesProtectedStat', { count: communitiesCount })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
