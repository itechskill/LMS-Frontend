import React from 'react';
import './All_Courses.css';
import { FaCheck, FaUsers, FaClock, FaCertificate, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
// import Course from './courses';
import Courses_Screen from './Courses_Screen';

import { useScrollToTop } from '../hooks/useScrollToTop';

const All_Courses = () => {
    useScrollToTop();
  return (
    <div className="all-courses-container">
      {/* Hero Section */}
      <div className="all-courses-hero-section full-width">
        <div className="all-courses-hero-content">
          <h1 className="all-courses-hero-title"><i>Empowerment — Get the Skills that Pay.</i></h1>
          <p className="all-courses-hero-description">
            In the careers at iTechSkill, our careers will assist you in developing real, in-demand skills which are not only needed by, but are actively sought after by the employers, clients and businesses, bring your knowledge and initiate or further develop your talents, you would find career oriented programs and practical programs which would prepare you to compete in the real world.
          </p>
          <p className="all-courses-hero-subtext">
            Practical training, real life projects, professional mentorship, the flexibility of online studies- all that combined to you, so that you can learn at your own pace, and put your skills into practice.
          </p>
        </div>
      </div>

      {/* Page Title */}
      <div className="all-courses-page-header">
        <h1 className="all-courses-page-title">Our Complete Course Library</h1>
        <p className="all-courses-page-subtitle">Choose from our comprehensive collection of industry-relevant courses</p>
      </div>

      <Courses_Screen/>

      {/* Why Learn Section */}
      <div className="all-courses-why-learn-section">
        <h2 className="all-courses-section-title">Why Learn With iTechSkill?</h2>
        <div className="all-courses-features-grid">
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaCheck />
            </div>
            <h3>Work-ready training curriculum</h3>
            <p>Courses designed with industry input to ensure job relevance</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaUsers />
            </div>
            <h3>Industry-expert instructors</h3>
            <p>Learn from professionals actively working in the field</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaClock />
            </div>
            <h3>Lifetime course access</h3>
            <p>Once enrolled, access course materials forever</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaGraduationCap />
            </div>
            <h3>Flexible online learning</h3>
            <p>Study at your own pace, anytime, anywhere</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaCertificate />
            </div>
            <h3>Career-focused certifications</h3>
            <p>Get recognized credentials that employers value</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="all-courses-cta-section">
        <div className="all-courses-cta-content">
          <h2 className="all-courses-cta-title">Ready to Start Your Journey?</h2>
          <p className="all-courses-cta-description">
            Choose your course, enroll today, and begin building the skills that will transform your career.
          </p>
          <Link to="/courses" className="all-courses-cta-button">
            <FaArrowRight className="all-courses-btn-icon" />
            Find Courses and Begin Studying
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default All_Courses;