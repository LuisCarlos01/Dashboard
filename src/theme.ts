import {
  createTheme,
  responsiveFontSizes,
  PaletteMode,
} from "@mui/material/styles";

// Cores compartilhadas entre os temas
const primaryLight = "#3a7bd5";
const primaryDark = "#2959a0";
const secondaryLight = "#6c63ff";
const secondaryDark = "#4e41db";

// Tema claro
export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: primaryLight,
        light: "#6ca2eb",
        dark: primaryDark,
        contrastText: "#fff",
      },
      secondary: {
        main: secondaryLight,
        light: "#9a8fff",
        dark: secondaryDark,
        contrastText: "#fff",
      },
      success: {
        main: "#00d4b1",
        light: "#5dffd4",
        dark: "#00a382",
      },
      error: {
        main: "#ff5252",
        light: "#ff8a80",
        dark: "#c62828",
      },
      warning: {
        main: "#ffc658",
        light: "#ffde59",
        dark: "#e2a336",
      },
      info: {
        main: "#64b5f6",
        light: "#9be7ff",
        dark: "#2286c3",
      },
      text: {
        primary: "#333333",
        secondary: "#666666",
      },
      background: {
        default: "#f8f9fc",
        paper: "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.25rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
          },
          html: {
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            scrollBehavior: "smooth",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(58, 123, 213, 0.2)",
            },
          },
          contained: {
            "&:hover": {
              boxShadow: "0 6px 20px rgba(58, 123, 213, 0.3)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 3px 10px 0 rgba(58, 123, 213, 0.1)",
            borderRadius: 16,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 25px 0 rgba(58, 123, 213, 0.15)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
          elevation1: {
            boxShadow: "0 3px 10px 0 rgba(58, 123, 213, 0.1)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 15px 0 rgba(58, 123, 213, 0.1)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: "none",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            marginBottom: 4,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            "&.Mui-selected": {
              backgroundColor: "#6c63ff",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#5a52e0",
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(58, 123, 213, 0.08)",
              transform: "translateY(-2px)",
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(58, 123, 213, 0.05)",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(58, 123, 213, 0.05)",
            },
          },
        },
      },
    },
  })
);

// Tema escuro
export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#5a93e8",
        light: "#89b8ff",
        dark: "#3a7bd5",
        contrastText: "#fff",
      },
      secondary: {
        main: "#8c85ff",
        light: "#b1acff",
        dark: "#6c63ff",
        contrastText: "#fff",
      },
      success: {
        main: "#2de0c3",
        light: "#71ffe0",
        dark: "#00b398",
      },
      error: {
        main: "#ff7575",
        light: "#ffa9a9",
        dark: "#e23636",
      },
      warning: {
        main: "#ffd277",
        light: "#ffe7a9",
        dark: "#e2a336",
      },
      info: {
        main: "#82beff",
        light: "#b1d8ff",
        dark: "#408cdc",
      },
      text: {
        primary: "#f7f7f7",
        secondary: "#bbbbbb",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.25rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#2d2d2d",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#6b6b6b",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#7f7f7f",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            },
          },
          contained: {
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.6)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 3px 10px 0 rgba(0, 0, 0, 0.3)",
            borderRadius: 16,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 25px 0 rgba(0, 0, 0, 0.4)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 15px 0 rgba(0, 0, 0, 0.3)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: "none",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            marginBottom: 4,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              backgroundColor: "rgba(90, 147, 232, 0.25)",
              "&:hover": {
                backgroundColor: "rgba(90, 147, 232, 0.3)",
              },
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
          elevation1: {
            boxShadow: "0 3px 10px 0 rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
  })
);

// Exporta um tema padrão para compatibilidade com código existente
const theme = lightTheme;
export default theme;
