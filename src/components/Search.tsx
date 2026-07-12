import * as React from "react";
import { styled } from "@mui/material/styles";

const GoogleSearch = styled('div')(() => ({
	width: '14rem',
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
	},
	'.gsc-control-cse': {
		padding: 0,
		margin: 0,
		backgroundColor: "var(--ifm-navbar-background-color)",
		borderColor: "var(--ifm-navbar-background-color)",
	},
	'form.gsc-search-box': {
		margin: 0,
	},
	'table.gsc-search-box': {
		margin: 0,
		width: '100%',
		'td.gsc-input': {
			paddingRight: '4px',
		},
	},
	'.gsc-input-box': {
		backgroundColor: "var(--ifm-navbar-search-input-background-color)",
		border: 'none',
		borderRadius: '2rem',
		padding: '0 0.5rem',
		overflow: 'hidden',
		// Google inserts an invisible 48px-tall ::before block that inflates
		// the height of the whole box.
		'.gsib_a::before': {
			display: 'none !important',
		},
		'table.gsc-input': {
			backgroundColor: 'transparent',
		},
		'.gsib_a': {
			padding: '4px 4px 4px 10px',
			backgroundColor: 'transparent',
			// The stock widget draws its own fixed-gray magnifier as the
			// cell background; the themed search button replaces it.
			backgroundImage: 'none',
			input: {
				display: 'block',
				backgroundColor: 'transparent !important',
				color: "var(--ifm-navbar-search-input-color)",
				fontSize: '0.9rem',
				'&::placeholder': {
					color: "var(--ifm-navbar-search-input-placeholder-color)",
				},
			},
		},
		// The clear-button cell must not contribute to the row height; the
		// stock stylesheet gives it a hard 48x48px size.
		'.gsib_b': {
			backgroundColor: 'transparent',
			height: 'auto',
			width: 'auto',
			lineHeight: 0,
			padding: 0,
			'.gscb_a': {
				lineHeight: '24px',
			},
		},
	},
	'td.gsc-search-button': {
		display: 'table-cell !important',
		width: '1%',
	},
	'button.gsc-search-button-v2': {
		// The stock widget hides its search button and renders a fixed
		// gray magnifier inside the input instead; that one is suppressed
		// above, so the real button must be forced back.
		display: 'inline-block !important',
		padding: '7px',
		margin: 0,
		borderRadius: '50%',
		border: 'none',
		backgroundColor: 'transparent',
		cursor: 'pointer',
		svg: {
			display: 'block',
			width: '14px',
			height: '14px',
			fill: "var(--ifm-navbar-color)",
		},
		'&:hover, &:focus': {
			backgroundColor: "var(--ifm-color-emphasis-200)",
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
