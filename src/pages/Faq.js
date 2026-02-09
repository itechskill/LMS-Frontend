import React, { useState } from 'react';
import './Faq.css';
import { FaQuestionCircle, FaGraduationCap, FaLaptop, FaInfinity, FaCertificate, FaCheckCircle, FaEnvelope, FaWhatsapp, FaArrowRight, FaArrowDown, FaUsers, FaBook, FaUserGraduate, FaAward, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import HelpCenter from'./HelpCenter';

import { useScrollToTop } from '../hooks/useScrollToTop';
const Faq = () => {
    useScrollToTop();
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All FAQs");

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      id: 1,
      question: "Who is eligible for iTechSkill courses?",
      answer: "Anyone! Our courses include student, professional, freelancer, and beginner courses. Most programs don't require any prior experience. We offer learning paths for complete beginners as well as advanced professionals looking to upgrade their skills.",
      icon: <FaUserGraduate />,
      category: "Eligibility"
    },
    {
      id: 2,
      question: "Are courses 100% online?",
      answer: "Yes. iTechSkill is a purely online-based learning platform that provides 100% of programs accessible from any location at any time. All course materials, lectures, and resources are available through our digital platform.",
      icon: <FaLaptop />,
      category: "Learning Mode"
    },
    {
      id: 3,
      question: "Do I get lifetime access to courses?",
      answer: "Yes. Upon enrollment, you receive lifetime access to course materials and updates. This includes all future content additions, improvements, and supplementary resources added to the course.",
      icon: <FaInfinity />,
      category: "Access"
    },
    {
      id: 4,
      question: "Will I receive a certificate?",
      answer: "Yes. Upon successful completion of a course and meeting all requirements, you'll receive a career-oriented digital certificate. This professional certificate validates your skills and knowledge in the specific domain.",
      icon: <FaCertificate />,
      category: "Certification"
    },
    {
      id: 5,
      question: "Are certificates recognized?",
      answer: "Our certificates are career-friendly, resume-friendly, LinkedIn and freelancing platform compatible, and valued by employers. They demonstrate practical skills and real-world project experience to potential employers.",
      icon: <FaAward />,
      category: "Certification"
    },
    {
      id: 6,
      question: "How do I contact support?",
      answer: "You can reach us via email at itechskill6@gmail.com or WhatsApp at +92 330 9998880. Our support team is available Monday through Saturday from 9 AM to 6 PM PKT to assist you with any questions or issues.",
      icon: <FaHeadset />,
      category: "Support"
    },
    {
      id: 7,
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including bank transfers, JazzCash, EasyPaisa, and credit/debit cards. We also offer installment plans for most courses to make learning more accessible.",
      icon: <FaCheckCircle />,
      category: "Payment"
    },
    {
      id: 8,
      question: "Can I access courses on mobile devices?",
      answer: "Absolutely! Our platform is fully responsive and optimized for mobile devices. You can access all courses, watch lectures, complete assignments, and take quizzes on your smartphone or tablet.",
      icon: <FaLaptop />,
      category: "Learning Mode"
    },
    {
      id: 9,
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 7-day refund policy for most courses. If you're not satisfied with your purchase within the first week, you can request a full refund, no questions asked.",
      icon: <FaCheckCircle />,
      category: "Payment"
    },
    {
      id: 10,
      question: "Are there any prerequisites for courses?",
      answer: "Most beginner courses have no prerequisites. For advanced courses, we clearly mention any required foundational knowledge in the course description. We also provide recommended learning paths for complex topics.",
      icon: <FaBook />,
      category: "Eligibility"
    },
    {
      id: 11,
      question: "How long does it take to complete a course?",
      answer: "Course duration varies from 4 weeks to 6 months depending on the program. However, with lifetime access, you can learn at your own pace and complete courses according to your schedule.",
      icon: <FaInfinity />,
      category: "Access"
    },
    {
      id: 12,
      question: "Do you offer job placement assistance?",
      answer: "Yes, we provide career guidance, resume building assistance, and interview preparation for our certification programs. Many of our graduates have successfully transitioned to tech careers with our support.",
      icon: <FaUsers />,
      category: "Career Support"
    }
  ];

  const categories = [
    { 
      id: 1, 
      name: "All FAQs", 
      icon: <FaQuestionCircle />, 
      count: faqs.length,
      colorClass: "faq-category-get-started"
    },
    { 
      id: 2, 
      name: "Eligibility", 
      icon: <FaUserGraduate />, 
      count: faqs.filter(f => f.category === "Eligibility").length,
      colorClass: "faq-category-enrollment"
    },
    { 
      id: 3, 
      name: "Learning Mode", 
      icon: <FaLaptop />, 
      count: faqs.filter(f => f.category === "Learning Mode").length,
      colorClass: "faq-category-technical"
    },
    { 
      id: 4, 
      name: "Access", 
      icon: <FaInfinity />, 
      count: faqs.filter(f => f.category === "Access").length,
      colorClass: "faq-category-payment"
    },
    { 
      id: 5, 
      name: "Certification", 
      icon: <FaCertificate />, 
      count: faqs.filter(f => f.category === "Certification").length,
      colorClass: "faq-category-certification"
    },
    { 
      id: 6, 
      name: "Payment", 
      icon: <FaCheckCircle />, 
      count: faqs.filter(f => f.category === "Payment").length,
      colorClass: "faq-category-account"
    },
    { 
      id: 7, 
      name: "Support", 
      icon: <FaHeadset />, 
      count: faqs.filter(f => f.category === "Support").length,
      colorClass: "faq-category-get-started"
    },
    { 
      id: 8, 
      name: "Career Support", 
      icon: <FaUsers />, 
      count: faqs.filter(f => f.category === "Career Support").length,
      colorClass: "faq-category-enrollment"
    }
  ];

  const filteredFAQs = selectedCategory === "All FAQs" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="faq-page-container">
      {/* Hero Section */}
      <div className="faq-hero-section">
        <div className="faq-hero-content">
          <div className="faq-hero-header">
            <FaQuestionCircle className="faq-hero-icon" />
            <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          </div>
          <p className="faq-hero-subtitle">
            Answers to the most common questions asked by iTechSkill learners
          </p>
          <p className="faq-hero-description">
            Find quick answers to your questions about courses, enrollment, certificates, and more. 
            Can't find what you're looking for? Our support team is always ready to help.
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="faq-categories-section">
        <h2 className="faq-section-title">Browse by Category</h2>
        <div className="faq-categories-grid">
          {categories.map(category => (
            <button
              key={category.id}
              className={`faq-category-btn ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className={`faq-category-btn-icon ${category.colorClass}`}>
                {category.icon}
              </div>
              <div className="faq-category-btn-content">
                <span className="faq-category-name">{category.name}</span>
                <span className="faq-category-count">{category.count} FAQs</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="faq-accordion-section">
        <div className="faq-section-header">
          <h2 className="faq-section-title">
            {selectedCategory === "All FAQs" ? "All Frequently Asked Questions" : selectedCategory + " FAQs"}
          </h2>
          <p className="faq-section-subtitle">
            Click on any question to expand and view the detailed answer
          </p>
        </div>
        
        <div className="faq-list">
          {filteredFAQs.map((faq, index) => (
            <div 
              key={faq.id} 
              className={`faq-accordion-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-accordion-question"
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question-header">
                  <div className="faq-question-icon">
                    {faq.icon}
                  </div>
                  <h3 className="faq-question-text">{faq.question}</h3>
                </div>
                <div className="faq-question-arrow">
                  {activeIndex === index ? <FaArrowDown /> : <FaArrowRight />}
                </div>
              </div>
              
              <div className="faq-accordion-answer">
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="faq-contact-support-section">
        <div className="faq-contact-content">
          <div className="faq-contact-header">
            <FaQuestionCircle className="faq-contact-header-icon" />
            <h2 className="faq-contact-title">Still Have Questions?</h2>
          </div>
          <p className="faq-contact-description">
            Our support team is here to help you with any additional questions or concerns you may have.
          </p>
          
          <div className="faq-contact-options">
            <div className="faq-contact-card">
              <div className="faq-contact-icon faq-email-icon">
                <FaEnvelope />
              </div>
              <div className="faq-contact-card-content">
                <h3>Email Support</h3>
                <p>For detailed inquiries and documentation</p>
                <a href="mailto:itechskill6@gmail.com" className="faq-contact-link">
                  itechskill6@gmail.com
                </a>
              </div>
            </div>
            
            <div className="faq-contact-card">
              <div className="faq-contact-icon faq-whatsapp-icon">
                <FaWhatsapp />
              </div>
              <div className="faq-contact-card-content">
                <h3>WhatsApp Support</h3>
                <p>Quick answers and instant assistance</p>
                <a 
                  href="https://wa.me/923309998880" 
                  className="faq-contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +92 330 9998880
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-resources-section">
        <h2 className="faq-section-title">Additional Resources</h2>
        <div className="faq-resources-grid">
          {/* FIXED: Remove nested <a> tag and use Link properly */}
          <Link to="/HelpCenter" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaHeadset />
            </div>
            <div className="faq-resource-content">
              <h3>Help Center</h3>
              <p>Detailed guides and troubleshooting articles</p>
              <span className="faq-resource-link">
                Explore Help Center <FaArrowRight />
              </span>
            </div>
          </Link>
          
          <Link to="/courses" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaGraduationCap />
            </div>
            <div className="faq-resource-content">
              <h3>Course Catalog</h3>
              <p>Browse all available courses and programs</p>
              <span className="faq-resource-link">
                View Courses <FaArrowRight />
              </span>
            </div>
          </Link>
          
          <Link to="/certification" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaCertificate />
            </div>
            <div className="faq-resource-content">
              <h3>Certifications</h3>
              <p>Learn about our certification programs</p>
              <span className="faq-resource-link">
                View Certifications <FaArrowRight />
              </span>
            </div>
          </Link>
          
          <Link to="/contact" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaEnvelope />
            </div>
            <div className="faq-resource-content">
              <h3>Contact Form</h3>
              <p>Submit detailed inquiries to our team</p>
              <span className="faq-resource-link">
                Contact Us <FaArrowRight />
              </span>
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Faq;





