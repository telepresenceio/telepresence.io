import { useLocation } from '@reach/router';
import * as React from 'react';
import BugIcon      from '@src/assets/icons/bug.inline.svg';
import ChangeIcon   from '@src/assets/icons/change.inline.svg';
import TadaIcon     from '@src/assets/icons/tada.inline.svg';
import SecurityIcon from '@src/assets/icons/security.inline.svg';

import * as styles from './releaseNotes.module.less';

const titlePrefix = {
  bugfix: 'Bug Fix',
  change: 'Change',
  feature: 'Feature',
  security: 'Security Update',
};

const typeIcon = {
  bugfix: <BugIcon className={styles.note__typeIcon}/>,
  change: <ChangeIcon className={styles.note__typeIcon}/>,
  feature: <TadaIcon className={styles.note__typeIcon}/>,
  security: <SecurityIcon className={styles.note__typeIcon}/>,
};

// Given a content string and a dict of variables, expand $variables$ in the string.
//
// https://github.com/gatsbyjs/gatsby/issues/10174#issuecomment-442513501
const template = (content, vars) => {
    if (content === null || vars === null) {
        return '';
    }
    return content.replace(/\$(\S+)\$/g, (match, key) => {
        const value = vars[key];
        if (typeof value !== 'undefined') {
            return value;
        }
        return match; // guards against some unintentional prefix
    });
}

const Note = ({ note, versions, onClick }) => {
  const { pathname } = useLocation();
  const title = (titlePrefix[note.type] ? `${titlePrefix[note.type]}: ` : ``) + note.title;
  const imgSrc = note?.image?.startsWith('.') ? `${pathname}/${note.image}` : note.image;

  return (
      <div className={styles.note}>
          <div className={styles.note__description}>
          <h3
              className={
                  note.docs || note.href
                      ? styles.note__title
                      : styles.note__title_no_link
              }
              onClick={onClick}
          >
              {typeIcon[note.type]}
              <span>{title}</span>
          </h3>
          <div
              className={styles.note__body}
              dangerouslySetInnerHTML={{__html: template(note.body, versions)}}
          />
          </div>
          {note.image && (
              <div className={styles.note__image}>
                  <img
                      src={imgSrc}
                      alt={note.title}
                      height="172"
                      width="207"
                      loading="lazy"
                  />
              </div>
          )}
      </div>
  );
};

export default Note;
