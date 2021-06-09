import React from 'react';
import { LocationContext } from '../components/Layout/Layout';

export const GH_URL = 'https://github.com/datawire/ambassador/';

const BASE_URL_NO_TRAIL = 'https://www.getambassador.io';
export const BASE_URL = BASE_URL_NO_TRAIL + '/';

export const EDITIONS_URL = BASE_URL + 'editions/';

export function removeDoubleSlashes(str) {
  return str.replace(/\/{2,}/g, '/');
}

export function getPathFromSlug(str) {
  return removeDoubleSlashes(`/${str}/`);
}

export function usePageUrl() {
  const location = React.useContext(LocationContext);
  if (!location || !location.pathname) {
    return;
  }
  return BASE_URL_NO_TRAIL + removeDoubleSlashes(`/${location.pathname}/`);
}

export function isAbsUrl(url) {
  return url.startsWith('http') || url.startsWith('mailto');
}

export function relativeToAbsUrl(path) {
  // Make sure we're dealing with a path
  if (isAbsUrl(path)) {
    // If it's an URL, then we return it as is to prevent breaking it
    return path;
  } else return BASE_URL_NO_TRAIL + removeDoubleSlashes(`/${path}/`);
}
