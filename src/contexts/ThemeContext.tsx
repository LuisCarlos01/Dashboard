import React, { createContext, useState, useContext, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  PaletteMode,
} from "@mui/material";
import { lightTheme, darkTheme } from "../theme";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Recupera o tema da localStorage ou usa 'light' como padrão
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as PaletteMode) || "light";
  });

  const theme = mode === "light" ? lightTheme : darkTheme;

  // Atualiza o localStorage quando o tema muda
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    // Atualiza a classe no body para estilos CSS globais
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${mode}-mode`);
  }, [mode]);

  // Função para alternar entre temas
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const themeContextValue = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
