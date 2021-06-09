import React from 'react';

const RefreshButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        cursor: 'pointer',
        background: '#00c58a',
        color: 'white',
        position: 'fixed',
        left: '1em',
        bottom: '1em',
        zIndex: 1000,
        border: '.25em solid #5f3eff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '.5em .75em',
      }}
      title="Refresh data"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        style={{ height: '1.5em' }}
      >
        <path d="M1 4v6h6M23 20v-6h-6" />
        <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
      </svg>
    </button>
  );
};

export default RefreshButton;
