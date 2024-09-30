import React, { Suspense } from 'react';

function InterceptAnimationLazy(props: React.JSX.IntrinsicAttributes) {
  const FallBack = () => <div>Loading...</div>;
  const LazyComp = React.lazy(() => import(`./InterceptsAnimation`));

  return (
    <>
      <Suspense fallback={<FallBack />}>
        <LazyComp {...props} />
      </Suspense>
    </>
  );
}
export default InterceptAnimationLazy;
