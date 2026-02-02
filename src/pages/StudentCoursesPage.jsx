// src/pages/StudentCoursesPage.jsx
import React, { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import {
  getStudentEnrollments,
  getProgress,
  enrollStudentInCourse,
  getAllCourses,
  getCoursePrice,
  checkPaymentStatus,
  getEnrollmentStatus,
  completePaymentProcess
} from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaChartLine,
  FaArrowRight,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaBook,
  FaCalendarAlt,
  FaLock,
  FaUnlock,
  FaSpinner,
  FaRupeeSign,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaPlay,
  FaShoppingCart,
  FaBars,
  FaTimes
} from "react-icons/fa";

const StudentCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [coursePrices, setCoursePrices] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const userInfo = localStorage.getItem("userInfo");
  const studentId = userInfo ? JSON.parse(userInfo).id : null;

  useEffect(() => {
    if (studentId) {
      initializePage();
    }
  }, [studentId]);

  const initializePage = async () => {
    await Promise.all([fetchEnrollments(), fetchAllCourses()]);
  };

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getStudentEnrollments(studentId);

      const active = data.filter(e => !e.isDeleted && e.course);
      setEnrollments(active);

      const progressMap = {};
      const priceMap = {};
      const paymentMap = {};
      
      for (const e of active) {
        const courseId = e.course._id;
        
        try {
          // Get progress
          const res = await getProgress(studentId, courseId);
          progressMap[courseId] = res.progressPercentage || 0;
          
          // Get course price
          try {
            const priceRes = await getCoursePrice(courseId);
            priceMap[courseId] = priceRes.price || 0;
          } catch (priceErr) {
            priceMap[courseId] = e.course.price || 0;
          }
          
          // Check payment status
          try {
            const paymentRes = await checkPaymentStatus(studentId, courseId);
            paymentMap[courseId] = paymentRes.isPaid || false;
          } catch (paymentErr) {
            paymentMap[courseId] = e.isPaid || false;
          }
          
        } catch (err) {
          progressMap[courseId] = 0;
          priceMap[courseId] = e.course.price || 0;
          paymentMap[courseId] = e.isPaid || false;
        }
      }
      
      setProgressData(progressMap);
      setCoursePrices(priceMap);
      setPaymentStatus(paymentMap);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const data = await getAllCourses();
      setAvailableCourses(data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleEnrollCourse = async () => {
    if (!selectedCourse) return;
    
    setEnrolling(true);
    setError("");
    
    try {
      // Find selected course details
      const selectedCourseData = availableCourses.find(c => c._id === selectedCourse);
      const coursePrice = selectedCourseData?.price || 0;
      
      if (coursePrice === 0) {
        // Free course - enroll directly
        // await enrollStudentInCourse(studentId, selectedCourse, true);
        await enrollStudentInCourse(studentId, selectedCourse, selectedCourseData.price === 0);
        alert("Successfully enrolled in free course!");
        await fetchEnrollments();
      } else {
        // Paid course - show payment modal
        setSelectedCourseForPayment(selectedCourseData);
        setShowPaymentModal(true);
      }
      
      setSelectedCourse("");
    } catch (err) {
      setError("Enrollment failed. Please try again.");
      console.error("Error enrolling:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const handlePayment = async (courseId, paymentMethod) => {
    try {
      setProcessingPayment(prev => ({ ...prev, [courseId]: true }));
      
      const course = availableCourses.find(c => c._id === courseId);
      const coursePrice = course?.price || 0;
      
      const result = await completePaymentProcess(courseId, paymentMethod, coursePrice);
      
      if (result.success) {
        alert("Payment successful! Course is now unlocked.");
        setShowPaymentModal(false);
        setSelectedCourseForPayment(null);
        await fetchEnrollments();
      } else {
        alert(result.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      alert("Payment processing error. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setProcessingPayment(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const getStatus = (progress) => {
    if (progress === 100) {
      return { text: "Completed", color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle /> };
    }
    if (progress > 0) {
      return { text: "In Progress", color: "#F1D572", bg: "rgba(241, 213, 114, 0.2)", icon: <FaChartLine /> };
    }
    return { text: "Not Started", color: "#6b7280", bg: "#f3f4f6", icon: <FaBook /> };
  };

  // const isCourseLocked = (enrollment, courseId) => {
  //   const coursePrice = coursePrices[courseId] || 0;
  //   const isPaid = paymentStatus[courseId] || false;
    
  //   // Course is locked if:
  //   // 1. It's a paid course (price > 0)
  //   // 2. User hasn't paid for it
  //   return coursePrice > 0 && !isPaid;
  // };
  const isCourseLocked = (enrollment, courseId) => {
  const coursePrice = coursePrices[courseId] ?? enrollment.course.price ?? 0;
  const isPaid = paymentStatus[courseId] ?? enrollment.isPaid ?? false;

  // FREE course kabhi lock nahi hoga
  if (coursePrice === 0) return false;

  return !isPaid;
};


  const getCourseAccessType = (courseId) => {
    // const coursePrice = coursePrices[courseId] || 0;
    const coursePrice = coursePrices[courseId] ?? course.price ?? 0;
    const isPaid = paymentStatus[courseId] || false;
    
    if (coursePrice === 0) {
      return { type: "free", label: "Free Course", icon: <FaUnlock />, color: "#10b981", bg: "#d1fae5" };
    } else if (isPaid) {
      return { type: "paid_unlocked", label: "Paid (Unlocked)", icon: <FaUnlock />, color: "#3D1A5B", bg: "rgba(61, 26, 91, 0.1)" };
    } else {
      return { type: "paid_locked", label: "Payment Required", icon: <FaLock />, color: "#ef4444", bg: "#fee2e2" };
    }
  };

  const StatBadge = ({ label, value, color }) => (
    <div style={styles.statBadgeContainer}>
      <div style={{ ...styles.statBadgeValue, color }}>{value}</div>
      <div style={styles.statBadgeLabel}>{label}</div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <StudentSidebar />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <div style={styles.loadingText}>Loading your courses...</div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => (progressData[e.course._id] || 0) === 100).length;
  const unlockedCourses = enrollments.filter(e => {
    const courseId = e.course._id;
    const coursePrice = coursePrices[courseId] || 0;
    const isPaid = paymentStatus[courseId] || false;
    return coursePrice === 0 || isPaid;
  }).length;
  const avgProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + (progressData[e.course._id] || 0), 0) / totalCourses)
    : 0;

  return (
    <div style={styles.pageContainer}>
      {/* Mobile Menu Button */}
      <button 
        style={styles.mobileMenuButton}
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          style={styles.mobileOverlay}
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div 
            style={styles.mobileSidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <StudentSidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div style={styles.desktopSidebar}>
        <StudentSidebar />
      </div>
      
      <div style={styles.mainContent}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div style={styles.headerLeft}>
              <h1 style={styles.pageTitle}>
                <FaGraduationCap style={styles.titleIcon} />
                My Courses
              </h1>
              <p style={styles.pageSubtitle}>
                Track your progress, access course materials, and continue learning
              </p>
            </div>
            
            <div style={styles.liveDataBadge}>
              <p style={styles.liveDataText}>
                Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div style={styles.statsContainer}>
            <StatBadge 
              label="Total Courses" 
              value={totalCourses} 
              color="#3D1A5B" 
            />
            <StatBadge 
              label="Completed" 
              value={completedCourses} 
              color="#10b981" 
            />
            <StatBadge 
              label="Unlocked" 
              value={unlockedCourses} 
              color="#F1D572" 
            />
            <StatBadge 
              label="Avg Progress" 
              value={`${avgProgress}%`} 
              color="#A68A46" 
            />
          </div>
        </div>

        {/* Enrollment Section */}
        <div style={styles.enrollSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIndicator}></div>
            <h2 style={styles.sectionTitle}>Enroll in New Course</h2>
          </div>
          
          <p style={styles.enrollSubtitle}>
            Choose from available courses to expand your learning
          </p>
          
          <div style={styles.enrollForm}>
            <div style={styles.selectWrapper}>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={styles.selectStyle}
                disabled={enrolling}
              >
                <option value="">Select a course to enroll...</option>
                {availableCourses
                  .filter(c => !enrollments.some(e => e.course._id === c._id))
                  .map(c => (
                    <option key={c._id} value={c._id}>
                      {c.title} {c.duration ? `(${c.duration}h)` : ''} - 
                      {c.price > 0 ? ` ₹${c.price}` : ' FREE'}
                    </option>
                  ))}
              </select>
            </div>
            
            <button
              onClick={handleEnrollCourse}
              disabled={!selectedCourse || enrolling}
              style={{
                ...styles.enrollButton,
                opacity: (!selectedCourse || enrolling) ? 0.7 : 1,
                cursor: (!selectedCourse || enrolling) ? 'not-allowed' : 'pointer'
              }}
            >
              {enrolling ? (
                <>
                  <div style={styles.buttonSpinner}></div>
                  Enrolling...
                </>
              ) : selectedCourse && availableCourses.find(c => c._id === selectedCourse)?.price > 0 ? (
                <>
                  <FaShoppingCart /> Proceed to Payment
                  <FaArrowRight />
                </>
              ) : (
                <>
                  <FaBook /> Enroll Now
                  <FaArrowRight />
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div style={styles.errorMessage}>
              <FaTimesCircle />
              {error}
            </div>
          )}
          
          {availableCourses.length > 0 && (
            <div style={{ marginTop: 16, fontSize: 14, color: '#64748b' }}>
              {availableCourses.filter(c => !enrollments.some(e => e.course._id === c._id)).length} courses available for enrollment
            </div>
          )}
        </div>

        {/* Courses Grid Section */}
        <div style={styles.coursesSection}>
          <div style={styles.coursesSectionHeader}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Your Courses</h2>
            </div>
            <div style={styles.coursesInfo}>
              <span style={styles.courseCount}>
                {totalCourses} course{totalCourses !== 1 ? 's' : ''}
              </span>
              <div style={styles.courseStats}>
                {unlockedCourses} unlocked • {totalCourses - unlockedCourses} locked
              </div>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div style={styles.emptyState}>
              <FaBook style={styles.emptyIcon} />
              <h3 style={styles.emptyTitle}>No courses enrolled yet</h3>
              <p style={styles.emptyText}>
                Get started by enrolling in a course from the dropdown above
              </p>
            </div>
          ) : (
            <div style={styles.coursesGrid}>
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const courseId = course._id;
                const progress = progressData[courseId] || 0;
                const status = getStatus(progress);
                const accessType = getCourseAccessType(courseId);
                const locked = isCourseLocked(enrollment, courseId);
                const coursePrice = coursePrices[courseId] || course.price || 0;

                return (
                  <div
                    key={enrollment._id}
                    style={{
                      ...styles.courseCard,
                      opacity: locked ? 0.9 : 1,
                    }}
                    className="course-card"
                  >
                    <div style={styles.cardHeader}>
                      <div style={statusBadgeStyle(status)}>
                        {status.icon}
                        {status.text}
                      </div>
                      
                      <div style={styles.badgeContainer}>
                        {/* Access Type Badge */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: accessType.bg,
                          color: accessType.color,
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {accessType.icon}
                          {accessType.label}
                        </div>
                        
                        {/* Price Badge */}
                        {coursePrice > 0 && (
                          <div style={styles.priceBadge}>
                            <FaRupeeSign size={10} />
                            ₹{coursePrice}
                          </div>
                        )}
                        
                        {course.duration && (
                          <div style={styles.durationBadge}>
                            <FaClock style={styles.badgeIcon} />
                            {course.duration}h
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <h3 style={styles.courseTitle}>{course.title}</h3>
                      <p style={styles.courseDescription}>
                        {course.description?.substring(0, 120) || 'No description available'}...
                      </p>
                      
                      {course.createdAt && (
                        <div style={styles.dateInfo}>
                          <FaCalendarAlt style={styles.dateIcon} />
                          Enrolled on {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div style={styles.progressSection}>
                      <div style={styles.progressHeader}>
                        <div style={styles.progressLabel}>
                          <FaChartLine style={styles.progressIcon} />
                          Progress
                        </div>
                        <div style={styles.progressPercentage}>{progress}%</div>
                      </div>
                      <div style={styles.progressBarContainer}>
                        <div style={styles.progressBarTrack}>
                          <div 
                            style={{
                              ...styles.progressBarFill,
                              width: `${progress}%`,
                              backgroundColor: status.color
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={styles.buttonGroup}>
                      <button
                        onClick={() => {
                          // if (locked) {
                          //   // Show payment modal for locked course
                          //   setSelectedCourseForPayment(course);
                          //   setShowPaymentModal(true);
                          //   return;
                          // }
                          if (locked && coursePrice > 0) {
                            setSelectedCourseForPayment(course);
                            setShowPaymentModal(true);
                            return;
                          }

                          navigate(`/student/courses/${courseId}`);
                        }}
                        style={{
                          ...styles.viewButton,
                          background: locked 
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : progress === 100
                            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                            : 'linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)',
                          flex: 2
                        }}
                        className="view-button"
                      >
                        {locked ? (
                          <>
                            <FaLock />
                            Unlock Course
                          </>
                        ) : progress === 100 ? (
                          <>
                            <FaCheckCircle />
                            Review Course
                            <FaArrowRight style={styles.buttonArrow} />
                          </>
                        ) : (
                          <>
                            <FaPlay />
                            Continue Learning
                            <FaArrowRight style={styles.buttonArrow} />
                          </>
                        )}
                      </button>
                      
                      {locked && coursePrice > 0 && (
                        <button
                          onClick={() => {
                            setSelectedCourseForPayment(course);
                            setShowPaymentModal(true);
                          }}
                          disabled={processingPayment[courseId]}
                          style={{
                            ...styles.paymentButton,
                            opacity: processingPayment[courseId] ? 0.7 : 1,
                            cursor: processingPayment[courseId] ? 'not-allowed' : 'pointer'
                          }}
                          className="payment-button"
                        >
                          {processingPayment[courseId] ? (
                            <>
                              <div style={styles.buttonSpinner}></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaMoneyBillWave />
                              Pay ₹{coursePrice}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedCourseForPayment && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <FaShoppingCart /> Complete Payment
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedCourseForPayment(null);
                }}
                style={styles.modalClose}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.courseInfo}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>
                  {selectedCourseForPayment.title}
                </h4>
                <p style={{ margin: '0 0 20px 0', color: '#64748b' }}>
                  {selectedCourseForPayment.description?.substring(0, 150)}...
                </p>
                
                <div style={styles.priceDisplay}>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Course Price:</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#3D1A5B' }}>
                    ₹{selectedCourseForPayment.price || 0}
                  </div>
                </div>
                
                <div style={styles.noteBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e' }}>
                    <FaExclamationTriangle />
                    <strong>Note:</strong> Once payment is complete, you'll get lifetime access to all course materials.
                  </div>
                </div>
              </div>
              
              <div style={styles.paymentMethods}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Select Payment Method</h4>
                
                <div style={styles.methodGrid}>
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'card')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
                    <div style={{ fontWeight: '600' }}>Credit/Debit Card</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Pay with card</div>
                  </button>
                  
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'upi')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
                    <div style={{ fontWeight: '600' }}>UPI</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Pay with UPI ID</div>
                  </button>
                  
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'netbanking')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏦</div>
                    <div style={{ fontWeight: '600' }}>Net Banking</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>All banks supported</div>
                  </button>
                  
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'wallet')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>👛</div>
                    <div style={{ fontWeight: '600' }}>Wallet</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Paytm, PhonePe, etc.</div>
                  </button>
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedCourseForPayment(null);
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', flex: 1 }}>
                Your payment is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .course-card {
          transition: all 0.3s ease;
        }
        
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(61, 26, 91, 0.15);
        }
        
        .view-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
        }
        
        .payment-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }
        
        .enroll-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
        }

        input:focus, select:focus, textarea:focus {
          border-color: #3D1A5B !important;
          box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          [style*="mobileMenuButton"] {
            display: flex !important;
          }

          [style*="desktopSidebar"] {
            display: none !important;
          }

          [style*="mainContent"] {
            margin-left: 0 !important;
            padding: 80px 20px 20px 20px !important;
          }

          [style*="loadingContainer"] {
            margin-left: 0 !important;
            padding: 80px 20px 20px 20px !important;
          }

          [style*="headerTop"] {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          [style*="statsContainer"] {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            width: 100% !important;
            gap: 12px !important;
          }

          [style*="enrollForm"] {
            flex-direction: column !important;
          }

          [style*="selectWrapper"] {
            width: 100% !important;
            min-width: auto !important;
          }

          [style*="enrollButton"] {
            width: 100% !important;
          }

          [style*="coursesGrid"] {
            grid-template-columns: 1fr !important;
          }

          [style*="badgeContainer"] {
            flex-wrap: wrap !important;
          }

          [style*="buttonGroup"] {
            flex-direction: column !important;
          }

          [style*="viewButton"], [style*="paymentButton"] {
            width: 100% !important;
          }

          [style*="methodGrid"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          [style*="mainContent"] {
            padding: 70px 16px 16px 16px !important;
          }

          [style*="pageTitle"] {
            font-size: 24px !important;
          }

          [style*="statsContainer"] {
            grid-template-columns: 1fr !important;
          }

          [style*="statBadgeContainer"] {
            min-width: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

// Updated Styles
const styles = {
  pageContainer: {
    display: "flex",
    minHeight: "100vh",
    background: "#f9fafb",
    position: "relative",
  },

  // Mobile Menu Button
  mobileMenuButton: {
    display: "none",
    position: "fixed",
    top: "16px",
    left: "16px",
    zIndex: 1001,
    background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
    transition: "transform 0.2s ease",
    alignItems: "center",
    justifyContent: "center",
  },

  // Mobile Overlay
  mobileOverlay: {
    display: "block",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },

  mobileSidebar: {
    width: "280px",
    height: "100%",
    backgroundColor: "#fff",
    boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)",
  },

  // Desktop Sidebar
  desktopSidebar: {
    display: "block",
  },

  loadingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 250,
  },

  spinner: {
    width: 50,
    height: 50,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3D1A5B",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: 500,
  },

  mainContent: {
    flex: 1,
    marginLeft: 250,
    padding: "32px 40px",
    maxWidth: 1400,
  },

  headerSection: {
    marginBottom: 40,
  },

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 24,
    marginBottom: 24,
  },

  headerLeft: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#3D1A5B",
    marginBottom: 8,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  titleIcon: {
    color: "#F1D572",
    fontSize: 28,
  },

  pageSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0,
  },

  liveDataBadge: {
    background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
    border: "1px solid rgba(61, 26, 91, 0.2)",
    borderRadius: "8px",
    padding: "12px 16px",
  },

  liveDataText: {
    color: "#3D1A5B",
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
  },

  statsContainer: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },

  statBadgeContainer: {
    background: "#fff",
    padding: "16px 24px",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    textAlign: "center",
    minWidth: 120,
    border: "1px solid #e2e8f0",
  },

  statBadgeValue: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 4,
  },

  statBadgeLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  enrollSection: {
    background: "#fff",
    padding: 32,
    borderRadius: 20,
    marginBottom: 40,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },

  sectionIndicator: {
    width: "4px",
    height: "20px",
    background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
    borderRadius: "2px",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
  },

  enrollSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },

  enrollForm: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  selectWrapper: {
    flex: 1,
    minWidth: 300,
  },

  selectStyle: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    borderRadius: 12,
    border: "2px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    outline: "none",
  },

  enrollButton: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },

  buttonSpinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  errorMessage: {
    marginTop: 16,
    padding: 12,
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: 10,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 500,
  },

  coursesSection: {
    marginTop: 40,
  },

  coursesSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },

  coursesInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  courseCount: {
    fontSize: 20,
    color: "#64748b",
    fontWeight: 500,
  },

  courseStats: {
    fontSize: 14,
    color: "#64748b",
    background: "#f8fafc",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 40px",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  emptyIcon: {
    fontSize: 64,
    color: "#cbd5e1",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },

  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: 28,
  },

  courseCard: {
    background: "#fff",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },

  badgeContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  priceBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "rgba(241, 213, 114, 0.2)",
    color: "#92400e",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  durationBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#64748b",
    fontSize: 14,
    fontWeight: 600,
  },

  badgeIcon: {
    fontSize: 13,
  },

  cardBody: {
    flex: 1,
    marginBottom: 20,
  },

  courseTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 12,
    lineHeight: 1.4,
  },

  courseDescription: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 12,
  },

  dateInfo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#64748b",
    fontSize: 14,
    fontWeight: 500,
    marginTop: 12,
  },

  dateIcon: {
    fontSize: 13,
    color: "#94a3b8",
  },

  progressSection: {
    marginBottom: 20,
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  progressLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
  },

  progressIcon: {
    fontSize: 14,
    color: "#3D1A5B",
  },

  progressPercentage: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
  },

  progressBarContainer: {
    marginTop: 8,
  },

  progressBarTrack: {
    width: "100%",
    height: 12,
    background: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 10,
    transition: "width 0.5s ease",
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
  },

  viewButton: {
    padding: "14px 20px",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
    cursor: "pointer",
  },

  paymentButton: {
    padding: "14px 20px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    cursor: "pointer",
    flex: 1
  },

  buttonArrow: {
    fontSize: 14,
    transition: "transform 0.3s ease",
  },

  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modalContent: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "500px",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
  },

  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  modalClose: {
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
  },

  modalBody: {
    padding: "24px",
  },

  courseInfo: {
    marginBottom: "24px",
  },

  priceDisplay: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "rgba(61, 26, 91, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(61, 26, 91, 0.1)",
  },

  noteBox: {
    background: "rgba(241, 213, 114, 0.1)",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "20px",
    border: "1px solid rgba(166, 138, 70, 0.2)",
  },

  paymentMethods: {
    marginTop: "24px",
  },

  methodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },

  paymentMethodBtn: {
    background: "#fff",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  modalFooter: {
    padding: "24px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cancelButton: {
    background: "#64748b",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

// Helper function for status badge style
const statusBadgeStyle = (status) => ({
  background: status.bg,
  color: status.color,
  padding: "8px 16px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 6,
  textTransform: "uppercase",
  letterSpacing: 0.5,
});

export default StudentCoursesPage;