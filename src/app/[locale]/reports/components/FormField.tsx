"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Component for form input fields
export interface FormFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  type?: string;
  as?: "input" | "textarea" | "select";
  children?: React.ReactNode;
  description?: string;
}

export function FormField({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type = "text",
  as = "input",
  children,
  description
}: FormFieldProps) {
  const InputComponent = as === "textarea" ? Textarea : Input;
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label 
        htmlFor={id} 
        style={{ 
          fontSize: "0.9375rem", 
          fontWeight: "600", 
          marginBottom: "0.25rem",
          color: "hsl(var(--foreground))"
        }}
      >
        {label}
      </label>
      
      {as === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          style={{
            fontSize: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            border: "1px solid hsla(var(--border) / 0.5)",
            backgroundColor: "hsla(var(--background) / 0.5)",
            color: "hsl(var(--foreground))",
            transition: "border-color 0.2s, box-shadow 0.2s",
            height: "2.75rem",
            width: "100%"
          }}
          required={required}
          className="select-with-visible-options"
        >
          {children}
        </select>
      ) : (
        <InputComponent
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            fontSize: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            border: "1px solid hsla(var(--border) / 0.5)",
            backgroundColor: "hsla(var(--background) / 0.5)",
            color: "hsl(var(--foreground))",
            transition: "border-color 0.2s, box-shadow 0.2s"
          }}
          required={required}
          className="input-with-visible-text"
        />
      )}
      
      {description && (
        <p style={{ 
          fontSize: "0.75rem", 
          color: "hsl(var(--muted-foreground))",
          marginTop: "0.25rem"
        }}>
          {description}
        </p>
      )}
    </div>
  );
}
