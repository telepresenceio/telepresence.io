import React from 'react';
import TelepresenceIcon from '../assets/images/telepresence-edgy.svg';
import Typography, {TypographyProps} from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import Grid from "@mui/material/Grid2";
import Layout from "../components/Layout";
import {Theme} from "@mui/material";

const Paragraph = styled(Typography)<TypographyProps>(({theme}) => ({
	variant: 'body1',
	marginTop: '1.2em',
	a: {
		textDecoration: 'none',
		color: theme.palette.text.secondary,
	}
}));

const AboutPage: React.FC = () => {
	return (
		<Layout title="About" description="Telepresence: a local development environment for a remote Kubernetes cluster">
			<Grid container direction='row' alignItems='center' spacing={2} bgcolor={(theme: Theme) => theme.palette.marketing.light}>
				<Grid size={{xs: 12, md: 7}} padding={'4em'}>
					<Typography fontWeight={"bold"} variant='h2' component="h1">
						About
					</Typography>
					<Paragraph>
						Telepresence is an open source tool for Kubernetes application
						developers that lets you run a single service locally while
						connecting that service to a remote Kubernetes cluster.
					</Paragraph>
					<Paragraph>
						Telepresence is a CNCF sandbox tool built by the team at{' '}
						<a href="https://www.getambassador.io/">Ambassador</a> Labs, the
						creators of Emissary-ingress (Kubernetes-native API gateway powered
						by Envoy Proxy). The team at Ambassador Labs is committed to helping
						development teams build faster & ship safer on Kubernetes.
					</Paragraph>
					<Paragraph>
						We welcome all community contributions. If you find a bug or a
						mistake in the documentation, you can help us out by submitting an
						issue or a pull request with a fix. If you have questions, join our
						active <a href="https://slack.cncf.io/">Slack community</a> or{' '}
						<a href="https://www.getambassador.io/contact-us">contact us</a>{' '}
						about paid support plans.
					</Paragraph>
				</Grid>
				<Grid size={{xs: 8, md: 5}} offset={{xs: 2, md: 0}} padding={'4em'}>
					<TelepresenceIcon/>
				</Grid>
			</Grid>
			<Grid direction='column' flexGrow={1} bgcolor={(theme: Theme) => theme.palette.marketing.light}/>
		</Layout>
	);
}

/*
export const Head: React.FC<HeadProps> = ({location}) => {
	return (
		<GlobalHead location={location} title="About" canonical="https://www.telepresence.io/about/">
			<meta name="description" content="Telepresence: a local development environment for a remote Kubernetes cluster"/>
		</GlobalHead>
	)
}
 */
export default AboutPage;