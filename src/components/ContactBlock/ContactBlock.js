import React from 'react';
import { Link } from 'gatsby';

import { goToSlack, goToContactUs } from '../../utils/routes';
import Icon from '../Icon';
import './style.less';

const ContactBlock = () => (
  <div className="contact-block">
    <span className="contact-block__heading">Questions?</span>
    <p>We’re here to help if you have questions.</p>
    <ul className="contact-block__list">
      <li>
        <a href={goToSlack} target="_blank">
          <Icon name="slack-icon" className="contact-block__list--icon" />
              Join our Slack
          </a>
      </li>
      {/* I don't think we have a contact page for the telepresence.io page
          so let's comment it out for now
      <li>
        <Link to={goToContactUs}>
          <Icon name="mail-icon" className="contact-block__list--icon" />
              Contact Us
          </Link>
      </li>
      */}
    </ul>
  </div>
);

export default ContactBlock;
