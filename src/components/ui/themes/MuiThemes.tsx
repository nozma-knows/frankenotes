import { createTheme, experimental_sx as sx } from "@mui/material/styles";

const muiTheme = createTheme({
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
    MuiDialog: {
      styleOverrides: {
        root: {
          position: "absolute",
          right: 0,
          top: 50,
          borderRadius: 15,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          width: "100%",
          borderRadius: "10px",
          fieldset: {
            borderWidth: 2,
            borderColor: "#a56baf",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: 4,
            borderColor: "#a56baf",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 6,
            borderColor: "#a56baf",
          },
          "&:focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 4,
            borderColor: "#a56baf",
          },
        },
      },
    },
    MuiTextField: {},
  },
});

export default muiTheme;
