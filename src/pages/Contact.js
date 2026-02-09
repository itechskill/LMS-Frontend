import React, { useState } from 'react';
import './Contact.css';
import { FaEnvelope, FaPhone, FaWhatsapp, FaGlobe, FaClock, FaMapMarkerAlt, FaUserGraduate, FaQuestionCircle, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import Footer from '../components/Footer';

import { useScrollToTop } from '../hooks/useScrollToTop';
const Contact = () => {
    useScrollToTop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    {
      id: 1,
      title: "Email Us",
      info: "itechskill6@gmail.com",
      description: "General inquiries and course information",
      icon: <FaEnvelope />,
      color: "#22013a"
    },
    {
      id: 2,
      title: "Call Us",
      info: "+92 330 9998880",
      description: "Monday - Saturday, 10 AM - 7 PM PKT",
      icon: <FaPhone />,
      color: "#8e5203"
    },
    {
      id: 3,
      title: "WhatsApp",
      info: "+92 330 9998880",
      description: "Quick queries and instant support",
      icon: <FaWhatsapp />,
      color: "#25D366"
    },
    {
      id: 4,
      title: "Visit Website",
      info: "https://itechskill.com",
      description: "Explore courses and resources",
      icon: <FaGlobe />,
      color: "#22013a"
    }
  ];

  const contactReasons = [
    { id: 1, reason: "Course Admissions & Enrollment" },
    { id: 2, reason: "Certification & Course Details" },
    { id: 3, reason: "Payment & Fee Structure" },
    { id: 4, reason: "Technical Support & Platform Access" },
    { id: 5, reason: "Career Guidance & Counseling" },
    { id: 6, reason: "Corporate Training Programs" },
    { id: 7, reason: "Partnership & Collaboration" },
    { id: 8, reason: "Feedback & Suggestions" }
  ];

  const faqs = [
    {
      id: 1,
      question: "What are the admission requirements?",
      answer: "Basic requirements include: 1) Matriculation or equivalent, 2) Basic computer knowledge, 3) Valid email and phone number. Some advanced courses may have additional prerequisites."
    },
    {
      id: 2,
      question: "How long does it take to complete a course?",
      answer: "Course durations vary: Short courses (2 months), Standard courses (3 months), Advanced programs (4-6 months). Most courses offer flexible pacing."
    },
    {
      id: 3,
      question: "Are certifications internationally recognized?",
      answer: "Yes! Our certifications are recognized by industry partners and employers globally. They focus on practical skills that employers value."
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept: Bank transfers, EasyPaisa, JazzCash, Credit/Debit cards, and installment plans for most courses."
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero-section full-width">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title"><i>Contact iTechSkill</i></h1>
          <h2 className="contact-hero-subtitle"><i>We're Here to Help You Succeed</i></h2>
          <p className="contact-hero-description">
            Have questions about courses, admissions, certifications, or learning processes? 
            Starting your tech journey but need guidance? We're here for you!
          </p>
          <p className="contact-hero-description">
            At iTechSkill, communication matters. We provide mentoring, answer your questions, 
            and guide you toward the best learning path for your goals.
          </p>
        </div>
      </div>

      {/* Contact Methods Grid */}
      <div className="contact-methods-section">
        <h2 className="contact-section-title">Get in Touch With Us</h2>
        <div className="contact-methods-grid">
          {contactMethods.map(method => (
            <div key={method.id} className="contact-method-card">
              <div className="contact-method-icon" style={{ backgroundColor: method.color }}>
                {method.icon}
              </div>
              <h3 className="contact-method-title">{method.title}</h3>
              <p className="contact-method-info">{method.info}</p>
              <p className="contact-method-description">{method.description}</p>
              {method.id === 3 && (
                <a 
                  href="https://wa.me/923309998880" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-whatsapp-link"
                >
                  Start Chat on WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="contact-business-hours">
          <FaClock className="contact-hours-icon" />
          <div className="contact-hours-content">
            <h4>Business Hours</h4>
            <p>Monday – Saturday | 10:00 AM – 7:00 PM (PKT)</p>
            <p className="contact-hours-note">Closed on Sundays and Public Holidays</p>
          </div>
        </div>
      </div>

      {/* Contact Form & Reasons */}
      <div className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-header">
            <h2 className="contact-form-title">Send Us a Message</h2>
            <p className="contact-form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="contact-success-message">
              <FaCheckCircle className="contact-success-icon" />
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting iTechSkill. Our team will respond to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form-form">
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 XXX XXXXXXX"
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="admissions">Course Admissions</option>
                    <option value="courses">Course Information</option>
                    <option value="certifications">Certifications</option>
                    <option value="payments">Payment & Fees</option>
                    <option value="technical">Technical Support</option>
                    <option value="career">Career Guidance</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button type="submit" className="contact-submit-button">
                <FaPaperPlane className="submit-icon" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="contact-reasons">
          <h3 className="contact-reasons-title">Common Reasons to Contact Us</h3>
          <ul className="contact-reasons-list">
            {contactReasons.map(reason => (
              <li key={reason.id} className="contact-reason-item">
                <FaUserGraduate className="contact-reason-icon" />
                <span>{reason.reason}</span>
              </li>
            ))}
          </ul>
          
          <div className="contact-urgent-support">
            <h4>Need Immediate Assistance?</h4>
            <p>For urgent queries, please call or WhatsApp us directly.</p>
            <a href="tel:+923309998880" className="contact-urgent-call">
              <FaPhone /> Call Now: +92 330 9998880
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="contact-faq-section">
        <h2 className="contact-section-title">Frequently Asked Questions</h2>
  
        
        <div className="contact-faq-grid">
          {faqs.map(faq => (
            <div key={faq.id} className="contact-faq-card">
              <div className="contact-faq-question">
                <FaQuestionCircle className="contact-faq-icon" />
                <h4>{faq.question}</h4>
              </div>
              <p className="contact-faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="contact-faq-cta">
          <p>Need more answers? Check our complete <a href="/faq">FAQ section</a> or contact us.</p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="contact-cta-section">
        <div className="cta-content">
          <h2 className="contact-cta-title">Ready to Start Your Tech Journey?</h2>
          <p className="contact-cta-description">
            Apply now and begin your technological career with iTechSkill. 
            Our team is ready to guide you every step of the way.
          </p>
          
          <div className="contact-cta-buttons">
            <a href="/courses" className="contact-primary-cta-btn">
              Explore All Courses
            </a>
            <a href="/admissions" className="contact-secondary-cta-btn">
              Apply for Admission
            </a>
            <a href="https://wa.me/923309998880" className="contact-whatsapp-cta-btn" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>
          
          <p className="contact-response-time">
            <strong>Typical Response Time:</strong> 2-4 hours on business days
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Contact;