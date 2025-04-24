import React, { JSX } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './custom-themes';
import Head from '@docusaurus/Head';

function Root({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <ThemeProvider theme={customTheme()}>
      {/* Add the JSON-LD Structured Data in the <head> */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				"url": "https://telepresence.io",
				"name": "Telepresence.io",
				"description": "Telepresence is a platform that allows developers to run their local code in a remote Kubernetes cluster for easier testing and debugging.",
				"publisher": {
				  "@type": "Organization",
				  "name": "Telepresence"
				},
				"mainEntityOfPage": {
				  "@type": "WebPage",
				  "@id": "https://telepresence.io"
				},
			  }
			  )
          }}
        />
      </Head>
      {children}
    </ThemeProvider>
  );
}

export default Root;
