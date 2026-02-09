import React , { useEffect } from 'react';
import './Privacy.css';
import { FaLock, FaUserShield, FaCookie, FaShieldAlt, FaEnvelope, FaCreditCard, FaChartLine, FaBell, FaHandshake, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Privacy = () => {
// useEffect(() => {
//   console.log('Scrolling to top...');
  
//   // Multiple methods to ensure scroll
//   window.scrollTo(0, 0);
//   document.documentElement.scrollTop = 0;
//   document.body.scrollTop = 0;

  useScrollToTop();
  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      icon: <FaUserShield />,
      items: [
        "Name and contact details",
        "Email address and phone number",
        "Course enrollment data",
        "Payment-related information",
        "Learning progress and achievements",
        "Technical data (IP address, browser type)",
        "Communication preferences"
      ],
      color: "#22013a"
    },
    {
      id: 2,
      title: "How We Use Your Information",
      icon: <FaChartLine />,
      items: [
        "Provide access to courses and learning materials",
        "Issue certificates and track progress",
        "Improve our services and platform experience",
        "Manage communication and customer support",
        "Process payments and transactions",
        "Send important updates and announcements",
        "Personalize learning recommendations"
      ],
      color: "#8e5203"
    },
    {
      id: 3,
      title: "Data Protection",
      icon: <FaShieldAlt />,
      items: [
        "We exercise reasonable security measures to protect your information",
        "Encrypted data storage and transmission",
        "Regular security audits and updates",
        "Limited access to personal data",
        "We never share personal information with third parties without consent",
        "Data retention according to legal requirements",
        "Right to access and control your data"
      ],
      color: "#22013a"
    },
    {
      id: 4,
      title: "Cookies",
      icon: <FaCookie />,
      items: [
        "Cookies are used to enhance user experience",
        "Essential cookies for site functionality",
        "Performance cookies for analytics",
        "Preference cookies for personalization",
        "You can manage cookie preferences in browser settings",
        "Third-party cookies for embedded content",
        "Cookie policy updates communicated to users"
      ],
      color: "#8e5203"
    },
    {
      id: 5,
      title: "Third-Party Services",
      icon: <FaHandshake />,
      items: [
        "Payment gateways (Stripe, PayPal)",
        "Analytics services (Google Analytics)",
        "Email marketing platforms",
        "Learning management systems",
        "Customer support tools",
        "Cloud storage providers",
        "Each service has its own privacy policy"
      ],
      color: "#22013a"
    },
    {
      id: 6,
      title: "Your Rights",
      icon: <FaCheckCircle />,
      items: [
        "Right to access your personal data",
        "Right to correct inaccurate information",
        "Right to request data deletion",
        "Right to data portability",
        "Right to withdraw consent",
        "Right to lodge complaints",
        "Right to opt-out of marketing"
      ],
      color: "#8e5203"
    }
  ];

  const privacyPrinciples = [
    {
      icon: <FaLock />,
      title: "Transparency",
      description: "We clearly communicate how your data is collected and used"
    },
    {
      icon: <FaUserShield />,
      title: "Security",
      description: "Advanced security measures to protect your information"
    },
    {
      icon: <FaEnvelope />,
      title: "Consent",
      description: "We obtain explicit consent before collecting sensitive data"
    },
    {
      icon: <FaCreditCard />,
      title: "Minimal Data",
      description: "We only collect data necessary for providing our services"
    }
  ];

  return (
    <div className="privacy-container">
      {/* Hero Section */}
      <div className="privacy-hero-section">
        <div className="privacy-hero-content">
          <div className="privacy-hero hero-header">
            <FaLock className="privacy-hero hero-icon" />
            <h1 className="privacy-hero-title">Privacy Policy</h1>
          </div>
          <p className="privacy-hero-description">
            At iTechSkill, privacy is our priority. This Privacy Policy explains how we collect, use, and store your personal information while providing you with the best learning experience.
          </p>
         
        </div>
      </div>

      {/* Introduction */}
      <div className="privacy-introduction-section">
        <div className="privacy-introduction-content">
          <h2 className="privacy-section-title">Our Commitment to Your Privacy</h2>
          <p className="privacy-introduction-text">
            We are committed to protecting your personal information and being transparent about our data practices. This policy outlines how we handle your data when you use our platform, enroll in courses, or interact with our services.
          </p>
          <p className="privacy-introduction-text">
            Your trust is important to us, and we strive to maintain the highest standards of data protection in compliance with applicable laws and regulations.
          </p>
        </div>
      </div>

      {/* Privacy Principles */}
      <div className="privacy-principles-section">
        <h2 className="privacy-section-title">Our Privacy Principles</h2>
        <div className="privacy-principles-grid">
          {privacyPrinciples.map((principle, index) => (
            <div key={index} className="privacy-principle-card">
              <div className="privacy-principle-icon" style={{ 
                backgroundColor: index % 2 === 0 ? '#22013a' : '#8e5203' 
              }}>
                {principle.icon}
              </div>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="privacy-sections-container">
        {sections.map(section => (
          <div key={section.id} className="privacy-section-wrapper">
            <div className="privacy-section-header" style={{ backgroundColor: section.color }}>
              <div className="privacy-section-icon">
                {section.icon}
              </div>
              <h2 className="privacy-section-title">{section.title}</h2>
            </div>
            <div className="privacy-section-content">
              <ul className="privacy-section-list">
                {section.items.map((item, index) => (
                  <li key={index} className="privacy-list-item">
                    <FaCheckCircle className="privacy-list-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Consent Section */}
      <div className="privacy-consent-section">
        <div className="privacy-consent-content">
          <h2 className="privacy-section-titlee">Your Consent</h2>
          <div className="privacy-consent-card">
            <div className="privacy-consent-icon">
              <FaHandshake />
            </div>
            <div className="privacy-consent-text">
              <p>
                By using iTechSkill's platform, enrolling in courses, or interacting with our services, you accept and consent to the practices described in this Privacy Policy.
              </p>
              <p className="privacy-consent-note">
                If you have any questions or concerns about our privacy practices, please contact our Privacy Team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="privacy-faq-section">
        <h2 className="privacy-section-title">Frequently Asked Questions</h2>
        <div className="privacy-faq-grid">
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>How can I access my personal data?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>You can request access to your personal data by contacting our support team. We'll provide you with a copy of your data within 30 days.</p>
            </div>
          </div>
          
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>Can I delete my account and data?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>Yes, you can request account deletion at any time. Some data may be retained for legal or legitimate business purposes as required by law.</p>
            </div>
          </div>
          
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>Do you share data with third parties?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>We only share data with trusted third-party service providers necessary for delivering our services, and only under strict data protection agreements.</p>
            </div>
          </div>
          
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>How do you protect payment information?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>All payment transactions are processed through PCI-DSS compliant payment gateways. We never store your complete payment card information on our servers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="privacy-contact-section">
        <div className="privacy-contact-content">
          <h2 className="privacy-contact-title">Contact Our Privacy Team</h2>
          <p className="privacy-contact-description">
            If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
          </p>
          <div className="privacy-contact-methods">
          <div className="privacy-contact-method">
  <FaEnvelope className="privacy-contact-icon" />
  <div className="privacy-contact-info">
    <span className="privacy-contact-label">Email</span>
    <a 
      href="mailto:itechskill6@gmail.com" 
      className="privacy-contact-value privacy-email-link"
    >
      itechskill6@gmail.com
    </a>
  </div>
</div>
            <div className="privacy-contact-method">
              <FaBell className="privacy-contact-icon" />
              <div className="privacy-contact-info">
                <span className="privacy-contact-label">Support Hours</span>
                <span className="privacy-contact-value">Monday - Saturday, 10 AM - 7 PM</span>
              </div>
            </div>
          </div>
          <div className="privacy-contact-actions">
            <Link to="/contact" className="privacy-contact-btn">
              Contact Support
            </Link>
           {/* <button 
  className="privacy-download-btn"
  onClick={() => window.open('/documents/PrivacyPolicy.pdf', '_blank')}
>
  Download Privacy Policy (PDF)
</button> */}
<button 
  className="privacy-download-btn"
  onClick={() => {
    const link = document.createElement('a');
    link.href = '/documents/PrivacyPolicy.pdf';
    link.download = 'iTechSkill-Privacy-Policy.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
>
  Download Privacy Policy (PDF)
</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;