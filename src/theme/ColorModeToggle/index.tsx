import React, {useEffect} from 'react';
import ColorModeToggle from '@theme-original/ColorModeToggle';
import type ColorModeToggleType from '@theme/ColorModeToggle';
import type {WrapperProps} from '@docusaurus/types';
import {useColorScheme} from '@mui/material';

type Props = WrapperProps<typeof ColorModeToggleType>;

export default function ColorModeToggleWrapper(props: Props): React.JSX.Element {
	// Get the MUI hook
	const {setMode} = useColorScheme();

	// Extract the docusaurus theme from the component properties
	const {value} = props;

	// Whenever the theme changes in docusaurus, trigger the change in MUI.
	// The value is the user's explicit choice and is null until one is made;
	// MUI must then follow the browser preference rather than fall back to
	// its default (light) mode.
	useEffect(() => {
		setMode(value ?? 'system');
	}, [value, setMode]);

	return (
			<ColorModeToggle {...props} />
	);
}
