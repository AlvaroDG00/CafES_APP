import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export function UiInput({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        // El icono también cambia de color según el modo (gris en claro, crema en oscuro)
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#F5EBDC]/70 pointer-events-none transition-colors">
          {icon}
        </div>
      )}
      <input
        // Usamos 'input-cafe' para pillar los estilos del CSS
        className={cn(
          "input-cafe", 
          icon ? "pl-12 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  );
}