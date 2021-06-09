const docsVersion = (pathname = null) => {
  if (pathname) {
    return pathname.substr(1).split('/')[1];
  }
  return "Version"
};

export default docsVersion;
