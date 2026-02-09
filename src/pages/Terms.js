
import React from 'react';
import './Terms.css';
import { FaFileContract, FaUserGraduate, FaCreditCard, FaCertificate, FaUsers, FaShieldAlt, FaExclamationTriangle, FaEnvelope, FaCheckCircle, FaBook, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Terms = () => {
   useScrollToTop();
  const sections = [
    {
      id: 1,
      title: "Use of Platform",
      icon: <FaBook />,
      items: [
        "The use of iTechSkill material must be personal and educational",
        "Users cannot reproduce, distribute, or trade course materials",
        "Account sharing is not allowed strictly",
        "One account per individual user",
        "No commercial use without written permission",
        "Compliance with copyright laws",
        "Respect intellectual property rights"
      ],
      colorClass: "terms-section-general"
    },
    {
      id: 2,
      title: "Course Enrollment & Payments",
      icon: <FaCreditCard />,
      items: [
        "All fees must be paid to access courses",
        "Prices are subject to change without notice",
        "Refund policies apply as per enrollment terms",
        "Payment must be completed before course access",
        "Subscription renewals are automatic unless cancelled",
        "No refunds for digital products after access",
        "Payment disputes may result in account suspension"
      ],
      colorClass: "terms-section-enrollment"
    },
    {
      id: 3,
      title: "Certificates",
      icon: <FaCertificate />,
      items: [
        "Issuance requires course completion",
        "Presentation and delivery of all projects",
        "Meeting all course requirements and assessments",
        "Certificate verification available to employers",
        "Digital certificates issued within 14 business days",
        "Certificate authenticity can be verified online",
        "Replacement certificates may incur fees"
      ],
      colorClass: "terms-section-certification"
    },
    {
      id: 4,
      title: "User Conduct",
      icon: <FaUsers />,
      items: [
        "Respect teachers and fellow students",
        "Avoid misuse of the platform",
        "Maintain ethical and professional behavior",
        "No harassment or discriminatory behavior",
        "Follow community guidelines in discussions",
        "Report technical issues promptly",
        "Provide constructive feedback"
      ],
      colorClass: "terms-section-support"
    },
    {
      id: 5,
      title: "Limitation of Liability",
      icon: <FaShieldAlt />,
      items: [
        "iTechSkill is not liable for individual career outcomes",
        "Not responsible for technical issues beyond our control",
        "No guarantee of employment or specific salary outcomes",
        "Platform availability may vary due to maintenance",
        "Third-party service disruptions not covered",
        "User responsibility for device and internet connectivity",
        "Disclaimer for course content accuracy"
      ],
      colorClass: "terms-section-privacy"
    },
    {
      id: 6,
      title: "Changes to Terms",
      icon: <FaExclamationTriangle />,
      items: [
        "We reserve the right to change these Terms",
        "Continued use implies acceptance of updates",
        "Users will be notified of significant changes",
        "30-day notice for major policy changes",
        "Review Terms periodically for updates",
        "Archived versions available upon request",
        "Jurisdiction and governing law clauses"
      ],
      colorClass: "terms-section-contact"
    }
  ];

  const importantPoints = [
    {
      icon: <FaUserGraduate />,
      title: "Educational Use Only",
      description: "All materials are for personal learning and development",
      colorClass: "terms-point-general"
    },
    {
      icon: <FaCheckCircle />,
      title: "Complete Requirements",
      description: "Certificates require full course completion",
      colorClass: "terms-point-certification"
    },
    {
      icon: <FaFileContract />,
      title: "Binding Agreement",
      description: "Using our platform means you accept these terms",
      colorClass: "terms-point-payment"
    },
    {
      icon: <FaEnvelope />,
      title: "Stay Updated",
      description: "Check for term updates regularly",
      colorClass: "terms-point-support"
    }
  ];

  return (
    <div className="terms-page-container">
      {/* Hero Section */}
      <div className="terms-hero-section">
        <div className="terms-hero-content">
          <div className="terms-hero-header">
            <FaFileContract className="terms-hero-icon" />
            <h1 className="terms-hero-title">Terms & Conditions</h1>
          </div>
          <p className="terms-hero-description">
            By utilizing iTechSkill.com, you consent to abide by the following Terms and Conditions. 
            Please read them carefully before enrolling in any course.
          </p>
              </div>
      </div>

      {/* Important Notice */}
      <div className="terms-notice-section">
        <div className="terms-notice-icon">
          <FaExclamationTriangle />
        </div>
        <div className="terms-notice-text">
          <h3>Important Notice</h3>
          <p>
            These Terms & Conditions constitute a legally binding agreement between you and iTechSkill. 
            By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      {/* Key Points */}
      <div className="terms-key-points-section">
        <h2 className="terms-section-title">Key Points to Remember</h2>
        <div className="terms-points-grid">
          {importantPoints.map((point, index) => (
            <div key={index} className="terms-point-card">
              <div className={`terms-point-icon ${point.colorClass}`}>
                {point.icon}
              </div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Terms Sections */}
      <div className="terms-sections-container">
        {sections.map(section => (
          <div key={section.id} className="terms-content-section">
            <div className={`terms-content-header ${section.colorClass}`}>
              <div className="terms-content-icon">
                {section.icon}
              </div>
              <h2 className="terms-content-title">{section.title}</h2>
            </div>
            <div className="terms-section-content">
              <ul className="terms-section-list">
                {section.items.map((item, index) => (
                  <li key={index} className="terms-list-item">
                    <FaCheckCircle className="terms-list-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

    {/* Contact Section */}
<div className="terms-contact-section">
  <div className="terms-contact-content">
    <div className="terms-contact-header">
      <FaEnvelope className="terms-contact-header-icon" />
      <h2 className="terms-contact-title">Questions About Our Terms?</h2>
    </div>
    <p className="terms-contact-description">
      If you have any questions or concerns regarding our Terms & Conditions, 
      please don't hesitate to reach out to our legal team.
    </p>
    <div className="terms-contact-actions">
      <a href="mailto:itechskill6@gmail.com" className="terms-contact-btn">
        <FaEnvelope />
        Email Us: itechskill6@gmail.com
      </a>
      <button 
        className="terms-download-btn"
        onClick={() => {
          const link = document.createElement('a');
          link.href = '/documents/Terms.pdf';
          link.download = 'iTechSkill-Terms-And-Conditions.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        <FaDownload />
        Download Terms (PDF)
      </button>
    </div>
  </div>
</div>

      <Footer />
    </div>
  );
};

export default Terms;