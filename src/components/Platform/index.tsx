import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import React, {ReactElement} from 'react';

import * as allTabTypes from './tabs';
import {AbstractTab, UnknownTab} from './tabs';
import styled from "@mui/material/styles/styled";

const allTabs = Object.values(allTabTypes)

function publicTabs(): typeof allTabs {
	let result: typeof allTabs = []
	for (const tab of allTabs) {
		if (tab == AbstractTab || tab == UnknownTab) {
			continue
		}
		result.push(tab);
	}
	// Ordering here isn't too important, but for sanity it should
	// probably be stable.
	return result.sort((a, b) => {
		return a.order - b.order;
	});
}

function detectUserOS(window: Window) {
	const tabs = publicTabs()
	for (const tab of tabs) {
		if (tab.detect(window)) {
			return tab.slug;
		}
	}
	return allTabTypes.UnknownTab.slug;
}

function isValidTab(element: any) {
	const isElement = React.isValidElement(element);
	if (isElement) {
		const ct = (element as ReactElement).type
		return ct.hasOwnProperty("slug");
	}
	return false;
}

type Props = { children: React.ReactNode }
type State = {
	curTab: string,
	setTab: ((tab: string) => void) | null,
	doAutoDetect: boolean,
}

const Context = React.createContext<State>({
	curTab: "",
	setTab: null,
	doAutoDetect: true,
});

function Provider({children}: Props) {
	const [state, setState] = React.useState<State>({
		curTab: "",
		setTab: null,
		doAutoDetect: true,
	});
	if (!state.setTab) {
		state.setTab = (newTab: string) => {
			window.history.replaceState(
				null,
				'',
				`?os=${newTab}${window.location.hash}`,
			);
			setState({
				curTab: newTab,
				setTab: null,
				doAutoDetect: false,
			});
		};
	}

	React.useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		let os = query.get('os');
		if (os === null) {
			os = detectUserOS(window);
		}
		if (publicTabs().map((cls) => cls.slug).includes(os)) {
			if (state.doAutoDetect || state.curTab !== os) {
				setState({
					curTab: os,
					setTab: null,
					doAutoDetect: false,
				});
			}
		} else {
			setState({
				curTab: '',
				setTab: null,
				doAutoDetect: false,
			});
		}
	}, [state, setState]);

	return <Context.Provider value={state}>{children}</Context.Provider>;
}

type TabGroupProps = {
	children?: React.ReactNode | React.ReactNode[]
};

const TabGroup: React.FC<TabGroupProps> = ({children}) => {
	// Do some preliminary input validation.
	const childArr = React.Children.toArray(children)
	const ca: Array<typeof AbstractTab> = []
	for (const child of childArr) {
		if (isValidTab(child)) {
			ca.push((child as ReactElement).type as typeof AbstractTab);
		}
	}
	if (ca.length < 1) {
		throw new Error('Platform.TabGroup: Must have at least 1 child tab');
	}
	const slugs = new Set(ca.map((child) => {
		return child.slug
	}));
	if (slugs.size < ca.length) {
		throw new Error(
			'Platform.TabGroup: Has multiple children of the same type',
		);
	}

	// OK, now actually do the work.
	const sortedChildren = [...childArr].sort((a, b) => {
		return ((a as ReactElement).type as typeof AbstractTab).order - ((b as ReactElement).type as typeof AbstractTab).order;
	});

	let {curTab, setTab} = React.useContext(Context);
	if (!slugs.has(curTab)) {
		const defaultChild = [...ca].sort(
			(a, b) => b.priority - a.priority,
		)[0];
		curTab = defaultChild.slug;
	}

	const handleChange = (_ev: Object, newTab: string) => {
		if (setTab) {
			setTab(newTab);
		}
	};

	const Styled = styled("div")(({theme}) => ({
		".TabBar": {
			backgroundColor: theme.palette.osTabs.main,
			color: "black",
			borderBottom: "1px solid",
			borderBottomColor: theme.palette.divider,

			".TabHead": {
				minWidth: "10%",
				textTransform: "none",
				svg: {
					height: "24px",
					width: "24px",
					fill: theme.palette.osTabs.contrastText
				}
			}
		}
	}))

	return (
		<Styled>
			<TabContext value={curTab}>
				<AppBar elevation={0} position="static" className="TabBar">
					<TabList onChange={handleChange} aria-label="operating system tabs">
						{sortedChildren.map((child) => {
							const re = child as ReactElement
							const ct = (re.type as typeof AbstractTab)
							const Icon = ct.icon;
							return (
								<Tab
									key={ct.slug}
									value={ct.slug}
									icon={<Icon/>}
									label={ct.label}
									className="TabHead"
								/>
							);
						})}
					</TabList>
				</AppBar>
				{sortedChildren.map((child) => {
					const re = child as ReactElement
					const ct = (re.type as typeof AbstractTab)
					return (
						<TabPanel
							key={ct.slug}
							value={ct.slug}
							className="TabBody"
						>
							{re.props.children}
						</TabPanel>
					);
				})}
			</TabContext>
		</Styled>
	);
}

const Platform = {
	Provider,
	TabGroup,
	...allTabTypes,
};

export default Platform;