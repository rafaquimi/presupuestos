import { Building2 } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "Presupuestos";

  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} aspect-square bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center`}
      >
        <Building2 className={`${size === "sm" ? "w-5 h-5" : size === "md" ? "w-7 h-7" : "w-10 h-10"} text-white`} />
      </div>
      <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
        {companyName}
      </span>
    </div>
  );
}
