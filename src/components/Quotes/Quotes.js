import React, { Component } from 'react';
import classnames from 'classnames';
import Link from '../Link';

import styles from './styles.module.less';

const QUOTES = [
  {
    content: (
      <p>
        "Ambassador is a great productivity tool, and provides a single point of reference for all of our services.
        We’ve also saved a lot of money and complexity since we’ve eliminated many of our ELBs. Ambassador has been
        very stable and robust for our needs."
      </p>
    ),
    author: {
      name: 'Paris Apostolopoulos',
      title: 'Lead Software Engineer',
      company: 'Ticketmaster',
      website: 'https://www.ticketmaster.com'
    }
  },
  {
    content: (
      <p>
        "Ever since the inception of Kubernetes, we’ve witnessed a community of
        ideas coming together and evolving best practices. Ambassador is one of
        the building blocks we adopted and are proud to be contributing to."
      </p>
    ),
    author: {
      name: 'Alexandre Gervais',
      title: 'Staff Software Engineer',
      company: 'AppDirect',
      website: 'https://www.appdirect.com'
    }
  },
  {
    content: (
      <p>"Regarding Ambassador, all I hear around our company is pure joy."</p>
    ),
    author: {
      name: 'Carlos Yakimov',
      title: 'Solutions Architect',
      company: 'Falabella',
      website: 'https://www.falabella.com'
    }
  },
  {
    content: (
      <p>
        "Ambassador provides a simple, decentralized way of managing Envoy files through annotations which allows us to declare
        the state of the routing tier directly to code and simplify the dev-ops process"
      </p>
    ),
    author: {
      name: 'Christopher Lane',
      title: 'Enterprise Architect',
      company: 'Chick-Fil-A',
      website: 'https://www.chick-fil-a.com'
    }
  }
];

export default class Quotes extends Component {
  constructor() {
    super();
    this.state = {
      currentIdx: 0,
    };
  }

  prev = () => {
    this.setState({
      currentIdx:
        this.state.currentIdx <= 0
          ? QUOTES.length - 1
          : this.state.currentIdx - 1,
    });
  };

  next = () => {
    this.setState({
      currentIdx:
        this.state.currentIdx >= QUOTES.length - 1
          ? 0
          : this.state.currentIdx + 1,
    });
  };

  render() {
    return (
      <div
        className={styles.Quotes}
      >
        {
          this.props.showLogos &&
          <div className={styles.Logos}>
            <img alt="Nvidia" src="/images/home/logos/nvidia-logo.png" />
            <img alt="App Direct" src="/images/home/logos/app-direct-logo.png" />
            <img alt="Microsoft" src="/images/home/logos/microsoft-logo.png" />
            <img alt="PTC" src="/images/home/logos/ptc-logo.png" />
            <img alt="Ticketmaster" src="/images/home/logos/ticketmaster-logo.png" />
            <img alt="Chick Fil A" src="/images/home/logos/chick-fil-a-logo.png" />
          </div>
        }

        <div className={styles.QuoteSlider}>
          <button
            onClick={() => this.prev()}
            className={classnames(styles.Arrow, styles.Prev)}
            aria-label="Previous"
          >
            Previous
          </button>
          <div>
            {QUOTES.map((quote, i) => (
              <div
                key={i}
                className={classnames(
                  styles.Quote,
                  this.state.currentIdx === i && styles.Active,
                )}
              >
                <div className={styles.Content}>
                  {quote.content}
                  <p className={styles.Name}>{quote.author.name}</p>
                  <span className={styles.Title}>{quote.author.title}, <Link to={quote.author.website}>{quote.author.company}</Link></span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => this.next()}
            className={classnames(styles.Arrow, styles.Next)}
            aria-label="Next"
          >
            Previous
          </button>
        </div>
      </div>
    );
  }
}

Quotes.defaultProps = {
  showLogos: true
};
