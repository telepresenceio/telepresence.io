import React from 'react';

import EasyLayout from '../components/EasyLayout';
import Markdown from '../components/Markdown';

export default function Tel2Page({ location }) {
  return (
    <EasyLayout title="Announcing Telepresence 2!" location={location}>
      <section id="about-page" class="bg-white">
        {/* FIXME: It's stupid to put docs__main here, but reset.css is a pain and breaks everything until you fix it */}
        <div class="container docs__main">
          <Markdown>{`

# Announcing Telepresence 2!

In November 2020 we released Telepresence 2.0.0 to a small early-access
audience, and have been increasing its exposure ever since then.  We've had a
banner on the web-page promoting v2, and have been encouraging community members
to try upgrading from v1; but because v2 is such a big change, we had been
holding of on switching the "default" Telepresence to be v2; v1 was still what
was on the homepage, and was still what \`master\` was in Git.

Well, over the last 6 months we've made massive strides with v2, and have
finally made the switch-over: Changing the website and Git to be oriented around
v2.

As a regular end-user of Telepresence, you should find everything you need in
the [upgrading documentation](/docs/latest/install/migrate-from-legacy/).

As a developer of Telepresence, you may notice some funny business with your
existing Git checkout of Telepresence.  We've made a few changes to the Git
repo:

 - We've renamed the old \`master\` branch to \`release/v1\`; there is no longer a
   \`master\` branch.
 - We've changed the default branch to be \`release/v2\`

All existing GitHub pull requests for v1 have automatically been re-targetted
from \`master\` to \`release/v1\`.

If you have an existing local Git checkout, the next time you \`git fetch\`,
you'll want to pass the \`--prune\` flag to clean up anything pointing to the old
\`master\` branch.

You should be able to switch your checkout v2 as simply as \`git checkout
release/v2\` (after fetching, of course).  However, be warned: Don't try to
\`rebase\` any of your v1 work on to v2.  They do not share any Git history, and
moreover v2 is a complete rewrite in a different language.

If you have any questions, please reach out to us on GitHub or in the
#telepresence channel on our [Community Slack](https://a8r.io/slack).

          `}</Markdown>
        </div>
      </section>
    </EasyLayout>
  );
}
