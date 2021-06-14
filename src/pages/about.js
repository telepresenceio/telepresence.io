import React from 'react';

import EasyLayout from '../components/EasyLayout';
import Markdown from '../components/Markdown';

export default function AboutPage({ location }) {
  return (
    <EasyLayout title="About" location={location}
                description="Telepresence: a local development environment for a remote Kubernetes cluster">
      <section id="about-page" class="bg-white">
        <div class="container">
          <h1 class="text-lg">About</h1>
          <Markdown>{`

Telepresence is an open source tool that lets you run a single service locally, while connecting that service to a
remote Kubernetes cluster.

Telepresence was originally built by the team at [Ambassador Labs](https://www.getambassador.io/), which builds open
source development tools for Kubernetes, including [Forge](https://forge.sh/) and
[Ambassador](https://www.getambassador.io).  The current list of maintainers of Telepresence are listed in the
[MAINTAINERS.md](https://github.com/telepresenceio/telepresence/blob/master/MAINTAINERS.md) file.

We welcome all community contributions.  If you find a bug or a mistake in the documentation, you can help us out by
[submitting an issue](https://github.com/telepresenceio/telepresence/issues/new) or a pull request with a fix.  If you
have questions, join our active [Slack community](https://a8r.io/slack) or [contact
us](https://www.getambassador.io/editions/) about paid support plans.

`}</Markdown>
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
