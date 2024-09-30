import React from 'react';
import HeroIcon from '../assets/images/hero-image.svg';
import AmbassadorLogo from '../assets/images/ambassador-logo.svg';
import SlackLogo from '../assets/images/slack-logo.svg';
import GithubLogo from '../assets/images/github-logo.svg';
import Typography from "@mui/material/Typography";
import {indigo} from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {Card, CardActionArea, CardContent, Theme} from "@mui/material";
import Layout from "../components/Layout";

const SOCIAL_CARDS = [
	{
		logo: (<SlackLogo height={48} width={48}/>),
		title: 'Slack',
		link: 'https://slack.cncf.io/',
		description:
			'Join our Slack to get answers to your questions and learn how others are using Telepresence.',
	},
	{
		logo: (<GithubLogo height={48} width={48}/>),
		title: 'Github',
		link: 'https://github.com/telepresenceio/telepresence/issues/new/choose',
		description:
			'Help with documentation, request a new feature, or submit a bug fix. No contribution is too small!',
	},
];

const CommunityPage: React.FC = () => {
	return (
		<Layout title="Community" description="Get involved and collaborate with our outstanding community of adopters and contributors on the Telepresence project">
			<Grid container bgcolor={(theme: Theme) => theme.palette.marketing.light} textAlign={'center'}>
				<Grid size={12}>
					<Typography fontWeight={"bold"} variant='h2' component="h1" paddingTop={'1em'}>
						Join the Community
					</Typography>
				</Grid>
				<Grid size={12} padding={'2rem'}>
					<Typography variant='h5' padding={'0 7em 2em'}>
						Developers worldwide are contributing to Telepresence. We’re
						building a vibrant community of contributors and related projects.
						We welcome any and all suggestions, new features, integrations, and
						documentation!
					</Typography>
				</Grid>
			</Grid>
			<Grid container direction='row' alignItems='center' sx={{
				color: 'white',
				paddingBottom: '2em',
				background: `linear-gradient(90deg, ${indigo[900]} 10%, ${indigo[500]} 100%)`
			}}>
				<Grid size={6.5} offset={2.75}>
					<Typography fontWeight={"bold"} variant='h4' component="h1" padding={'2em 0'} textAlign={'center'}>
						Ecosystem Projects Related to Telepresence
					</Typography>
				</Grid>
				<Grid size={{xs: 4, md: 4}} offset={{xs: 4, md: 0}}>
					<HeroIcon/>
				</Grid>
				<Grid size={{xs: 12, md: 8}} paddingX={'2em'}>
					<Box>
						<AmbassadorLogo width="150" height="22"/>
						<Typography variant='h6' paddingBottom='1em'>
							Ambassador supports Telepresence for fast, efficent development
							of Kubernetes services for development teams. In addition to the
							features of Telepresence for local development, Ambassador
							includes a cloud dashboard and automatically generates preview
							URLs for easily sharing development environments with teammates.
							Ambassador makes it easy for developers to collaborate on
							Kubernetes microservices without disturbing production.
						</Typography>
						<Button variant='contained' href="https://www.getambassador.io/products/telepresence/">
							Learn more
						</Button>
					</Box>
				</Grid>
			</Grid>
			<Grid container padding={'2em'} direction='row' alignItems='center' bgcolor={(theme: Theme) => theme.palette.marketing.light} textAlign={'center'}>
				<Grid size={12}>
					<Typography fontWeight={"bolder"} variant='h4' component="h1" padding={'1em 0 2em'}>
						Explore and Contribute to Our Networks
					</Typography>
				</Grid>
				<Grid container spacing={1} size={7} offset={2.5}>
					{SOCIAL_CARDS.map((card, index) => (
						<Grid key={index} size={12 / SOCIAL_CARDS.length} display="flex">
							<Card variant="elevation" sx={{flexGrow: 1, backgroundColor: (theme: Theme) => theme.palette.marketing.main}}>
								<CardActionArea href={card.link}>
									<CardContent>
										{card.logo}
										<Typography gutterBottom variant="h5" component="div">
											{card.title}
										</Typography>
										<Typography variant="body2" sx={{color: 'text.marketing'}}>
											{card.description}
										</Typography>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					))}
				</Grid>
			</Grid>
			<Grid sx={{flexGrow: 1}} bgcolor={(theme: Theme) => theme.palette.marketing.light}/>
		</Layout>
	);
}

/*
export const Head: React.FC<HeadProps> = ({location}) => {
	return (
		<GlobalHead location={location} title="Community" canonical="https://www.telepresence.io/community/">
			<meta name="description"
			      content="Get involved and collaborate with our outstanding community of adopters and contributors on the Telepresence project"/>
		</GlobalHead>
	)
}
 */
export default CommunityPage;