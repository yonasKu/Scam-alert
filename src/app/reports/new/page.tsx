"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewReportPage() {
  const [formData, setFormData] = useState({
    title: "",
    businessName: "",
    location: "",
    category: "",
    description: "",
    photo: null,
    contact: "",
    reportType: "",
    priceBefore: "",
    priceAfter: "",
    receiptIssue: "",
    suspiciousActivity: "",
    unauthorizedIssue: "",
    item: ""
  });
  
  const [windowWidth, setWindowWidth] = useState(0);

  // Handle window resize effect - only runs client-side
  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window !== 'undefined') {
      // Set initial width
      setWindowWidth(window.innerWidth);
      
      // Add resize listener
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the data to an API
    console.log("Submitting report:", formData);
    alert("Thank you for submitting your report! It will be reviewed by our team.");
    // Reset form or redirect
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      padding: "2rem 1.5rem 4rem",
      backgroundColor: "hsl(var(--background))"
    }}>
      {/* Header Section */}
      <div style={{
        position: "relative",
        width: "100%",
        marginBottom: "2.5rem",
        maxWidth: "1000px",
        margin: "0 auto 3rem"
      }}>
        <div style={{
          textAlign: "center",
          padding: "2rem",
          borderRadius: "0.75rem",
          backgroundColor: "hsla(var(--primary) / 0.05)",
          marginBottom: "2rem"
        }}>
          <h1 style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: "var(--font-heading)",
            background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent"
          }}>
            Report Consumer Issues
          </h1>
          <p style={{ 
            fontSize: "1.125rem",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Document price gouging, missing receipts, suspicious activities, or other unfair business practices
          </p>
        </div>
      </div>

      <div className="container" style={{ 
        maxWidth: "800px", 
        margin: "0 auto"
      }}>
        <Card style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: "0.75rem",
          overflow: "hidden"
        }}>
          <CardHeader style={{
            borderBottom: "1px solid hsla(var(--border) / 0.5)",
            padding: "1.5rem",
            backgroundColor: "hsla(var(--muted) / 0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem"
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <CardTitle style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>Report Details</CardTitle>
            </div>
            <CardDescription style={{ lineHeight: 1.6, fontSize: "1rem" }}>
              Help protect your community by reporting businesses engaged in unfair practices. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent style={{ padding: "2rem 1.5rem" }}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Report Title */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="title" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Report Title *
                  </label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief description of the issue" 
                    style={{
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    required
                  />
                </div>

                {/* Business Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="businessName" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Business Name *
                  </label>
                  <Input 
                    id="businessName" 
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Name of the store or business" 
                    style={{
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    required
                  />
                </div>

                {/* Location */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="location" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Location *
                  </label>
                  <Input 
                    id="location" 
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Address or area of the business" 
                    style={{
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    required
                  />
                </div>

                {/* Category */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="category" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Category *
                  </label>
                  <select 
                    id="category" 
                    value={formData.category}
                    onChange={handleChange}
                    style={{
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      height: "2.75rem",
                      width: "100%"
                    }}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="No Receipt">No Receipt Provided</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Report Type */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                  <label 
                    htmlFor="reportType" 
                    style={{ 
                      fontSize: "1.125rem", 
                      fontWeight: "600", 
                      color: "hsl(var(--foreground))",
                      fontFamily: "var(--font-heading)"
                    }}
                  >
                    What are you reporting? *
                  </label>
                  
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: windowWidth >= 768 ? "repeat(2, 1fr)" : "1fr",
                    gap: "1rem"
                  }}>
                    {/* Price Gouging Option */}
                    <div 
                      onClick={() => setFormData({...formData, reportType: "price_gouging"})}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid",
                        borderColor: formData.reportType === "price_gouging" 
                          ? "hsl(var(--primary))" 
                          : "hsla(var(--border) / 0.5)",
                        backgroundColor: formData.reportType === "price_gouging" 
                          ? "hsla(var(--primary) / 0.05)" 
                          : "hsla(var(--card) / 0.8)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--destructive) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--destructive))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                            <path d="M3 6h18"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                        </div>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "1.125rem"
                        }}>Price Gouging</div>
                      </div>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: 1.5
                      }}>
                        Report unreasonable price increases, especially during emergencies
                      </p>
                      <input 
                        type="radio" 
                        id="reportType-price-gouging" 
                        name="reportType"
                        value="price_gouging"
                        checked={formData.reportType === "price_gouging"}
                        onChange={() => setFormData({...formData, reportType: "price_gouging"})}
                        style={{ display: "none" }}
                      />
                    </div>
                    
                    {/* No Receipt Option */}
                    <div 
                      onClick={() => setFormData({...formData, reportType: "no_receipt"})}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid",
                        borderColor: formData.reportType === "no_receipt" 
                          ? "hsl(var(--primary))" 
                          : "hsla(var(--border) / 0.5)",
                        backgroundColor: formData.reportType === "no_receipt" 
                          ? "hsla(var(--primary) / 0.05)" 
                          : "hsla(var(--card) / 0.8)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--destructive) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--destructive))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <line x1="9" x2="15" y1="9" y2="9" />
                            <line x1="9" x2="15" y1="15" y2="15" />
                          </svg>
                        </div>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "1.125rem"
                        }}>No Receipt Provided</div>
                      </div>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: 1.5
                      }}>
                        Report businesses that don't provide proper receipts for purchases
                      </p>
                      <input 
                        type="radio" 
                        id="reportType-no-receipt" 
                        name="reportType"
                        value="no_receipt"
                        checked={formData.reportType === "no_receipt"}
                        onChange={() => setFormData({...formData, reportType: "no_receipt"})}
                        style={{ display: "none" }}
                      />
                    </div>
                    
                    {/* Suspicious Activity Option */}
                    <div 
                      onClick={() => setFormData({...formData, reportType: "suspicious_activity"})}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid",
                        borderColor: formData.reportType === "suspicious_activity" 
                          ? "hsl(var(--primary))" 
                          : "hsla(var(--border) / 0.5)",
                        backgroundColor: formData.reportType === "suspicious_activity" 
                          ? "hsla(var(--primary) / 0.05)" 
                          : "hsla(var(--card) / 0.8)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--warning) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--warning))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                          </svg>
                        </div>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "1.125rem"
                        }}>Suspicious Activity</div>
                      </div>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: 1.5
                      }}>
                        Report card skimming, counterfeit products, or other suspicious behavior
                      </p>
                      <input 
                        type="radio" 
                        id="reportType-suspicious" 
                        name="reportType"
                        value="suspicious_activity"
                        checked={formData.reportType === "suspicious_activity"}
                        onChange={() => setFormData({...formData, reportType: "suspicious_activity"})}
                        style={{ display: "none" }}
                      />
                    </div>
                    
                    {/* Unauthorized Business Option */}
                    <div 
                      onClick={() => setFormData({...formData, reportType: "unauthorized_business"})}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid",
                        borderColor: formData.reportType === "unauthorized_business" 
                          ? "hsl(var(--primary))" 
                          : "hsla(var(--border) / 0.5)",
                        backgroundColor: formData.reportType === "unauthorized_business" 
                          ? "hsla(var(--primary) / 0.05)" 
                          : "hsla(var(--card) / 0.8)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--primary) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--primary))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </div>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "1.125rem"
                        }}>Unauthorized Business</div>
                      </div>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: 1.5
                      }}>
                        Report businesses operating illegally or with code violations
                      </p>
                      <input 
                        type="radio" 
                        id="reportType-unauthorized" 
                        name="reportType"
                        value="unauthorized_business"
                        checked={formData.reportType === "unauthorized_business"}
                        onChange={() => setFormData({...formData, reportType: "unauthorized_business"})}
                        style={{ display: "none" }}
                      />
                    </div>

                    {/* False Advertising Option */}
                    <div 
                      onClick={() => setFormData({...formData, reportType: "false_advertising"})}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid",
                        borderColor: formData.reportType === "false_advertising" 
                          ? "hsl(var(--primary))" 
                          : "hsla(var(--border) / 0.5)",
                        backgroundColor: formData.reportType === "false_advertising" 
                          ? "hsla(var(--primary) / 0.05)" 
                          : "hsla(var(--card) / 0.8)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--warning) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--warning))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 8 4-4 4 4"/>
                            <path d="M11 12H3"/>
                            <path d="m9 16 4 4 4-4"/>
                            <path d="M20 12h-8"/>
                          </svg>
                        </div>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "1.125rem"
                        }}>False Advertising</div>
                      </div>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: 1.5
                      }}>
                        Report misleading advertisements or product claims
                      </p>
                      <input 
                        type="radio" 
                        id="reportType-false-advertising" 
                        name="reportType"
                        value="false_advertising"
                        checked={formData.reportType === "false_advertising"}
                        onChange={() => setFormData({...formData, reportType: "false_advertising"})}
                        style={{ display: "none" }}
                      />
                    </div>

                    {/* Hidden Fees Option */}
                    <div 
                      onClick={() => setFormData({...formData, reportType: "hidden_fees"})}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid",
                        borderColor: formData.reportType === "hidden_fees" 
                          ? "hsl(var(--primary))" 
                          : "hsla(var(--border) / 0.5)",
                        backgroundColor: formData.reportType === "hidden_fees" 
                          ? "hsla(var(--primary) / 0.05)" 
                          : "hsla(var(--card) / 0.8)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--destructive) / 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--destructive))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4"/>
                            <path d="M12 16h.01"/>
                          </svg>
                        </div>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "1.125rem"
                        }}>Hidden Fees</div>
                      </div>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: 1.5
                      }}>
                        Report undisclosed charges or unexpected fees
                      </p>
                      <input 
                        type="radio" 
                        id="reportType-hidden-fees" 
                        name="reportType"
                        value="hidden_fees"
                        checked={formData.reportType === "hidden_fees"}
                        onChange={() => setFormData({...formData, reportType: "hidden_fees"})}
                        style={{ display: "none" }}
                      />
                    </div>
                    
                    {/* Other Option */}
                    <div 
                      onClick={() => setFormData({...formData, reportType: "other"})}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "0.75rem",
                        border: "1px solid",
                        borderColor: formData.reportType === "other" 
                          ? "hsl(var(--primary))" 
                          : "hsla(var(--border) / 0.5)",
                        backgroundColor: formData.reportType === "other" 
                          ? "hsla(var(--primary) / 0.05)" 
                          : "hsla(var(--card) / 0.8)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem"
                      }}>
                        <div style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "50%",
                          backgroundColor: "hsla(var(--muted) / 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "hsl(var(--muted-foreground))"
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <path d="M12 17h.01"/>
                          </svg>
                        </div>
                        <div style={{
                          fontWeight: "600",
                          fontSize: "1.125rem"
                        }}>Other Consumer Issue</div>
                      </div>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))",
                        lineHeight: 1.5
                      }}>
                        Report any other unfair business practices not listed above
                      </p>
                      <input 
                        type="radio" 
                        id="reportType-other" 
                        name="reportType"
                        value="other"
                        checked={formData.reportType === "other"}
                        onChange={() => setFormData({...formData, reportType: "other"})}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hide the old dropdown since we're using the new visual selector */}
                <div style={{ display: "none" }}>
                  <select 
                    id="reportType" 
                    value={formData.reportType}
                    onChange={handleChange}
                  >
                    <option value="">Select issue type</option>
                    <option value="price_gouging">Price Gouging</option>
                    <option value="no_receipt">No Receipt Provided</option>
                    <option value="suspicious_activity">Suspicious Activity</option>
                    <option value="unauthorized_business">Unauthorized Business Behavior</option>
                    <option value="false_advertising">False Advertising</option>
                    <option value="hidden_fees">Hidden Fees</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Issue Details - conditional based on report type */}
                {formData.reportType === 'price_gouging' && (
                  <>
                    {/* Price Before */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label 
                        htmlFor="priceBefore" 
                        style={{ 
                          fontSize: "0.9375rem", 
                          fontWeight: "600", 
                          marginBottom: "0.25rem",
                          color: "hsl(var(--foreground))"
                        }}
                      >
                        Original Price *
                      </label>
                      <Input 
                        id="priceBefore" 
                        value={formData.priceBefore}
                        onChange={handleChange}
                        placeholder="e.g. $1.99" 
                        style={{
                          fontSize: "1rem",
                          padding: "0.75rem 1rem",
                          borderRadius: "0.375rem",
                          border: "1px solid hsla(var(--border) / 0.5)",
                          backgroundColor: "hsla(var(--background) / 0.5)",
                          transition: "border-color 0.2s, box-shadow 0.2s"
                        }}
                        required={formData.reportType === 'price_gouging'}
                      />
                    </div>

                    {/* Price After */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label 
                        htmlFor="priceAfter" 
                        style={{ 
                          fontSize: "0.9375rem", 
                          fontWeight: "600", 
                          marginBottom: "0.25rem",
                          color: "hsl(var(--foreground))"
                        }}
                      >
                        Gouged Price *
                      </label>
                      <Input 
                        id="priceAfter" 
                        value={formData.priceAfter}
                        onChange={handleChange}
                        placeholder="e.g. $5.99" 
                        style={{
                          fontSize: "1rem",
                          padding: "0.75rem 1rem",
                          borderRadius: "0.375rem",
                          border: "1px solid hsla(var(--border) / 0.5)",
                          backgroundColor: "hsla(var(--background) / 0.5)",
                          transition: "border-color 0.2s, box-shadow 0.2s"
                        }}
                        required={formData.reportType === 'price_gouging'}
                      />
                    </div>
                  </>
                )}

                {formData.reportType === 'no_receipt' && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label 
                      htmlFor="receiptIssue" 
                      style={{ 
                        fontSize: "0.9375rem", 
                        fontWeight: "600", 
                        marginBottom: "0.25rem",
                        color: "hsl(var(--foreground))"
                      }}
                    >
                      Receipt Issue Type *
                    </label>
                    <select 
                      id="receiptIssue" 
                      value={formData.receiptIssue}
                      onChange={handleChange}
                      style={{
                        fontSize: "1rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.375rem",
                        border: "1px solid hsla(var(--border) / 0.5)",
                        backgroundColor: "hsla(var(--background) / 0.5)",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        height: "2.75rem",
                        width: "100%"
                      }}
                      required={formData.reportType === 'no_receipt'}
                    >
                      <option value="">Select receipt issue</option>
                      <option value="no_receipt">No receipt offered at all</option>
                      <option value="refused_receipt">Receipt refused when requested</option>
                      <option value="incomplete_receipt">Incomplete/illegible receipt</option>
                      <option value="verbal_receipt">Only verbal confirmation, no paper receipt</option>
                      <option value="handwritten">Suspicious handwritten receipt</option>
                    </select>
                  </div>
                )}

                {formData.reportType === 'suspicious_activity' && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label 
                      htmlFor="suspiciousActivity" 
                      style={{ 
                        fontSize: "0.9375rem", 
                        fontWeight: "600", 
                        marginBottom: "0.25rem",
                        color: "hsl(var(--foreground))"
                      }}
                    >
                      Suspicious Activity Type *
                    </label>
                    <select 
                      id="suspiciousActivity" 
                      value={formData.suspiciousActivity}
                      onChange={handleChange}
                      style={{
                        fontSize: "1rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.375rem",
                        border: "1px solid hsla(var(--border) / 0.5)",
                        backgroundColor: "hsla(var(--background) / 0.5)",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        height: "2.75rem",
                        width: "100%"
                      }}
                      required={formData.reportType === 'suspicious_activity'}
                    >
                      <option value="">Select suspicious activity</option>
                      <option value="card_skimming">Credit card skimming</option>
                      <option value="counterfeit">Selling counterfeit products</option>
                      <option value="identity_theft">Identity theft concerns</option>
                      <option value="data_collection">Excessive personal data collection</option>
                      <option value="unauthorized_charges">Unauthorized charges</option>
                      <option value="digital_scam">Digital/online scam</option>
                      <option value="other">Other suspicious activity</option>
                    </select>
                  </div>
                )}

                {formData.reportType === 'unauthorized_business' && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label 
                      htmlFor="unauthorizedIssue" 
                      style={{ 
                        fontSize: "0.9375rem", 
                        fontWeight: "600", 
                        marginBottom: "0.25rem",
                        color: "hsl(var(--foreground))"
                      }}
                    >
                      Unauthorized Business Issue *
                    </label>
                    <select 
                      id="unauthorizedIssue" 
                      value={formData.unauthorizedIssue}
                      onChange={handleChange}
                      style={{
                        fontSize: "1rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.375rem",
                        border: "1px solid hsla(var(--border) / 0.5)",
                        backgroundColor: "hsla(var(--background) / 0.5)",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        height: "2.75rem",
                        width: "100%"
                      }}
                      required={formData.reportType === 'unauthorized_business'}
                    >
                      <option value="">Select issue type</option>
                      <option value="unlicensed">Operating without proper license</option>
                      <option value="health_violations">Health code violations</option>
                      <option value="illegal_products">Selling illegal/prohibited products</option>
                      <option value="tax_evasion">Suspected tax evasion</option>
                      <option value="labor_violations">Labor law violations</option>
                      <option value="other">Other unauthorized behavior</option>
                    </select>
                  </div>
                )}

                {/* Item Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="item" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Item Name *
                  </label>
                  <Input 
                    id="item" 
                    value={formData.item}
                    onChange={handleChange}
                    placeholder="Name of the product or service" 
                    style={{
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                    required
                  />
                </div>

                {/* Description */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="description" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Detailed Description *
                  </label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what happened, including any relevant context about the issue"
                    rows={5}
                    style={{
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      minHeight: "120px",
                      resize: "vertical"
                    }}
                    required
                  />
                </div>

                {/* Photo Upload */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="photo" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Receipt or Price Tag Photo (Optional)
                  </label>
                  <div style={{
                    border: "2px dashed hsla(var(--border) / 0.7)",
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "hsla(var(--muted) / 0.1)",
                    cursor: "pointer"
                  }}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <Input 
                        id="photo" 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                        style={{
                          display: "none"
                        }}
                      />
                      <label htmlFor="photo" style={{
                        cursor: "pointer",
                        color: "hsl(var(--primary))",
                        fontWeight: "500"
                      }}>
                        Click to upload or drag and drop
                      </label>
                      <p style={{
                        fontSize: "0.875rem",
                        color: "hsl(var(--muted-foreground))"
                      }}>
                        PNG, JPG, or WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label 
                    htmlFor="contact" 
                    style={{ 
                      fontSize: "0.9375rem", 
                      fontWeight: "600", 
                      marginBottom: "0.25rem",
                      color: "hsl(var(--foreground))"
                    }}
                  >
                    Your Contact Info (Optional)
                  </label>
                  <Input 
                    id="contact" 
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Email or phone number" 
                    style={{
                      fontSize: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.375rem",
                      border: "1px solid hsla(var(--border) / 0.5)",
                      backgroundColor: "hsla(var(--background) / 0.5)",
                      transition: "border-color 0.2s, box-shadow 0.2s"
                    }}
                  />
                  <p style={{ 
                    fontSize: "0.75rem", 
                    color: "hsl(var(--muted-foreground))",
                    marginTop: "0.25rem"
                  }}>
                    This will not be publicly displayed. Only for verification if needed.
                  </p>
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{
                marginTop: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  flexDirection: windowWidth >= 640 ? "row" : "column",
                  justifyContent: windowWidth >= 640 ? "flex-end" : "stretch",
                  width: "100%"
                }}>
                  <Button 
                    type="button" 
                    variant="outline" 
                    asChild 
                    style={{
                      padding: "0 1.5rem",
                      height: "2.75rem"
                    }}
                  >
                    <Link href="/reports">Cancel</Link>
                  </Button>
                  <Button 
                    type="submit"
                    style={{
                      padding: "0 1.5rem",
                      height: "2.75rem", 
                      backgroundColor: "hsl(var(--primary))"
                    }}
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
