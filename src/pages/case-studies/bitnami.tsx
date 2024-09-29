import React from 'react';
import CaseStudyTemplate from '../../components/CaseStudyTemplate';
import {caseStudy} from "./index";
import Layout from "../../components/Layout";

const BitnamiPage: React.FC = () => {
	return (
		<Layout title="Bitnami Case Study">
			<CaseStudyTemplate caseStudy={caseStudy("Bitnami")}>
				<div className="mediaItem video">
					<iframe
						title="Video"
						width="560"
						height="315"
						src="//www.youtube-nocookie.com/embed/8Dl8U-AbJN0?rel&#x3D;0&amp;amp;showinfo&#x3D;0"
						allow="autoplay; encrypted-media"
						allowFullScreen
					></iframe>
				</div>

				<div className="mediaItem">
					<iframe
						title="Slides"
						src="//speakerdeck.com/player/8ed089b6084b4cf3b842c0a3db0d8941"
						allowFullScreen
					></iframe>
				</div>

				<h2>Transcript</h2>
				<p>
					<strong>Ara Pulido:</strong> So thanks, thanks a lot for coming. My
					name is Ara Pulido. I am engineering manager at Bitnami. This is
					actually my second KubeCon so still pretty new to the community. And
					for the next few minutes I'm going to be talking about a tool that we
					discover in the previous KubeCon in Austin. And since then has become
					a key piece so far in our development process.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So, first of all, who we are: so, Bitnami
					is a leader in application packaging. We have more than 120
					applications on the cloud marketplaces, like AWS, Azure, DCP, etc. And
					that's how a lot of people know us. And a couple of years ago we
					started investing a lot in containers and Kubernetes. With the
					application packaging in our DNA, we invested a lot in Helm and we
					actually continue maintaining more than 20 of the official charts
					there.
				</p>
				<p>
					<strong>Ara Pulido:</strong> We also do a bunch of opensource projects
					that are always on the application deployment area of Kubernetes, so
					we have Kubeless, which is a server less framework for Kubernetes,
					Kubeapps which is an application dashboard for Kubernetes for your
					cluster, which is actually the application that we use telepresence
					for. And others like SSLSecrets or Kube CFG that we develop with
					HEPTIO, SSLSecrets, and others.
				</p>
				<p>
					<strong>Ara Pulido:</strong> And since we started investing a lot in
					Kubernetes, we also did that internally, so we run many of our
					workloads in our Kubernetes cluster, and we love Kubernetes as a
					production environment for your containerize applications. But it
					seems like the development process for it, it was a little bit of an
					afterthought. When you're developing for Kubernetes, suddenly it
					becomes very difficult to manage. So, just to put an example of a
					very, very simple cloud native application.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Very quickly it becomes this microservice
					architecture where you may have different ingress rules that redirect
					traffic to a front end, maybe a web UI, and that web UI may talk to
					one or different services on the back end. And those services may talk
					to each other and they may need to to talk to, for example, and
					external database or another external service that may not be in your
					cluster. So even with a very, very simple app, it certainly becomes
					this difficult mess to handle on the development process.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So, how we've been doing that is
					historically is basically replicating our architecture in production,
					in a docker compose, and making this little tricks that we will do.
					Like we may have a conflict mapping Kubernetes, and we may replace
					that with just a volume mount on docker compose. And we may replace
					our secrets with just a envirable, and we may have several services
					describe that for service recovery, and we maybe have our volumes,
					etc, etc. And as the application grows, you have to keep maintaining
					those two manifests.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So the manifests that you ran in
					production, the ones that you use in docker compose to develop and
					they may divert and you may find regressions or things do not work,
					sadly, as you expected when you go to your cluster. Also there are
					things that are not that easily described on a docker compose like
					your ingress rules or jobs and cromjobs, or your init containers, or
					your [inaudible 00:03:51] rules, and your Kubeconfig, etc, etc.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So, then there is the second solution
					with having this development cycle off. You bill your image, you make
					a change, you bill your image, you push it somewhere to a registry,
					hopefully on your cluster maybe somewhere else. Change your manifest
					or maybe your manifest are pointing to a def image directly so you
					test your changes. That's some work and you do that over and over
					again. And this can become very, very slow. You can be doing things
					like making sure that you're building your image as part of your bill
					process to accelerate things, but again it's always a little bit slow.
					And even if you have to push somewhere in the register you may have
					these issues of making it a little bit more slow.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So, obviously this is a problem that a
					lot of people are thinking of and there are several solutions that are
					there. And as you said, we discovered Telepresence last Kubecon. It's
					a tool by a company called Datawire and very, very high level. What it
					does is allows you to run a process that is fully connected to a
					cluster and that cluster could be on your local environment with
					Minicube, but it also and ideally, will be elsewhere in the cloud. So
					you can have all the computer that you need or all the memory that you
					need to run the different services that you're not actually developing
					but your application may need to talk to.
				</p>
				<p>
					<strong>Ara Pulido:</strong> How it works is Telepresence will deploy
					a two-way proxy into your cluster that start proxing data from your
					cluster to our client running or your local machine and back.
					Basically what it gives you, you get service discovery with full DNS
					resolution for your local machines. So you can talk to any of the
					services that are in your cluster in a seemless way. You have volumes,
					you have environmental variables, so all the things that you may need
					from your cluster when you're developing a service that you are
					planning to put on that cluster directly from your local machine. And
					I think that the gifing and the thing that we like about Telepresence
					is that it does that without you even almost noticing. So you run a
					local process and it's talking to everything on your cluster without
					you having to do any change on the code because of this using the same
					service discovery volumes, environmental variables, etc.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Telepresence has several proxy methods.
					Each of those has pros and cons. You can use the one that you think is
					gonna serve you better. The first one is VPN, where it creates
					basically a SSH tunnel between the proxy running the cluster and the
					client creating more or less like a VPN. The only downside is you
					cannot use another VPN on top and actually I was testing the demo the
					other day and I was freaking because it wasn't working. It was because
					I was actually running on my company VPN.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Then you have Inject-TPC, which basically
					injects a shared library into the process that you want to run. And
					with a clear limitation that it doesn't work with statically linked
					process that go.
				</p>
				<p>
					<strong>Ara Pulido:</strong> And then docker which is very similar to
					VPN process with the difference that instead of running just a process
					it allows you to run an image that you already built. Which works well
					if you already have this container native development process where
					you'll build processes not building your app. It's building your app
					and building your a docker image.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So the idea of this talk more than
					talking about is talking at least to show you how it feels using
					Telepresence, so I prepare a couple of demos. And let's see came to
					explain the first one.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Is this big enough? Or maybe bigger?
				</p>
				<p>
					<strong>Ara Pulido:</strong> Better?
				</p>
				<p>
					<strong>Speaker 2:</strong> Yeah.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Okay. So the first one is very simple.
					It's just to show you all these service discovery in volumes, etc.,
					that you can have. So we have these couple of pods in cluster but when
					I'm in a Kube just to avoid using networking too much. Yes, the idea
					is that you would have development cluster in the cloud or in your
					service and primaries to do this. So yeah, we have this service, a
					simple service called QRTM. The only thing it does is listening on
					port 5000. When you make a request it remains adjacent with a random
					quote. It's just as simple as that. We use it as an example of a
					service that may be running on your cluster, not the one that you're
					developing that, but you need to talk to it as far off your
					application.
				</p>
				<p>
					<strong>Ara Pulido:</strong> And then we have these Telepresence test
					that- let's check what it is. [inaudible 00:10:27] deployment. It has
					an init container so you can see that we can still use init
					containers. The only thing that it does is mounting the volume call
					datum into a mount [inaudible 00:10:45] data and just creates just a
					simple random stream on a file. And then we have our main container
					which has here an environmental variable. It's not a real secret in
					this case, but it could be a key ref to a real secret. It will still
					work. And tFhen you have the same volume mount and basically it reads
					the file it was supposed to be created by in the container. And the
					volume is just simple empty there.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So obviously if we check the logs of that
					pod, we have random data there as we expected. And now let's remind
					you that there is something not going okay. We didn't get random data
					there, there's something going wrong. We may thing that it's something
					with the volumes. Something with the init container, want to debug a
					little bit.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So basically we are going to tell the
					presence to stop the deployment call to the presence test and let's
					watch here the ports as well. But, I'm not telling the presence to run
					any process on top, so what it's going to do is to start a bash
					session that is already connected to my cluster. So as you can see,
					what is happening is it's swapping the deployment and we will see when
					it finished what it's actually doing. So and the obviously swapping is
					changing the deployment and the deployment controller, the replica
					controller is doing it's thing. And basically some things that it says
					here, so it says that it's starting the VPN method. That's the full
					one, so that's the one it's going to use if you don't tell it
					otherwise. And then it says volumes are routed to the Telepresence
					route and it says that no traffic is being forwarded from the
					deployment to my pod. We will see in the second demo how to do that.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So let's check. So one of the pods is
					terminating the other one is starting, so let's check how these pod
					look like. So you can see we have the volumes now, we have our init
					containers still here, and we have the main container with our
					environmental variable. Some special variables coming from
					Telepresence. As you can see the image has changed from the bc box
					image that I was using to the Telepresence proxy image.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So back to the shell that is connected to
					my classes. Let's check first volumes, so volumes are routed at
					Telepresence route so let's go there. So we can see that the data
					volume was correctly mounted and if we check the data there our init
					container created that file correctly. So we can see that way we can
					have access to the volume and see if something was wrong there. Also,
					we have several environmental variables, some of them are coming from
					my local machine. But also, I have access to the ones that are on my
					pod. Here's the one that was on the pod description, and it's still
					there so I can have access to any of the environmental variables
					there.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Lastly, remember that we were running the
					service on port 5000 called QOTM. That basically returned adjacent
					with a random code. So directly from here, from my local machine, I
					can call QOTM on and I can use the same DNS: service discovery
					[inaudible 00:15:45]. So if it's running on a different name it's best
					that I have access to I could use dot [inaudible 00:15:50] etc, etc,
					to get access to it. And as you can see it works. It feels like I'm
					[inaudible 00:16:01] into a container inside my cluster, but actually
					I'm not. As you can see it's still running so if I go here it's my
					local machine. If I exit here, it's going to the opposite. It's going
					to replace back the container by the original one and leaving my
					cluster as it was before I start Telepresence.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So this is a very simple demo but it
					already shows what you can do with Telepresence. I'm going to show now
					how we're using it to develop Kubeapps, which is an application
					dashboard for your Kubernetes cluster. Kubeapps comes with the CLI,
					I'm gonna make that bigger. So it comes with the CLI tool. If you do
					Kubeapps app it will deploy all the different components that are part
					of Kubeapps into your cluster and you can see that there are different
					deployments, also one in the Kubeless name space.
				</p>
				<p>
					<strong>Ara Pulido:</strong> The one that we are going to use
					Telepresence for is Kubeapps dashboard UI. What is this UI? So if we
					run Kubeapps dashboard, it's going to start this application
					dashboard. What you can do with, you have access to your helm
					deployments, we are using actually not only using Tele directly but
					using something we call Helm CRD. Which for every deployment creates a
					CRD object and there is a controller looking after it. We have a set
					of charts available, some different repos, you can add repositories if
					you need to. This thing for example is happening also with a different
					main, and different CRD.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Functions through Kubeless, we have
					function as a service in Kubeapps with Kubeless integration. So you
					can have any function that you may run here. Each of these functions
					in Kubeless is again, a CRD. Call function. It has service catalog
					integration. Service catalog is an API extension for Kubernetes that
					allows you to connect external services provided by what is called the
					service broker into your cluster. And again, It's an extension of the
					API. So you can see, this UI has a lot of knowledge about your
					Kubernetes cluster and it would be very, very difficult to just try
					and to develop this UI locally.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So what we are going to do is we are
					going to tell Telepresence to swap the deployment call Kubeapps
					dashboard UI, which is the UI we just saw, on the nameless space
					Kubeapps because it's not running on the default nameless space. We
					using in this case the Net TCP method, although there are people on
					our developing team that are used to VPN as well so both work well.
					Also we are telling it to redirect all the traffic to on the cluster
					on port 8080 on that pod to port 3000 on the local port. And the
					reason why we are doing that is because we are then going to run a
					development server for that application that is running on port 3000
					by default.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So again, it's starting the proxy this
					time with a Net TCP, it's warning you about some limitations of that.
					Same thing, volumes are routed to a Telepresence route and it's
					forwarding traffic from port 8080 to 3000. So let's run a development
					server on port 3000. It's going to take some seconds to start. So it
					says now that it's listening on local host 3000, but instead we are
					going to access through this proxy to our cluster that we just
					created. And actually now that it refreshes, this UI is actually
					running on my local machine through port 3000. And I still have access
					to all the service catalog classes that I have for this particular
					broker, functions, the charts, applications, etc, etc. To demonstrate
					that's true, we are going to do a quick live change.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So this particular file is rendering the
					view here, the applications. So this Heather, H1 Heather, is that same
					Heather that we saw. And we are just going to save that and our
					development server is going realize that there has been a change and
					it's going to reload the page and it's showing the change. So that way
					allows us to do a lot faster development process for this particular
					application, and since we've started using Telepresence it has been a
					lot easier to make these changes. When making sure that we were able
					to keep those services running on that cluster talking to our local
					servers. So that's it for the demo.
				</p>
				<p>
					<strong>Ara Pulido:</strong> The only thing left for this talk, I'm
					going to ask Richard Lee, who is the CEO of Datawire. Thanks for
					coming, Richard.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> Hi.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Applause for him.
				</p>
				<p>
					<strong>Ara Pulido:</strong> And he's going to be talking a little bit
					about the plans that they have for Telepresence for the next few
					months. It should work.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> Does this work?
					Okay. Yeah, so thank you for the great demo. So what we're working on.
					So Telepresence is all open source. We're actually taking it through
					the CNCF sandbox process right now. From a sort of governance and open
					sourcing perspective, from a development perspective we're focused a
					lot of robustness and speed. One of our used case was to talk about is
					the [inaudible 00:23:56] case.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> So if you've been
					to Silicone Valley, a lot of developers take [inaudible 00:24:01] from
					South Bay to up into the valley, and they're bad spot for wi-fi and so
					you can't do reconnect with Telepresence right now. So we want to
					support things like reconnect and better performance on behavior when
					you have bad network connections, improving startup speed. We've done
					a lot of work around cleaning up. You saw from the demo how we
					actually swap out the deployment, put in a proxy, and there are
					certain situations where we would leave that proxy hanging out in the
					cluster. We want that behavior to improve so we've done a lot of work
					on our robustness.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> We're doing more
					deployments at larger organizations that have a lot of our back
					controls in place. So we've been going through the auditing
					permissions that Telepresence needs so you need it actually use it.
					We're also looking at transitioning away from inject TCP because it
					requires hacking LD Preload or DenLib on your laptop which is actually
					very difficult from a maintenance perspective. So we're actually
					exploring other strategies so you can actually support running
					Telepresence even though you have a VPN client. And then we're also
					looking at some more future looking used cases around. Things like
					traffic shadowing, copping production traffic or a percentage of
					production traffic to your local laptop for production testing,
					simplifying the UX so you can actually have a config file for
					configuring it.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> A lot of people
					are asking us around, "How do I configure this with built system X?"
					Like they want to run it automatically [inaudible 00:25:28] or use it
					with particular IDEs and how do you copy environment variables from my
					local process into my intellogy IDE, so we're trying to do a little
					bit of work around that. And also supporting [Istios 00:25:40]. So
					some users have actually manually integrated Telepresence with Istio
					so that you can actually authenticate to your main website. You know,
					foo.com, and through the magic of Isteo routing rules actually route
					those requests straight down to your laptop so you can actually do a
					real-time development versus your production system.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> So those are some
					of the things that we're looking at, and we're also really interested
					in just general feedback around used cases and how people like to use
					Telepresence. Because, it's very dependent on your developer work flow
					and we find that everyone has their own sort of way of doing things,
					so...
				</p>
				<p>
					<strong>Ara Pulido:</strong> Cool. Thanks, thank you.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> Thank you.
				</p>
				<p>
					<strong>Ara Pulido:</strong> If anyone has any questions? Yes.
				</p>
				<p>
					<strong>Speaker 4:</strong> Hi, hello. So perhaps how to go about
					allowing multiple developers to develop against the same set of
					backend services running on our cluster? So that they could work
					concurrently.
				</p>
				<p>
					<strong>Ara Pulido:</strong> I don't think there is a way right now.
					That proxy, so the Telepresence client would talk to a proxy, one of
					the clients at the proxy. So it won't allow to talk to several ones.
					Maybe Richard...
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> Sorry, yeah so
					the, so if you can't do it right now so hopefully what we will do is
					they can bring their own namespaces or clusters for each developer. We
					are working on some other techniques that let you at least detect when
					you actually have collision when you drop on the same namespace. But
					yes, it's a great question. [crosstalk 00:27:34]
				</p>
				<p>
					<strong>Ara Pulido:</strong> So I'm gonna repeat the answer for the
					recording so there is no way right now to do that. The workaround
					people do is to put different namespaces per developer so you can run
					the rest of the services together.
				</p>
				<p>
					<strong>Speaker 5:</strong> Just to make sure I understand correctly,
					the only usage currently is for static files changes, or does it
					include like applications that are developed, let's say with a
					compiler or something? Like Java based applications or something like
					that. I mean your demo just covered a static case for changing some
					HTML but what happens for example for when I [crosstalk 00:28:21] Java
					based application.
				</p>
				<p>
					<strong>Ara Pulido:</strong> Yeah, you can change your Java script so
					it's not just for static files. So it's basically anything that you're
					running on your local process would be the one that's talking to the
					proxy. So it could be any application. It could be a go application.
				</p>
				<p>
					<strong>Speaker 5:</strong> Okay, thanks.
				</p>
				<p>
					<strong>Speaker 6:</strong> So I was curious, how are you
					authenticating to the cluster and what permissions you use in order to
					run this Telepresence?
				</p>
				<p>
					<strong>Ara Pulido:</strong> Basically using your Kube CFG. So your
					Kube Config.
				</p>
				<p>
					<strong>Speaker 7:</strong> Hello. First of all, what is the practical
					use to stream the files from your local mission to the [inaudible
					00:29:26] mission?
				</p>
				<p>
					<strong>Ara Pulido:</strong> I think that would be a better question
					maybe for Richard who know more about the internals.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> So we're just
					using essentially SSHFS for your file system, and we're using, I
					forget what it's called, but it's an SSH-based VPN for the VPN method.
					So it's all sort of layer four networking type stuff. We're basically
					doing a layer four proxy between the cluster and your laptop.
				</p>
				<p>
					<strong>Speaker 7:</strong> My second question is: on the solutions
					for proxying the traffic, have you talked about using [ssx 00:30:05]
					proxy? That would allow delegating DNS resolution of the local
					application to the remote cluster.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> Yes, that's what
					we do. We actually use a fork of [torsocks 00:30:15].
				</p>
				<p>
					<strong>Speaker 8:</strong> When you create the connection to your
					laptop and you have your process running, and then you close you
					laptop and go home for the day does the Telepresence quit and revert
					back to the original process?
				</p>
				<p>
					<strong>Ara Pulido:</strong> Yeah, basically it closes the connection
					and goes back to- it's one of what he said they're working on. On
					actually having being able to reconnect. Yeah, basically goes back to
					how it was.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> Yeah so when the
					connection's dropped, when you terminate the Telepresence proxy on
					your laptop it actually will clean up itself in the cluster. However,
					if you go to sleep the behavior isn't super nice and that's one of the
					things we're actually working on. And sort of where architecturally
					exploring the idea of a persistent proxy on the cluster that you can
					actually reconnect to. Because right now we deploy the proxy every
					time you invoke the command.
				</p>
				<p>
					<strong>Speaker 9:</strong> So how many developers are working
					simultaneously at Bitnami on the same project on the same cluster
					right now and how happy they are with Telepresence can you?
				</p>
				<p>
					<strong>Ara Pulido:</strong> Can you repeat the question sir?
				</p>
				<p>
					<strong>Speaker 9:</strong> How many developers are currently working
					on the same project on the same cluster using Telepresence in your
					project right now?
				</p>
				<p>
					<strong>Ara Pulido:</strong> So right now it's mostly three people,
					but some people are using different clusters. And some of them are
					using MiniKube as well during the development, so we're not using
					concurring access of the same cluster.
				</p>
				<p>
					<strong>Speaker 10:</strong> It's easy to see how you could fall into
					some development practices that are unfortunate with the way you're
					editing your cold starts to diverge from what it actually goes into
					the images that are built. Can you share something about your
					experiences and best practices there?
				</p>
				<p>
					<strong>Ara Pulido:</strong> Yeah, so actually that one would think
					that ideally you would move to is the container native, where you
					build processes is you building an image. The docker image. Then you
					use the docker method with Telepresence. It allows you to run that new
					image and you will still be able to make changes, you can still do
					tricks for faster development like mounting your development folder
					into that image while you run it. So you can pass any docker and run
					parameters that you want. So you can still do tricks to go faster but
					at the same time you make sure that you're building an image and it's
					similar as possible when you were running production.
				</p>
				<p>
					<strong>Speaker 11:</strong> Have you identified any used cases for
					Telepresence for more than just development? Maybe for CI or for
					creating a sandbox environment for-.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So right now we are just using it for
					this project. We just started using like two months ago. We haven't
					been thinking about other use cases. (silence) There is a question
					over there.
				</p>
				<p>
					<strong>Speaker 6:</strong> Sorry, I have another question. So it
					works fine if you have one instance of your container. What happens if
					you've got 10 instances of your container in your cluster and you're
					trying to Telepresence from your machine?
				</p>
				<p>
					<strong>Ara Pulido:</strong> Yeah, so what do you mean? Like you have
					several deployments or?
				</p>
				<p>
					<strong>Speaker 6:</strong> So you've got one deployment, several pods
					right, so you've got 10 pods then your Telepresence, you use
					Telepresence.
				</p>
				<p>
					<strong>Ara Pulido:</strong> So I tried the case where your pod is
					multi-container, I haven't tried that one but I tried the one that it
					has one pod, several containers and as far as my testing went, it
					replaced only the first one. So I don't know what happens if you have
					several pods. Haven't tried that.
				</p>
				<p>
					<strong className="purpleText">Richard Lee:</strong> Yeah, I'm not
					sure either. Was that your situation?
				</p>
				<p>
					<strong>Ara Pulido:</strong> I think, yeah, I think we've run out of
					time. So, if you have any other questions I'll be at the Bitnami booth
					most of the conference and I know Richard is going to be at the
					Datawire one most of the conference. So come reach us. Thank you.
				</p>
			</CaseStudyTemplate>
		</Layout>
	);
}

export default BitnamiPage;