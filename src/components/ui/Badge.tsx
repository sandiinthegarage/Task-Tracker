interface BadgeProps {
  variant?: "primary" | "success" | "warning" | "danger";
  children: React.ReactNode;
}

export function Badge({ variant = "primary", children }: BadgeProps) {
  const variantStyle = {
    primary: "bg-fg text-bg",
    success: "bg-success text-white",
    warning: "bg-warning text-black",
    danger: "bg-danger text-white",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-bold border-2 border-fg rounded-none ${variantStyle[variant]}`}
    >
      {children}
    </span>
  );
}
