import React from 'react';
import './AboutUs.css';
import { FaCheck, FaUsers, FaGraduationCap, FaGlobe, FaHandsHelping, FaCertificate, FaLaptopCode, FaChartLine, FaRobot, FaWordpress, FaBullhorn, FaSearch, FaPalette } from 'react-icons/fa';
import Footer from '../components/Footer';

import { useScrollToTop } from '../hooks/useScrollToTop';

const AboutUs = () => {
    useScrollToTop();
  const courses = [
    { id: 1, title: "Data Science", description: "Master Python, machine learning, and data visualization to analyze multifaceted data perfectly. Perfect in banking, finance and e-Commerce.", icon: <FaChartLine /> },
    { id: 2, title: "Data Analytics", description: "Study SQL, Excel and Tableau to convert raw data to action-oriented results - ideal for telecom, startups and enterprises.", icon: <FaChartLine /> },
    { id: 3, title: "Artificial Intelligence (AI)", description: "Build Neural Networks, Chatbots and generative AI solutions. Future-proof your career with 21st century automation.", icon: <FaRobot /> },
    { id: 4, title: "WordPress Development", description: "Design advanced websites, portfolios and online shops without even having to write a single line of code.", icon: <FaWordpress /> },
    { id: 5, title: "Digital Marketing", description: "Get realistic Digital Marketing training including Google Ads, social media marketing, email campaigns and analytics.", icon: <FaBullhorn /> },
    { id: 6, title: "Advanced SEO", description: "Study how to rank websites on Google through keyword research, on-page and technical SEO and link building techniques.", icon: <FaSearch /> },
    { id: 7, title: "Graphic Designing", description: "Master tools like Adobe Photoshop, Illustrator and Figma for logos, UI/UX design and branding projects.", icon: <FaPalette /> }
  ];

  const testimonials = [
    { id: 1, text: "iTechSkill helped me to change my career to Digital Marketing. All the difference was on practical projects and support of mentors.", name: "Ayesha K.", location: "Karachi" },
    { id: 2, text: "The course on Artificial Intelligence is quite practical and comprehendible. Ideal in teaching the real skills to beginners.", name: "Ahmed R.", location: "Lahore" }
  ];

  const differences = [
    { id: 1, title: "Practical, Hands-On Learning", description: "Each course includes live projects, real case studies and practical assignments that replicate real world workplace issues.", icon: <FaLaptopCode /> },
    { id: 2, title: "Expert Instructors", description: "Industry professionals with practical experience in AI, Data Science, SEO, Digital Marketing and Web Development.", icon: <FaUsers /> },
    { id: 3, title: "Flexible & Fully Online", description: "Study on your schedule with video recordings and unlimited access to updated materials.", icon: <FaGlobe /> },
    { id: 4, title: "24/7 Student Support", description: "Dedicated team to assist with technical problems, learning guidance and career advice.", icon: <FaHandsHelping /> },
    { id: 5, title: "Career-Focused Certifications", description: "Certifications that add real value to your CV and LinkedIn profile for job applications and freelancing.", icon: <FaCertificate /> }
  ];

  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <div className="about-hero-section full-width">
        <div className="about-hero-content">
          <h1 className="about-hero-title"><i>About iTechSkill</i></h1>
          <h2 className="about-hero-subtitle"><i>Learn Skills That Change Careers</i></h2>
          <p className="about-hero-description">
            At iTechSkill, we believe education should not just teach concepts or issue certificates. 
            Education must open doors, build confidence, and transform lives.
            Everything we do is based on that belief.
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <div className="about-intro-section">
        <div className="about-intro-content">
          <p className="about-intro-text">
            We have a very straightforward yet strong mission to empower beginners, students, freelancers, 
            and professionals with practical, job-ready tech skills that result in real careers, sustainable 
            income and long term growth.
          </p>
          <p className="about-intro-text">
            Whether you want to study Data Science online, explore the latest AI technologies, 
            create professional websites with WordPress, or get certified in Digital Marketing, 
            iTechSkill helps you achieve it - step by step.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-mission-section">
        <h2 className="about-section-title">Our Mission</h2>
        <p className="about-section-description">
          In today's fast-changing tech industry, traditional education often can't keep up. 
          iTechSkill bridges the gap between academic knowledge and industry needs.
        </p>
        
        <div className="about-mission-features">
          <div className="about-mission-feature">
            <FaCheck className="about-feature-icon" />
            <span>Hands-on training with real-world projects</span>
          </div>
          <div className="about-mission-feature">
            <FaCheck className="about-feature-icon" />
            <span>Practical assignments that build confidence</span>
          </div>
          <div className="about-mission-feature">
            <FaCheck className="about-feature-icon" />
            <span>Expert mentorship from industry professionals</span>
          </div>
        </div>

        <div className="about-mission-focus">
          <h3 className="about-focus-title">Our Core Focus Includes:</h3>
          <div className="about-focus-points">
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>Practical, industry-relevant skills employers actually want</p>
            </div>
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>Low-cost, flexible learning for students and working professionals</p>
            </div>
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>Career results over theoretical knowledge</p>
            </div>
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>International opportunities tailored for Pakistan's job market</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="about-story-section">
        <h2 className="about-section-title">Our Story</h2>
        <div className="about-story-content">
          <p>
            iTechSkill was founded to make high-quality technology education accessible, 
            practical and affordable for students in Pakistan and beyond.
          </p>
          <p>
            We recognized the rising demand for skilled professionals in Data Analytics, 
            Artificial Intelligence, Digital Marketing, SEO, and Web Development, while 
            many students struggled to find structured education that focused on practical 
            abilities rather than outdated theory.
          </p>
          <p>
            That's when iTechSkill emerged. We built an educational platform that understands 
            what employers, startups, and clients need in today's world. We focus on doing, 
            building, analyzing and solving real problems - not just memorization.
          </p>
        </div>

        <div className="about-who-we-support">
          <h3 className="about-support-title">Who We Support:</h3>
          <div className="about-support-grid">
            <div className="about-support-card">
              <FaGraduationCap className="about-support-icon" />
              <h4>Novices in Tech</h4>
              <p>Beginners starting their tech journey</p>
            </div>
            <div className="about-support-card">
              <FaUsers className="about-support-icon" />
              <h4>Freelancers</h4>
              <p>Independent career builders</p>
            </div>
            <div className="about-support-card">
              <FaCertificate className="about-support-icon" />
              <h4>Professionals</h4>
              <p>Those upgrading their skills</p>
            </div>
            <div className="about-support-card">
              <FaLaptopCode className="about-support-icon" />
              <h4>Career Switchers</h4>
              <p>Transitioning to tech industries</p>
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="about-differences-section">
        <h2 className="about-section-title">What Makes iTechSkill Different</h2>
        <div className="about-differences-grid">
          {differences.map(diff => (
            <div key={diff.id} className="about-difference-card">
              <div className="about-difference-icon">{diff.icon}</div>
              <h3 className="about-difference-title">{diff.title}</h3>
              <p className="about-difference-description">{diff.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flagship Courses */}
      <div className="about-courses-section">
        <h2 className="about-section-title">Job-Ready Skills That Count</h2>
        <p className="about-courses-subtitle">Well-planned programs that equip learners for job prospects in Pakistan and overseas</p>
        
        <div className="about-courses-grid">
          {courses.map(course => (
            <div key={course.id} className="about-course-card">
              <div className="about-course-icon">{course.icon}</div>
              <h3 className="about-course-title">{course.title}</h3>
              <p className="about-course-description">{course.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="about-testimonials-section">
        <h2 className="about-section-title">What Our Students Say</h2>
        <div className="about-testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="about-testimonial-card">
              <p className="about-testimonial-text">"{testimonial.text}"</p>
              <p className="about-testimonial-author">- {testimonial.name}, {testimonial.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vision for the Future */}
      <div className="about-vision-section">
        <h2 className="about-section-titlee">Our Vision for the Future</h2>
        <div className="about-vision-content">
          <p>
            We aim to become one of the most popular edtech platforms globally, 
            empowering thousands of learners with future-proof digital skills.
          </p>
          
          <div className="about-vision-plans">
            <h3>We're constantly expanding with:</h3>
            <ul className="about-vision-list">
              <li>Advanced AI programs</li>
              <li>Enterprise and corporate training</li>
              <li>International certifications</li>
              <li>Improved industry partnerships</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta-section">
        <div className="about-cta-content">
          <h2 className="about-cta-title">Get Started On Your Education Journey Today</h2>
          <p className="about-cta-description">
            When you're ready to develop skills that really matter and opportunities that last, 
            iTechSkill is ready to help you gain high-quality education.
          </p>
          
          <div className="about-cta-buttons">
            <button className="about-primary-cta-button">Explore Our Courses</button>
            <button className="about-secondary-cta-button">Apply Now and Change Your Future</button>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default AboutUs;