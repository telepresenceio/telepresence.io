import React from 'react';
import SlackLogo from '../assets/images/slack-logo.svg';
import GithubLogo from '../assets/images/github-logo.svg';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Grid";

import {Card, CardActionArea, CardContent, Theme} from "@mui/material";
import Layout from "../components/Layout";

const SOCIAL_CARDS = [
	{
		logo: (<ForumOutlinedIcon sx={{fontSize: 48}}/>),
		title: 'GitHub Discussions',
		link: 'https://github.com/telepresenceio/telepresence/discussions',
		description:
			'Ask questions, share ideas, and help shape the roadmap — right where the code lives.',
	},
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
            <Grid
                container
                sx={{
                    bgcolor: (theme: Theme) => theme.palette.marketing.light,
                    textAlign: 'center'
                }}>
				<Grid size={12}>
					<Typography
                        variant='h2'
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            paddingTop: '1em'
                        }}>
						Join the Community
					</Typography>
				</Grid>
				<Grid size={12} sx={{
                    padding: '2rem'
                }}>
					<Typography variant='h5' sx={{
                        padding: '0 7em 2em'
                    }}>
						Developers worldwide are contributing to Telepresence. We’re
						building a vibrant community of contributors and related projects.
						We welcome any and all suggestions, new features, integrations, and
						documentation!
					</Typography>
				</Grid>
			</Grid>
            <Grid
                container
                direction='row'
                sx={{
                    padding: '2em',
                    alignItems: 'center',
                    bgcolor: (theme: Theme) => theme.palette.marketing.light,
                    textAlign: 'center'
                }}>
				<Grid size={12}>
					<Typography
                        variant='h4'
                        component="h1"
                        sx={{
                            fontWeight: "bolder",
                            padding: '1em 0 2em'
                        }}>
						Explore and Contribute to Our Networks
					</Typography>
				</Grid>
				<Grid container spacing={1} size={7} offset={2.5}>
					{SOCIAL_CARDS.map((card, index) => (
						<Grid key={index} size={12 / SOCIAL_CARDS.length} sx={{
                            display: "flex"
                        }}>
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
            <Grid
                sx={{
                    bgcolor: (theme: Theme) => theme.palette.marketing.light,
                    flexGrow: 1
                }} />
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