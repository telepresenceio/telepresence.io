import React, {JSX} from 'react';
import {ThemeProvider} from "@mui/material/styles";
import {customTheme} from "./custom-themes";
import Head from "@docusaurus/Head";

function Root({children}): JSX.Element {
  return (
    <>
      <Head>
        <script defer src="https://cse.google.com/cse.js?cx=c1eaf17d1db4e4ac8"/>
      </Head>
      <ThemeProvider theme={customTheme()}>
        {children}
      </ThemeProvider>
    </>
  );
}
export default Root