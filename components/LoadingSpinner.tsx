import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "white";
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
  color = "primary",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  const colorClasses = {
    primary: "border-gray-300 border-t-blue-600",
    secondary: "border-gray-300 border-t-gray-600",
    white: "border-white/30 border-t-white",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingOverlay = ({
  children,
  isLoading,
  className = "",
}: {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-md z-50">
          <LoadingSpinner size="lg" color="white" />
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
