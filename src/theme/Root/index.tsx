import React, {JSX} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {customTheme} from "./custom-themes";

function Root({children}): JSX.Element {
	return (
		<ThemeProvider theme={customTheme()}>
			{children}
		</ThemeProvider>
	);
}

export default Root