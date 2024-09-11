import * as React from 'react';

function InterceptAnimationLazy(props: React.JSX.IntrinsicAttributes) {
  const [Component, setComponent] = React.useState(null);
  const [ReactSuspense, setSuspense] = React.useState(null);

  const FallBack = () => <div>Loading...</div>;

  React.useEffect(() => {
    const lazyComp = React.lazy(() => import(`./InterceptsAnimation`));
    setComponent(lazyComp);
    setSuspense(React.Suspense);
  }, []);
  return (
    <>
      {Component && ReactSuspense ? (
        <ReactSuspense fallback={<FallBack />}>
          <Component {...props} />
        </ReactSuspense>
      ) : (
        <FallBack />
      )}
    </>
  );
}

export default InterceptAnimationLazy;
