/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FC } from 'react';
import React from 'react';
import clsx from 'clsx';
import {
	useThemeConfig,
	NavbarSecondaryMenuFiller,
	type NavbarSecondaryMenuComponent,
	useWindowSize,
	ThemeClassNames,
} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import DocSidebarItems from '@theme/DocSidebarItems';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import type { Props } from '@theme/DocSidebar';

import styles from './styles.module.css';

const DocsVersionWrapper = (props: {docsPluginId: string}) => {
	const { docsPluginId } = props;
	return (
		<div className={styles.sidebarVersionSwitch}>
			Version:
			<DocsVersionDropdownNavbarItem
				docsPluginId={docsPluginId}
				dropdownItemsBefore={[]}
				dropdownItemsAfter={[]}
				items={[]}
			/>
		</div>
	);
};

const DocsVersionWrapperMemo = React.memo(DocsVersionWrapper);

interface DocSidebarMobileSecondaryMenuProps extends Props {
	docsPluginId: string,
	toggleSidebar: () => void
}

// eslint-disable-next-line react/function-component-definition
const DocSidebarMobileSecondaryMenu: NavbarSecondaryMenuComponent<DocSidebarMobileSecondaryMenuProps> = ({
	sidebar,
	path,
	docsPluginId,
}) => {
	const mobileSidebar = useNavbarMobileSidebar();
	return (
		<>
			<DocsVersionWrapperMemo docsPluginId={docsPluginId} />
		<ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
			<DocSidebarItems
				items={sidebar}
				activePath={path}
				onItemClick={(item) => {
					// Mobile sidebar should only be closed if the category has a link
					if (item.type === 'category' && item.href) {
						mobileSidebar.toggle();
					}
					if (item.type === 'link') {
						mobileSidebar.toggle();
					}
				}}
				level={1}
			/>
		</ul>
		</>
	);
};

function DocSidebarMobile(props: Props) {
	return (
		<NavbarSecondaryMenuFiller
			component={DocSidebarMobileSecondaryMenu}
			props={props}
		/>
	);
}

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden, docsPluginId}: Props & {docsPluginId: string}) {
	const {
		navbar: {hideOnScroll},
		docs: {
			sidebar: {hideable},
		},
	} = useThemeConfig();

	return (
		<div
			className={clsx(
				styles.sidebar,
				hideOnScroll && styles.sidebarWithHideableNavbar,
				isHidden && styles.sidebarHidden,
			)}>
			{hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
			<DocsVersionWrapperMemo docsPluginId={docsPluginId} />
			<Content path={path} sidebar={sidebar} />
			{hideable && <CollapseButton onClick={onCollapse} />}
		</div>
	);
}

const DocSidebarMobileMemo = React.memo(DocSidebarMobile);
const DocSidebarDesktopMemo = React.memo(DocSidebarDesktop);

const DocSidebar: FC<Props & {docsPluginId: string}> = (props) => {
	const windowSize = useWindowSize();

	// Desktop sidebar visible on hydration: need SSR rendering
	const shouldRenderSidebarDesktop = windowSize === 'desktop' || windowSize === 'ssr';

	// Mobile sidebar not visible on hydration: can avoid SSR rendering
	const shouldRenderSidebarMobile = windowSize === 'mobile';

	return (
		<>
			{shouldRenderSidebarDesktop && <DocSidebarDesktopMemo {...props} />}
			{shouldRenderSidebarMobile && <DocSidebarMobileMemo {...props} />}
		</>
	);
};

export default DocSidebar;