import {darken, createTheme} from "@mui/material";
import {indigo, blueGrey, blue, grey, common} from "@mui/material/colors";
import {PaletteColor, PaletteColorOptions} from "@mui/material";
declare module "@mui/material/styles" {
	export interface PaletteOptions {
		osTabs: PaletteColorOptions;
		marketing: PaletteColorOptions;
	}
	export interface Palette {
		osTabs: PaletteColor;
		marketing: PaletteColor;
	}
}

createTheme({
	colorSchemes: {
		light: true,
		dark: true,
	}
})

export const customTheme = () => {
	return createTheme({
		colorSchemes: {
			light: {
				palette: {
					marketing: {
						light: indigo[50],
						main: darken(indigo[50], 0.02),
						dark: indigo[100],
					},
					osTabs: {
						main: common.white,
						contrastText: common.black,
					},
				},
			},
			dark: {
				palette: {
					marketing: {
						light: blueGrey[900],
						main: blueGrey[700],
						dark: indigo[900],
					},
					osTabs: {
						main: "#1b1b1d",
						contrastText: common.white,
					},
					primary: {
						main: blue[300],
						contrastText: grey[100],
					},
					background: {
						paper: blueGrey[800],
					},
				},
			},
		},
	});
}
