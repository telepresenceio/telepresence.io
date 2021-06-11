import React from 'react';

import EasyLayout from '../components/EasyLayout';

export default function AboutPage({ location }) {
  return (
    <EasyLayout title="About" location={location}
                description="Telepresence: a local development environment for a remote Kubernetes cluster">
      <section id="about-page" class="bg-white">
        <div class="container">
          <h1 class="text-lg">About</h1>
          <p>Telepresence is an open source tool that lets you run a single service locally, while connecting that
          service to a remote Kubernetes cluster.</p>
          <p>
            Telepresence was originally built by the team at
            <a target="_blank" rel="noreferrer" href="https://www.getambassador.io/">Ambassador Labs</a>, which builds open source development tools
            for Kubernetes, including <a target="_blank" rel="noreferrer" href="https://forge.sh/">Forge</a> and
            <a target="_blank" rel="noreferrer" href="https://www.getambassador.io">Ambassador</a>. The current list of maintainers of
            Telepresence are listed in the
            <a target="_blank" rel="noreferrer" href="https://github.com/telepresenceio/telepresence/blob/master/MAINTAINERS.md">MAINTAINERS.md</a>
          file.</p>
          <p>
            We welcome all community contributions. If you find a bug or a mistake in the documentation, you can help us
            out by <a target="_blank" rel="noreferrer" href="https://github.com/telepresenceio/telepresence/issues/new">submitting an issue</a>
            or a pull request with a fix. If you have questions, join our active
            <a target="_blank" rel="noreferrer" href="https://a8r.io/slack">Slack
            community</a> or <a target="_blank" rel="noreferrer" href="https://www.getambassador.io/editions/">contact us</a> about paid
            support plans.
          </p>

          <div class="bg-white content-box text-center">
            <h1 class="text-lg">Stay Updated</h1>
            <p class="font-light text-md">Telepresence is under active development. Subscribe to get updates and announcements:</p>
            <div class="mailing-list-signup">
              <script type="text/javascript">{`
                hbspt.forms.create({
                  css: '',
                  portalId: '485087',
                  formId: '956287a4-7614-486b-91bd-28c9a91949cb'
                });
              `}</script>
            </div>
          </div>
        </div>
      </section>
    </EasyLayout>
  );
}
