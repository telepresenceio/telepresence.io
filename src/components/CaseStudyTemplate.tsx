import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import Grid from "@mui/material/Grid2";
import {indigo, purple} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export type CaseStudy = {
	logo: any,
	logoName: string,
	link: string,
	isExternal?: boolean,
}

type CaseStudyTemplateProps = {
	caseStudy?: CaseStudy;
	children: React.ReactNode
}

const CaseStudyTemplate: React.FC<CaseStudyTemplateProps> = ({caseStudy, children}) => {
	if(caseStudy === undefined) {
		return null;
	}
	return (
		<>
			<Grid container bgcolor={indigo[50]} textAlign={'center'}>
				<Grid size={6} offset={3} paddingBottom="2em">
					<Typography variant="h4" paddingY="2em">
						Case Study
					</Typography>
					<Box height="150px">
						<img src={caseStudy.logo} alt={caseStudy.logoName} height="100%"/>
					</Box>
				</Grid>
			</Grid>
			<Grid container  sx={{flexGrow: 1}} spacing={2} direction="row" alignItems="start">
				<Grid size={8} offset={2} paddingY="3em" sx={{
					fontFamily: "Inter, sans-serif",
					h2: {
						fontWeight: "800",
						fontSize: "1.1rem",
						lineHeight: "1.5rem",
					},
					".purpleText": {
						color: purple[600],
					},
					".mediaItem": {
						position: "relative",
						paddingBottom: "56.25%",
						paddingTop: "25px",
						height: 0,
						width: "100%",
						border: "6px solid #fff",
						background: "#fff",
						borderRadius: "2px",
						marginBottom: "36px",

						iframe: {
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							width: "100%",
							height: "100%",
						}
					}
				}}>
					<Breadcrumbs
						preview={{link: '/case-studies/', label: 'Case Studies'}}
						current={caseStudy.logoName}
					/>
					{children}
				</Grid>
			</Grid>
			<Grid container direction='row' alignItems='center' paddingY="2em" spacing={3} sx={{
				color: 'white',
				paddingBottom: '2em',
				background: `linear-gradient(90deg, ${indigo[900]} 10%, ${indigo[500]} 100%)`
			}}>
				<Grid size={12} textAlign="center">
					<Typography variant="h4">Questions?</Typography>
				</Grid>
				<Grid size={12} textAlign="center">
					<Typography variant="body1">Let us help you get started</Typography>
				</Grid>
				<Grid size={12} textAlign="center">
					<Button variant="contained" href="/docs/latest/quick-start/">get started</Button>
				</Grid>
			</Grid>
		</>
	)
		;
};

export default CaseStudyTemplate;
