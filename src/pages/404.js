import React from 'react';
import { Link } from "gatsby";

import EasyLayout from '../components/EasyLayout';

export default function NotFoundPage({ location }) {
  return (
    <EasyLayout title="Not Found" location={location}>
      <main>
        <div
          className="container"
          style={{
            minHeight: '70vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 .5em' }}>NOT FOUND</h1>
            <p>
              We couldn't find this page... maybe you could{' '}
              <Link to="/">go back to the homepage?</Link>
            </p>
          </div>
        </div>
      </main>
    </EasyLayout>
  );
};
