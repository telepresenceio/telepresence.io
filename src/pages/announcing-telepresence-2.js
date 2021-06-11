import React from 'react';

import EasyLayout from '../components/EasyLayout';

export default function Tel2Page({ location }) {
  return (
    <EasyLayout title="Announcing Telepresence 2!" location={location}>
      <section id="about-page" class="bg-white">
        <div class="container">
          <h1 class="text-lg">Announcing Telepresence 2!</h1>

          <p>We’re excited to announce that a new version of
            Telepresence is available. Among other new features, we
            have rewritten Telepresence in Go (from Python) in order
          to:</p>
          <ul>
            <li>Make it even faster!</li>
            <li>Better serve our awesome open source community and make it easier for more community members to contribute</li>
            <li>Make Telepresence easier to integrate with other cloud native tools in your tech stack</li>
          </ul>

          <div class="bg-white content-box text-center">
            <h1 class="text-lg">Telepresence 2 is available now!</h1>
            <div class="actions">
              <a class="btn btn-red"
                 href="https://www.getambassador.io/docs/telepresence/latest/quick-start/"
              >Try it now</a>
            </div>
          </div>

          <h1 class="text-lg">Have questions?</h1>
          <p>Join the #telepresence channel on our <a target="_blank" rel="noreferrer" href="https://a8r.io/slack">Community Slack</a> to talk with the community about the new updates.</p>
        </div>
      </section>
    </EasyLayout>
  );
}
