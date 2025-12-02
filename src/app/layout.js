// app/layout.js
"use client";

import "./globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function RootLayout({ children }) {
  const theme = createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#fafbfc",
        paper: "#ffffff",
      },
      primary: {
        main: "#667eea",
        light: "#8b9fef",
        dark: "#4f5fc9",
      },
      secondary: {
        main: "#764ba2",
        light: "#9168b8",
        dark: "#5c3b7f",
      },
      success: { main: "#38ef7d" },
      warning: { main: "#f5576c" },
      text: {
        primary: "#1a202c",
        secondary: "#718096",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      "none",
      "0px 2px 4px rgba(0,0,0,0.05)",
      "0px 4px 8px rgba(0,0,0,0.08)",
      "0px 8px 16px rgba(0,0,0,0.1)",
      "0px 12px 24px rgba(0,0,0,0.12)",
      "0px 16px 32px rgba(0,0,0,0.14)",
      "0px 20px 40px rgba(0,0,0,0.16)",
      "0px 24px 48px rgba(0,0,0,0.18)",
      "0px 32px 64px rgba(0,0,0,0.2)",
      ...Array(16).fill("0px 32px 64px rgba(0,0,0,0.2)"),
    ],
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: "0px 8px 24px rgba(102, 126, 234, 0.4)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 10,
            fontWeight: 600,
            padding: "10px 24px",
          },
          contained: {
            boxShadow: "0px 4px 12px rgba(102, 126, 234, 0.3)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
          },
        },
      },
    },
  });

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
