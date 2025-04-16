"use client";

// ReportTypeOption component to make code more modular
export interface ReportTypeOptionProps {
  id: string;
  value: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  iconBgColor: string;
  iconColor: string;
}

export function ReportTypeOption({
  id,
  value,
  title,
  description,
  icon,
  isSelected,
  onClick,
  iconBgColor,
  iconColor
}: ReportTypeOptionProps) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: "1.25rem",
        borderRadius: "0.75rem",
        border: "1px solid",
        borderColor: isSelected 
          ? "hsl(var(--primary))" 
          : "hsla(var(--border) / 0.5)",
        backgroundColor: isSelected 
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
          backgroundColor: iconBgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor
        }}>
          {icon}
        </div>
        <div style={{
          fontWeight: "600",
          fontSize: "1.125rem"
        }}>{title}</div>
      </div>
      <p style={{
        fontSize: "0.875rem",
        color: "hsl(var(--muted-foreground))",
        lineHeight: 1.5
      }}>
        {description}
      </p>
      <input 
        type="radio" 
        id={id} 
        name="reportType"
        value={value}
        checked={isSelected}
        onChange={onClick}
        style={{ display: "none" }}
      />
    </div>
  );
}
