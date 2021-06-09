import React from 'react';
import HubspotForm from 'react-hubspot-form';
import GatsbyImage from 'gatsby-image';

import styles from './styles.module.less';
import RichText from '../RichText/RichText';
import { getFixedProps } from '../../utils/sanity';
import { PORTAL_ID } from '../../utils/hubspot';
import { YoutubeVideo } from '../YoutubeVideo/YoutubeVideo';

function parseUTC(date) {
  // To prevent affecting the original date object, we create a new one
  return new Date(date).toLocaleTimeString('en', {
    timeZone: 'UTC',
    timeZoneName: 'short',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });
}

const AVAILABLE_LABEL = 'Watch now on demand';

export default ({
  meta,
  speakers = [],
  description,
  hubspotFormId,
  videoUrl,
}) => {
  // Single date is deprecated
  const dates = (meta.dates || []).map((d) => new Date(d));
  const now = new Date(Date.now());
  // If we don't find any date that is in the future (d > now), then the webinar is already available and on demand
  const isAvailable = !dates.find((d) => d > now);
  // Before loading, show only the UTC time, as the server has this timezone
  // If the webinar is already available, then there's no need to show the date, just the available label
  const [formattedDates, setDates] = React.useState(
    isAvailable
      ? [AVAILABLE_LABEL]
      : dates.map((d) =>
          d.toLocaleDateString('en', {
            timeZone: 'UTC',
            timeZoneName: 'short',
            weekday: 'long',
            month: 'long',
            hour12: true,
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        ),
  );
  const [shouldShowUTC, showUTC] = React.useState(false);

  // And when the component mounts, update to the user's timezone
  React.useEffect(
    () => {
      // If the webinar is in the future, update the date, else leave it be
      if (!isAvailable) {
        setDates(
          dates.map((d) =>
            d.toLocaleDateString('en', {
              weekday: 'long',
              month: 'long',
              hour12: true,
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          ),
        );
        showUTC(true);
      }
    },
    /*eslint-disable */
    [isAvailable],
    /*eslint-enable */
  );
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>{meta.title}</h1>
          {description && <RichText blocks={description} />}
          <p className={styles.date}>
            {formattedDates.map((d, i) => (
              <div key={`date-${i}`}>
                {d}
                {shouldShowUTC && (
                  <span style={{ fontWeight: 400 }}> ({parseUTC(d)})</span>
                )}
              </div>
            ))}{' '}
          </p>
          <div>
            {speakers.map((speaker) => (
              <div key={speaker.name} className={styles.speaker}>
                {speaker.image && speaker.image.asset && (
                  <GatsbyImage
                    alt={`${speaker.name}'s photo`}
                    fixed={
                      speaker.image.asset.fixed ||
                      getFixedProps(
                        { assetId: speaker.image.asset._ref },
                        {
                          width: 100,
                          height: 100,
                        },
                      )
                    }
                  />
                )}
                <div className={styles.speakerInfo}>
                  <div>{speaker.name}</div>
                  {speaker.role && <div>{speaker.role}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {videoUrl ? (
          <div className={styles.video}>
            <YoutubeVideo url={videoUrl} />
          </div>
        ) : (
          <div className={styles.form}>
            <HubspotForm
              portalId={PORTAL_ID}
              formId={hubspotFormId}
              loading={'Loading form...'}
              css=""
            />
          </div>
        )}
      </div>
    </section>
  );
};
