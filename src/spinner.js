import React from 'react';
import styled from 'styled-components';

const Spinner = () => {
  return (
    <Wrapper>
      <div className="spinner">
        {[...Array(8)].map((_, i) => (
          <span key={i} style={{ left: `${10 * (8 - i)}px`, animationDelay: `${0.125 * (i + 1)}s` }} />
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0d1b2a;

  .spinner {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .spinner span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 35px;
    height: 7px;
    background: #ffffff;
    animation: dominos 1s ease infinite;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  }

  @keyframes dominos {
    50% {
      opacity: 0.7;
    }

    75% {
      transform: rotate(90deg);
    }

    80% {
      opacity: 1;
    }
  }
`;

export default Spinner;
