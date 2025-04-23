"use client";

import { useState } from "react";

interface BusinessFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedReportType: string;
  setSelectedReportType: (type: string) => void;
  reportTypes: Array<{ id: string; label: string }>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function BusinessFilters({ 
  searchTerm, 
  setSearchTerm, 
  selectedReportType, 
  setSelectedReportType,
  reportTypes,
  t 
}: BusinessFiltersProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Search Bar */}
      <div style={{
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        background: "hsl(var(--card))",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <div style={{
          color: "hsl(var(--muted-foreground))"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "1rem",
            color: "hsl(var(--foreground))"
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "hsl(var(--muted-foreground))"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Report Type Filter */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginBottom: "1rem"
      }}>
        <label style={{
          fontWeight: "500",
          fontSize: "0.875rem"
        }}>
          {t("filterByReportType")}
        </label>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          {reportTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedReportType(type.id)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid",
                borderColor: selectedReportType === type.id 
                  ? "hsl(var(--primary))" 
                  : "hsla(var(--border) / 0.5)",
                backgroundColor: selectedReportType === type.id 
                  ? "hsla(var(--primary) / 0.1)" 
                  : "transparent",
                color: selectedReportType === type.id 
                  ? "hsl(var(--primary))" 
                  : "hsl(var(--foreground))",
                fontWeight: "500",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {t(`reportTypes.${type.id}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Scam Legend */}
      <div style={{
        padding: "1rem",
        backgroundColor: "hsla(var(--muted) / 0.1)",
        borderRadius: "0.5rem",
        marginBottom: "1rem"
      }}>
        <h3 style={{
          fontWeight: "600",
          marginBottom: "0.75rem",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          {t("scamScoreExplanation")}
        </h3>
        <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem" 
          }}>
            <div style={{
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              backgroundColor: "hsl(var(--success))"
            }}></div>
            <span style={{ fontSize: "0.875rem" }}>{t("riskLevels.lowRisk")}</span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem" 
          }}>
            <div style={{
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              backgroundColor: "hsl(var(--warning))"
            }}></div>
            <span style={{ fontSize: "0.875rem" }}>{t("riskLevels.moderateRisk")}</span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem" 
          }}>
            <div style={{
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              backgroundColor: "hsl(var(--destructive))"
            }}></div>
            <span style={{ fontSize: "0.875rem" }}>{t("riskLevels.highRisk")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
