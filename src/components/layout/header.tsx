"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import { usePathname } from 'next/navigation'; // Import usePathname
import { LanguageSwitcher } from './LanguageSwitcher'; // Import LanguageSwitcher

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('Header'); // Initialize translations for 'Header' namespace
  const pathname = usePathname(); // Get current pathname for active link highlighting

  // Handle responsiveness properly
  useEffect(() => {
    // Set mounted to true once component is mounted
    setMounted(true);
    
    // Check initial screen size
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add click outside handler to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen &&
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) &&
          menuButtonRef.current &&
          !menuButtonRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    // Add the event listener only when menu is open
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Get current locale from URL path
  const [locale, setLocale] = useState<string>('');
  
  useEffect(() => {
    // Extract locale from URL path
    const pathSegments = window.location.pathname.split('/');
    const localeFromPath = pathSegments[1];
    if (localeFromPath === 'en' || localeFromPath === 'am') {
      setLocale(localeFromPath);
    } else {
      setLocale('en'); // Default to English if locale not found
    }
  }, []);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/reports`, label: t('reports') },
    { href: `/${locale}/businesses`, label: t('businesses') },
    { href: `/${locale}/watchlist`, label: t('watchlist') },
    { href: `/${locale}/about`, label: t('about') },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      width: '100%',
      borderBottom: '1px solid hsla(var(--border) / 0.2)',
      backgroundColor: 'hsla(var(--background) / 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 50,
      padding: '0.5rem 0',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        height: '4rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
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
              fontSize: '1.5rem'
            }}>
              SW
            </div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'hsl(var(--foreground))',
              letterSpacing: '-0.025em',
              transition: 'color 0.2s ease'
            }}>
              {t('scamWatch')} {/* Use t('scamWatch') */}
            </span>
          </Link>
        </div>

        {/* Desktop navigation - Only show if not mobile and mounted */}
        {mounted && !isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            {links.map((link) => {
              // Check if this is the active link
              const isActive = pathname === link.href || 
                (pathname?.startsWith(link.href) && link.href !== `/${locale}`);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    position: 'relative',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    padding: '0.5rem 0',
                  }}
                >
                  {link.label}
                  <div
                    className={isActive ? 'active-line' : 'hover-line'}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      height: '2px',
                      width: isActive ? '100%' : '0%',
                      backgroundColor: 'hsl(var(--primary))',
                      transition: 'width 0.2s ease',
                    }}
                  />
                </Link>
              );
            })}
            <LanguageSwitcher /> {/* Add LanguageSwitcher here */}
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Desktop action button - Only show if not mobile and mounted */}
          {mounted && !isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link 
                href={`/${locale}/reports/new`} 
                className="action-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2.5rem',
                  padding: '0 1.25rem',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 500,
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.1s, background-color 0.2s',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.backgroundColor = 'hsl(var(--primary) / 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                }}
              >
                {t('reportPriceGouging')} {/* Use t('reportPriceGouging') */}
              </Link>
            </div>
          )}

          {/* Mobile menu button - Only show if mobile or not mounted yet */}
          {(!mounted || isMobile) && (
            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                background: 'none',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                color: 'hsl(var(--foreground))' // Explicit color to ensure visibility
              }}
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: 'hsl(var(--foreground))' }} // Explicit color for the SVG
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" x2="20" y1="12" y2="12"/>
                    <line x1="4" x2="20" y1="6" y2="6"/>
                    <line x1="4" x2="20" y1="18" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu - Only render if mobile and menu is open */}
      {mounted && isMobile && mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'hsl(var(--background))',
            borderBottomLeftRadius: '0.5rem',
            borderBottomRightRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '1rem',
            zIndex: 40,
            borderTop: '1px solid hsla(var(--border) / 0.1)'
          }}
        >
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {links.map((link) => {
              // Check if this is the active link
              const isActive = pathname === link.href || 
                (pathname?.startsWith(link.href) && link.href !== `/${locale}`);
              
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                    backgroundColor: isActive ? 'hsla(var(--primary) / 0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div style={{
              marginTop: '0.5rem',
              borderTop: '1px solid hsla(var(--border) / 0.5)',
              paddingTop: '0.75rem'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <LanguageSwitcher /> {/* Add LanguageSwitcher to mobile menu too */}
              </div>
              <Link 
                href="/reports/new" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 500,
                  borderRadius: '0.375rem',
                  textDecoration: 'none'
                }}
              >
                {t('reportPriceGouging')} {/* Use t('reportPriceGouging') */}
              </Link>
            </div>
          </nav>
        </div>
      )}

      <style jsx>{`
        a:hover .hover-line {
          width: 100%;
        }
        .active-line {
          width: 100% !important;
        }
      `}</style>
    </header>
  );
}
