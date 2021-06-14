import React from 'react';

import EasyLayout from '../../components/EasyLayout';

import LogoBitnami      from '../../assets/images/bitnami.svg';
import LogoEngelVolkers from '../../assets/images/engel-and-voelkers.png';
import LogoIrisTV       from '../../assets/images/iris-tv.png';
import LogoIronclad     from '../../assets/images/ironclad_logo.png';
import LogoSightMachine from '../../assets/images/sightmachine.png';
import LogoVerloop      from '../../assets/images/Verloop-Logo-Horizontal-HD.png';

export default function CaseStudiesPage({ location }) {
  return (
    <EasyLayout title="Case Studies" location={location}>
      <div className="bg-white page-title">
        <div className="container">
          <h1>Telepresence Case Studies</h1>
        </div>
      </div>
      <div className="case-studies-bg bg-gray padding-bottom-75">
        <div className="container">
          <div className="case-studies">
            <a className="case-study" href="/case-studies/bitnami">
              <div>
                <img src={LogoBitnami} alt="Bitnami logo"/>
              </div>
              <span className="case-study-btn">View Case Study</span>
            </a>
            <a className="case-study" href="/case-studies/engel-volkers">
              <div>
                <img src={LogoEngelVolkers} alt="Engel & Völkers logo"/>
              </div>
              <span className="case-study-btn">View Case Study</span>
            </a>
            <a className="case-study" href="/case-studies/iris-tv">
              <div>
                <img src={LogoIrisTV} alt="IRIS.TV logo"/>
              </div>
              <span className="case-study-btn">View Case Study</span>
            </a>
            <a className="case-study" target="_blank" rel="noreferrer" href="https://articles.microservices.com/towards-a-better-service-development-story-c2fb9bdda6aa">
              <div>
                <img src={LogoIronclad} alt="Ironclad logo"/>
              </div>
              <span className="case-study-btn">View Case Study</span>
            </a>
            <a className="case-study" href="/case-studies/sight-machine">
              <div>
                <img src={LogoSightMachine} alt="Sight Machine logo"/>
              </div>
              <span className="case-study-btn">View Case Study</span>
            </a>
            <a className="case-study" href="/case-studies/verloop">
              <div>
                <img src={LogoVerloop} alt="Verloop logo"/>
              </div>
              <span className="case-study-btn">View Case Study</span>
            </a>
            <a className="case-study" href="https://www.getambassador.io/contact-us/">
              <div>
                <p>Have a Telepresence story to share?</p>
              </div>
              <span className="case-study-btn">Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </EasyLayout>
  );
}
