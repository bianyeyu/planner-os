import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { 
  ThemeProvider as MuiThemeProvider, 
  createTheme, 
  PaletteMode,
  PaletteOptions 
} from '@mui/material';

type ThemeMode = 'light' | 'dark' | 'system' | 'custom';

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'system';
  });
  const [primaryColor, setPrimaryColor] = useState<string>(() => {
    return localStorage.getItem('themePrimaryColor') || '#6750A4';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('themePrimaryColor', primaryColor);
  }, [primaryColor]);

  const getActualMode = (): PaletteMode => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode === 'custom' ? 'light' : mode;
  };

  const getDesignTokens = (mode: PaletteMode): PaletteOptions => ({
    mode,
    primary: {
      main: primaryColor,
    },
    ...(mode === 'light'
      ? {
          secondary: {
            main: '#625B71',
          },
          background: {
            default: '#FFFFFF',
            paper: '#F7F2FA',
          },
          text: {
            primary: '#1C1B1F',
          },
        }
      : {
          secondary: {
            main: '#CCC2DC',
          },
          background: {
            default: '#1C1B1F',
            paper: '#2B2930',
          },
          text: {
            primary: '#E6E1E5',
          }
        }),
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: getDesignTokens(getActualMode()),
        typography: {
          fontFamily: 'Roboto, sans-serif',
        },
      }),
    [mode, primaryColor]
  );

  const contextValue = useMemo(() => ({
    mode,
    setMode,
    primaryColor,
    setPrimaryColor,
  }), [mode, primaryColor]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};