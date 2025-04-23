"use client";

import { useState } from 'react';

export interface IssueType {
  id: string;
  label: string;
}

interface BusinessFiltersProps {
  minScore: string;
  setMinScore: (value: string) => void;
  maxScore: string;
  setMaxScore: (value: string) => void;
  limit: string;
  setLimit: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  issueTypes: IssueType[];
  onApplyFilters: () => void;
}

export default function BusinessFilters({
  minScore,
  setMinScore,
  maxScore,
  setMaxScore,
  limit,
  setLimit,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  issueTypes,
  onApplyFilters
}: BusinessFiltersProps) {
  return (
    <div style={{ 
      backgroundColor: 'hsl(var(--card))',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '2rem'
    }}>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        marginBottom: '1rem'
      }}>
        Filter Businesses
      </h2>
      
      <form onSubmit={(e) => { e.preventDefault(); onApplyFilters(); }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label 
              htmlFor="minScore" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: 500 
              }}
            >
              Minimum Score
            </label>
            <input
              id="minScore"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="0"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid hsla(var(--border) / 0.5)',
                backgroundColor: 'hsla(var(--background) / 0.5)',
                fontSize: '0.9375rem'
              }}
            />
          </div>
          
          <div>
            <label 
              htmlFor="maxScore" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: 500 
              }}
            >
              Maximum Score
            </label>
            <input
              id="maxScore"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="10"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid hsla(var(--border) / 0.5)',
                backgroundColor: 'hsla(var(--background) / 0.5)',
                fontSize: '0.9375rem'
              }}
            />
          </div>
          
          <div>
            <label 
              htmlFor="limit" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: 500 
              }}
            >
              Limit Results
            </label>
            <input
              id="limit"
              type="number"
              min="1"
              max="100"
              placeholder="20"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid hsla(var(--border) / 0.5)',
                backgroundColor: 'hsla(var(--background) / 0.5)',
                fontSize: '0.9375rem'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                backgroundColor: 'hsl(var(--primary))',
                fontSize: '0.9375rem',
                fontWeight: '500',
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>
      
      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="search" 
          style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontSize: '0.875rem', 
            fontWeight: 500 
          }}
        >
          Search Businesses
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="search"
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              paddingLeft: '2.5rem',
              borderRadius: '0.375rem',
              border: '1px solid hsla(var(--border) / 0.5)',
              backgroundColor: 'hsla(var(--background) / 0.5)',
              fontSize: '0.9375rem'
            }}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'hsl(var(--muted-foreground))'
            }}
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>
      
      {/* Issue type filters */}
      <div>
        <label 
          style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontSize: '0.875rem', 
            fontWeight: 500 
          }}
        >
          Filter by Issue Type
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {issueTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              type="button"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: activeTab === type.id 
                  ? 'hsl(var(--warning))' 
                  : 'hsla(var(--border) / 0.5)',
                backgroundColor: activeTab === type.id 
                  ? 'hsla(var(--warning) / 0.1)' 
                  : 'transparent',
                color: activeTab === type.id 
                  ? 'hsl(var(--warning))' 
                  : 'hsl(var(--foreground))',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
