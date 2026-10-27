interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyle =
    "font-bold border-2 border-fg rounded-none transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50";

  const variantStyle = {
    primary: "bg-fg text-bg shadow-brutal hover:shadow-brutal-lg",
    secondary: "bg-bg text-fg border-fg shadow-brutal hover:shadow-brutal-lg",
    danger: "bg-danger text-white border-danger shadow-brutal hover:shadow-brutal-lg",
  };

  const sizeStyle = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyle[variant]} ${sizeStyle[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
