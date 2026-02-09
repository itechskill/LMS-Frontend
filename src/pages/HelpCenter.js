import React from 'react';
import './HelpCenter.css';
import { FaSearch, FaQuestionCircle, FaUserGraduate, FaCreditCard, FaLock, FaDesktop, FaCertificate, FaWhatsapp, FaEnvelope, FaDownload, FaKey, FaCartPlus, FaUserPlus, FaGraduationCap, FaCog, FaClock, FaFileInvoice, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

const HelpCenter = () => {
    useScrollToTop();
const helpCategories = [
  {
    id: 1,
    title: "Get Started",
    icon: <FaUserGraduate />,
    colorClass: "help-general-bg",
    items: [
      {
        question: "Registration Process",
        answer: "Select a course, add to cart, and pay using bank transfer, JazzCash, or EasyPaisa. Access your dashboard instantly after payment confirmation.",
        icon: <FaCartPlus />
      },
      {
        question: "Free Trials",
        answer: "No credit card required. Get access to the first module of every course for free to experience our teaching style.",
        icon: <FaClock />
      },
      {
        question: "Account Registration",
        answer: "Register with your email and password. Complete authentication through the verification link sent to your email.",
        icon: <FaUserPlus />
      }
    ]
  },
  {
    id: 2,
    title: "Course Access & Learning",
    icon: <FaGraduationCap />,
    colorClass: "help-billing-bg",
    items: [
      {
        question: "Dashboard Login",
        answer: "Access your dashboard at itechskill.com/login. Forgot password? Use the 'Reset Password' link on the login page.",
        icon: <FaLock />
      },
      {
        question: "Payment Options",
        answer: "Choose from 3-6 monthly installments through bank deposits. Contact itechskill6@gmail.com for installment arrangements.",
        icon: <FaCreditCard />
      },
      {
        question: "Receipts & Invoices",
        answer: "Download payment receipts and course invoices directly from your profile section in the dashboard.",
        icon: <FaFileInvoice />
      }
    ]
  },
  {
    id: 3,
    title: "Technical Support",
    icon: <FaCog />,
    colorClass: "help-technical-bg",
    items: [
      {
        question: "Enrollment Issues",
        answer: "If you face issues enrolling in courses, clear browser cache or try a different browser. Contact support if problems persist.",
        icon: <FaDesktop />
      },
      {
        question: "Certificate Downloads",
        answer: "Certificates are available for download upon course completion. Check your dashboard under 'My Certificates' section.",
        icon: <FaCertificate />
      },
      {
        question: "Platform Troubleshooting",
        answer: "For technical issues, ensure stable internet connection, update your browser, and disable conflicting extensions.",
        icon: <FaDesktop />
      }
    ]
  }
];

const contactOptions = [
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp Support",
    description: "Instant messaging support available",
    details: "+92 330 8889990",
    detailsLink: "https://wa.me/923308889990", // Added this
    action: "Chat Now",
    link: "https://wa.me/923308889990",
    colorClass: "contact-chat-bg"
  },
  {
    icon: <FaEnvelope />,
    title: "Email Support",
    description: "Detailed inquiries and document submissions",
    details: "itechskill6@gmail.com",
    detailsLink: "mailto:itechskill6@gmail.com", // Added this
    action: "Send Email",
    link: "mailto:itechskill6@gmail.com",
    colorClass: "contact-email-bg"
  },
];

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page. Enter your registered email to receive reset instructions."
    },
    {
      question: "Are courses accessible on mobile?",
      answer: "Yes, all courses are fully responsive and accessible on smartphones, tablets, and desktops."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept bank transfers, JazzCash, EasyPaisa, and major credit/debit cards."
    },
    {
      question: "How long do I have access to courses?",
      answer: "You get lifetime access to all enrolled courses, including future updates and materials."
    }
  ];

  return (
    <div className="help-center-container">
      {/* Hero Section */}
      <div className="help-hero-section">
        <div className="help-hero-content">
          <div className="hero-header">
            <FaQuestionCircle className="hero-icon" />
            <h1 className="help-hero-title">Help Center</h1>
          </div>
          <p className="help-hero-subtitle">
            Warehouse of Rapid Knowledge To Have You Learning
          </p>
          <p className="help-hero-description">
            Enrollment issues, payment problems, or course access questions? Find quick solutions in our Help Center. 
            Can't find what you need? Contact our support team for personalized assistance.
          </p>
          
          {/* Search Bar */}
         
        </div>
      </div>


      {/* Help Categories */}
      <div className="categories-section">
        <h2 className="section-title">Browse Help Topics</h2>
        <div className="categories-grid">
          {helpCategories.map(category => (
            <div key={category.id} className="category-card">
              <div className={`category-header ${category.colorClass}`}>
                <div className="category-icon">
                  {category.icon}
                </div>
                <h3 className="category-title">{category.title}</h3>
              </div>
              <div className="category-content">
                {category.items.map((item, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-header">
                      <div className="question-icon">
                        {item.icon}
                      </div>
                      <h4 className="question">{item.question}</h4>
                    </div>
                    <p className="answer">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="contact-support-section">
        <h2 className="section-title">Still Stuck? Contact Support</h2>
        <p className="contact-description">
          Our support team is ready to help you with any issues or questions you might have.
        </p>
        
        <div className="contact-options">
          {contactOptions.map((option, index) => (
            <div key={index} className="contact-card">
              <div className={`contact-icon ${option.colorClass}`}>
                {option.icon}
              </div>
              <div className="contact-content">
                <h3>{option.title}</h3>
                <p className="contact-desc">{option.description}</p>
               <div className="contact-details">
  <a 
    href={option.detailsLink || option.link} 
    className="detail-link"
    target={option.detailsLink?.startsWith('http') || option.detailsLink?.startsWith('mailto') ? '_blank' : '_self'}
    rel="noopener noreferrer"
  >
    {option.details}
  </a>
</div>
                <a 
                  href={option.link} 
                  className="contact-action-btn"
                  target={option.link.startsWith('http') || option.link.startsWith('mailto') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                >
                  {option.action}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="additional-faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

     
      <Footer />
    </div>
  );
};

export default HelpCenter;