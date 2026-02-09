import React from 'react';
import './Careers.css';
import { FaUsers, FaRocket, FaGraduationCap, FaGlobe, FaHeart, FaLaptop, FaLightbulb, FaHandshake, FaChartLine, FaBalanceScale, FaSmile } from 'react-icons/fa';
import Footer from'../components/Footer';

import { useScrollToTop } from '../hooks/useScrollToTop';
const Careers = () => {
    useScrollToTop();
  const jobOpenings = [
    {
      id: 1,
      title: "Tech Instructor (AI & Data Science)",
      department: "Education",
      type: "Full-time",
      location: "Remote",
      description: "Teach cutting-edge AI and Data Science courses to students worldwide.",
      requirements: ["2+ years industry experience", "Strong Python skills", "Teaching experience preferred"]
    },
    {
      id: 2,
      title: "Full Stack Developer",
      department: "Engineering",
      type: "Full-time",
      location: "Karachi/Remote",
      description: "Build and maintain our educational platform and tools.",
      requirements: ["React/Node.js expertise", "3+ years experience", "AWS/Cloud knowledge"]
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      type: "Full-time",
      location: "Remote",
      description: "Drive student acquisition and brand growth through digital channels.",
      requirements: ["SEO/SEM expertise", "Content creation skills", "Analytics proficiency"]
    },
    {
      id: 4,
      title: "Student Success Manager",
      department: "Operations",
      type: "Full-time",
      location: "Lahore/Remote",
      description: "Support students throughout their learning journey.",
      requirements: ["Excellent communication", "Customer service experience", "Education background"]
    },
    {
      id: 5,
      title: "Curriculum Developer",
      department: "Content",
      type: "Contract/Full-time",
      location: "Remote",
      description: "Design engaging, industry-relevant course content.",
      requirements: ["Subject matter expertise", "Instructional design experience", "Tech-savvy"]
    },
    {
      id: 6,
      title: "Sales Executive",
      department: "Business Development",
      type: "Full-time",
      location: "Islamabad/Remote",
      description: "Expand our corporate training partnerships.",
      requirements: ["Sales experience", "B2B background", "Strong networking skills"]
    }
  ];

  const benefits = [
    {
      id: 1,
      title: "Competitive Salary",
      description: "Industry-competitive compensation with performance bonuses",
      icon: <FaChartLine />
    },
    {
      id: 2,
      title: "Remote First",
      description: "Work from anywhere with flexible hours",
      icon: <FaGlobe />
    },
    {
      id: 3,
      title: "Learning Budget",
      description: "$1,000 annual budget for your own skill development",
      icon: <FaGraduationCap />
    },
    {
      id: 4,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs",
      icon: <FaHeart />
    },
    {
      id: 5,
      title: "Tech Equipment",
      description: "Latest laptop and tools for optimal productivity",
      icon: <FaLaptop />
    },
    {
      id: 6,
      title: "Growth Opportunities",
      description: "Clear career progression and leadership development",
      icon: <FaRocket />
    }
  ];

  const values = [
    {
      id: 1,
      title: "Student Success First",
      description: "Every decision starts with what's best for our students",
      icon: <FaUsers />
    },
    {
      id: 2,
      title: "Innovate Constantly",
      description: "Embrace new technologies and teaching methods",
      icon: <FaLightbulb />
    },
    {
      id: 3,
      title: "Collaborate Openly",
      description: "Transparent communication and teamwork",
      icon: <FaHandshake />
    },
    {
      id: 4,
      title: "Own & Execute",
      description: "Take initiative and deliver exceptional results",
      icon: <FaBalanceScale />
    },
    {
      id: 5,
      title: "Celebrate Wins",
      description: "Recognize achievements and have fun along the way",
      icon: <FaSmile />
    }
  ];

  const teamTestimonials = [
    {
      id: 1,
      text: "Teaching at iTechSkill lets me impact hundreds of students while staying at the forefront of AI technology. The best of both worlds!",
      name: "Dr. Sarah Ahmed",
      role: "AI Instructor",
      tenure: "2 years"
    },
    {
      id: 2,
      text: "The remote-first culture gives me perfect work-life balance while working on meaningful projects that transform education in Pakistan.",
      name: "Ali Raza",
      role: "Full Stack Developer",
      tenure: "1.5 years"
    }
  ];

  return (
    <div className="careers-container">
      {/* Hero Section */}
      <div className="careers-hero-section full-width">
        <div className="careers-hero-content">
          <h1 className="careers-hero-title"><i>Build Your Career at iTechSkill</i></h1>
          <h2 className="careers-hero-subtitle"><i>Advance with Pakistan's Leading EdTech Innovator</i></h2>
          <p className="careers-hero-description">
            Shape the future of education while building your dream career. 
            Join a team that's passionate about making quality tech education accessible to all.
          </p>
          <button className="careers-hero-cta-button">View Open Positions</button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="careers-stats-section">
        <div className="careers-stats-grid">
          <div className="careers-stat-card">
            <h3>50+</h3>
            <p>Team Members</p>
          </div>
          <div className="careers-stat-card">
            <h3>10,000+</h3>
            <p>Students Impacted</p>
          </div>
          <div className="careers-stat-card">
            <h3>15+</h3>
            <p>Countries Reached</p>
          </div>
          <div className="careers-stat-card">
            <h3>4.8/5</h3>
            <p>Employee Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Why Join Us */}
      <div className="careers-why-join-section">
        <h2 className="careers-section-title">Why Join iTechSkill?</h2>
        <p className="careers-section-subtitle">
          At iTechSkill, we're not just building courses—we're building careers, communities, 
          and futures. If you're passionate about education, technology, and innovation, 
          you'll find your place here.
        </p>
        
        <div className="careers-benefits-grid">
          {benefits.map(benefit => (
            <div key={benefit.id} className="careers-benefit-card">
              <div className="careers-benefit-icon">{benefit.icon}</div>
              <h3 className="careers-benefit-title">{benefit.title}</h3>
              <p className="careers-benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Work Culture */}
      <div className="careers-culture-section">
        <h2 className="careers-section-title">Our Work Culture</h2>
        <div className="careers-culture-content">
          <div className="careers-culture-points">
            <div className="careers-culture-point">
              <div className="careers-culture-bullet">●</div>
              <div>
                <h4>Innovative & Student-Centered</h4>
                <p>We prioritize what's best for learners in everything we do</p>
              </div>
            </div>
            <div className="careers-culture-point">
              <div className="careers-culture-bullet">●</div>
              <div>
                <h4>Flexible & Remote-First</h4>
                <p>Work from anywhere with schedules that fit your life</p>
              </div>
            </div>
            <div className="careers-culture-point">
              <div className="careers-culture-bullet">●</div>
              <div>
                <h4>Continuous Learning</h4>
                <p>We invest in your growth with regular training and development</p>
              </div>
            </div>
            <div className="careers-culture-point">
              <div className="careers-culture-bullet">●</div>
              <div>
                <h4>Collaborative Team Spirit</h4>
                <p>Work with passionate professionals who support each other</p>
              </div>
            </div>
            <div className="careers-culture-point">
              <div className="careers-culture-bullet">●</div>
              <div>
                <h4>Impact-Driven Mission</h4>
                <p>Every role contributes to transforming education in Pakistan</p>
              </div>
            </div>
          </div>
          
          <div className="careers-culture-image">
            <div className="careers-placeholder-image">
              <FaUsers className="careers-team-icon" />
              <p>Our Diverse & Talented Team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Openings */}
      <div className="careers-jobs-section">
        <h2 className="careers-section-title">Current Openings</h2>
        <p className="careers-section-subtitle">
          Explore opportunities to grow with us. We're hiring across multiple departments.
        </p>
        
        <div className="careers-jobs-grid">
          {jobOpenings.map(job => (
            <div key={job.id} className="careers-job-card">
              <div className="careers-job-header">
                <h3 className="careers-job-title">{job.title}</h3>
                <div className="careers-job-tags">
                  <span className="careers-job-tag department">{job.department}</span>
                  <span className="careers-job-tag type">{job.type}</span>
                  <span className="careers-job-tag location">{job.location}</span>
                </div>
              </div>
              
              <p className="careers-job-description">{job.description}</p>
              
              <div className="careers-job-requirements">
                <h4>Requirements:</h4>
                <ul>
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="careers-job-actions">
                <button className="careers-apply-btn">Apply Now</button>
                <button className="careers-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Values */}
      <div className="careers-values-section">
        <h2 className="careers-section-title">Our Core Values</h2>
        <div className="careers-values-grid">
          {values.map(value => (
            <div key={value.id} className="careers-value-card">
              <div className="careers-value-icon">{value.icon}</div>
              <h3 className="careers-value-title">{value.title}</h3>
              <p className="careers-value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Testimonials */}
      <div className="careers-testimonials-section">
        <h2 className="careers-section-title">Hear From Our Team</h2>
        <div className="careers-testimonials-grid">
          {teamTestimonials.map(testimonial => (
            <div key={testimonial.id} className="careers-testimonial-card">
              <p className="careers-testimonial-text">"{testimonial.text}"</p>
              <div className="careers-testimonial-author">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role} • {testimonial.tenure} at iTechSkill</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Process */}
      <div className="careers-process-section">
        <h2 className="careers-section-titlee">Our Hiring Process</h2>
        <div className="careers-process-steps">
          <div className="careers-process-step">
            <div className="careers-step-number">1</div>
            <h3>Application Review</h3>
            <p>We review your resume and portfolio within 3-5 business days</p>
          </div>
          <div className="careers-process-step">
            <div className="careers-step-number">2</div>
            <h3>Initial Interview</h3>
            <p>30-minute video call with our HR team</p>
          </div>
          <div className="careers-process-step">
            <div className="careers-step-number">3</div>
            <h3>Technical Assessment</h3>
            <p>Role-specific task or case study</p>
          </div>
          <div className="careers-process-step">
            <div className="careers-step-number">4</div>
            <h3>Final Interview</h3>
            <p>Meet the team and department head</p>
          </div>
          <div className="careers-process-step">
            <div className="careers-step-number">5</div>
            <h3>Offer & Onboarding</h3>
            <p>Welcome to the iTechSkill family!</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="careers-cta-section">
        <div className="careers-cta-content">
          <h2 className="careers-cta-title">Don't See Your Perfect Role?</h2>
          <p className="careers-cta-description">
            We're always looking for talented people. Send us your resume and tell us how you can contribute!
          </p>
          <button className="careers-primary-cta-btn">Submit General Application</button>
          <p className="careers-email-cta">
            Or email us at: <a href="mailto:itechskill6@gmail.com">itechskill6@gmail.com</a>
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Careers;