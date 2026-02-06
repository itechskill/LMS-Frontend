import React from 'react';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      {/* NEW SECTION - Skills & Certifications */}
      <div className="footer-skills-section">
        <h2 className="skills-maain-title">Explore top skills and certifications</h2>
        
        <div className="skills-grid">
          {/* In-demand Careers */}
          <div className="skills-category">
            <h3 className="category-title">In-demand Careers</h3>
            <ul className="category-links">
              <li>Data Scientist</li>
              <li>Full Stack Web Developer</li>
              <li>Cloud Engineer</li>
              <li>Project Manager</li>
              <li>Game Developer</li>
              <li>All Career Accelerators</li>
            </ul>
          </div>
{/* WordPress Development */}
<div className="skills-category">
  <h3 className="category-title">Web Development</h3>
  <ul className="category-links">
    <li>WordPress Development</li>
    <li>WordPress Theme Development</li>
    <li>WordPress Plugin Development</li>
    <li>WooCommerce Development</li>
    <li>PHP for WordPress</li>
    <li>Elementor Page Builde</li>
  </ul>
</div>

          {/* IT Certifications */}
          <div className="skills-category">
            <h3 className="category-title">IT Certifications</h3>
            <ul className="category-links">
              <li>Amazon AWS</li>
              <li>AWS Certified Cloud Practitioner</li>
              <li>AZ-900: Microsoft Azure Fundamentals</li>
              <li>AWS Certified Solutions Architect - Associate</li>
              <li>Kubernetes</li>
            </ul>
          </div>

          {/* Leadership */}
          <div className="skills-category">
            <h3 className="category-title">Leadership</h3>
            <ul className="category-links">
              <li>Leadership</li>
              <li>Management Skills</li>
              <li>Project Management</li>
              <li>Personal Productivity</li>
              <li>Emotional Intelligence</li>
            </ul>
          </div>

          {/* Certifications by Skill */}
          <div className="skills-category">
            <h3 className="category-title">Certifications by Skill</h3>
            <ul className="category-links">
              <li>Cybersecurity Certification</li>
              <li>Project Management Certification</li>
              <li>Cloud Certification</li>
              <li>Data Analytics Certification</li>
              <li>HR Management Certification</li>
              <li>See all Certifications</li>
            </ul>
          </div>

          {/* Data Science */}
          <div className="skills-category">
            <h3 className="category-title">Data Science</h3>
            <ul className="category-links">
              <li>Data Science</li>
              <li>Python</li>
              <li>Machine Learning</li>
              <li>ChatGPT</li>
              <li>Deep Learning</li>
            </ul>
          </div>

          {/* Communication */}
          <div className="skills-category">
            <h3 className="category-title">Communication</h3>
            <ul className="category-links">
              <li>Communication Skills</li>
              <li>Presentation Skills</li>
              <li>Public Speaking</li>
              <li>Writing</li>
              <li>PowerPoint</li>
            </ul>
          </div>

          {/* Business Analytics & Intelligence */}
          <div className="skills-category">
            <h3 className="category-title">Business Analytics & Intelligence</h3>
            <ul className="category-links">
              <li>Microsoft Excel</li>
              <li>SQL</li>
              <li>Microsoft Power BI</li>
              <li>Data Analysis</li>
              <li>Business Analysis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* EXISTING FOOTER CONTENT */}
      <div className="footer-copyright">
        <p>© 2025 iTechSkill. All rights reserved.</p>
        <p className="footer-tagline">Empowering the next generation of tech professionals</p>
      </div>
      
      <div className="footer-links">
        <div className="company-section">
          <p className="company-title">Company</p>
          <ul className="company-links">
            <li>About Us</li>
            <li>Careers</li>
            <li>Contact</li>
            <li>Blog</li>
          </ul>
        </div>
        
        <div className="learning-section">
          <p className="learning-title">Learning</p>
          <ul className="learning-links">
            <li>All Courses</li>
            <li>Instructors</li>
            <li>Categories</li>
            <li>Certifications</li>
          </ul>
        </div>
        
        <div className="support-section">
          <p className="support-title">Support</p>
          <ul className="support-links">
            <li>Help Center</li>
            <li>FAQ</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
       
      </div>
    </footer>
  );
};

export default Footer;
