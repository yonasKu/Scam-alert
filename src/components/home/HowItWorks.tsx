"use client";

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

import { usePathname } from 'next/navigation';

export default function HowItWorks() {
  const t = useTranslations('HowItWorks');
  const pathname = usePathname();
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';

  return (
    <section style={{
      width: "100%",
      padding: "5rem 0",
      backgroundColor: "hsla(var(--muted) / 0.2)"
    }}>
      <div className="container" style={{ padding: "0 1.5rem" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "4rem",
          paddingTop: "2rem"
        }}>
          <h2 style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-heading)",
            textAlign: "center",
            background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            {t('title')}
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            width: "100%",
            maxWidth: "1200px"
          }}>
            {/* Step 1 */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "2rem",
              backgroundColor: "hsla(var(--card) / 0.8)",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                backgroundColor: "hsla(var(--primary) / 0.1)",
                borderRadius: "50%",
                width: "4rem",
                height: "4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem"
              }}>
                <span style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "hsl(var(--primary))"
                }}>1</span>
              </div>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)"
              }}>{t('step1Title')}</h3>
              <div style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "hsl(var(--muted-foreground))"
              }}>
                {t('step1Desc')}
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "2rem",
              backgroundColor: "hsla(var(--card) / 0.8)",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                backgroundColor: "hsla(var(--primary) / 0.1)",
                borderRadius: "50%",
                width: "4rem",
                height: "4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem"
              }}>
                <span style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "hsl(var(--primary))"
                }}>2</span>
              </div>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)"
              }}>{t('step2Title')}</h3>
              <div style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "hsl(var(--muted-foreground))"
              }}>
                {t('step2Desc')}
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "2rem",
              backgroundColor: "hsla(var(--card) / 0.8)",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                backgroundColor: "hsla(var(--primary) / 0.1)",
                borderRadius: "50%",
                width: "4rem",
                height: "4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem"
              }}>
                <span style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "hsl(var(--primary))"
                }}>3</span>
              </div>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)"
              }}>{t('step3Title')}</h3>
              <div style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "hsl(var(--muted-foreground))"
              }}>
                {t('step3Desc')}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem"
        }}>
          <Button asChild>
            <Link href={`/${locale}/about`}>{t('learnMoreButton')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
