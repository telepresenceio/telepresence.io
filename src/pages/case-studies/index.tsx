import React from 'react';
import LogoBitnami from '@site/src/assets/images/case-study/bitnami.png';
import LogoEngelVolkers from '@site/src/assets/images/case-study/engel-and-voelkers.png';
import LogoIrisTV from '@site/src/assets/images/case-study/iris-tv.png';
import LogoIronclad from '@site/src/assets/images/case-study/ironclad_logo.png';
import LogoSightMachine from '@site/src/assets/images/case-study/sightmachine.png';
import LogoVerloop from '@site/src/assets/images/case-study/Verloop-Logo-Horizontal-HD.png';
import {indigo} from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {Card, CardActionArea, CardContent} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {CaseStudy} from "../../components/CaseStudyTemplate";
import Layout from "../../components/Layout";
import styled from "@mui/material/styles/styled";

const CASE_STUDIES: CaseStudy[] = [
	{
		logo: LogoBitnami,
		logoName: 'Bitnami',
		link: '/case-studies/bitnami',
	},
	{
		logo: LogoEngelVolkers,
		logoName: 'Engel & Völkers',
		link: '/case-studies/engel-volkers',
	},
	{
		logo: LogoIrisTV,
		logoName: 'IRIS.TV',
		link: '/case-studies/iris-tv',
	},
	{
		logo: LogoIronclad,
		logoName: 'Ironclad',
		link: 'https://articles.microservices.com/towards-a-better-service-development-story-c2fb9bdda6aa',
		isExternal: true,
	},
	{
		logo: LogoSightMachine,
		logoName: 'Sight Machine',
		link: '/case-studies/sight-machine',
	},
	{
		logo: LogoVerloop,
		logoName: 'Verloop',
		link: '/case-studies/verloop',
	},
];

export function caseStudy(logoName: string) {
	return CASE_STUDIES.find((caseStudy) => {
		return caseStudy.logoName == logoName;
	})
}

const CaseCardIcon = ({img}: { img: CaseStudy }) => (
	<Box height="100px" width="250px" paddingY="20px">
		<Box display="inline-block">
			<img src={img.logo.toString()} alt={img.logoName} width="204px" height="auto"/>
		</Box>
	</Box>
)

const MarketingGrid = styled(Grid)(({theme}) => ({
	backgroundColor: theme.palette.marketing.light,
	textAlign: 'center',
}))

const CaseStudiesPage: React.FC = () => {
	return (
		<Layout title="Case Studies">
			<MarketingGrid container>
				<Grid size={12}>
					<Typography fontWeight={"bold"} variant='h2' component="h1" padding={'1em'}>
						Case Studies
					</Typography>
				</Grid>
			</MarketingGrid>
			<Grid container spacing={3} size={6} offset={3} paddingY="2em">
				{CASE_STUDIES.map((card, index) => (
					<Grid key={index} size={{sm: 12, md:6}} >
						<Card variant='elevation' elevation={6} sx={{height: "100%", maxWidth: "280px", backgroundColor: "white"}}>
							<CardActionArea href={card.link} target={card.isExternal ? '_blank' : '_self'}>
								<CardContent>
									<CaseCardIcon img={card}/>
									<Button variant="text">View Case Study &#x2192;</Button>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				))}
			</Grid>
			<Grid container sx={{flexGrow: 1}}/>
			<Grid container direction='row' alignItems='center' textAlign="center" sx={{
				color: 'white',
				paddingBottom: '2em',
				background: `linear-gradient(90deg, ${indigo[900]} 10%, ${indigo[500]} 100%)`
			}}>
				<Grid size={10} offset={1}>
					<Typography fontWeight={"bold"} variant='h4' component="h4" padding={'0.5em 0'}>
						Have a Telepresence story to share?
					</Typography>
					<Typography fontWeight={"bold"} variant='body1' component="p" padding="1em 0 2em">
						Tell us your story
					</Typography>
					<Button variant="contained" href="https://www.getambassador.io/contact-us/">contact us</Button>
				</Grid>
			</Grid>
		</Layout>
	);
}

/*
export const Head: React.FC<HeadProps> = ({location}) => {
	return (
		<GlobalHead location={location} title="Case Studies" canonical="https://www.telepresence.io/case-studies/"/>
	)
};
 */
export default CaseStudiesPage;