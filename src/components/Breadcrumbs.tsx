import React from 'react';
import Polygon from '../assets/images/polygon.svg';
import Box from "@mui/material/Box";
import {grey, blue} from "@mui/material/colors";

type Preview = {
	link: string;
	label: string;
}

type BreadcrumbsProps = {
	preview: Preview;
	current: React.ReactNode;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({preview, current}) => {
	if (!preview || !current) {
		return null;
	}

	return (
		<Box component="div" sx={{
			borderBottom: `1px solid ${grey[600]}`,
			lineHeight: "1.6rem",
			fontWeight: 800,
			fontSize: "1.2rem",
			paddingBottom: "1.7rem",
			marginBottom: "1.7rem",
			a: {
				color: grey[700],
				textDecoration: 'none',
				"&:hover": {
					color: blue[500],
					textDecoration: 'underline',
				}
			},
			svg: {
				margin: "0 0.75rem"
			}
		}}>
					<span>
						<a href={preview.link}>{preview.label}</a>
					</span>
			<Polygon/>
			{current}
		</Box>
	);
};

export default Breadcrumbs;
