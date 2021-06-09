import React from 'react';
import { Link } from 'gatsby';
import url from 'url';

import BugIcon      from '@src/assets/icons/bug.inline.svg';
import ChangeIcon   from '@src/assets/icons/change.inline.svg';
import TadaIcon     from '@src/assets/icons/tada.inline.svg';
import SecurityIcon from '@src/assets/icons/security.inline.svg';

import styles from './releaseNotes.module.less';

const titlePrefix = {
  bugfix: 'Bug Fix',
  change: 'Change',
  feature: 'Feature',
  security: 'Security Update',
};

const typeIcon = {
  bugfix: <BugIcon/>,
  change: <ChangeIcon/>,
  feature: <TadaIcon/>,
  security: <SecurityIcon/>,
};

const Note = ({ note }) => {
  const title = (titlePrefix[note.type] ? `${titlePrefix[note.type]}: ` : ``) + note.title;

  return (
    <Link to={note.docs && url.resolve('../', note.docs)} className={styles.note}>
      <div className={styles.note__description}>
        <h3 className={styles.note__title}>
          {typeIcon[note.type]}
          <span>{title}</span>
        </h3>
        <div
          className={styles.note__body}
          dangerouslySetInnerHTML={{ __html: note.body }}
        />
        {note.image && (
          <div className={styles.note__image_xs}>
            <img src={note.image} alt={title} height="172" width="207" />
          </div>
        )}
      </div>
      {note.image && (
        <div className={styles.note__image}>
          <img src={note.image} alt={title} height="172" width="207" />
        </div>
      )}
    </Link>
  );
};

export default Note;
