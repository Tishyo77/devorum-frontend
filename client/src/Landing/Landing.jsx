import React from 'react';
import './Landing.css'; 
import { useNavigate } from 'react-router-dom';
import Art from '../assets/Art.png';
import Logo from '../assets/Logo.png';
import Instagram from '../assets/Instagram.png';
import Facebook from '../assets/Facebook.png';
import Twitter from '../assets/Twitter.png';

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="landing-page">
      <div className="white-section">
        <div className="logo">
          <img src={Logo} alt="Devorum Logo" />
        </div>

        <div className="social-icons">
          <img src={Twitter} alt="Twitter" className="social-icon" />
          <img src={Instagram} alt="Instagram" className="social-icon" />
          <img src={Facebook} alt="Facebook" className="social-icon" />
        </div>
      </div>

      <div className="gradient-section">
        <div className="image-section">
          <img src={Art} alt="collaboration" />
        </div>

        <div className="text-section">
          <h1>CONNECT. COLLABORATE. CREATE.</h1>
          <p>
            Discover Devorum, your platform for effortless collaboration on exciting projects. Whether you're a developer, designer, or creator, connect with like-minded peers to bring ideas to life. Join us to explore new opportunities, build your network, and achieve your goals together. Start your journey with Devorum and elevate your projects today.
          </p>
          <div className="buttons">
            <button className="signup-btn" onClick={() => navigate('/signup')}>Signup</button>
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>

      <div className="black-section">
        <p>&copy; 2024 Devorum. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Landing;
