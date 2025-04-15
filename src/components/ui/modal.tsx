"use client";

import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, size = "md", children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (isOpen) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Prevent the modal from rendering during SSR
  if (!isMounted) return null;
  
  if (!isOpen) return null;

  const getModalWidth = () => {
    switch (size) {
      case "sm": return "500px";
      case "md": return "700px";
      case "lg": return "900px";
      case "xl": return "1100px";
      default: return "700px";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "hsl(var(--background))",
          borderRadius: "0.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: getModalWidth(),
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "hsl(var(--foreground))",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "1.5rem",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
