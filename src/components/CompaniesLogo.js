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
        <div className="logos-single-row">
          <div className="logo-item-single">
            <img src={logo1} alt="Samsung" />
          </div>
          <div className="logo-item-single">
            <img src={logo2} alt="Cisco" />
          </div>
          <div className="logo-item-single">
            <img src={logo3} alt="Vimeo" />
          </div>
          <div className="logo-item-single">
            <img src={logo4} alt="P&G" />
          </div>
          <div className="logo-item-single">
            <img src={logo5} alt="Hewlett Packard Enterprise" />
          </div>
          <div className="logo-item-single">
            <img src={logo6} alt="Citi" />
          </div>
          <div className="logo-item-single">
            <img src={logo7} alt="Ericsson" />
          </div>
        </div>
        
        <p className="companies-label">
          Trusted by over 17,000 companies and millions of learners around the world
        </p>
      </div>
    </div>
  );
};

export default CompaniesLogo;