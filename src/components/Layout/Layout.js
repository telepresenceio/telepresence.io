import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import AnnouncementBar from '../AnnouncementBar';
import isDocLink from '../../utils/isDocLink';
import Link from '../Link';
import { useMigrationPopup, MigrationPopup } from './MigrationPopup';

import './globalHelpers.less';
import './layout.less';
import './docs-layout.less';

// To be used by components that need access to the current page's path
export const LocationContext = React.createContext({});

const Layout = ({ children, location, customAnnouncement }) => {
  const [popupVisible] = useMigrationPopup(location);
  const announcementVisible = false;

  return (
    <LocationContext.Provider value={location}>
      <Helmet>
        <html lang="en" />
      </Helmet>
      {popupVisible && <MigrationPopup />}
      <div
        className={`layout ${
          isDocLink((location || {}).pathname) && `layout__scroll-body`
        }`}
      >
        {announcementVisible && (
          <AnnouncementBar
            content={
              <span>
                Monitor the ongoing outage at{' '}
                <Link to="https://status.getambassador.io">
                  status.getambassador.io
                </Link>
              </span>
            }
          />
        )}
        {customAnnouncement && (
          <AnnouncementBar
            content={customAnnouncement}
            hightlighted={!!announcementVisible}
          />
        )}
        <div className="main-body">{children}</div>
      </div>
    </LocationContext.Provider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
