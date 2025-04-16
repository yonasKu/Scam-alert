"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();
  const pathname = usePathname();
  
  // Extract locale from path
  const locale = pathname.split('/')[1] || 'en';

  const footerLinks = [
    {
      title: t('navSection'), links: [
        { label: t('home'), href: `/${locale}` },
        { label: t('reports'), href: `/${locale}/reports` },
        { label: t('businesses'), href: `/${locale}/businesses` },
        { label: t('watchlist'), href: `/${locale}/watchlist` },
      ]
    },
    {
      title: t('reportingSection'), links: [
        { label: t('reportIssue'), href: `/${locale}/reports/new` },
        { label: t('recentReports'), href: `/${locale}/reports` },
        { label: t('suspiciousBusinesses'), href: `/${locale}/watchlist` },
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
              }}>{t('brandInitials')}</div>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'hsl(var(--foreground))',
              }}>{t('brandName')}</span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))',
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              {t('description')}
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
            }}>{t('consumerProtection')}</h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              {t('consumerProtectionText')}
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
            {t('copyright', { year: year })}
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem'
          }}>
            <Link href={`/${locale}/privacy`} style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--muted-foreground))',
              textDecoration: 'none'
            }}>
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--muted-foreground))',
              textDecoration: 'none'
            }}>
              {t('terms')}
            </Link>
            <Link href={`/${locale}/cookies`} style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--muted-foreground))',
              textDecoration: 'none'
            }}>
              {t('cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
