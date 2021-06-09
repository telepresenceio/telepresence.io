import React from 'react';

export function textToParagraphs(str) {
  return (
    str &&
    str.split('\n').map((paragraph, i) => <p key={`p-${i}`}>{paragraph}</p>)
  );
}

export function capitalizeStr(str) {
  const lowercased = str.toLowerCase().split(' ');
  return lowercased
    .map((str) => str?.[0]?.toUpperCase() + str?.slice(1))
    .join(' ');
}
