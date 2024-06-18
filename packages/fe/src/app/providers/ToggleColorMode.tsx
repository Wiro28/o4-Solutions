import React, { ReactNode, useState, useMemo, useCallback } from "react";
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from "@frontend/app/layout/theme";

interface Props {
  children: ReactNode;
}

// Erstellen des ThemeContexts
export const ThemeContext = React.createContext({
  mode: 'light',
  toggleColorMode: () => { },
  themeConfig: null,
  applyTheme: (config: any) => { },
});

// Hauptkomponente
const ToggleColorMode = ({ children }: Props) => {
  // Zustandsvariablen
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [themeConfig, setThemeConfig] = useState<any>(null);

  // Kontextwert
  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const applyTheme = useCallback((config: any) => {
    setThemeConfig(config);
  }, []);

  const themeContextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
      themeConfig,
      applyTheme,
    }),
    [mode, toggleColorMode, themeConfig, applyTheme]
  );

  // Erstellen des Themes
  const theme = useMemo(() => {
    // Default palette settings for dark mode
    const defaultDarkPalette = {
      background: {
        default: "#121212",
        paper: "#1d1d1d",
      },
      text: {
        primary: "#ffffff",
      },
    };

    // Merge custom themeConfig with the mode-specific settings
    const mergedTheme = createTheme({
      ...themeConfig,
      palette: {
        ...themeConfig?.palette,
        mode,
        ...(mode === 'dark' ? defaultDarkPalette : {}),
      },
    });

    return mergedTheme;
  }, [mode, themeConfig]);

  // Rendern der Komponente
  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ToggleColorMode;
