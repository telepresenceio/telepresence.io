import styled from "@mui/material/styles/styled";
import BrowserOnly from "@docusaurus/BrowserOnly";
import * as React from "react";

const GoogleSearch = styled('div')(() => ({
	table: {
		padding: 0,
		margin: 0,
		border: 0,
	},
	tr: {
		color: "var(--ifm-navbar-color)",
		border: 0,
	},
	td: {
		padding: 0,
		margin: 0,
		border: 0,
		lineHeight: 1.2,
	},
	'.gsc-control-cse': {
		padding: 0,
		margin: 0,
	},
	'.gsc': {
		backgroundColor: "var(--ifm-navbar-background-color)",
		borderColor: "var(--ifm-navbar-background-color)",
		'&-control': {
			'&-cse': {
				backgroundColor: "var(--ifm-navbar-background-color)",
				borderColor: "var(--ifm-navbar-background-color)",
				overflow: 'hidden',
			}
		},
		'&-input': {
			backgroundColor: "var(--ifm-navbar-background-color)",
			'.gsib_a': {
				padding: '5px 1px 5px 8px',
			},
			'&-box': {
				borderRadius: '8px',
				overflow: 'hidden',
			}
		},
		'&-search-button': {
			margin: '0 0',
			'&-v2': {
				padding: '7px 7px',
				borderRadius: '50%',
			},
		},
	}
}));

// SearchBar must be combined with a script tag in head that points to the
// Google search engine declaration. Our is added in ./Root/index.tsx
//
// See https://programmablesearchengine.google.com/ for more info.
export default function SearchBar() {
	return <BrowserOnly>
		{() => (
			<GoogleSearch>
				<div className="gcse-search"></div>
			</GoogleSearch>
		)}
	</BrowserOnly>
}
