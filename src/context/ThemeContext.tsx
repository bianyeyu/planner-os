import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  ThemeProvider as MuiThemeProvider, 
  createTheme, 
  PaletteMode,
  PaletteOptions 
} from '@mui/material';

type ThemeContextType = {
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as 'light' | 'dark' | 'system') || 'system';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const getActualMode = (): PaletteMode => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  };

  const getDesignTokens = (mode: PaletteMode): PaletteOptions => ({
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#6750A4',
          },
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
          primary: {
            main: '#D0BCFF',
          },
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

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: getDesignTokens(getActualMode()),
        typography: {
          fontFamily: 'Roboto, sans-serif',
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
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