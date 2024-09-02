import * as React from 'react';
import { navigate } from 'gatsby';
import Note from './Note';
import * as styles from './releaseNotes.module.less';

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const Release = ({ release, versions }) => {
  const formattedDate = (() => {
    if (release.date) {
      const [yyyy, mm, dd] = release.date.split('-');
      if (yyyy && mm && dd) {
        return `${month[Number(mm - 1)]} ${dd}, ${yyyy}`;
      }
    }
    return '';
  })();

  const handleViewMore = React.useCallback(
      ({ docs, href }) => {
        if (href) {
          navigate(href);
          return;
        }
        if (docs) {
          if (docs.indexOf('http://') === 0 || docs.indexOf('https://') === 0) {
            window.location = docs;
          }
        }
      },
      []
  );

  return (
    <div className={styles.release}>
      <h2>
        {release.version && (
          <>
            Version {release.version}{' '}
            {formattedDate && (
              <span className={styles.release__date}>({formattedDate})</span>
            )}
          </>
        )}
        {!release.version && formattedDate}
      </h2>
      <div>
        {release.notes.map((note, index) => (
          <Note key={index} note={note} versions={versions} onClick={() => handleViewMore(note)} />
        ))}
      </div>
    </div>
  );
};

export default Release;
