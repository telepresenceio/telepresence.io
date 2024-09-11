import React from 'react';

const Placeholder = () => null;
const LazyCodeBlock = (props) => {
  const [Component, setComponent] = React.useState(() => Placeholder);
  React.useEffect(() => {
    let cancelled = false
    import('./CodeBlock').then((Thing) => {
      if (!cancelled) {
        setComponent(() => Thing.default)
      }
    });
    return () => {
      cancelled = true
    }
  }, []);
  return <Component {...props} />;
};
export default LazyCodeBlock;
