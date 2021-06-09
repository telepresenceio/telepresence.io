module.exports = (pathname = null) => {
  if (pathname) {
    const root = pathname.substr(1).split('/')[0];
    return (
      root === 'tutorials'
    );
  }
  return false;
};
