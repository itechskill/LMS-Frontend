import React, { useState, useRef, useEffect } from 'react';
import './YouTubeRecommendations.css';
import student from '../assets/student.png';
import aiiImage from '../assets/aii.png';
import comptiaImage from '../assets/comptia.png';
import awsImage from '../assets/aws.png';
import pmiImage from '../assets/pmi.png';
import report from '../assets/report.png';
import { FaChevronLeft, FaChevronRight, FaRobot, FaCertificate, FaChartLine, FaLaptopCode, FaCloud, FaDatabase, FaCheck, FaPlay, FaYoutube, } from 'react-icons/fa';
import Footer from '../components/Footer'; // ✅ Go up one level, then into components
import '../components/Footer.css'; // ✅ If Footer.css is with Footer.js
import PlanPrice from '../components/PlanPrice'; // ✅
import CompaniesLogo from '../components/CompaniesLogo';
import Review from '../components/Review';
import { useScrollToTop } from '../hooks/useScrollToTop';

const YouTubeRecommendations = () => {
  useScrollToTop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lectureIndex, setLectureIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0); // ✅ Fixed
  const [trendingCardsPerView, setTrendingCardsPerView] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [demoCardsPerView, setDemoCardsPerView] = useState(4);
  const [demoIndex, setDemoIndex] = useState(0); // ✅ Moved here
  const carouselRef = useRef(null);
  const lectureCarouselRef = useRef(null);


 useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Set different cards per view based on screen size
      if (window.innerWidth <= 480) {
        setDemoCardsPerView(1);
        setTrendingCardsPerView(1); // Add this
      } else if (window.innerWidth <= 768) {
        setDemoCardsPerView(2);
        setTrendingCardsPerView(2); // Add this
      } else if (window.innerWidth <= 1024) {
        setDemoCardsPerView(3);
        setTrendingCardsPerView(3); // Add this
      } else {
        setDemoCardsPerView(4);
        setTrendingCardsPerView(4); // Add this
      }
    };
     handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const skillsData = [
    {
      id: 1,
      title: "Generative AI",
      description: "Master AI tools like ChatGPT, DALL-E, and build your own AI models. Perfect for beginners to advanced learners.",
      icon: <FaRobot className="skill-icon" />,
      color: "#22013a",
      coursesCount: "12+ courses",
      // link: "/All_Courses",
    },
    {
      id: 2,
      title: "IT Certifications",
      description: "Get certified in AWS, Google Cloud, Cisco, and more. Boost your IT career with recognized certifications.",
      icon: <FaCertificate className="skill-icon" />,
      color: "#8e5203",
      coursesCount: "8+ certifications",
      link: "/courses?category=certifications"
    },
    {
      id: 3,
      title: "Data Science",
      description: "Learn data analysis, machine learning, and visualization. Become a data-driven decision maker.",
      icon: <FaChartLine className="skill-icon" />,
      color: "#22013a",
      coursesCount: "15+ courses",
      link: "/courses?category=data-science"
    },
    {
      id: 4,
      title: "Web Development",
      description: "Full-stack development with modern frameworks. Build responsive websites and web applications.",
      icon: <FaLaptopCode className="skill-icon" />,
      color: "#8e5203",
      coursesCount: "10+ courses",
      link: "/courses?category=web-dev"
    },
    {
      id: 5,
      title: "Cloud Computing",
      description: "Master AWS, Azure, Google Cloud. Learn cloud architecture, deployment, and management.",
      icon: <FaCloud className="skill-icon" />,
      color: "#22013a",
      coursesCount: "7+ courses",
      link: "/courses?category=cloud"
    },
    {
      id: 6,
      title: "Database Management",
      description: "SQL, NoSQL, data modeling and administration. Essential skills for backend developers.",
      icon: <FaDatabase className="skill-icon" />,
      color: "#8e5203",
      coursesCount: "5+ courses",
      link: "/courses?category=database"
    },
    {
      id: 7,
      title: "Mobile App Development",
      description: "Build native and cross-platform mobile apps for iOS and Android.",
      icon: <FaLaptopCode className="skill-icon" />,
      color: "#22013a",
      coursesCount: "6+ courses",
      link: "/courses?category=mobile"
    },
    {
      id: 8,
      title: "Digital Marketing",
      description: "Learn SEO, social media marketing, and digital advertising strategies.",
      icon: <FaChartLine className="skill-icon" />,
      color: "#8e5203",
      coursesCount: "9+ courses",
      link: "/courses?category=marketing"
    }
  ];

  // Demo Lectures Data
  const demoLectures = [
    {
      id: 1,
      title: "AI Artificial Intelligence",
      description: "Learn the fundamentals of Artificial Intelligence and how it's transforming industries.",
      link: "https://youtu.be/oTnR5x2KME0",
      thumbnail: "https://i.ytimg.com/vi/oTnR5x2KME0/hqdefault.jpg"
    },
    {
      id: 2,
      title: "Data Science",
      description: "Start your data science journey with this comprehensive introductory course.",
      link: "https://youtu.be/e3LZNYqsJ_Q",
      thumbnail: "https://i.ytimg.com/vi/e3LZNYqsJ_Q/hqdefault.jpg"
    },
    {
      id: 3,
      title: "Web Development",
      description: "Build responsive websites from scratch using modern web technologies.",
      link: "https://youtu.be/nSRCJGvRJ-o",
      thumbnail: "https://i.ytimg.com/vi/nSRCJGvRJ-o/hqdefault.jpg"
    },
    {
      id: 4,
      title: "Graphic Designing",
      description: "Master graphic design principles and tools for creating stunning visuals.",
      link: "https://youtu.be/h7CTU2NxJ6A",
      thumbnail: "https://i.ytimg.com/vi/h7CTU2NxJ6A/hqdefault.jpg"
    },
    {
      id: 5,
      title: "Digital Marketing",
      description: "Learn digital marketing strategies to grow your business online.",
      link: "https://youtu.be/QGdYlqEc0s8",
      thumbnail: "https://i.ytimg.com/vi/QGdYlqEc0s8/hqdefault.jpg"
    },
    {
      id: 6,
      title: "Search Engine Optimization",
      description: "Master SEO techniques to improve your website's search engine ranking.",
      link: "https://youtu.be/vTJXbtQ9odY",
      thumbnail: "https://i.ytimg.com/vi/vTJXbtQ9odY/hqdefault.jpg"
    }
  ];
const demoMaxIndex = Math.max(0, demoLectures.length - (demoCardsPerView || 1));
// Update the trendingCourses array (around line 150-155)
const trendingCourses = [
  {
    ...demoLectures[0],
    pricing: "$170",
    discountedPrice: "$160",
    isDiscounted: true,
    rating: 4.7,
    students: "15,320"
  },
  {
    ...demoLectures[4],
    pricing: "$100",
    discountedPrice: "$87",
    isDiscounted: true,
    rating: 4.5,
    students: "8,745"
  },
  {
    ...demoLectures[1],
    pricing: "$170",
    discountedPrice: "$160",
    isDiscounted: true,
    rating: 4.8,
    students: "22,150"
  },
  {
    ...demoLectures[5],
    pricing: "$110",
    discountedPrice: "$100",
    isDiscounted: true,
    rating: 4.3,
    students: "5,890"
  },
  {
    ...demoLectures[3],
    pricing: "$135",
    discountedPrice: "$125",
    isDiscounted: true,
    rating: 4.9,
    students: "18,430"
  },
  {
    ...demoLectures[2],
    pricing: "$100",
    discountedPrice: "$87",
    isDiscounted: true,
    rating: 4.6,
    students: "12,670"
  }
];

const certificationsData = [
  {
    id: 1,
    title: "CompTIA",
    categories: "Cloud, Networking, Cybersecurity",
    description: "Industry-standard IT certifications for building foundational tech skills",
    color: "#22013a",
    image: comptiaImage,
    alt: "CompTIA Certification",
    logoWidth: "250px"
  },
  {
    id: 2,
    title: "AWS",
    categories: "Cloud, AI, Coding, Networking",
    description: "Amazon Web Services certifications for cloud professionals",
    color: "#8e5203",
    image: awsImage,
    alt: "AWS Certification"
  },
  {
    id: 3,
    title: "PMI",
    categories: "Project & Program Management",
    description: "Project Management Institute certifications for project leaders",
    color: "#22013a",
    image: pmiImage,
    alt: "PMI Certification",
    logoWidth: "250px"
  }
];
const cardsPerView = isMobile ? 1 : 2;
const maxIndex = Math.ceil(skillsData.length / cardsPerView) - 1;
  
  const lectureCardsPerView = 4;
  const lectureMaxIndex = Math.max(0, Math.ceil(demoLectures.length / lectureCardsPerView) - 1);

const nextSlide = () => {
  setCurrentIndex(prev => {
    const newIndex = prev + 1;
    if (newIndex > maxIndex) {
      return prev;
    }
    return newIndex;
  });
};

const prevSlide = () => {
  setCurrentIndex(prev => {
    const newIndex = prev - 1;
    if (newIndex < 0) {
      return prev;
    }
    return newIndex;
  });
};

  const nextLectureSlide = () => {
    setLectureIndex(prev => {
      if (prev >= lectureMaxIndex) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevLectureSlide = () => {
    setLectureIndex(prev => {
      if (prev <= 0) {
        return lectureMaxIndex;
      }
      return prev - 1;
    });
  };
// Add these functions
const nextDemoSlide = () => {
  setDemoIndex(prev => {
    const newIndex = prev + 1;
    if (newIndex > demoMaxIndex) {
      return prev;
    }
    return newIndex;
  });
};

const prevDemoSlide = () => {
  setDemoIndex(prev => {
    const newIndex = prev - 1;
    if (newIndex < 0) {
      return prev;
    }
    return newIndex;
  });
};

  const trendingMaxIndex = trendingCourses.length - trendingCardsPerView;

const nextTrendingSlide = () => {
  setTrendingIndex(prev => {
    const newIndex = prev + 1;
    if (newIndex > trendingMaxIndex) {
      return prev;
    }
    return newIndex;
  });
};

const prevTrendingSlide = () => {
  setTrendingIndex(prev => {
    const newIndex = prev - 1;
    if (newIndex < 0) {
      return prev;
    }
    return newIndex;
  });
};


// const handleSkillClick = (skill) => {
//   window.open(skill.link, '_blank');
// };

const handleLectureClick = (link) => {
  window.open(link, '_blank');
};





  return (
    
    <div className="youtube-recommendations-container">
      {/* Purple Recommendation Box */}
      <div className="purple-recommendation-box full-width">
        <div className="purple-box-content">
          <div className="purple-box-text">
            <h2 className="purple-box-title"><i>Master Data Analytics Your Way</i></h2>
            <h3 className="purple-box-subtitle"><i>Learn from industry experts and transform your career. Start with fundamentals and advance to expert level.</i></h3>
          </div>
          
          <div className="purple-box-image full-height">
            <img 
              src={student} 
              alt="Student learning" 
              className="student-image full-height"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x400/22013a/ffffff?text=Student+Image";
              }}
            />
          </div>
        </div>
      </div>

      {/* Skills & Certifications Section WITH CAROUSEL */}
      <div className="skills-certifications-section">
        <div className="skills-container">
          <div className="skills-content">
            <h2 className="skills-main-title"><i>
              Future-Proof Your Career with Elite Skills Training</i>
            </h2>
            <p className="skills-subtitle">
              <i>ITechSkill</i>: Where ambition meets expertise. We build professionals equipped for tomorrow's challenges.
            </p>
          </div>

          <div className="skills-carousel-container">
            <div className="carousel-wrapper">
              <div className="skills-carousel" ref={carouselRef}>
               <div 
  className="skills-carousel-track"
  style={{ 
    transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
  }}
>
                  {skillsData.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="skill-card"
                       >
                      <div className="skill-card-header" style={{ backgroundColor: skill.color }}>
                        <div className="skill-icon-container">
                          {skill.icon}
                        </div>
                      </div>
                      
                      <div className="skill-card-content">
                        <h3 className="skill-title">{skill.title}</h3>
                        <p className="skill-description">{skill.description}</p>
                        
                        <div className="skill-meta">
                          <span className="courses-count">{skill.coursesCount}</span>
                        </div>
                        
                     <button 
  className="explore-button"
  onClick={(e) => {
    window.location.href = "/courses";
  }}
  style={{ backgroundColor: skill.color }}
>
  Explore
</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
 <div className="carousel-controls">
  {currentIndex > 0 && (
    <button 
      className="carousel-arrow left-arrow"
      onClick={prevSlide}
      aria-label="Previous slide"
    >
      <FaChevronLeft />
    </button>
  )}
  
  <div className="carousel-dots">
    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
      <button
        key={index}
        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
        onClick={() => setCurrentIndex(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
  
  {currentIndex < maxIndex && (
    <button 
      className="carousel-arrow right-arrow"
      onClick={nextSlide}
      aria-label="Next slide"
    >
      <FaChevronRight />
    </button>
  )}
</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Era Career Section */}
      <div className="ai-era-section">
        <div className="ai-era-container">
          <div className="ai-era-content">
            <h2 className="ai-era-title">
              Transform Your Career with iTechSkills AI Mastery
            </h2>
            <p className="ai-era-subtitle">
              Future-proof your expertise with iTechSkills Personal Pro Plan. Access exclusive content crafted by industry-leading AI experts.
            </p>
            
       <div className="ai-era-features">
  <div className="ai-era-feature-item">
    <FaCheck className="ai-era-feature-icon" />
    <span>Master Cutting-Edge AI Technologies</span>
  </div> 
  <div className="ai-era-feature-item">
    <FaCheck className="ai-era-feature-icon" />
    <span>Ace Industry-Recognized Certifications</span>
  </div>
  <div className="ai-era-feature-item">
    <FaCheck className="ai-era-feature-icon" />
    <span>Train with Intelligent AI Mentors</span>
  </div>
  {/* FIX THIS LINE: */}
  <div className="ai-era-feature-item"> {/* Changed from feature-item */}
    <FaCheck className="ai-era-feature-icon" /> {/* Changed from feature-icon */}
    <span>Accelerate Your Tech Career Growth</span>
  </div>
</div>
            
            <button className="ai-era-button">
              Start Your Journey
            </button>
            
            <p className="ai-era-pricing">
              Starting at <span className="price">$11.00</span>/month
            </p>
          </div>
          
          <div className="ai-era-image">
            <div className="image-placeholder">
              <img 
                src={aiiImage} 
                alt="iTechSkills AI Platform" 
                className="ai-platform-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x400/22013a/ffffff?text=iTechSkills+AI";
                }}
              />
            </div>
          </div>
        </div>
      </div>

     {/* Demo Lectures Section */}
<div className="demo-lectures-section">
  <div className="demo-lectures-header">
    <h2 className="demo-lectures-title">
      <FaYoutube className="youtube-icon" />
      Free Demo Lectures
    </h2>
    <p className="demo-lectures-subtitle">
      Experience our teaching style with these free introductory lectures. No commitment required!
    </p>
    <a 
      href="https://www.youtube.com/@ArteAnalytics/playlists" 
      target="_blank" 
      rel="noopener noreferrer"
      className="youtube-channel-link"
    >
      <FaYoutube /> Watch All Demo Lectures on YouTube
    </a>
  </div>

  <div className="demo-lectures-carousel-wrapper">
{demoIndex > 0 && (
  <button 
    className="demo-lectures-arrow left"
    onClick={prevDemoSlide}
    aria-label="Previous demo lectures"
  >
    <FaChevronLeft />
  </button>
)}

{/* Change this condition */}
{demoIndex < demoMaxIndex && (
  <button 
    className="demo-lectures-arrow right"
    onClick={nextDemoSlide}
    aria-label="Next demo lectures"
  >
    <FaChevronRight />
  </button>
)}

   <div 
  className="demo-lectures-track"
  style={{
    transform: `translateX(-${demoIndex * (100 / demoCardsPerView)}%)`,
    transition: 'transform 0.5s ease'
  }}
>{demoLectures.map((lecture) => (
        <div 
          key={lecture.id} 
          className="demo-lecture-card"
          onClick={() => handleLectureClick(lecture.link)}
        >
          <div className="demo-lecture-thumbnail">
            <img 
              src={lecture.thumbnail} 
              alt={lecture.title}
              className="demo-thumbnail-img"
              onError={(e) => {
                e.target.onerror = null;
                const videoId = lecture.link.split('youtu.be/')[1] || lecture.link.split('v=')[1];
                if (videoId) {
                  e.target.src = `https://i.ytimg.com/vi/${videoId.split('?')[0]}/hqdefault.jpg`;
                }
              }}
            />
            <div className="demo-play-overlay">
              <FaPlay className="demo-play-icon" />
            </div>
          </div>
          
          <div className="demo-lecture-content">
            <h3 className="demo-lecture-title">{lecture.title}</h3>
            <p className="demo-lecture-description">{lecture.description}</p>
            <button 
              className="demo-watch-button"
              onClick={(e) => {
                e.stopPropagation();
                handleLectureClick(lecture.link);
              }}
            >
              Watch Now
            </button>
          </div>
        </div>
      ))}
    </div>

    {demoIndex < demoMaxIndex && (
      <button 
        className="demo-lectures-arrow right"
        onClick={nextDemoSlide}
        aria-label="Next demo lectures"
      >
        <FaChevronRight />
      </button>
    )}
  </div>
</div>
    
<CompaniesLogo/>

<Review/>


      {/* Certifications Section */}
      <div className="certifications-section">
        <div className="certifications-container">
          <div className="certifications-main-content">
            <div className="certifications-text-content">
              <h2 className="certifications-title">
                Get certified and take your career to the next level
              </h2>
              <p className="certifications-subtitle">
                Succeed in certifications with expert courses, comprehensive practice tests, and exclusive offers on exam vouchers.
              </p>
            </div>

            <div className="certifications-grid">
              {certificationsData.map((cert) => (
                <div 
                  key={cert.id} 
                  className="certification-card"
                >
                  <div className="certification-logo-container">
                    <img 
                      src={cert.image} 
                      alt={cert.alt}
                      style={{
                        width: cert.logoWidth,
                        maxWidth: '100%'
                      }}
                      className="certification-logo"
                    />
                  </div>
                  
                  <div className="certification-content">
                    <h3 className="certification-title">{cert.title}</h3>
                    <div className="certification-categories">{cert.categories}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

     {/* Trending Courses Section */}
<div className="trending-courses-section">
  <div className="trending-courses-header">
    <h2 className="trending-courses-title">Trending courses</h2>
  </div>

  <div className="trending-carousel-wrapper">
    {trendingIndex > 0 && (
      <button 
        className="trending-carousel-arrow left"
        onClick={prevTrendingSlide}
        aria-label="Previous courses"
      >
        <FaChevronLeft />
      </button>
    )}
<div 
  className="trending-courses-track"
  style={{
    transform: `translateX(-${trendingIndex * (100 / trendingCardsPerView)}%)`,
    transition: 'transform 0.5s ease',
    '--cards-per-view': trendingCardsPerView // Add this line
  }}
>

      {trendingCourses.map((course, index) => (
        <div 
          key={`${course.id}-${index}`}
          className="trending-course-card"
          onClick={() => handleLectureClick(course.link)}
        >
          <div className="trending-thumbnail">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="trending-thumbnail-img"
              onError={(e) => {
                e.target.onerror = null;
                const videoId = course.link.split('youtu.be/')[1] || course.link.split('v=')[1];
                if (videoId) {
                  e.target.src = `https://i.ytimg.com/vi/${videoId.split('?')[0]}/hqdefault.jpg`;
                }
              }}
            />
            <div className="trending-play-overlay">
              <FaPlay className="trending-play-icon" />
            </div>
          </div>
          
          <div className="trending-course-info">
            <h3 className="trending-course-title">{course.title}</h3>
            <p className="trending-course-description">{course.description}</p>
            
            {/* Add Pricing Section Here */}
            <div className="trending-course-pricing">
              <div className="trending-course-rating">
                <span className="trending-rating-star">★</span>
                <span className="trending-rating-value">{course.rating}</span>
                <span className="trending-students-count">({course.students} students)</span>
              </div>
              
              <div className="trending-price-container">
                {course.isDiscounted ? (
                  <>
                    <span className="trending-original-price">{course.pricing}</span>
                    <span className="trending-discounted-price">{course.discountedPrice}</span>
                  </>
                ) : (
                  <span className="trending-current-price">{course.pricing}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {trendingIndex < trendingMaxIndex && (
      <button 
        className="trending-carousel-arrow right"
        onClick={nextTrendingSlide}
        aria-label="Next courses"
      >
        <FaChevronRight />
      </button>
    )}
  </div>
</div>

<PlanPrice/>
<div className="trends-report-section">
  <div className="trends-report-container">
    <div className="trends-report-content">
      <h2 className="trends-report-title">
        Get the 2026 Global Learning & Skills Trends Report
      </h2>
      <p className="trends-report-description">
        If you or your organization are looking for help navigating change and AI transformation, you'll find a roadmap for action in our popular annual report.
      </p>
      <button className="trends-report-button">
        Download now →
      </button>
    </div>
    
    <div className="trends-report-image">
      <img 
        src={report}
        alt="2026 Global Learning & Skills Trends Report"
        className="report-cover-image"
      />
    </div>
  </div>
</div>



{/* Popular Skills Section */}
<div className="popular-skills-section">
  <h2 className="popular-skills-title">Popular Skills</h2>
  
  <div className="skills-content-wrapper">
    
    {/* LEFT SIDE - ChatGPT Section */}
    <div className="chatgpt-section">
      <div>
        <h3 className="chatgpt-title">ChatGPT is a top skill</h3>
        <a href="/courses/chatgpt" className="see-chatgpt-link">
          See ChatGPT courses ›
        </a>
        <p className="learners-count">5,462,840 learners</p>
      </div>
      
      <div className="trending-skills-button">
        Show all trending skills ⤴
      </div>
    </div>
    
    {/* RIGHT SIDE - 3 Column Grid */}
    <div className="skills-categories-wrapper">
      
      {/* Development Column */}
      <div className="skill-category-column">
        <h3 className="category-tiitle">Development</h3>
        <ul className="category-skills-list">
          <li className="skill-link-item">
            <a href="/topic/python" className="skill-link">Python</a>
            <p className="skill-learners-count">50,176,801 learners</p>
          </li>
          <li className="skill-link-item">
            <a href="/topic/web-development" className="skill-link">Web Development</a>
            <p className="skill-learners-count">14,475,692 learners</p>
          </li>
          <li className="skill-link-item">
            <a href="/topic/data-science" className="skill-link">Data Science</a>
            <p className="skill-learners-count">8,338,020 learners</p>
          </li>
        </ul>
      </div>
      
      {/* Design Column */}
      <div className="skill-category-column">
        <h3 className="category-tiitle">Design</h3>
        <ul className="category-skills-list">
          <li className="skill-link-item">
            <a href="/topic/blender" className="skill-link">Blender</a>
            <p className="skill-learners-count">3,108,331 learners</p>
          </li>
          <li className="skill-link-item">
            <a href="/topic/graphic-design" className="skill-link">Graphic Design</a>
            <p className="skill-learners-count">4,687,243 learners</p>
          </li>
          <li className="skill-link-item">
            <a href="/topic/ux-design" className="skill-link">User Experience (UX) Design</a>
            <p className="skill-learners-count">2,150,373 learners</p>
          </li>
        </ul>
      </div>
      
      {/* Business Column */}
      <div className="skill-category-column">
        <h3 className="category-tiitle">Business</h3>
        <ul className="category-skills-list">
          <li className="skill-link-item">
            <a href="/topic/pmp" className="skill-link">PMI Project Management Professional (PMP)</a>
            <p className="skill-learners-count">2,860,044 learners</p>
          </li>
          <li className="skill-link-item">
            <a href="/topic/power-bi" className="skill-link">Microsoft Power BI</a>
            <p className="skill-learners-count">5,139,271 learners</p>
          </li>
          <li className="skill-link-item">
            <a href="/topic/capm" className="skill-link">PMI Certified Associate in Project Management (CAPM)</a>
            <p className="skill-learners-count">485,497 learners</p>
          </li>
        </ul>
      </div>
      
    </div>
  </div>
</div>

     <Footer />
    </div>
  );
};

export default YouTubeRecommendations;
