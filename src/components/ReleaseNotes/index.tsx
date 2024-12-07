import React, {DetailedHTMLProps, ImgHTMLAttributes} from "react";
import BugfixIcon from '@site/src/assets/icons/bugfix.inline.svg';
import ChangeIcon from '@site/src/assets/icons/change.inline.svg';
import FeatureIcon from '@site/src/assets/icons/feature.inline.svg';
import SecurityIcon from '@site/src/assets/icons/security.inline.svg';
import styles from "./styles.module.scss";

const titlePrefix = {
	bugfix: 'Bug Fix',
	change: 'Change',
	feature: 'Feature',
	security: 'Security Update',
};

const typeIcon = {
	bugfix: <BugfixIcon className={styles.note__typeIcon}/>,
	change: <ChangeIcon className={styles.note__typeIcon}/>,
	feature: <FeatureIcon className={styles.note__typeIcon}/>,
	security: <SecurityIcon className={styles.note__typeIcon}/>,
};

type TitleProps = {
	children: React.ReactNode | React.ReactNode[];
	type: string,
	docs?: string,
	href?: string,
}

export const Title: React.FC<TitleProps> = ({children, type, docs, href}) => {
	const typeKey = type as keyof typeof titlePrefix;

	if(docs || href) {
		return (
		<a className={styles.note__title_link} href={docs ? docs: href}>
			{typeIcon[typeKey]}
			<span>{children}</span>
		</a>)
	}
	return (
		<h3 className={styles.note__title_no_link}>
			{typeIcon[typeKey]}
			<span>{children}</span>
		</h3>
	);
};

type BodyProps = {
	children: React.ReactNode | React.ReactNode[];
}

export const Body: React.FC<BodyProps> = ({children}) => (
	<div className={styles.note__body}>
		{children}
	</div>
);

type ImageProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

export const Image: React.FC<ImageProps> = (props) => (
	<div className={styles.note__image}>
		<img {...props}/>
	</div>
);

type NoteProps = {
	children: React.ReactNode | React.ReactNode[];
}

export const Note: React.FC<NoteProps> = ({children}) => (
	<div className={styles.note}>
		{children}
	</div>
);

type ReleaseProps = {
	version: string
	date: string,
	children: React.ReactNode | React.ReactNode[],
}

export const Release: React.FC<ReleaseProps> = ({children, version, date}) => {
	return date ? (
		<div className={styles.release}>
			<h2>Version {version} <span className={styles.release__date}>{date}</span></h2>
			{children}
		</div>
	) : (
		<div className={styles.release}>
			<h2>Version {version}</h2>
			{children}
		</div>
	)
};
