import React from 'react';

const Loader = () => {
  return (
    <div className="loaderContainer">
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <style jsx>{`
        .loaderContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          z-index: 9999;
        }

        .loader {
          display: flex;
          gap: 8px;
        }

        .loader div {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #6b2ebf;
          animation: bounce 0.5s cubic-bezier(0.19, 0.57, 0.3, 0.98) infinite alternate;
        }

        .loader div:nth-child(2) {
          animation-delay: 0.1s;
        }

        .loader div:nth-child(3) {
          animation-delay: 0.2s;
        }

        @keyframes bounce {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-16px);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;