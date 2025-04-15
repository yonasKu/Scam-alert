"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      padding: "2rem 1.5rem 4rem",
      backgroundColor: "hsl(var(--background))"
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 3rem",
        width: "100%",
        position: "relative",
        padding: "3rem",
        borderRadius: "1rem",
        backgroundColor: "hsla(var(--primary) / 0.05)",
        backgroundImage: "linear-gradient(to right, hsla(var(--background) / 0.9), hsla(var(--background) / 0.8))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}>
        <div style={{
          marginBottom: "1.5rem",
          backgroundColor: "hsla(var(--primary) / 0.1)",
          color: "hsl(var(--primary))",
          borderRadius: "9999px",
          width: "4rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold"
        }}>
          SW
        </div>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: "bold",
          marginBottom: "1rem",
          background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textFillColor: "transparent"
        }}>
          About Scam Watch
        </h1>
        <p style={{
          fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
          maxWidth: "800px",
          marginBottom: "2rem",
          color: "hsl(var(--muted-foreground))",
          lineHeight: 1.6
        }}>
          Empowering consumers through transparency, accountability, and community action against price gouging
        </p>
      </div>

      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Mission Section */}
        <section style={{
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "hsl(var(--foreground))"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--primary) / 0.1)",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--primary))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            Our Mission
          </h2>
          <div style={{
            fontSize: "1.0625rem",
            lineHeight: "1.7",
            color: "hsl(var(--foreground))"
          }}>
            <p style={{ marginBottom: "1.5rem" }}>
              Scam Watch was founded with a clear mission: to combat price gouging and protect consumers from predatory pricing practices, especially during emergencies and times of crisis. We believe that transparency is the most powerful tool in creating accountability and fairness in the marketplace.
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              Our platform serves as a centralized database where consumers can report, track, and share instances of price gouging. By collecting and analyzing this data, we aim to:
            </p>
            <ul style={{
              paddingLeft: "1.5rem",
              marginBottom: "1.5rem",
              listStyleType: "disc"
            }}>
              <li style={{ marginBottom: "0.75rem" }}>Expose businesses engaging in unfair pricing practices</li>
              <li style={{ marginBottom: "0.75rem" }}>Provide consumers with information needed to make informed decisions</li>
              <li style={{ marginBottom: "0.75rem" }}>Assist regulatory agencies by identifying patterns of price gouging</li>
              <li style={{ marginBottom: "0.75rem" }}>Create a deterrent effect through public accountability</li>
              <li>Advocate for stronger consumer protection laws and regulations</li>
            </ul>
          </div>
        </section>

        {/* How It Works Section */}
        <section style={{
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "hsl(var(--foreground))"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--primary) / 0.1)",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--primary))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            How Scam Watch Works
          </h2>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: "2rem",
              alignItems: "center"
            }}>
              <div style={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{
                    backgroundColor: "hsla(var(--primary) / 0.1)",
                    borderRadius: "50%",
                    width: "3rem",
                    height: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "hsl(var(--primary))",
                    flexShrink: 0
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: "600"
                  }}>Community Reporting</h3>
                </div>
                <p style={{
                  lineHeight: "1.7",
                  color: "hsl(var(--muted-foreground))"
                }}>
                  Our platform allows users to submit detailed reports of price gouging incidents. Each report includes the business name, location, price information, photos, and a description of the pricing issue. Reports are verified by our team before being published.
                </p>
              </div>
              
              <div style={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{
                    backgroundColor: "hsla(var(--primary) / 0.1)",
                    borderRadius: "50%",
                    width: "3rem",
                    height: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "hsl(var(--primary))",
                    flexShrink: 0
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  </div>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: "600"
                  }}>Data Analysis & Scoring</h3>
                </div>
                <p style={{
                  lineHeight: "1.7",
                  color: "hsl(var(--muted-foreground))"
                }}>
                  We analyze reported data to identify patterns and assign "Scam Scores" to businesses based on factors like the frequency of reports, severity of price increases, and whether the gouging occurred during emergencies. This helps users quickly assess risk.
                </p>
              </div>
              
              <div style={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{
                    backgroundColor: "hsla(var(--primary) / 0.1)",
                    borderRadius: "50%",
                    width: "3rem",
                    height: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "hsl(var(--primary))",
                    flexShrink: 0
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: "600"
                  }}>Community Action</h3>
                </div>
                <p style={{
                  lineHeight: "1.7",
                  color: "hsl(var(--muted-foreground))"
                }}>
                  Users can search our database, view reported businesses, and make informed choices about where to shop. By sharing this information, we create a powerful incentive for businesses to maintain fair pricing practices even during high-demand periods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section style={{
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "hsl(var(--foreground))"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--primary) / 0.1)",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--primary))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
            Our Core Values
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              borderLeft: "4px solid hsl(var(--primary))",
              backgroundColor: "hsla(var(--muted) / 0.1)"
            }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.75rem"
              }}>Transparency</h3>
              <p style={{
                fontSize: "0.9375rem",
                lineHeight: "1.6",
                color: "hsl(var(--muted-foreground))"
              }}>
                We believe in complete transparency in our operations, data collection methods, and verification processes.
              </p>
            </div>
            
            <div style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              borderLeft: "4px solid hsl(var(--primary))",
              backgroundColor: "hsla(var(--muted) / 0.1)"
            }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.75rem"
              }}>Fairness</h3>
              <p style={{
                fontSize: "0.9375rem",
                lineHeight: "1.6",
                color: "hsl(var(--muted-foreground))"
              }}>
                We maintain strict verification standards to ensure businesses are not unfairly targeted or misrepresented.
              </p>
            </div>
            
            <div style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              borderLeft: "4px solid hsl(var(--primary))",
              backgroundColor: "hsla(var(--muted) / 0.1)"
            }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.75rem"
              }}>Community</h3>
              <p style={{
                fontSize: "0.9375rem",
                lineHeight: "1.6",
                color: "hsl(var(--muted-foreground))"
              }}>
                We empower communities to protect themselves through collective knowledge and shared experiences.
              </p>
            </div>
            
            <div style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              borderLeft: "4px solid hsl(var(--primary))",
              backgroundColor: "hsla(var(--muted) / 0.1)"
            }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "0.75rem"
              }}>Accountability</h3>
              <p style={{
                fontSize: "0.9375rem",
                lineHeight: "1.6",
                color: "hsl(var(--muted-foreground))"
              }}>
                We hold businesses accountable for their pricing practices while maintaining the highest ethical standards.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section style={{
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "hsl(var(--foreground))"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--primary) / 0.1)",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--primary))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            Our Team
          </h2>
          <p style={{ 
            marginBottom: "2rem",
            lineHeight: "1.7",
            color: "hsl(var(--foreground))"
          }}>
            Scam Watch was founded by a team of consumer advocates, data analysts, and technology experts committed to creating fair marketplaces. Our diverse team brings together expertise in consumer protection law, data science, and community organizing.
          </p>
        </section>

        {/* CTA Section */}
        <section style={{
          backgroundColor: "hsla(var(--primary) / 0.05)",
          borderRadius: "0.75rem",
          padding: "2.5rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem"
          }}>Join the Movement Against Price Gouging</h2>
          <p style={{
            marginBottom: "2rem",
            maxWidth: "600px",
            lineHeight: "1.7",
            color: "hsl(var(--muted-foreground))"
          }}>
            Help build a more fair marketplace by reporting price gouging incidents in your community
          </p>
          <div style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <Button asChild size="lg" style={{
              fontSize: "1rem",
              padding: "0 1.5rem",
              height: "3rem"
            }}>
              <Link href="/reports/new">Report Price Gouging</Link>
            </Button>
            <Button variant="outline" size="lg" asChild style={{
              fontSize: "1rem",
              padding: "0 1.5rem",
              height: "3rem"
            }}>
              <Link href="/businesses">View Reported Businesses</Link>
            </Button>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "hsl(var(--foreground))"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--primary) / 0.1)",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(var(--primary))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            Contact Us
          </h2>
          <p style={{ 
            marginBottom: "1.5rem",
            lineHeight: "1.7",
            color: "hsl(var(--foreground))"
          }}>
            Have questions, feedback, or want to get involved? We'd love to hear from you. Get in touch with our team.
          </p>
          <div style={{
            backgroundColor: "hsl(var(--card))",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem"
            }}>
              <div>
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Email
                </h3>
                <a href="mailto:contact@scamwatch.example.com" style={{
                  color: "hsl(var(--primary))",
                  textDecoration: "none"
                }}>contact@scamwatch.example.com</a>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Phone
                </h3>
                <span>+1 (555) 123-4567</span>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M16.2 7.8c-.2 0-.4.1-.5.2-.1.1-.2.3-.2.5s.1.4.2.5c.1.1.3.2.5.2s.4-.1.5-.2c.1-.1.2-.3.2-.5s-.1-.4-.2-.5c-.1-.1-.3-.2-.5-.2z"/>
                  </svg>
                  Social Media
                </h3>
                <div style={{
                  display: "flex",
                  gap: "0.75rem"
                }}>
                  <a href="#" style={{
                    color: "hsl(var(--muted-foreground))",
                    transition: "color 0.2s"
                  }}>Twitter</a>
                  <a href="#" style={{
                    color: "hsl(var(--muted-foreground))",
                    transition: "color 0.2s"
                  }}>Facebook</a>
                  <a href="#" style={{
                    color: "hsl(var(--muted-foreground))",
                    transition: "color 0.2s"
                  }}>Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
