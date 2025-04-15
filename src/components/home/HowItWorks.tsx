"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
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
            How Scam Watch Works
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
              }}>Encounter Unfair Practice</h3>
              <div style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "hsl(var(--muted-foreground))"
              }}>
                Notice a business charging excessive prices during emergencies or not providing proper receipts for purchases
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
              }}>Report the Incident</h3>
              <div style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "hsl(var(--muted-foreground))"
              }}>
                Document the unfair pricing by providing business details, location, and photos of receipts or price tags.
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
              }}>Track and Share</h3>
              <div style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "hsl(var(--muted-foreground))"
              }}>
                Browse reports by location or business type to identify recurring offenders and pricing patterns in your area. Share your findings with others to help keep your community informed.
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
            <Link href="/about">Learn More About Our Process</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
