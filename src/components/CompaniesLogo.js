// src/components/CompaniesLogo.js
import React from 'react';
import './CompaniesLogo.css';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import logo3 from '../assets/logo3.png';
import logo4 from '../assets/logo4.png';
import logo5 from '../assets/logo5.png';
import logo6 from '../assets/logo6.png';
import logo7 from '../assets/logo7.png';

const CompaniesLogo = () => {
  // CSS styles can be moved to CSS file or kept as inline if dynamic
  const logoContainerStyle = {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '140px',
    padding: '0 2px',
    minWidth: '0',
    maxWidth: '200px'
  };

  const logoImageStyle = {
    width: 'auto',
    height: '120px',
    maxWidth: '100%',
    objectFit: 'contain'
  };

  const logosRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto 30px',
    padding: '20px 0',
    gap: '0'
  };

  return (
    <div className="logos-reviews-section">
      <div className="section-header">
        <h2 className="trusted-section-title">
          <i>Trusted by Industry Leaders</i>
        </h2>
        <p className="trusted-section-subtitle">
          Join thousands of professionals and companies who have transformed their careers with iTechSkill
        </p>
      </div>

      <div className="logos-single-row-container">
        <div className="logos-single-row" style={logosRowStyle}>
          <div style={logoContainerStyle}>
            <img src={logo1} alt="Samsung" style={logoImageStyle} />
          </div>
          <div style={logoContainerStyle}>
            <img src={logo2} alt="Cisco" style={logoImageStyle} />
          </div>
          <div style={logoContainerStyle}>
            <img src={logo3} alt="Vimeo" style={logoImageStyle} />
          </div>
          <div style={logoContainerStyle}>
            <img src={logo4} alt="P&G" style={logoImageStyle} />
          </div>
          <div style={logoContainerStyle}>
            <img src={logo5} alt="Hewlett Packard Enterprise" style={logoImageStyle} />
          </div>
          <div style={logoContainerStyle}>
            <img src={logo6} alt="Citi" style={logoImageStyle} />
          </div>
          <div style={logoContainerStyle}>
            <img src={logo7} alt="Ericsson" style={logoImageStyle} />
          </div>
        </div>
        
        <div className="companies-label">
          Trusted by over 17,000 companies and millions of learners around the world
        </div>
      </div>
    </div>
  );
};

export default CompaniesLogo;