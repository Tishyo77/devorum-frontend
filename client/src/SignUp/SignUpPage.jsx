import React, { useState } from 'react';
import SignUpPart1 from './SignUpPart1';
import SignUpPart2 from './SignUpPart2';
import SignUpPart3 from './SignUpPart3';
import Logo from '../assets/Logo.png';
import './SignUpPage.css';

const SignUpPage = () => {
  const [part, setPart] = useState(1);

  const nextPart = () => {
    setPart(part + 1);
  };

  const skipPart = () => {
    setPart(part + 1);
  };

  return (
    <div className="signup-page">
        <div className="navbar">
            <div className="logo">
                <img src={Logo} alt="Devorum Logo" className="logo-img" />
            </div>
        </div>
        <h2>Sign Up and start creating now!</h2>
        <div className="signup-container">
            {part === 1 && <SignUpPart1 nextPart={nextPart} />}
            {part === 2 && <SignUpPart2 nextPart={nextPart} skipPart={skipPart} />}
            {part === 3 && <SignUpPart3 />}
        </div>
    </div>
  );
};

export default SignUpPage;
