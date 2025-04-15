"use client";

import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Navigation", links: [
        { label: "Home", href: "/" },
        { label: "Reports", href: "/reports" },
        { label: "Businesses", href: "/businesses" },
        { label: "Watchlist", href: "/watchlist" },
      ]
    },
    {
      title: "Reporting", links: [
        { label: "Report an Issue", href: "/reports/new" },
        { label: "Recent Reports", href: "/reports" },
        { label: "Suspicious Businesses", href: "/watchlist" },
      ]
    }
  ];

  return (
    <footer style={{
      width: '100%',
      borderTop: '1px solid hsla(var(--border) / 0.5)',
      backgroundColor: 'hsl(var(--background))',
      padding: '4rem 0 2rem',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: 'hsl(var(--primary))',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold',
                fontSize: '1.25rem'
              }}>SW</div>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'hsl(var(--foreground))',
              }}>Scam Watch</span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))',
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              A community platform for reporting price gouging and protecting consumers from unfair practices.
            </p>

            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}>
              {['twitter', 'facebook', 'instagram', 'github'].map(social => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '9999px',
                    backgroundColor: 'hsla(var(--muted) / 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'hsl(var(--foreground))',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '0.75rem' }}>{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'hsl(var(--foreground))'
              }}>{section.title}</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: '0.875rem',
                        color: 'hsl(var(--muted-foreground))',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        display: 'inline-block',
                        paddingTop: '0.25rem',
                        paddingBottom: '0.25rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'hsl(var(--primary))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'hsl(var(--foreground))'
            }}>Consumer Protection</h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              ScamWatch helps consumers report and track unfair business practices like price gouging, receipt issues, and suspicious activities.
            </p>

          </div>
        </div>

        <div style={{
          borderTop: '1px solid hsla(var(--border) / 0.3)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'hsl(var(--muted-foreground))'
          }}>
            &copy; {year} Scam Watch. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem'
          }}>
            <Link href="/privacy" style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--muted-foreground))',
              textDecoration: 'none'
            }}>
              Privacy
            </Link>
            <Link href="/terms" style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--muted-foreground))',
              textDecoration: 'none'
            }}>
              Terms
            </Link>
            <Link href="/cookies" style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--muted-foreground))',
              textDecoration: 'none'
            }}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
