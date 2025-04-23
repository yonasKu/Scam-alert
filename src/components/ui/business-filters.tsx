"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BusinessFiltersProps {
  reportTypes: { id: string; label: string }[];
  selectedReportType: string;
  setSelectedReportType: (type: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function BusinessFilters({
  reportTypes,
  selectedReportType,
  setSelectedReportType,
  searchTerm,
  setSearchTerm,
  t
}: BusinessFiltersProps) {
  return (
    <div style={{
      marginBottom: "2rem",
      backgroundColor: "hsl(var(--card))",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      border: "1px solid hsl(var(--border))"
    }}>
      <h2 style={{
        fontSize: "1.25rem",
        fontWeight: "600",
        marginBottom: "1rem"
      }}>
        {t("filters.title")}
      </h2>
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "0.5rem"
            }}
          >
            {t("filters.search")}
          </label>
          <div style={{
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "hsl(var(--muted-foreground))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              style={{
                width: "100%",
                padding: "0.625rem 1rem 0.625rem 2.5rem",
                borderRadius: "0.375rem",
                border: "1px solid hsl(var(--input))",
                backgroundColor: "hsl(var(--background))",
                fontSize: "0.875rem"
              }}
            />
          </div>
        </div>
        
        {/* Report Type Filter */}
        <div>
          <h3 style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            marginBottom: "0.75rem"
          }}>
            {t("filters.reportType")}
          </h3>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem"
          }}>
            {reportTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedReportType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedReportType(type.id)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
