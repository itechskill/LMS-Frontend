import React from 'react';
import './Certification.css';
import { FaCertificate, FaAward, FaCheckCircle, FaLinkedin, FaBriefcase, FaClock, FaGlobe, FaGraduationCap, FaArrowRight, FaRocket, FaUserTie, FaChartLine, FaRobot, FaCode, FaBullhorn, FaSearch, FaPalette, FaUsers, FaLaptop, FaProjectDiagram, FaFileAlt, FaMedal, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

import { useScrollToTop } from '../hooks/useScrollToTop';
const Certification = () => {
    useScrollToTop();
  const certifications = [
    {
      id: 1,
      title: "Data Science Certification",
      icon: <FaChartLine />,
      color: "#22013a",
      description: "Learns how to analyze, model and manipulate real-life data using Python and machine learning.",
      duration: "6-8 Months",
      level: "Advanced",
      projects: "8+ Real Projects",
      skills: ["Python", "Machine Learning", "Data Visualization", "Statistical Analysis", "Big Data"],
      benefits: [
        "Industry-recognized credential",
        "Portfolio of real data projects",
        "Job placement assistance"
      ],
      link: "/certification/data-science"
    },
    {
      id: 2,
      title: "Data Analytics Certification",
      icon: <FaChartLine />,
      color: "#8e5203",
      description: "Certified the knowledge of SQL, Excel, and data visualization applications in business.",
      duration: "4-6 Months",
      level: "Intermediate",
      projects: "5+ Business Cases",
      skills: ["SQL", "Excel", "Tableau", "Power BI", "Business Intelligence"],
      benefits: [
        "Business-focused analytics skills",
        "Real-world business scenarios",
        "Employer-valued certification"
      ],
      link: "/certification/data-analytics"
    },
    {
      id: 3,
      title: "Artificial Intelligence (AI) Certification",
      icon: <FaRobot />,
      color: "#22013a",
      description: "Shows working experience in AI concepts, automation, chatbots, and generative AI software.",
      duration: "7-9 Months",
      level: "Advanced",
      projects: "10+ AI Projects",
      skills: ["Neural Networks", "Natural Language Processing", "Computer Vision", "Generative AI", "TensorFlow"],
      benefits: [
        "Cutting-edge AI skills",
        "Portfolio of AI applications",
        "Industry connections"
      ],
      link: "/certification/ai"
    },
    {
      id: 4,
      title: "WordPress Development Certification",
      icon: <FaCode />,
      color: "#8e5203",
      description: "Checks your websites and e-commerce store development and management competencies.",
      duration: "3-5 Months",
      level: "Beginner to Intermediate",
      projects: "6+ Website Projects",
      skills: ["WordPress", "PHP", "CSS", "E-commerce", "SEO Optimization"],
      benefits: [
        "Freelance-ready skills",
        "Portfolio of live websites",
        "Client management training"
      ],
      link: "/certification/wordpress"
    },
    {
      id: 5,
      title: "Digital Marketing Certification",
      icon: <FaBullhorn />,
      color: "#22013a",
      description: "Shows online marketing, paid advertisement, social media and analytics expertise.",
      duration: "4-6 Months",
      level: "Intermediate",
      projects: "7+ Campaign Projects",
      skills: ["Google Ads", "Social Media Marketing", "Email Marketing", "Analytics", "Content Strategy"],
      benefits: [
        "Comprehensive marketing toolkit",
        "Real campaign management experience",
        "Industry networking"
      ],
      link: "/certification/digital-marketing"
    },
    {
      id: 6,
      title: "SEO Certification",
      icon: <FaSearch />,
      color: "#8e5203",
      description: "Demonstrate your abilities in web page prioritizing, search engine optimization with keywords and technical research.",
      duration: "3-4 Months",
      level: "Intermediate",
      projects: "5+ SEO Projects",
      skills: ["Keyword Research", "Technical SEO", "Link Building", "Local SEO", "Analytics"],
      benefits: [
        "Specialized SEO expertise",
        "Portfolio of optimized websites",
        "High-demand skillset"
      ],
      link: "/certification/seo"
    },
    {
      id: 7,
      title: "Graphic Designing Certification",
      icon: <FaPalette />,
      color: "#22013a",
      description: "Capable of applying creative and technical design with professional software, e.g. Adobe and Figma.",
      duration: "4-6 Months",
      level: "Beginner to Intermediate",
      projects: "8+ Design Projects",
      skills: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "UI/UX Design", "Branding"],
      benefits: [
        "Professional design portfolio",
        "Industry-standard software mastery",
        "Creative problem-solving skills"
      ],
      link: "/certification/graphic-design"
    }
  ];

  const features = [
    {
      icon: <FaProjectDiagram />,
      title: "Not only theory, as per practical training",
      description: "Hands-on projects that simulate real-world scenarios"
    },
    {
      icon: <FaUserTie />,
      title: "Popular and welcome by employers and clients",
      description: "Certifications recognized by industry leaders and businesses"
    },
    {
      icon: <FaLinkedin />,
      title: "Exquisite LinkedIn and CV resume",
      description: "Certificates designed to stand out on professional profiles"
    },
    {
      icon: <FaGlobe />,
      title: "Suitable to both local and international markets",
      description: "Globally relevant skills with local market adaptation"
    },
    {
      icon: <FaLaptop />,
      title: "Developed to suit Pakistani market among others",
      description: "Curriculum tailored for regional opportunities and challenges"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Enroll in a course",
      description: "Choose your certification program and begin learning"
    },
    {
      number: "02",
      title: "Complete assignments/projects",
      description: "Work on practical projects that build real skills"
    },
    {
      number: "03",
      title: "Pass course evaluations",
      description: "Demonstrate your knowledge through assessments"
    },
    {
      number: "04",
      title: "Obtain digital certificate",
      description: "Receive your verified, digitally signed certification"
    },
    {
      number: "05",
      title: "Build Credibility. Boost Your Career",
      description: "Showcase your certification to advance professionally"
    }
  ];

  return (
    <div className="certification-container">
      {/* Hero Section */}
      <div className="certification-hero-section full-width">
        <div className="certification-hero-content">
          <div className="certification-hero-badge">
            <FaCertificate className="certification-badge-icon" />
            <span>iTechSkill Certifications</span>
          </div>
          <h1 className="certification-hero-title">
            <i>Showcase of Skills That Matter.</i>
          </h1>
          <p className="certification-hero-description">
            iTechSkill does not require the use of paper in certifications but, instead, demonstrates the real and practical abilities. Each certificate reflects on practice, completed projects and knowledge in the industry.
          </p>
          <p className="certification-hero-subtext">
            Your certifications will put you on the spot in the job applications, freelance websites, and professional networks.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="certification-features-section">
        <h2 className="certification-section-title-alt">The Reason iTechSkill Certifications Are Desirable</h2>
        <div className="certification-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="certification-feature-card">
              <div className="certification-feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="certification-certifications-section">
        <div className="certification-section-header">
          <h2 className="certification-section-titlee">The Certification Programs that we have</h2>
          <p className="certification-section-subtitle">
            Choose from our comprehensive range of industry-recognized certification programs
          </p>
        </div>
        
        <div className="certification-certifications-grid">
          {certifications.map(cert => (
            <div key={cert.id} className="certification-card">
              <div className="certification-card-header">
                <div className="certification-card-icon" style={{ backgroundColor: cert.color }}>
                  {cert.icon}
                </div>
                <h3 className="certification-card-title">{cert.title}</h3>
                <div className="certification-level-badge" style={{ backgroundColor: cert.color }}>
                  {cert.level}
                </div>
              </div>
              
              <div className="certification-card-content">
                <p className="certification-card-description">{cert.description}</p>
                
                <div className="certification-details">
                  <div className="certification-detail-row">
                    <FaClock className="certification-detail-icon" />
                    <span className="certification-detail-label">Duration:</span>
                    <span className="certification-detail-value">{cert.duration}</span>
                  </div>
                  <div className="certification-detail-row">
                    <FaProjectDiagram className="certification-detail-icon" />
                    <span className="certification-detail-label">Projects:</span>
                    <span className="certification-detail-value">{cert.projects}</span>
                  </div>
                </div>
                
                <div className="certification-skills-section">
                  <h4 className="certification-skills-title">Key Skills:</h4>
                  <div className="certification-skills-list">
                    {cert.skills.map((skill, index) => (
                      <span key={index} className="certification-skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="certification-benefits-section">
                  <h4 className="certification-benefits-title">Benefits:</h4>
                  <ul className="certification-benefits-list">
                    {cert.benefits.map((benefit, index) => (
                      <li key={index} className="certification-benefit-item">
                        <FaCheckCircle className="certification-benefit-icon" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Earn Section */}
      <div className="certification-steps-section">
        <div className="certification-steps-container">
          <h2 className="certification-section-title">How to Earn a Certification</h2>
          <div className="certification-steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="certification-step-card">
                <div className="certification-step-number">{step.number}</div>
                <div className="certification-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="certification-cta-section full-width">
        <div className="certification-cta-content">
          <div className="certification-cta-badge">
            <FaAward className="certification-badge-icon" />
            <span>Get Certified Today</span>
          </div>
          <h2 className="certification-cta-title">Build Credibility. Boost Your Career.</h2>
          <p className="certification-cta-description">
            Join thousands of professionals who have transformed their careers with iTechSkill certifications.
          </p>
          
          <div className="certification-cta-buttons">
           
            <Link to="/enroll" className="certification-secondary-cta-btn">
              <FaRocket className="certification-btn-icon" />
              Enroll Now & Get Certified
            </Link>
          </div>
          
          <div className="certification-cta-stats">
            <div className="certification-stat-item">
              <FaUsers className="certification-stat-icon" />
              <div className="certification-stat-content">
                <span className="certification-stat-number">10,000+</span>
                <span className="certification-stat-label">Certified Professionals</span>
              </div>
            </div>
            <div className="certification-stat-item">
              <FaBriefcase className="certification-stat-icon" />
              <div className="certification-stat-content">
                <span className="certification-stat-number">85%</span>
                <span className="certification-stat-label">Career Advancement Rate</span>
              </div>
            </div>
            <div className="certification-stat-item">
              <FaMedal className="certification-stat-icon" />
              <div className="certification-stat-content">
                <span className="certification-stat-number">4.8/5</span>
                <span className="certification-stat-label">Employer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Certification;