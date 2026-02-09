import React from 'react';
import './Categories.css';
import { FaLaptopCode, FaRobot, FaChartLine, FaCode, FaBullhorn, FaSearch, FaPalette, FaGraduationCap, FaArrowRight, FaUsers, FaBriefcase, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

import { useScrollToTop } from '../hooks/useScrollToTop';
const Categories = () => {
    useScrollToTop();
  const categories = [
    {
      id: 1,
      title: "Technology & Data",
      icon: <FaLaptopCode />,
      color: "#22013a",
      description: "Master data manipulation, predictive analytics, and business intelligence for finance, healthcare, and e-commerce.",
      subcategories: [
        { name: "Data Science", description: "Advanced analytics, machine learning, and AI applications" },
        { name: "Data Analytics", description: "Business intelligence, reporting, and decision-making tools" },
        { name: "Database Management", description: "SQL, NoSQL, and data architecture" },
        { name: "Business Intelligence", description: "Power BI, Tableau, and data visualization" }
      ],
      courseCount: "15+ courses",
      link: "/courses?category=technology-data"
    },
    {
      id: 2,
      title: "Artificial Intelligence",
      icon: <FaRobot />,
      color: "#8e5203",
      description: "Discover AI, build intelligent systems, and create real AI tools to shape the future.",
      subcategories: [
        { name: "AI & Machine Learning", description: "Neural networks, deep learning, and AI models" },
        { name: "Generative AI", description: "ChatGPT, DALL-E, and creative AI applications" },
        { name: "Computer Vision", description: "Image recognition and processing" },
        { name: "Natural Language Processing", description: "Chatbots and language models" }
      ],
      courseCount: "8+ courses",
      link: "/courses?category=ai"
    },
    {
      id: 3,
      title: "Web & Development",
      icon: <FaCode />,
      color: "#22013a",
      description: "Build, develop, and manage websites and applications with or without coding skills.",
      subcategories: [
        { name: "WordPress Development", description: "No-code website building and management" },
        { name: "Full Stack Development", description: "Frontend and backend web development" },
        { name: "Mobile App Development", description: "iOS and Android app creation" },
        { name: "Cloud Computing", description: "AWS, Azure, and Google Cloud" }
      ],
      courseCount: "12+ courses",
      link: "/courses?category=web-dev"
    },
    {
      id: 4,
      title: "Digital Marketing & Growth",
      icon: <FaBullhorn />,
      color: "#8e5203",
      description: "Master paid advertising, social media strategy, email marketing, and performance tracking.",
      subcategories: [
        { name: "Digital Marketing", description: "Complete digital marketing strategy" },
        { name: "Social Media Marketing", description: "Facebook, Instagram, TikTok strategies" },
        { name: "Email Marketing", description: "Campaign creation and automation" },
        { name: "Content Marketing", description: "Blogging and content strategy" }
      ],
      courseCount: "10+ courses",
      link: "/courses?category=marketing"
    },
    {
      id: 5,
      title: "SEO & Optimization",
      icon: <FaSearch />,
      color: "#22013a",
      description: "Optimize websites to rank higher in search engines and drive organic traffic.",
      subcategories: [
        { name: "Technical SEO", description: "Website structure and performance optimization" },
        { name: "Content SEO", description: "Keyword research and content optimization" },
        { name: "Local SEO", description: "Local business optimization" },
        { name: "E-commerce SEO", description: "Product page and shop optimization" }
      ],
      courseCount: "6+ courses",
      link: "/courses?category=seo"
    },
    {
      id: 6,
      title: "Creative & Design",
      icon: <FaPalette />,
      color: "#8e5203",
      description: "Create branding, marketing materials, and UI/UX designs with industry-standard tools.",
      subcategories: [
        { name: "Graphic Design", description: "Adobe Creative Suite and branding" },
        { name: "UI/UX Design", description: "User interface and experience design" },
        { name: "Video & Animation", description: "Premiere Pro, After Effects, and animation" },
        { name: "3D Modeling", description: "Blender and 3D design" }
      ],
      courseCount: "8+ courses",
      link: "/courses?category=design"
    },
    {
      id: 7,
      title: "Business & Management",
      icon: <FaBriefcase />,
      color: "#22013a",
      description: "Develop leadership, project management, and business strategy skills.",
      subcategories: [
        { name: "Project Management", description: "PMP, Agile, and Scrum methodologies" },
        { name: "Business Analytics", description: "Decision-making and strategy" },
        { name: "Entrepreneurship", description: "Startup creation and management" },
        { name: "Soft Skills", description: "Communication and leadership" }
      ],
      courseCount: "7+ courses",
      link: "/courses?category=business"
    },
    {
      id: 8,
      title: "Certification Programs",
      icon: <FaGraduationCap />,
      color: "#8e5203",
      description: "Industry-recognized certifications to boost your career and credibility.",
      subcategories: [
        { name: "AWS Certifications", description: "Amazon Web Services cloud certifications" },
        { name: "Google Certifications", description: "Google Cloud and analytics certifications" },
        { name: "Microsoft Certifications", description: "Azure and Office 365 certifications" },
        { name: "CompTIA Certifications", description: "IT fundamentals and security" }
      ],
      courseCount: "10+ certifications",
      link: "/certifications"
    }
  ];

  const careerPaths = [
    {
      id: 1,
      title: "Beginner",
      icon: <FaRocket />,
      description: "Start from scratch with no prior experience",
      courses: "Foundational courses with step-by-step guidance"
    },
    {
      id: 2,
      title: "Career Changer",
      icon: <FaUsers />,
      description: "Transition to tech from another field",
      courses: "Intensive programs for quick career switching"
    },
    {
      id: 3,
      title: "Professional",
      icon: <FaBriefcase />,
      description: "Advance your existing tech career",
      courses: "Advanced specializations and certifications"
    },
    {
      id: 4,
      title: "Entrepreneur",
      icon: <FaChartLine />,
      description: "Build your own business or freelance",
      courses: "Business + tech combo programs"
    }
  ];

  return (
    <div className="categories-container">
      {/* Hero Section */}
      <div className="categories-hero-section full-width">
        <div className="categories-hero-content">
          <h1 className="categories-hero-title"><i>Explore Course Categories</i></h1>
          <h2 className="categories-hero-subtitle"><i>Choose Your Path to Success</i></h2>
          <p className="categories-hero-description">
            Not sure where to start? Find the right skillset easily based on your career goals. 
            Our course categories focus on practical implementation and increased employment opportunities.
          </p>
        </div>
      </div>

      {/* Find Your Path Section */}
      <div className="categories-find-path-section">
        <h2 className="categories-section-title">Find Your Perfect Category</h2>
        <p className="categories-section-description">
          No matter your background, there's a learning path that helps you learn faster, get smarter, and earn more.
          Explore categories and enroll today.
        </p>
        
        <div className="categories-career-paths-grid">
          {careerPaths.map(path => (
            <div key={path.id} className="categories-career-path-card">
              <div className="categories-path-icon" style={{ 
                backgroundColor: path.id % 2 === 0 ? '#8e5203' : '#22013a' 
              }}>
                {path.icon}
              </div>
              <h3 className="categories-path-title">{path.title}</h3>
              <p className="categories-path-description">{path.description}</p>
              <p className="categories-path-courses">{path.courses}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid-section">
        <h2 className="categories-section-title">Browse All Categories</h2>
        <p className="categories-section-subtitle">
          Each category focuses on practical implementation of knowledge and increasing employment opportunities.
        </p>
        
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="categories-category-card">
              <div className="categories-category-header" style={{ backgroundColor: category.color }}>
                <div className="categories-category-icon">
                  {category.icon}
                </div>
                <div className="categories-category-title-wrapper">
                  <h3 className="categories-category-card-title">{category.title}</h3>
                  <span className="categories-course-count">{category.courseCount}</span>
                </div>
              </div>
              
              <div className="categories-category-content">
                <p className="categories-category-description">{category.description}</p>
                
                <div className="categories-subcategories">
                  <h4 className="categories-subcategories-title">Includes:</h4>
                  <ul className="categories-subcategories-list">
                    {category.subcategories.map((subcat, index) => (
                      <li key={index} className="categories-subcategory-item">
                        <span className="categories-subcategory-name">{subcat.name}</span>
                        <span className="categories-subcategory-desc">{subcat.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="categories-category-actions">
                  <Link to={category.link} className="categories-view-courses-btn">
                    <FaArrowRight className="categories-btn-icon" />
                    View {category.title} Courses
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="categories-popular-categories-section">
        <h2 className="categories-section-title">Most Popular Categories</h2>
        <div className="categories-popular-categories">
          <div className="categories-popular-category">
            <div className="categories-popular-category-icon">
              <FaRobot />
            </div>
            <div className="categories-popular-category-content">
              <h3>Artificial Intelligence</h3>
              <p>Build intelligent systems and real AI tools for the future</p>
              <Link to="/courses?category=ai" className="categories-popular-link">
                View AI Courses <FaArrowRight />
              </Link>
            </div>
          </div>
          
          <div className="categories-popular-category">
            <div className="categories-popular-category-icon">
              <FaLaptopCode />
            </div>
            <div className="categories-popular-category-content">
              <h3>Web Development</h3>
              <p>Construct, build and manage websites - perfect for freelancers and startups</p>
              <Link to="/courses?category=web-dev" className="categories-popular-link">
                View Web Courses <FaArrowRight />
              </Link>
            </div>
          </div>
          
          <div className="categories-popular-category">
            <div className="categories-popular-category-icon">
              <FaBullhorn />
            </div>
            <div className="categories-popular-category-content">
              <h3>Digital Marketing</h3>
              <p>Master paid ads, social media strategy, and performance tracking</p>
              <Link to="/courses?category=marketing" className="categories-popular-link">
                View Marketing Courses <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How to Choose Section */}
      <div className="categories-choose-section">
        <div className="categories-choose-content">
          <h2 className="categories-choose-title">How to Choose Your Category?</h2>
          
          <div className="categories-choose-steps">
            <div className="categories-choose-step">
              <div className="categories-step-number">1</div>
              <div className="categories-step-content">
                <h3>Identify Your Goals</h3>
                <p>Are you looking for a career change, skill upgrade, or starting from scratch?</p>
              </div>
            </div>
            
            <div className="categories-choose-step">
              <div className="categories-step-number">2</div>
              <div className="categories-step-content">
                <h3>Assess Your Background</h3>
                <p>Consider your current skills, education level, and available time commitment.</p>
              </div>
            </div>
            
            <div className="categories-choose-step">
              <div className="categories-step-number">3</div>
              <div className="categories-step-content">
                <h3>Explore Career Outcomes</h3>
                <p>Research job opportunities and salary potential in each category.</p>
              </div>
            </div>
            
            <div className="categories-choose-step">
              <div className="categories-step-number">4</div>
              <div className="categories-step-content">
                <h3>Start with a Free Course</h3>
                <p>Try our free introductory courses before committing to a full program.</p>
              </div>
            </div>
          </div>
        
        </div>
      </div>

      {/* CTA Section */}
      <div className="categories-cta-section full-width">
        <div className="categories-cta-content">
          <h2 className="categories-cta-title">Ready to Start Learning?</h2>
          <p className="categories-cta-description">
            Choose your category, enroll in a course, and begin your journey toward a successful tech career.
          </p>
          
          <div className="categories-cta-buttons">
            <Link to="/courses" className="categories-primary-cta-btn">
              Browse All Courses
            </Link>
                     </div>
          
          <div className="categories-cta-features">
            <div className="categories-feature">
              <FaGraduationCap className="categories-feature-icon" />
              <span>Practical, Hands-on Learning</span>
            </div>
            <div className="categories-feature">
              <FaBriefcase className="categories-feature-icon" />
              <span>Industry-Relevant Skills</span>
            </div>
            <div className="categories-feature">
              <FaUsers className="categories-feature-icon" />
              <span>Expert Instructor Support</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default Categories;