import React from 'react';
import url from 'url';

import Link from '../Link';

import BugIcon      from '@src/assets/icons/bug.inline.svg';
import ChangeIcon   from '@src/assets/icons/change.inline.svg';
import TadaIcon     from '@src/assets/icons/tada.inline.svg';
import SecurityIcon from '@src/assets/icons/security.inline.svg';

import styles from './releaseNotes.module.less';

import Markdown from '../../components/Markdown'

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
      <Link
          className={`${styles.note} ${note.docs ? styles.note_withlink : styles.note_withoutlink} ${note.image ? styles.note_withimage : styles.note_withoutimage}`}
          to={note.docs && url.resolve('../', note.docs)}>
        <h3>{typeIcon[note.type]}{title}</h3>
        <Markdown>{note.body}</Markdown>
        {
            note.image && (
                <img src={note.image} alt={title}/>
            )
        }
      </Link>
  );
};

export default Note;
