import React, { useState, useRef, useEffect } from 'react';

import './style.less';

interface IDraggableProps {
  children: JSX.Element;
  itemClassName?: string;
}

const Draggable: React.FC<IDraggableProps> = ({ children, itemClassName }): JSX.Element => {

  const [grabClass, setGrabClass] = useState('cursor-grab');
  const el = useRef<null | HTMLDivElement>(null);
  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const mouseDownHandler = function (e) {
    setGrabClass('cursor-grabbing');

    pos = {
      left: el.current.scrollLeft,
      top: el.current.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    el.current.scrollTop = pos.top - dy;
    el.current.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = function () {
    setGrabClass('cursor-grab');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  useEffect(() => {
    el.current.addEventListener('mousedown', mouseDownHandler);
  }, []);

  return (
    <div ref={el} className={`draggable-element draggable-element__${grabClass} ${itemClassName ? itemClassName : ''}`}>
      {children}
    </div>
  )
};

export default Draggable;