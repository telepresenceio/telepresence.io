import React from 'react';

import EasyLayout from '../../components/EasyLayout';

export default function IrisPage({ location }) {
  return (
    <EasyLayout title="IRIS.TV Case Study" location={location}>
      <section id="case-study" class="bg-white">

        <div class="container">
          <h1 class="title">IRIS.TV</h1>

          <h2>Can you tell us about yourself and what your company does?</h2>
          <p>
            I’m Blake Miller, Platform Architect at <a href="www.iris.tv">IRIS.TV</a>. IRIS.TV is a video personalization and programming platform.
            Media customers use IRIS.TV to increase their video views and audience engagement, among other things.
            The IRIS.TV platform consists of about 30 services, written in a wide variety of programming languages
            including Ruby, Python, JavaScript, Clojure, R, and Go. In addition, there are a wide variety of stateful
            services including Redis, Kafka, MongoDB, Cassandra, and MySQL.
          </p>
          <h2>Why did you choose Telepresence and <a href="https://forge.sh">Forge</a>?</h2>
          <p>
            We’re working to improve productivity, accuracy, and autonomy, which is especially important as we begin
            adding remote engineers. We wanted to reduce the cognitive burden of each engineer maintaining a
            development environment, so our engineers can focus as much as possible on the specific challenges and
            opportunities of our business. We are also evolving our production infrastructure towards microservices in
            Kubernetes and need an efficient and complete development setup in that context. When I heard the approach
            that these tools take, I was immediately excited to try it. The alternative is quite cumbersome.
          </p>
          <h2>Do you have any advice for people looking to adopt Telepresence?</h2>
          <p>
            Best practices around development workflow definitely take time to get right, they need to fit your
            organization, and they warrant a lot of consideration since they impact everything you do. There is no
            "one size fits all" approach. This is an ongoing process, it's important to continue examining (ideally,
            measuring) the way your team works, reflecting on it, and refining it. Testing your workflow with a small
            set of users, and incrementally rolling it out is a good strategy. Also, <a href="https://a8r.io/slack">talk with the Ambassador Labs team</a> on
            their Slack chat; they can provide good advice and perspective.
          </p>
          <div class="text-center">
            <a href="/#get-started" class="btn btn-black">Get Started</a>
          </div>
        </div>

      </section>
    </EasyLayout>
  );
}
