import * as React from "react";
import { styled } from "@mui/material/styles";

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
		lineHeight: 1,
	},
	'.gsc-control-cse': {
		padding: 0,
		margin: 0,
		backgroundColor: "var(--ifm-navbar-background-color)",
		borderColor: "var(--ifm-navbar-background-color)",
		overflow: 'hidden',
	},
	'form.gsc-search-box, table.gsc-search-box': {
		margin: 0,
	},
	'.gsc-input-box': {
		backgroundColor: "var(--ifm-navbar-search-input-background-color)",
		border: 'none',
		borderRadius: '2rem',
		height: '2rem',
		padding: '0 0.25rem',
		'.gsib_a': {
			padding: '0 0 0 12px',
			input: {
				color: "var(--ifm-navbar-search-input-color)",
				fontSize: '0.9rem',
				height: '1.9rem !important',
				'&::placeholder': {
					color: "var(--ifm-navbar-search-input-placeholder-color)",
				},
			},
		},
	},
	'.gsc-search-button': {
		margin: '0 0 0 4px',
		'&-v2': {
			padding: '8px',
			borderRadius: '50%',
			border: 'none',
			backgroundColor: 'transparent',
			cursor: 'pointer',
			svg: {
				width: '15px',
				height: '15px',
				fill: "var(--ifm-navbar-color)",
			},
			'&:hover, &:focus': {
				backgroundColor: "var(--ifm-color-emphasis-200)",
			},
		},
	},
}));

// Search must be combined with a script tag in head that points to the
// Google search engine declaration. Ours is added in ../theme/SearchBar.tsx
//
// See https://programmablesearchengine.google.com/ for more info.
function Search() {
	return (
		<GoogleSearch><div className="gcse-search"/></GoogleSearch>
	)
}
export default Search;
