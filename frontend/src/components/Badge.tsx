import { ReactNode } from "react";
import { statusClass } from "../utils/format";

interface BadgeProps {
  children: ReactNode;
  variant?: string;
}

export default function Badge({ children, variant }: BadgeProps) {
  const className = variant || (typeof children === 'string' ? statusClass(children) : 'muted');
  return <span className={`badge ${className}`}>{children}</span>;
}
