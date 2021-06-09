const isDocLink = (pathname = null) => {
  if (pathname) {
    const root = pathname.substr(1).split('/')[0];
    return (
      root === 'docs' ||
      root === 'about' ||
      root === 'concepts' ||
      root === 'user-guide' ||
      root === 'reference'
    );
  }
  return false;
};

export default isDocLink;
