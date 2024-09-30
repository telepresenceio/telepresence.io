import React, {FC, ReactNode, useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import styled from "@mui/material/styles/styled";

type Props = { children: ReactNode }
const TabsContainer: FC<Props> = ({children}) => {
	const [state, setState] = useState({curTab: "global"});
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const interceptType = query.get('intercept') || "regular";
		if (state.curTab != interceptType) {
			setState({curTab: interceptType});
		}
	}, [state, setState])
	const setURL = function (newTab: string) {
		history.replaceState(null, '', `?intercept=${newTab}${window.location.hash}`);
	};

	const Styled = styled("div")(({theme}) => {
		return {
			colorScheme: theme.palette.mode,
			flexGrow: 1,
			".TabBody": {
				padding: 0,
			},
			".interceptTab > *": {
				margin: "1rem 1rem",
			},
			"div:has(.mode-regular,.mode-global,.mode-personal)": {
				display: "flex",
				flexDirection: "column",
			},
			".mode-regular,.mode-global,.mode-personal": {
				display: "block",
				maxWidth: "700px",
				height: "40vw",
			},
		};
	});

	return (
		<Styled>
			<TabContext value={state.curTab}>
				<AppBar sx={{background: "transparent"}} elevation={1} position="static">
					<TabList onChange={(ev, newTab) => {
						setState({curTab: newTab});
						setURL(newTab)
					}} aria-label="intercept types">
						<Tab value="regular" label="No intercept"/>
						<Tab value="global" label="Intercept"/>
					</TabList>
				</AppBar>
				{children}
			</TabContext>
		</Styled>
	);
};

export default TabsContainer;