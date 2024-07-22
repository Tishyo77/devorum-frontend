import React from 'react';
import './Landing.css'; 
import Collab1 from '../assets/Collab1.jpg';
import Collab2 from '../assets/Collab2.jpg';
import Collab3 from '../assets/Collab3.jpg';
import Collab4 from '../assets/Collab4.jpg';
import Logo from '../assets/Logo.png';
import HeartIcon from '../assets/Connect.png'; 
import StarIcon from '../assets/Collaborate.png'; 
import ClockIcon from '../assets/Create.png';  
import ConnectIcon from '../assets/Connect.png'; 
import CollaborateIcon from '../assets/Collaborate.png'; 
import CreateIcon from '../assets/Create.png'; 

const Landing = () => {
  return (
    <div className="landing">
      <div className="navbar">
        <div className="logo">
          <img src={Logo} alt="Devorum Logo" className="logo-img" />
        </div>
        <div className="nav-links">
          <button className="login-button">Login</button>
          <button className="signup-button">Sign Up</button>
        </div>
      </div>
      <div className="landing-top">
        <header className="header">
          <h1>Connect. Collaborate.<br />Create.</h1>
          <p>Discover Devorum, your platform for effortless collaboration on exciting projects. Whether you're a developer, designer, or creator, connect with like-minded peers to bring ideas to life. Join us to explore new opportunities, build your network, and achieve your goals together. Start your journey with Devorum and elevate your projects today.</p>
          <button className="get-started">Get started</button>
        </header>
        
        <div className="right-columns">
          <section className="stats">
            <div className="stat-item">
              <img src={HeartIcon} alt="Heart Icon" className="stat-icon" />
              <div className="stat-text">
                <h3 className="number">500+</h3>
                <p>Discover and join over 500 diverse projects in various fields and industries.</p>
              </div>
            </div>
            <div className="stat-item">
              <img src={StarIcon} alt="Star Icon" className="stat-icon" />
              <div className="stat-text">
                <h3 className="number">10+</h3>
                <p>Find the perfect collaborator using over 10 detailed search criteria.</p>
              </div>
            </div>
            <div className="stat-item">
              <img src={ClockIcon} alt="Clock Icon" className="stat-icon" />
              <div className="stat-text">
                <h3 className="number">200+</h3>
                <p>Connect with a vibrant community of over 200 active and passionate collaborators.</p>
              </div>
            </div>
          </section>
          
          <section className="titles">
            <div className="title-item">
              <img src={ConnectIcon} alt="Connect Icon" className="title-icon" />
              <div className="title-text">
                <h3>Connect</h3>
                <p>Easily find and connect with like-minded individuals and collaborators.</p>
              </div>
            </div>
            <div className="title-item">
              <img src={CollaborateIcon} alt="Collaborate Icon" className="title-icon" />
              <div className="title-text">
                <h3>Collaborate</h3>
                <p>Share ideas, resources, and work together seamlessly in real-time.</p>
              </div>
            </div>
            <div className="title-item">
              <img src={CreateIcon} alt="Create Icon" className="title-icon" />
              <div className="title-text">
                <h3>Create</h3>
                <p>Turn your ideas into reality with Devorum's tools and community support.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <section className="features">
        <div className="feature-item">
          <img src={Collab1} alt="Collab Pic 1" className="collab-img-first" />
        </div>
        <div className="feature-item">
          <img src={Collab2} alt="Collab Pic 2" className="collab-img" />
        </div>
        
        <div className="feature-item">
          <img src={Collab4} alt="Collab Pic 4" className="collab-img-last" />
        </div>
      </section>
    </div>
  );
};

export default Landing;
