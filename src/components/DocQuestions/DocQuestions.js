import React from 'react'

import { Link } from 'gatsby';

import classNames from 'classnames';

import styles from './styles.module.less'

import SlackIcon from '../../../static/images/documentation/slack-icon.inline.svg';
import MailIcon from '../../../static/images/documentation/mail-icon.inline.svg';

import {
    goToSlack, goToContactUs
} from '../../utils/routes';

const DocQuestions = ({ page, branch }) => (
    <section className={styles.docQuestions}>
        <span className={styles.docQuestions__headingSecondary}>Questions?</span>
        <p>We’re here to help if you have questions.</p>

        <ul className={classNames('module', styles.docQuestions__contactList)}>
            <li><a href={goToSlack} title="Join our Slack"><SlackIcon className={styles.docQuestions__contactListIcon} />Join our Slack</a></li>
            <li><Link to={goToContactUs} title="Contact Us"><MailIcon className={styles.docQuestions__contactListIcon} />Contact Us</Link></li>
        </ul>
    </section>
);

export default DocQuestions
