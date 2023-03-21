import { createTheme, experimental_sx as sx } from "@mui/material/styles";

const queryNotesTheme = createTheme({
  palette: {
    primary: {
      main: "#d9f6f5",
    },
    secondary: {
      main: "#00FF00", // SET TO SECOND COLOR
    },
    error: {
      main: "#FF0000", // SET TO ERROR COLOR
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#e3d1e6",
        },
        input: {
          "&::placeholder": {
            opacity: 0.4,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          width: "100%",
          fieldset: {
            borderWidth: 0,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: 0,
            borderColor: "#a56baf",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 0,
          },
          "&:focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 0,
          },
        },
      },
    },
    MuiTextField: {},
  },
});

export default queryNotesTheme;
