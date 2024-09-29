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
	const latestVersion = "2.20";

	const getStarted = (
		<Button
			variant="contained"
			href={`/docs/${latestVersion}/quick-start/`}
			sx={{
				marginY: "4em",
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

	const card = (element: React.ReactElement<React.JSXElementConstructor<never>>) => (
		<Grid size={2.4} display={"inline-grid"} direction="row" alignContent="center" sx={{
			backgroundColor: "white",
			aspectRatio: "2/1",
			padding: "20px",
			borderRadius: "8px",
		}}>
			{element}
		</Grid>
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
			<Grid container padding={'6em 8%'} direction='row' alignItems='center' spacing={2} bgcolor={infoBg}>
				<Grid size={{xs: 12, md: 6}}>
					<Typography fontWeight={"bold"} variant='h2' component="h1">
						Telepresence
					</Typography>
					<Typography variant="h5" paddingTop="1.5em">
						Fast, local development for Kubernetes and OpenShift Microservices
					</Typography>
					{getStarted}
					<Box>
						<CNCFLogoIcon height="35px"/>
						<Typography variant="body2">
							Telepresence is
							a {link("Cloud Native Computing Foundation", "https://www.cncf.io/")} Sandbox
							project created by the team at {link("Ambassador Labs", "https://www.getambassador.io/")}
						</Typography>
					</Box>
				</Grid>
				<Grid size={{xs: 12, md: 6}} alignContent="center" padding={'4em'}>
					<TelepresenceIcon height={400} width={400}/>
				</Grid>
			</Grid>
			<Grid container padding={'4em 8%'} spacing={7}>
			<Typography width="100%" textAlign="center" paddingTop="2em" fontWeight={"bold"} variant='h4'
			            component="h2">
				Why Telepresence?
			</Typography>
				<Grid size={4}>
					<StyledLoopIcon width="50" height="50" />
					<Typography variant='subtitle1' component="h3" fontWeight="bold">
						Accelerate Inner Dev Loop
					</Typography>
					<Typography variant='body1' component="p">
						Kubernetes was supposed to make your team faster, but now
						everytime you make a code change you have to wait for containers
						to build, be pushed to registry, and deployed. With Telepresence,
						you can make changes to your service as if you&apos;re developing
						locally, without having to run all the dependencies on your local
						machine.
					</Typography>
				</Grid>
				<Grid size={4}>
					<StyledLeftArrowIcon width="50" height="50"/>
					<Typography variant='subtitle1' component="h3" fontWeight="bold">
						Shift Testing Left
					</Typography>
					<Typography variant='body1' component="p">
						You want to catch errors before they get shipped to production,
						but to do that you need a realistic development environment and
						with Kubernetes, those can be expensive. Telepresence lets you
						connect the copy of your service locally to your remote
						dependencies, so you can test like your laptop is in your cluster.
					</Typography>
				</Grid>
				<Grid size={4}>
					<StyledWrenchIcon width="50" height="50"/>
					<Typography variant='subtitle1' component="h3" fontWeight="bold">
						Use Your Existing Workflow
					</Typography>
					<Typography variant='body1' component="p">
						Missing your favorite code editor, debugger, or profiler? Anything
						that runs on your laptop works with Telepresence - even when
						you&apos;re working on a service running in Kubernetes.
					</Typography>
				</Grid>
			</Grid>
			<Grid container padding={'0.7em 8% 4em'} alignItems='center' spacing={2} bgcolor={infoBg}>
				<Typography width="100%" paddingY="1.5em" textAlign="center" fontWeight={"bold"} variant='h4'
				            component="h2">
					Used by
				</Typography>
				{card(<img src={EngelIcon} alt="Engel and voelkers" width="100%"/>)}
				{card(<PoshLogo height="100%"/>)}
				{card(<PtcLogo height="100%"/>)}
				{card(<SaltLogo height="100%"/>)}
				{card(<ManhattanLogo height="100%"/>)}
			</Grid>
			<Grid container padding={'4em 8%'} spacing={2}>
				<Grid size={8} offset={2}>
					<Typography width="100%" paddingY="0.6em" textAlign="center" fontWeight={"bold"} variant='h4'
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
						the {link("docs", `/docs/${latestVersion}/reference/architecture/`)} or
						join us in the #telepresence-oss channel on
						the {link("CNCF Slack", "https://slack.cncf.io/")}.
					</Typography>
					{getStarted}
				</Grid>
			</Grid>
		</Layout>
	)
}

/*
export const Head = ({location}) => {
    return (
        <GlobalHead location={location} title="Home" canonical="https://www.getambassador.io/products/telepresence">
            <meta name="description"
                  content="Telepresence: a local development environment for a remote Kubernetes cluster"/>
        </GlobalHead>
    )
}
 */

export default HomePage