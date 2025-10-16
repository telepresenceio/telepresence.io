import React from 'react';
import TelepresenceIcon from '../assets/images/telepresence-edgy.svg';
import CNCFLogoIcon from '../assets/images/home/CNCF_logo.svg';
import LoopIcon from '../assets/images/home/Loop.svg';
import LeftArrowIcon from '../assets/images/home/Left_Arrow.svg';
import WrenchIcon from '../assets/images/home/Wrench.svg';
import EngelIcon from '../assets/images/case-study/engel-and-voelkers.png';
import PoshLogo from '../assets/images/home/Posh_logo.svg';
import PtcLogo from '../assets/images/home/ptc.svg';
import SaltLogo from '../assets/images/home/Salt_logo.svg';
import ManhattanLogo from '../assets/images/home/Manhattan_logo.svg';
import TPArchitectureLogo from '../assets/images/home/TP_Architecture.svg';
import {deepPurple} from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Layout from "../components/Layout";
import {Theme} from "@mui/material";
import styled from "@mui/material/styles/styled";

const HomePage: React.FC = () => {
	const getStarted = (
		<Button
			variant="contained"
			href={`/docs/quick-start`}
			sx={{
				marginTop: "3em",
				lineHeight: "2.5",
				fontSize: "1.5",
				fontWeight: "bold",
				backgroundColor: deepPurple[400],
				"&:hover": {
					backgroundColor: deepPurple[800]
				}
			}}
		>
			get started
		</Button>
	)
	const link = (text: string, href: string) => (
		<Link underline="hover" target={href.startsWith("https://") ? "_blank" : "_self"} href={href}>{text}</Link>
	)

	const circle = (number: number, element: React.ReactElement<React.JSXElementConstructor<never>>) => (
		<Grid container alignItems="flex-start" spacing={1}>
			<Grid display="inline-grid" width="1.7em" textAlign="center" sx={{
				backgroundColor: deepPurple[300],
				borderRadius: "50%",
				color: "white",
				fontWeight: "800",
				fontSize: "1em",
				lineHeight: "1.7em",
			}}>{number}</Grid>
			<Grid size="grow">
				{element}
			</Grid>
		</Grid>
	)

	const infoBg = (theme: Theme) => theme.palette.marketing.light

	const StyledLoopIcon = styled(LoopIcon)(({theme}) => ({
		stroke: theme.palette.marketing.main
	}));
	const StyledLeftArrowIcon = styled(LeftArrowIcon)(({theme}) => ({
		stroke: theme.palette.marketing.main
	}));
	const StyledWrenchIcon = styled(WrenchIcon)(({theme}) => ({
		stroke: theme.palette.marketing.main
	}));

	return (
		<Layout title="Home" description="Telepresence: a local development environment for a remote Kubernetes cluster">
			<Grid container padding={'3em 8%'} direction='row' alignItems='center' spacing={2} bgcolor={infoBg}>
				<Grid size={{xs: 12, md: 6}}>
					<Typography fontWeight={"bold"} variant='h2' component="h1">
						Telepresence
					</Typography>
					<Typography variant="h5" paddingTop="1.5em">
						Fast, local development for Kubernetes and OpenShift Microservices
					</Typography>
					{getStarted}
					<Box marginTop="3em">
						<CNCFLogoIcon height="35px"/>
						<Typography variant="body2">
							Telepresence is
							a {link("Cloud Native Computing Foundation", "https://www.cncf.io/")} Sandbox
							project initially created by the team at {link("Ambassador", "https://www.getambassador.io/")}
						</Typography>
					</Box>
				</Grid>
				<Grid size={{xs: 12, md: 6}} alignContent="center" padding={'2em'}>
					<TelepresenceIcon height={400} width={400}/>
				</Grid>
			</Grid>
			<Grid container padding={'3em 8%'} spacing={7}>
				<Typography width="100%" textAlign="center" fontWeight={"bold"} variant='h4'
							component="h2">
					Why Telepresence?
				</Typography>
				<Grid size={4}>
					<StyledLoopIcon width="50" height="50" />
					<Typography variant='subtitle1' component="h3" fontWeight="bold">
						Speed Up Your Inner Dev Loop
					</Typography>
					<Typography variant='body1' component="p">
						Kubernetes should make your team faster. 
						But every time you make a code change, you have to wait for containers to build, be pushed to a registry and deployed. 
						With Telepresence, you develop as if everything runs on your machine. 
						No need to manage dependencies. Code, test, and see results immediately.
					</Typography>
				</Grid>
				<Grid size={4}>
					<StyledLeftArrowIcon width="50" height="50"/>
					<Typography variant='subtitle1' component="h3" fontWeight="bold">
						Shift Testing Left
					</Typography>
					<Typography variant='body1' component="p">
						You want to catch errors before they reach production.
						To do this, you need a realistic development environment.
						However, Kubernetes environments can be costly. 
						Telepresence solves this by letting you connect your local service to remote dependencies. 
						This allows you to test as if your laptop is part of the cluster.
					</Typography>
				</Grid>
				<Grid size={4}>
					<StyledWrenchIcon width="50" height="50"/>
					<Typography variant='subtitle1' component="h3" fontWeight="bold">
						Use Your Existing Workflow
					</Typography>
					<Typography variant='body1' component="p">
						Missing your favorite code editor, debugger, or profiler? 
						You can use anything that runs on your laptop with Telepresence. 
						This includes services running in Kubernetes.
					</Typography>
				</Grid>
			</Grid>
			<Grid container padding={'3em 8%'} spacing={2}  bgcolor={infoBg}>
				<Grid size={8} offset={2}>
					<Typography width="100%" textAlign="center" fontWeight={"bold"} variant='h4'
					            component="h2">
						How does it work?
					</Typography>
					<Typography variant='subtitle1' component="p">
						Telepresence consists of two core architecture components: the
						client-side telepresence binary (CLI on your workstation) and the
						cluster-side traffic-manager and traffic-agent (on the remote
						Kubernetes cluster).
					</Typography>
				</Grid>
				<Grid size={6}>
					<TPArchitectureLogo/>
				</Grid>
				<Grid container size={6}>
					{circle(1, <Typography variant="body1">
							The `telepresence connect` command utilizes the
							traffic-manager to establish a two-way (proxied) tunnel
							between your local development machine and the cluster. Now
							you can access remote K8s Service as if they were running
							locally.
						</Typography>
					)}
					{circle(2, <Typography variant="body1">
							Running `telepresence intercept service-name` triggers the
							traffic-manager to install a traffic-agent proxy container
							that runs within the Pods associated with the target Services.
							This can route remote traffic to your local dev machine for
							dev and test.
						</Typography>
					)}
					<Typography variant="body1">
						To find out more about the Telepresence Architecture, check out
						the {link("docs", `/docs/reference/architecture/`)} or
						join us in the #telepresence-oss channel on
						the {link("CNCF Slack", "https://slack.cncf.io/")}.
					</Typography>
					{getStarted}
				</Grid>
			</Grid>
		</Layout>
	)
}

export default HomePage