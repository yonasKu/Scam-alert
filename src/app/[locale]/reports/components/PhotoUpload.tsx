"use client";

import { useRef } from "react";

interface PhotoUploadProps {
  photoPreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

export function PhotoUpload({ photoPreview, onFileChange, onRemove, t }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileChange(event);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <label 
        htmlFor="photo" 
        style={{ 
          fontSize: "0.9375rem", 
          fontWeight: "600", 
          marginBottom: "0.25rem",
          color: "hsl(var(--foreground))"
        }}
      >
        {t('form.fields.photo.label')}
      </label>
      
      {!photoPreview ? (
        <div 
          style={{
            border: "2px dashed hsla(var(--border) / 0.7)",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            textAlign: "center",
            backgroundColor: "hsla(var(--muted) / 0.1)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = "hsla(var(--muted) / 0.2)";
            e.currentTarget.style.borderColor = "hsl(var(--primary))";
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = "hsla(var(--muted) / 0.1)";
            e.currentTarget.style.borderColor = "hsla(var(--border) / 0.7)";
          }}
        >
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <div style={{
              backgroundColor: "hsla(var(--primary) / 0.1)",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.75rem",
              color: "hsl(var(--primary))"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                <line x1="16" x2="22" y1="5" y2="5"/>
                <line x1="19" x2="19" y1="2" y2="8"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <input 
              ref={fileInputRef}
              id="photo" 
              type="file" 
              accept="image/*"
              onChange={onFileChange}
              style={{
                display: "none"
              }}
            />
            <div>
              <p style={{
                margin: "0 0 0.25rem 0",
                fontWeight: "500",
                color: "hsl(var(--primary))"
              }}>
                {t('form.fields.photo.uploadText')}
              </p>
              <p style={{
                fontSize: "0.875rem",
                color: "hsl(var(--muted-foreground))",
                margin: "0"
              }}>
                {t('form.fields.photo.dragDropText', { default: 'Drag and drop or click to select' })}
              </p>
            </div>
            <p style={{
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))",
              margin: "0.5rem 0 0 0"
            }}>
              {t('form.fields.photo.fileFormats')}
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          border: "1px solid hsla(var(--border) / 0.7)",
          borderRadius: "0.5rem",
          padding: "0.75rem",
          backgroundColor: "hsla(var(--background) / 1)",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <p style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                margin: "0"
              }}>
                {t('form.fields.photo.selectedImage', { default: 'Selected Image' })}
              </p>
              <button
                type="button"
                onClick={onRemove}
                style={{
                  backgroundColor: "hsla(var(--destructive) / 0.1)",
                  color: "hsl(var(--destructive))",
                  border: "none",
                  borderRadius: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                {t('form.fields.photo.remove', { default: 'Remove' })}
              </button>
            </div>
            <div style={{
              position: "relative",
              width: "100%",
              height: "200px",
              borderRadius: "0.375rem",
              overflow: "hidden",
              backgroundColor: "hsla(var(--muted) / 0.1)"
            }}>
              <img 
                src={photoPreview} 
                alt="Preview" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "flex-end"
            }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  backgroundColor: "hsla(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  border: "none",
                  borderRadius: "0.25rem",
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                  <line x1="16" x2="22" y1="5" y2="5"/>
                  <line x1="19" x2="19" y1="2" y2="8"/>
                </svg>
                {t('form.fields.photo.change', { default: 'Change Photo' })}
              </button>
            </div>
          </div>
        </div>
      )}
      <p style={{
        fontSize: "0.75rem",
        color: "hsl(var(--muted-foreground))",
        margin: "0.25rem 0 0 0"
      }}>
        {t('form.fields.photo.helpText', { default: 'Adding a photo helps verify your report and provides evidence of the issue.' })}
      </p>
    </div>
  );
}
