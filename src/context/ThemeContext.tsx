import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const colorFondo = isDark ? "#1A120B" : "#F3EFE0";

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", JSON.stringify(isDark));

    // En vez de actualizarlo, lo borramos y metemos uno nuevo para forzar al navegador a leerlo.
    const oldMeta = document.querySelector('meta[name="theme-color"]');
    if (oldMeta) {
      oldMeta.remove();
    }
    const newMeta = document.createElement("meta");
    newMeta.name = "theme-color";
    newMeta.content = colorFondo;
    document.head.appendChild(newMeta);

    document.body.style.backgroundColor = colorFondo;
    document.body.style.transition = "background-color 0.3s ease";
    root.style.backgroundColor = colorFondo;
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  return context;
};
