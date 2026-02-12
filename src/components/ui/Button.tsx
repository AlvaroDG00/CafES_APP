import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function UiButton({ className, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      style={{
        backgroundColor: 'var(--btn-primary)', // Usa la variable (Marrón en claro, Crema en oscuro)
        color: 'var(--btn-text)',             // Usa la variable (Blanco en claro, Oscuro en oscuro)
        ...style
      }}
      className={cn(
        "w-full font-bold py-3.5 rounded-xl shadow-md hover:brightness-110 transition-all active:scale-95",
        className
      )} 
      {...props} 
    />
  );
}