import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--mg)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
