import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  // State for mobile dropdowns
  const [openCategories, setOpenCategories] = useState({});

  // Toggle dropdown for mobile
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Skills categories data
  const skillsCategories = [
    {
      id: 'in-demand-careers',
      title: 'In-demand Careers',
      items: ['Data Scientist', 'Full Stack Web Developer', 'Cloud Engineer', 'Project Manager', 'Game Developer', 'All Career Accelerators']
    },
    {
      id: 'web-development',
      title: 'Web Development',
      items: ['WordPress Development', 'WordPress Theme Development', 'WordPress Plugin Development', 'WooCommerce Development', 'PHP for WordPress', 'Elementor Page Builder']
    },
    {
      id: 'it-certifications',
      title: 'IT Certifications',
      items: ['Amazon AWS', 'AWS Certified Cloud Practitioner', 'AZ-900: Microsoft Azure Fundamentals', 'AWS Certified Solutions Architect - Associate', 'Kubernetes']
    },
    {
      id: 'leadership',
      title: 'Leadership',
      items: ['Leadership', 'Management Skills', 'Project Management', 'Personal Productivity', 'Emotional Intelligence']
    },
    {
      id: 'certifications-by-skill',
      title: 'Certifications by Skill',
      items: ['Cybersecurity Certification', 'Project Management Certification', 'Cloud Certification', 'Data Analytics Certification', 'HR Management Certification', 'See all Certifications']
    },
    {
      id: 'data-science',
      title: 'Data Science',
      items: ['Data Science', 'Python', 'Machine Learning', 'ChatGPT', 'Deep Learning']
    },
    {
      id: 'communication',
      title: 'Communication',
      items: ['Communication Skills', 'Presentation Skills', 'Public Speaking', 'Writing', 'PowerPoint']
    },
    {
      id: 'business-analytics',
      title: 'Business Analytics & Intelligence',
      items: ['Microsoft Excel', 'SQL', 'Microsoft Power BI', 'Data Analysis', 'Business Analysis']
    }
  ];

  return (
    <footer className="footer">
      {/* NEW SECTION - Skills & Certifications */}
      <div className="footer-skills-section">
        <h2 className="skills-maain-title">Explore top skills and certifications</h2>
        
        <div className="skills-grid">
          {skillsCategories.map((category) => (
            <div className="skills-category" key={category.id}>
              {/* Desktop View - Always open */}
              <h3 className="category-title desktop-view">{category.title}</h3>
              
              {/* Mobile View - Collapsible */}
              <div 
                className="mobile-category-header" 
                onClick={() => toggleCategory(category.id)}
              >
                <h3 className="category-title mobile-view">{category.title}</h3>
                <span className="dropdown-arrow">
                  {openCategories[category.id] ? '−' : '+'}
                </span>
              </div>
              
              {/* Desktop Links */}
              <ul className="category-links desktop-view">
                {category.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              {/* Mobile Links - Collapsible */}
              <ul className={`category-links mobile-view ${openCategories[category.id] ? 'open' : ''}`}>
                {category.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-copyright">
        <p>© 2026 iTechSkill. All rights reserved.</p>
        <p className="footer-tagline">Empowering the next generation of tech professionals</p>
      </div>
      
      <div className="footer-links">
        <div className="company-section">
          <h3 className="company-title">Company</h3>
          <ul className="company-links">
            <li><Link to="/AboutUs">About Us</Link></li>
            <li><Link to="/Careers">Careers</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            <li>Blogs</li>
          </ul>
        </div>
        
        <div className="learning-section">
          <h3 className="learning-title">Learning</h3>
          <ul className="learning-links">
            <li><Link to="/All_Courses">All Courses</Link></li>
            <li><Link to="/Categories">Categories</Link></li>
            <li><Link to="/Certification">Certifications</Link></li>
          </ul>
        </div>
        
        <div className="support-section">
          <div 
            className="support-title"
            style={{
              display: 'block',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '20px',
              textAlign:'left',
            }}
          >
            Support
          </div>
          <ul className="support-links">
            <li><Link to="/HelpCenter">Help Center</Link></li>
            <li><Link to="/FAQ">FAQ</Link></li>
            <li><Link to="/Terms">Terms</Link></li>
            <li><Link to="/Privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;