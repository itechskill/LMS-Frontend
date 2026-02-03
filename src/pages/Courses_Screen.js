import React from 'react';
import './Courses_Screen.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Courses_Screen = () => {
  // Course data - replace with your actual course data
  const courses = [
    {
      id: 1,
      title: "Data Science",
      installmentFee: "50,000/- PKR",
      installmentDollar: "(Approx. $170)",
      discountedFee: "46,000/- PKR",
      discountedDollar: "(Approx. $160)",
      duration: "3 Months",
      technologies: ["Python", "R", "Machine Learning", "Data Visualization"],
      color: "#22013a" // Purple color from your CSS
    },
    {
      id: 2,
      title: "Artificial Intelligence",
      installmentFee: "50,000/- PKR",
      installmentDollar: "(Approx. $170)",
      discountedFee: "46,000/- PKR",
      discountedDollar: "(Approx. $160)",
      duration: "3 Months",
      technologies: ["Machine Learning", "Deep Learning", "Python", "TensorFlow"],
      color: "#8e5203" // Brown/orange color from your CSS
    },
    {
      id: 3,
      title: "Generative AI",
      installmentFee: "50,000/- PKR",
      installmentDollar: "(Approx. $170)",
      discountedFee: "46,000/- PKR",
      discountedDollar: "(Approx. $160)",
      duration: "3 Months",
      technologies: ["GANs", "Deep Learning", "Python", "TensorFlow"],
      color: "#22013a" // Purple color from your CSS
    },
    // NEW COURSES ADDED BELOW
    {
      id: 4,
      title: "Development and Operations (DevOps)",
      installmentFee: "50,000/- PKR",
      installmentDollar: "(approx. $170)",
      discountedFee: "46,000/- PKR",
      discountedDollar: "(approx. $160)",
      duration: "3 Months",
      technologies: ["Docker", "Kubernetes", "CI/CD Pipelines", "Cloud Platforms"],
      color: "#8e5203" // Brown/orange color from your CSS
    },
    {
      id: 5,
      title: "Cloud Computing",
      installmentFee: "50,000/- PKR",
      installmentDollar: "(approx. $170)",
      discountedFee: "46,000/- PKR",
      discountedDollar: "(approx. $160)",
      duration: "3 Months",
      technologies: ["AWS", "Microsoft Azure", "Google Cloud", "Virtualization"],
      color: "#22013a" // Purple color from your CSS
    },
    {
      id: 6,
      title: "FullStack Developer",
      installmentFee: "50,000/- PKR",
      installmentDollar: "(approx. $170)",
      discountedFee: "46,000/- PKR",
      discountedDollar: "(approx. $160)",
      duration: "4 Months",
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "Laravel"],
      color: "#8e5203" // Brown/orange color from your CSS
    },
    // After your existing 6 courses, add these:
{
  id: 7,
  title: "Mobile App Development",
  installmentFee: "50,000/- PKR",
  installmentDollar: "(approx. $170)",
  discountedFee: "46,000/- PKR",
  discountedDollar: "(approx. $160)",
  duration: "3 Months",
  technologies: ["Android Development", "iOS Development", "Flutter", "UI/UX Design"],
  color: "#22013a" // Purple
},
{
  id: 8,
  title: "Blockchain Development",
  installmentFee: "50,000/- PKR",
  installmentDollar: "(approx. $170)",
  discountedFee: "46,000/- PKR",
  discountedDollar: "(approx. $160)",
  duration: "3 Months",
  technologies: ["Smart Contracts", "Ethereum", "Solidity", "Decentralized Applications (DApps)"],
  color: "#8e5203" // Brown/orange
},
{
  id: 9,
  title: "Cyber Security", // Fixed typo from "Cycler Security" to "Cyber Security"
  installmentFee: "50,000/- PKR",
  installmentDollar: "(approx. $170)",
  discountedFee: "46,000/- PKR",
  discountedDollar: "(approx. $160)",
  duration: "3 Months",
  technologies: ["Ethical Hacking", "Network Security", "Penetration Testing", "Malware"],
  color: "#22013a" // Purple
},
// After your existing 9 courses, add these:
{
  id: 10,
  title: "Front-End Developer",
  installmentFee: "24,000/- PKR",
  installmentDollar: "(approx. $80)",
  discountedFee: "22,000/- PKR",
  discountedDollar: "(approx. $75)",
  duration: "2 Months",
  technologies: ["HTML", "CSS", "JavaScript", "Bootstrap"],
  color: "#8e5203" // Brown/orange (alternating from last course)
},
{
  id: 11,
  title: "Back-End Developer",
  installmentFee: "24,000/- PKR",
  installmentDollar: "(approx. $80)",
  discountedFee: "22,000/- PKR",
  discountedDollar: "(approx. $75)",
  duration: "2 Months",
  technologies: ["PHP", "MySQL", "API Development"],
  color: "#22013a" // Purple
},
{
  id: 12,
  title: "Laravel Developer",
  installmentFee: "24,000/- PKR",
  installmentDollar: "(approx. $80)",
  discountedFee: "22,000/- PKR",
  discountedDollar: "(approx. $75)",
  duration: "2 Months",
  technologies: ["Laravel Framework", "Blade Templates", "MVC Architecture"],
  color: "#8e5203" // Brown/orange
},
{
  id: 13,
  title: "Database Management",
  installmentFee: "40,000/- PKR",
  installmentDollar: "(approx. $130)",
  discountedFee: "36,000/- PKR",
  discountedDollar: "(approx. $120)",
  duration: "2 Months",
  technologies: ["SQL", "Database Design", "Data Modeling", "Database Management"],
  color: "#22013a" // Purple (alternating from last course's brown)
},
{
  id: 14,
  title: "WordPress Developer",
  installmentFee: "30,000/- PKR",
  installmentDollar: "(approx. $100)",
  discountedFee: "26,000/- PKR",
  discountedDollar: "(approx. $87)",
  duration: "2 Months",
  technologies: ["WordPress Themes", "Plugins", "Customization"],
  color: "#8e5203" // Brown/orange
},
{
  id: 15,
  title: "Digital Marketing",
  installmentFee: "30,000/- PKR",
  installmentDollar: "(approx. $100)",
  discountedFee: "26,000/- PKR",
  discountedDollar: "(approx. $87)",
  duration: "3 Months",
  technologies: ["Google Ads", "Facebook Ads", "Email Marketing", "SEO"],
  color: "#22013a" // Purple
},
{
  id: 16,
  title: "Social Media Marketing",
  installmentFee: "20,000/- PKR",
  installmentDollar: "(approx. $67)",
  discountedFee: "18,000/- PKR",
  discountedDollar: "(approx. $60)",
  duration: "2 Months",
  technologies: ["Facebook", "Instagram", "LinkedIn", "TikTok"],
  color: "#8e5203" // Brown/orange (alternating from last course's purple)
},
{
  id: 17,
  title: "Search Engine Optimization (SEO)",
  installmentFee: "35,000/- PKR", // Fixed from 3,500 to 35,000 (assuming typo)
  installmentDollar: "(approx. $117)",
  discountedFee: "30,000/- PKR",
  discountedDollar: "(approx. $100)",
  duration: "2 to 3 Months",
  technologies: ["On-Page SEO", "Off-Page SEO", "Technical SEO", "Keyword Research"],
  color: "#22013a" // Purple
},
{
  id: 18,
  title: "Content Writing",
  installmentFee: "25,000/- PKR",
  installmentDollar: "(approx. $83)",
  discountedFee: "23,000/- PKR",
  discountedDollar: "(approx. $75)",
  duration: "2 to 3 Months",
  technologies: ["Blog Writing", "Copywriting", "Creative Writing", "SEO Content"],
  color: "#8e5203" // Brown/orange
},
{
  id: 19,
  title: "Graphic Designing",
  installmentFee: "40,000/- PKR",
  installmentDollar: "(approx. $135)",
  discountedFee: "36,000/- PKR",
  discountedDollar: "(approx. $125)",
  duration: "3 Months",
  technologies: ["Logo Design", "Branding", "Bookhues", "UI/UX Basics and more"],
  color: "#22013a" // Purple
},
{
  id: 20,
  title: "Adobe Photoshop",
  installmentFee: "15,000/- PKR",
  installmentDollar: "(approx. $50)", // Fixed from $59 to $50 based on 15,000 PKR
  discountedFee: "12,000/- PKR",
  discountedDollar: "(approx. $40)", // Fixed from $48 to $40 based on 12,000 PKR
  duration: "2 Months",
  technologies: ["Photo Retouching", "Manipulation", "Poster Design"],
  color: "#8e5203" // Brown/orange
},
{
  id: 21,
  title: "Video & Audio Editing",
  installmentFee: "30,000/- PKR",
  installmentDollar: "(approx. $100)",
  discountedFee: "26,000/- PKR",
  discountedDollar: "(approx. $87)",
  duration: "2 Months",
  technologies: ["Premiere", "After Effects", "Audacity", "Final Cut Pro", "Photoshop"],
  color: "#22013a" // Purple
},
{
  id: 22,
  title: "Business Development",
  installmentFee: "25,000/- PKR", // Changed PRR to PKR
  installmentDollar: "(approx. $85)",
  discountedFee: "22,000/- PKR", // Changed PRR to PKR
  discountedDollar: "(approx. $80)",
  duration: "2 Months",
  technologies: ["Sales Strategies", "Market Research", "Client Management", "Lead Generation"],
  color: "#8e5203" // Brown/orange (alternating from last course's purple)
},
{
  id: 23,
  title: "E-Commerce Specialist",
  installmentFee: "25,000/- PKR", // Changed PRR to PKR
  installmentDollar: "(approx. $85)",
  discountedFee: "22,000/- PKR", // Changed PRR to PKR
  discountedDollar: "(approx. $80)",
  duration: "2 Months",
  technologies: ["Amazon Seller Center", "Shopify Store Management", "Product Listing", "Order Fulfillment", "Customer Handling"], // Fixed typos
  color: "#22013a" // Purple
}
  ];
    const handleApplyClick = (courseTitle) => {
    alert(`Applying for ${courseTitle} course!`);
    // You can replace this with actual application logic
  };

  // Function to handle Course Details button click
  const handleDetailsClick = (courseTitle) => {
    alert(`Showing details for ${courseTitle} course!`);
    // You can replace this with actual details logic
  };
  return (
    <div className="courses-page-container">
      {/* Page Header */}
      <div className="courses-header">
        <h1 className="courses-title"><i>All Courses</i></h1>
        <div className="courses-subheader">
          <h2 className="courses-subtitle"><i>Browse Our Complete Course Catalog</i></h2>
          <p className="courses-count">{courses.length} courses available</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-header" style={{ backgroundColor: course.color }}>
              <h3 className="course-title">{course.title}</h3>
            </div>
            
            <div className="course-content">
              <div className="course-fee-section">
                <div className="fee-row">
                  <span className="fee-label">Total Fee (Installment):</span>
                  <span className="fee-amount">{course.installmentFee}</span>
                </div>
                <div className="fee-dollar">{course.installmentDollar}</div>
                
                <div className="fee-row discounted">
                  <span className="fee-label">Discounted Fee (Advance):</span>
                  <span className="fee-amount">{course.discountedFee}</span>
                </div>
                <div className="fee-dollar">{course.discountedDollar}</div>
              </div>
              
              <div className="course-duration">
                <span className="duration-label">Course Duration:</span>
                <span className="duration-value">{course.duration}</span>
              </div>
              
              <div className="course-technologies">
                <span className="tech-label">Technologies Covered:</span>
                <div className="tech-tags">
                  {course.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
              
          <div className="course-buttons">
  <button className="apply-button">
    Apply Now
  </button>
  <button className="details-button">
    View Details
  </button>
</div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Footer for Courses Page */}
      <div className="courses-footer">
        <p className="courses-footer-text">
          Can't find what you're looking for? <a href="#contact" className="contact-link">Contact us</a> for custom learning solutions.
        </p>
      </div>
      <Footer/>
    </div>
  );
};

export default Courses_Screen; 



