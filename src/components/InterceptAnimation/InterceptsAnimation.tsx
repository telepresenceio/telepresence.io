import * as React from 'react';

import InterceptAnimationSVG from '../../assets/images/intercept-animation.inline.svg';

function Animation(props: React.JSX.IntrinsicAttributes) {
  const el = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const queueAnimation = () => {
      setTimeout(() => {
        el.current?.getAnimations({ subtree: true })?.forEach((anim) => {
          anim.finish();
          anim.play();
        });
        queueAnimation();
      }, 3000);
    };
    queueAnimation();
  }, [el]);
  return (
    <div ref={el}>
      <InterceptAnimationSVG
        {...props}
      />
    </div>
  );
}

export default Animation;
