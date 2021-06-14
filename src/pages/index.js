import React from 'react';
import { graphql } from 'gatsby';
import HubspotForm from 'react-hubspot-form';
import jsYAML from 'js-yaml';

import EasyLayout from '../components/EasyLayout';

import ImgBirdOnBricks         from '../assets/images/bird-on-bricks.svg';
import ImgDebugLocally         from '../assets/images/debug-locally.svg';
import ImgInstantFeedback      from '../assets/images/instant-feedback.svg';
import ImgRealisticEnvironment from '../assets/images/realistic-environment.svg';
import ImgMinimalResources     from '../assets/images/minimal-resources.svg';
import ImgYourTools            from '../assets/images/your-tools.svg';
import ImgQuote                from '../assets/images/quote.svg';
import ImgVizualaiLogo         from '../assets/images/vizualai-logo.jpg';

export default function HomePage({ location, data }) {
  const variables = jsYAML.safeLoad(data.file.internal.content);

  return (
    <EasyLayout title="Home" location={location}
                description="Telepresence: a local development environment for a remote Kubernetes cluster">
      <section id="hero" className="bg-white text-center">
        <h1 className="text-uppercase text-xl">Telepresence</h1>
        <p className="font-light text-uppercase text-md">
          Fast, local development for Kubernetes and OpenShift microservices
        </p>
        <div className="get-started-button">
          <a href="/docs/latest/" id="get-started-btn" className="btn btn-black">Get Started</a>
        </div>
        <div className="github-buttons">
          <a className="github-button" href="https://github.com/telepresenceio/telepresence"
             data-icon="octicon-star" data-show-count="true"
             aria-label="Star telepresenceio/telepresence on GitHub">Star</a>
          {' '}
          <a className="github-button" href="https://github.com/telepresenceio/telepresence/fork"
             data-icon="octicon-repo-forked" data-show-count="true"
             aria-label="Fork telepresenceio/telepresence on GitHub">Fork</a>
        </div>
        <div className="text-center text-md text-black">
          <div className="version-number">
            { variables.version }
          </div>
          <div>
            <strong className="font-bold ">Telepresence { variables.version } is now available</strong>
          </div>
          <a target="_blank" rel="noreferrer" className="font-light text-black" href="/docs/latest/release-notes">Read the Release Notes</a>
        </div>
        <img src={ImgBirdOnBricks} alt="Telepresence mascot"/>
      </section>
      <section id="tabs" className="bg-white box-shadow">
        <div className="container">
          <ul className="about-tabs">
            <li className="tab" data-tabId="debug-locally">
              <img alt="Debug locally" className="svg" src={ImgDebugLocally}/>
              <span>Debug locally</span>
            </li>
            <li className="tab" data-tabId="instant-feedback">
              <img alt="Instant feedback" className="svg" src={ImgInstantFeedback}/>
              <span>Instant feedback</span>
            </li>
            <li className="tab" data-tabId="realistic-environment">
              <img alt="Realistic environment" className="svg" src={ImgRealisticEnvironment}/>
              <span>Realistic environment</span>
            </li>
            <li className="tab" data-tabId="minimal-resources">
              <img alt="Minimal resource footprint" className="svg" src={ImgMinimalResources}/>
              <span>Minimal resource footprint</span>
            </li>
            <li className="tab" data-tabId="your-tools">
              <img alt="Use your own tools" className="svg" src={ImgYourTools}/>
              <span>Use your own tools</span>
            </li>
          </ul>
          <div className="tab-content font-light">
            <div id="debug-locally">
              <p>Debug your Kubernetes service locally, using your favorite debugging tool.</p>
              <p><a className="tutorial-link" href="/tutorials/kubernetes">Go to tutorial</a></p>
            </div>
            <div id="instant-feedback">
              <p>Test and iterate on code changes instantly, instead of waiting for your deployment cycle.</p>
              <p><a className="tutorial-link" href="/tutorials/kubernetes-rapid">Go to tutorial</a></p>
            </div>
            <div id="realistic-environment">
              <p>
                With Telepresence, you’re developing on a Kubernetes or OpenShift cluster, which can be configured
                to be identical to production. Eliminate bugs due to differences between development and production
                environments.
              </p>
            </div>
            <div id="minimal-resources">
              <p>
                Telepresence adds virtually zero overhead to your development environment. It only requires the
                memory and CPU necessary to run your actual service. Don’t let your laptop melt from running
                minikube!
              </p>
            </div>
            <div id="your-tools">
              <p>
                Use your favorite code editor, debugger, profiler, or other tools. Anything that runs on your
                laptop works with Telepresence.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray padding-top-75 padding-bottom-60">
        <div className="container">
          <div className="quote-container">
            <div className="quotes bg-white border-gray box-shadow content-box">
              <div>
                <div className="quote">
                  <img className="logo hidden-xs" src={ImgQuote} alt="blockquote symbol"/>
                  <div className="quote-content">
                    <p>"Telepresence is such a useful tool. I use the swap deployment so I can iterate faster
                    when I'm working back and forth between my local cluster and cloud clusters."</p>
                    <p><a href="https://twitter.com/KevinHoffman" className="author">@KevinHoffman</a></p>
                  </div>
                </div>
              </div>
              <div>
                <div className="quote">
                  <img className="hidden-xs" src={ImgQuote} alt="blockquote symbol"/>
                  <div className="quote-content">
                    <p>"Going through CI to test 2 lines of changed code seems excessive. Telepresence got it
                      down to `go run main.go` with an added benefit of getting access to real ConfigMap /
                    Secrets."</p>
                    <p><span className="author">Vladimir Pouzanov</span></p>
                  </div>
                </div>
              </div>
              <div>
                <div className="quote">
                  <img className="logo hidden-xs" src={ImgVizualaiLogo} alt="vizual.ai logo"/>
                  <div className="quote-content">
                    <p>"Telepresence can be used to drastically improve the development workflow for Spark
                    applications. It’s the best tool we have found for running integration tests against against systems inside our cluster from our local machines / CICD environments."</p>
                    <p><span className="author">Nate Buesgens, Vizual.AI</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray padding-top-75 padding-bottom-130">
        <div className="container text-center">
          <div className="bg-white border-gray box-shadow content-box text-center">
            <h1 className="text-lg">Stay Updated</h1>
            <p className="font-light text-md">Telepresence is under active development. Subscribe to get updates and announcements:</p>
            <div className="mailing-list-signup">
              <HubspotForm
                portalId="485087"
                formId="956287a4-7614-486b-91bd-28c9a91949cb"
              />
            </div>
          </div>
          <div className="sponsored-by text-center">
            <div className="cncf">
              <img className="cncf-logo" alt="Cloud Native Computing Foundation" src="https://d33wubrfki0l68.cloudfront.net/ea0d91fac8683c38ea9a1fb8a4e9914627ac6aae/8efa9/img/logos/cloud-native-computing.svg"/>
              <p className="text-md">
                Telepresence is a <a href="https://www.cncf.io">Cloud Native Computing Foundation</a> sandbox project
              </p>
            </div>
            <p className="text-md">
              Telepresence was originally created by <a href="https://www.getambassador.io" target="_blank" rel="noreferrer">Ambassador Labs</a>
            </p>
          </div>
        </div>
      </section>
      <script async defer src="https://buttons.github.io/buttons.js"></script>
    </EasyLayout>
  );
}

export const query = graphql`
  query {
    file(
      sourceInstanceName: { eq: "docs" },
      relativePath: {eq: "latest/versions.yml" },
    ) {
      internal {
        content
      }
    }
  }
`
