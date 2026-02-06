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
  completePaymentProcess,
  getFilteredLectures,
  canAccessCourse
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
  FaTimes,
  FaEye,
  FaTags
} from "react-icons/fa";
import { getUserId, isAuthenticated } from "../utils/auth";

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
  const [courseAccessMap, setCourseAccessMap] = useState({}); // New: Store course access info

  const navigate = useNavigate();
  const studentId = getUserId();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    if (studentId) {
      initializePage();
    }
  }, [studentId, navigate]);

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
      const accessMap = {};
      
      for (const e of active) {
        const courseId = e.course._id;
        
        try {
          // Get progress
          const res = await getProgress(studentId, courseId);
          progressMap[courseId] = res.progressPercentage || 0;
          
          // Get course price - use enrollment data first, then API
          priceMap[courseId] = e.course.price || 0;
          
          // Check payment status - use enrollment isPaid first, then API
          paymentMap[courseId] = e.isPaid || false;
          
          // Check course access status
          try {
            const accessStatus = await canAccessCourse(courseId, studentId);
            accessMap[courseId] = {
              canAccess: accessStatus.canAccess || false,
              hasFullAccess: accessStatus.hasFullAccess || false,
              isPaid: accessStatus.isPaid || e.isPaid || false,
              coursePrice: accessStatus.coursePrice || e.course.price || 0
            };
            
            // Update payment status based on access check
            if (accessStatus.isPaid !== undefined) {
              paymentMap[courseId] = accessStatus.isPaid;
            }
            
          } catch (accessErr) {
            console.warn(`Could not check access for course ${courseId}:`, accessErr);
            accessMap[courseId] = {
              canAccess: false,
              hasFullAccess: false,
              isPaid: e.isPaid || false,
              coursePrice: e.course.price || 0
            };
          }
          
        } catch (err) {
          console.error(`Error processing course ${courseId}:`, err);
          progressMap[courseId] = 0;
          priceMap[courseId] = e.course.price || 0;
          paymentMap[courseId] = e.isPaid || false;
          accessMap[courseId] = {
            canAccess: false,
            hasFullAccess: false,
            isPaid: e.isPaid || false,
            coursePrice: e.course.price || 0
          };
        }
      }
      
      setProgressData(progressMap);
      setCoursePrices(priceMap);
      setPaymentStatus(paymentMap);
      setCourseAccessMap(accessMap);
      
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Failed to load courses");
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
      
      if (!selectedCourseData) {
        setError("Course not found");
        return;
      }
      
      const coursePrice = selectedCourseData.price || 0;
      
      // ✅ FIXED: Proper enrollment with payment status
      await enrollStudentInCourse(studentId, selectedCourse, coursePrice === 0);
      
      if (coursePrice === 0) {
        alert("Successfully enrolled in free course!");
      } else {
        // For paid courses, show payment modal
        setSelectedCourseForPayment(selectedCourseData);
        setShowPaymentModal(true);
      }
      
      // Refresh enrollments
      await fetchEnrollments();
      setSelectedCourse("");
      
    } catch (err) {
      console.error("Enrollment error:", err);
      setError(err.response?.data?.message || "Enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const handlePayment = async (courseId, paymentMethod) => {
    try {
      setProcessingPayment(prev => ({ ...prev, [courseId]: true }));
      
      const course = availableCourses.find(c => c._id === courseId);
      const coursePrice = course?.price || 0;
      
      if (!coursePrice || coursePrice <= 0) {
        alert("Invalid course price");
        return;
      }
      
      const result = await completePaymentProcess(courseId, paymentMethod, coursePrice);
      
      if (result.success) {
        alert("Payment successful! Course is now unlocked.");
        setShowPaymentModal(false);
        setSelectedCourseForPayment(null);
        
        // Refresh data
        await fetchEnrollments();
      } else {
        alert(result.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment processing error. Please try again.");
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

  const isCourseLocked = (enrollment) => {
    const courseId = enrollment.course._id;
    const accessInfo = courseAccessMap[courseId];
    
    // Use access map if available
    if (accessInfo) {
      // Free courses are never locked
      if (accessInfo.coursePrice === 0) return false;
      
      // If user has full access or has paid, course is not locked
      return !(accessInfo.hasFullAccess || accessInfo.isPaid);
    }
    
    // Fallback to old logic if access map not available
    const coursePrice = coursePrices[courseId] ?? enrollment.course.price ?? 0;
    const isPaid = paymentStatus[courseId] ?? enrollment.isPaid ?? false;
    
    // FREE course never locked
    if (coursePrice === 0) return false;
    
    return !isPaid;
  };

  const getCourseAccessType = (enrollment) => {
    const courseId = enrollment.course._id;
    const course = enrollment.course;
    const accessInfo = courseAccessMap[courseId];
    
    // Use access map if available
    if (accessInfo) {
      const coursePrice = accessInfo.coursePrice;
      
      if (coursePrice === 0) {
        return { 
          type: "free", 
          label: "Free Course", 
          icon: <FaUnlock />, 
          color: "#10b981", 
          bg: "#d1fae5" 
        };
      } else if (accessInfo.isPaid) {
        return { 
          type: "paid_unlocked", 
          label: "Paid (Unlocked)", 
          icon: <FaUnlock />, 
          color: "#3D1A5B", 
          bg: "rgba(61, 26, 91, 0.1)" 
        };
      } else {
        return { 
          type: "paid_locked", 
          label: "Payment Required", 
          icon: <FaLock />, 
          color: "#ef4444", 
          bg: "#fee2e2" 
        };
      }
    }
    
    // Fallback logic
    const coursePrice = coursePrices[courseId] ?? course.price ?? 0;
    const isPaid = paymentStatus[courseId] ?? enrollment.isPaid ?? false;
    
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

  if (loading && enrollments.length === 0) {
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
  const unlockedCourses = enrollments.filter(e => !isCourseLocked(e)).length;
  const avgProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + (progressData[e.course._id] || 0), 0) / totalCourses)
    : 0;

  // Get unique subcategories from enrolled courses
  const enrolledSubcategories = [...new Set(
    enrollments.flatMap(e => {
      const subcats = e.course.subCategories;
      if (!subcats) return [];
      if (typeof subcats === 'string') {
        try {
          return JSON.parse(subcats);
        } catch {
          return subcats.split(',');
        }
      }
      return subcats;
    })
  )].filter(Boolean);

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
                const accessType = getCourseAccessType(enrollment);
                const locked = isCourseLocked(enrollment);
                const coursePrice = courseAccessMap[courseId]?.coursePrice || course.price || 0;

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
                      
                      {/* Subcategory Tags */}
                      {course.subCategories && (
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '6px', 
                          marginTop: '8px',
                          marginBottom: '8px'
                        }}>
                          {(typeof course.subCategories === 'string' 
                            ? JSON.parse(course.subCategories) 
                            : course.subCategories
                          )?.slice(0, 3).map((sub, idx) => (
                            <span key={idx} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              <FaTags size={9} />
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                      
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
          .mobileMenuButton {
            display: flex !important;
          }

          .desktopSidebar {
            display: none !important;
          }

          .mainContent {
            margin-left: 0 !important;
            padding: 80px 20px 20px 20px !important;
          }

          .loadingContainer {
            margin-left: 0 !important;
            padding: 80px 20px 20px 20px !important;
          }

          .headerTop {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .statsContainer {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            width: 100% !important;
            gap: 12px !important;
          }

          .enrollForm {
            flex-direction: column !important;
          }

          .selectWrapper {
            width: 100% !important;
            min-width: auto !important;
          }

          .enrollButton {
            width: 100% !important;
          }

          .coursesGrid {
            grid-template-columns: 1fr !important;
          }

          .badgeContainer {
            flex-wrap: wrap !important;
          }

          .buttonGroup {
            flex-direction: column !important;
          }

          .viewButton, .paymentButton {
            width: 100% !important;
          }

          .methodGrid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .mainContent {
            padding: 70px 16px 16px 16px !important;
          }

          .pageTitle {
            font-size: 24px !important;
          }

          .statsContainer {
            grid-template-columns: 1fr !important;
          }

          .statBadgeContainer {
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




// // src/pages/StudentCoursesPage.jsx
// import React, { useEffect, useState } from "react";
// import StudentSidebar from "../components/StudentSidebar";
// import {
//   getStudentEnrollments,
//   getProgress,
//   enrollStudentInCourse,
//   getAllCourses,
//   getCoursePrice,
//   checkPaymentStatus,
//   getEnrollmentStatus,
//   completePaymentProcess,
//   getFilteredLectures,
//   canAccessCourse
// } from "../api/api";
// import { useNavigate } from "react-router-dom";
// import {
//   FaClock,
//   FaChartLine,
//   FaArrowRight,
//   FaGraduationCap,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaBook,
//   FaCalendarAlt,
//   FaLock,
//   FaUnlock,
//   FaSpinner,
//   FaRupeeSign,
//   FaMoneyBillWave,
//   FaExclamationTriangle,
//   FaPlay,
//   FaShoppingCart,
//   FaBars,
//   FaTimes,
//   FaEye,
//   FaTags,
//   FaRedo
// } from "react-icons/fa";
// import { getUserId, isAuthenticated, getToken } from "../utils/auth";
// import axios from "axios";

// const StudentCoursesPage = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [progressData, setProgressData] = useState({});
//   const [coursePrices, setCoursePrices] = useState({});
//   const [paymentStatus, setPaymentStatus] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [enrolling, setEnrolling] = useState(false);
//   const [error, setError] = useState("");
//   const [processingPayment, setProcessingPayment] = useState({});
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [courseAccessMap, setCourseAccessMap] = useState({});
//   const [refreshKey, setRefreshKey] = useState(0);

//   const navigate = useNavigate();
//   const studentId = getUserId();

//   // API Base URL - Adjust based on your setup
//   const API_BASE = process.env.REACT_APP_API_URL || "";

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate("/login");
//       return;
//     }
    
//     if (studentId) {
//       initializePage();
//     }
//   }, [studentId, navigate, refreshKey]);

//   const refreshPage = () => {
//     setRefreshKey(prev => prev + 1);
//   };

//   const initializePage = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       await Promise.all([fetchEnrollments(), fetchAllCourses()]);
//     } catch (err) {
//       console.error("Initialize page error:", err);
//       setError("Failed to load data. Please refresh the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED: Fetch enrollments with proper access check
//   const fetchEnrollments = async () => {
//     try {
//       console.log("🔄 Fetching enrollments for student:", studentId);
      
//       // Get enrollments
//       const data = await getStudentEnrollments(studentId);
//       console.log("Raw enrollments data:", data);

//       // Filter active enrollments
//       const activeEnrollments = data.filter(e => 
//         e && e.course && !e.isDeleted && e.enrollmentStatus !== "cancelled"
//       );
      
//       console.log("Active enrollments:", activeEnrollments.length);
//       setEnrollments(activeEnrollments);

//       const progressMap = {};
//       const priceMap = {};
//       const paymentMap = {};
//       const accessMap = {};
      
//       // Process each enrollment
//       for (const enrollment of activeEnrollments) {
//         const courseId = enrollment.course._id;
//         const course = enrollment.course;
//         const coursePrice = course.price || 0;
        
//         try {
//           // Get progress
//           try {
//             const progressRes = await getProgress(studentId, courseId);
//             progressMap[courseId] = progressRes.progressPercentage || 0;
//           } catch (progressErr) {
//             console.warn(`Progress not available for ${courseId}:`, progressErr);
//             progressMap[courseId] = 0;
//           }
          
//           // Store price
//           priceMap[courseId] = coursePrice;
          
//           // ✅ CRITICAL: Check real-time enrollment status
//           try {
//             const statusRes = await axios.get(
//               `${API_BASE}/api/enroll/check/${studentId}/${courseId}`,
//               {
//                 headers: { Authorization: `Bearer ${getToken()}` }
//               }
//             );
            
//             const statusData = statusRes.data;
//             console.log(`Real-time status for ${courseId}:`, statusData);
            
//             // Determine payment status
//             const isFreeCourse = coursePrice === 0;
//             const isPaid = isFreeCourse ? true : (statusData.isPaid || enrollment.isPaid || false);
            
//             paymentMap[courseId] = isPaid;
            
//             accessMap[courseId] = {
//               canAccess: isFreeCourse || isPaid,
//               hasFullAccess: isFreeCourse || isPaid,
//               isPaid: isPaid,
//               coursePrice: coursePrice,
//               isEnrolled: true,
//               enrollmentId: enrollment._id,
//               // Include original enrollment data
//               originalEnrollment: enrollment
//             };
            
//           } catch (statusErr) {
//             console.warn(`Status check failed for ${courseId}:`, statusErr);
//             // Fallback to enrollment data
//             const isFreeCourse = coursePrice === 0;
//             const isPaid = enrollment.isPaid || false;
            
//             paymentMap[courseId] = isPaid;
//             accessMap[courseId] = {
//               canAccess: isFreeCourse || isPaid,
//               hasFullAccess: isFreeCourse || isPaid,
//               isPaid: isPaid,
//               coursePrice: coursePrice,
//               isEnrolled: true,
//               enrollmentId: enrollment._id,
//               originalEnrollment: enrollment
//             };
//           }
          
//         } catch (err) {
//           console.error(`Error processing course ${courseId}:`, err);
//           // Set safe defaults
//           progressMap[courseId] = 0;
//           priceMap[courseId] = coursePrice;
//           paymentMap[courseId] = enrollment.isPaid || false;
//           accessMap[courseId] = {
//             canAccess: coursePrice === 0 || enrollment.isPaid,
//             hasFullAccess: coursePrice === 0 || enrollment.isPaid,
//             isPaid: enrollment.isPaid || false,
//             coursePrice: coursePrice,
//             isEnrolled: true,
//             enrollmentId: enrollment._id,
//             originalEnrollment: enrollment
//           };
//         }
//       }
      
//       setProgressData(progressMap);
//       setCoursePrices(priceMap);
//       setPaymentStatus(paymentMap);
//       setCourseAccessMap(accessMap);
      
//       console.log("✅ Enrollment processing complete:", {
//         total: activeEnrollments.length,
//         accessMap: Object.keys(accessMap).length
//       });
      
//     } catch (err) {
//       console.error("❌ Error fetching enrollments:", err);
//       setError("Failed to load your courses. Please try again.");
//       setEnrollments([]);
//     }
//   };

//   const fetchAllCourses = async () => {
//     try {
//       const data = await getAllCourses();
//       console.log("Available courses loaded:", data?.length || 0);
//       setAvailableCourses(data || []);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//       setAvailableCourses([]);
//     }
//   };

//   // ✅ FIXED: Handle enrollment with direct API call
//   const handleEnrollCourse = async () => {
//     if (!selectedCourse) {
//       setError("Please select a course");
//       return;
//     }
    
//     setEnrolling(true);
//     setError("");
    
//     try {
//       console.log("🎯 Starting enrollment for course:", selectedCourse);
      
//       // Find course details
//       const selectedCourseData = availableCourses.find(c => c._id === selectedCourse);
      
//       if (!selectedCourseData) {
//         setError("Course not found");
//         setEnrolling(false);
//         return;
//       }
      
//       const coursePrice = selectedCourseData.price || 0;
//       console.log("Course details:", {
//         title: selectedCourseData.title,
//         price: coursePrice
//       });
      
//       // ✅ Direct enrollment API call
//       try {
//         const response = await axios.post(
//           `${API_BASE}/api/enroll/${selectedCourse}`,
//           {},
//           {
//             headers: { 
//               Authorization: `Bearer ${getToken()}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         const result = response.data;
//         console.log("Enrollment API response:", result);
        
//         if (result.success || result.message || result.enrollment) {
//           // Success
//           if (coursePrice === 0) {
//             alert("✅ Successfully enrolled in free course! You now have full access.");
//           } else {
//             alert("✅ Enrollment successful! Please complete payment to unlock all content.");
//             // Show payment modal for paid courses
//             setSelectedCourseForPayment(selectedCourseData);
//             setShowPaymentModal(true);
//           }
          
//           // Refresh data
//           await fetchEnrollments();
//           refreshPage();
          
//           // Reset selection
//           setSelectedCourse("");
//         } else {
//           setError(result.message || "Enrollment failed");
//         }
        
//       } catch (apiErr) {
//         console.error("Enrollment API error:", apiErr);
        
//         if (apiErr.response?.status === 400) {
//           const errorMsg = apiErr.response?.data?.message;
//           if (errorMsg?.includes("already enrolled") || errorMsg?.includes("Already enrolled")) {
//             alert("ℹ️ You are already enrolled in this course.");
//             await fetchEnrollments();
//           } else {
//             setError(errorMsg || "Enrollment failed");
//           }
//         } else if (apiErr.response?.status === 500) {
//           setError("Server error. Please try again later.");
//         } else {
//           setError("Network error. Please check your connection.");
//         }
//       }
      
//     } catch (err) {
//       console.error("General enrollment error:", err);
//       setError("Enrollment failed. Please try again.");
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   // ✅ FIXED: Handle payment processing
//   const handlePayment = async (courseId, paymentMethod) => {
//     try {
//       setProcessingPayment(prev => ({ ...prev, [courseId]: true }));
      
//       const course = availableCourses.find(c => c._id === courseId) || 
//                     enrollments.find(e => e.course._id === courseId)?.course;
      
//       if (!course) {
//         alert("Course not found");
//         return;
//       }
      
//       const coursePrice = course.price || 0;
      
//       if (coursePrice <= 0) {
//         alert("Invalid course price");
//         return;
//       }
      
//       console.log(`💰 Processing payment:`, {
//         courseId,
//         courseTitle: course.title,
//         amount: coursePrice,
//         method: paymentMethod
//       });
      
//       // Simulate payment for demo - replace with actual payment gateway
//       try {
//         // For demo purposes - simulate API call
//         await new Promise(resolve => setTimeout(resolve, 1500));
        
//         // Update payment status via API
//         const response = await axios.put(
//           `${API_BASE}/api/enroll/payment/update`,
//           {
//             courseId,
//             studentId,
//             isPaid: true,
//             paymentMethod,
//             amount: coursePrice
//           },
//           {
//             headers: { 
//               Authorization: `Bearer ${getToken()}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         const result = response.data;
//         console.log("Payment update response:", result);
        
//         if (result.success || result.message) {
//           alert("✅ Payment successful! Course is now unlocked.");
//           setShowPaymentModal(false);
//           setSelectedCourseForPayment(null);
          
//           // Refresh data
//           await fetchEnrollments();
//           refreshPage();
//         } else {
//           alert(result.message || "Payment update failed");
//         }
        
//       } catch (apiErr) {
//         console.error("Payment API error:", apiErr);
        
//         if (apiErr.response?.status === 500) {
//           alert("Payment server error. Please try again later.");
//         } else {
//           alert("Payment processing failed. Please try again.");
//         }
//       }
      
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert("Payment failed. Please try again.");
//     } finally {
//       setProcessingPayment(prev => ({ ...prev, [courseId]: false }));
//     }
//   };

//   // ✅ FIXED: Check if course is locked
//   const isCourseLocked = (courseId) => {
//     const accessInfo = courseAccessMap[courseId];
    
//     if (!accessInfo) {
//       // If no access info, check in enrollments
//       const enrollment = enrollments.find(e => e.course._id === courseId);
//       if (!enrollment) return true;
      
//       const coursePrice = enrollment.course.price || 0;
//       return coursePrice > 0 && !enrollment.isPaid;
//     }
    
//     // Free courses are never locked
//     if (accessInfo.coursePrice === 0) return false;
    
//     // Paid courses are locked if not paid
//     return !accessInfo.isPaid;
//   };

//   // ✅ FIXED: Get course access type with clear logic
//   const getCourseAccessType = (courseId) => {
//     const accessInfo = courseAccessMap[courseId];
    
//     if (!accessInfo) {
//       const enrollment = enrollments.find(e => e.course._id === courseId);
//       if (!enrollment) return null;
      
//       const coursePrice = enrollment.course.price || 0;
//       const isPaid = enrollment.isPaid || false;
      
//       if (coursePrice === 0) {
//         return { 
//           type: "free", 
//           label: "Free Course", 
//           icon: <FaUnlock />, 
//           color: "#10b981", 
//           bg: "#d1fae5" 
//         };
//       } else if (isPaid) {
//         return { 
//           type: "paid_unlocked", 
//           label: "Paid (Unlocked)", 
//           icon: <FaUnlock />, 
//           color: "#3D1A5B", 
//           bg: "rgba(61, 26, 91, 0.1)" 
//         };
//       } else {
//         return { 
//           type: "paid_locked", 
//           label: "Payment Required", 
//           icon: <FaLock />, 
//           color: "#ef4444", 
//           bg: "#fee2e2" 
//         };
//       }
//     }
    
//     // Use access info
//     const coursePrice = accessInfo.coursePrice;
    
//     if (coursePrice === 0) {
//       return { 
//         type: "free", 
//         label: "Free Course", 
//         icon: <FaUnlock />, 
//         color: "#10b981", 
//         bg: "#d1fae5" 
//       };
//     } else if (accessInfo.isPaid) {
//       return { 
//         type: "paid_unlocked", 
//         label: "Paid (Unlocked)", 
//         icon: <FaUnlock />, 
//         color: "#3D1A5B", 
//         bg: "rgba(61, 26, 91, 0.1)" 
//       };
//     } else {
//       return { 
//         type: "paid_locked", 
//         label: "Payment Required", 
//         icon: <FaLock />, 
//         color: "#ef4444", 
//         bg: "#fee2e2" 
//       };
//     }
//   };

//   // ✅ FIXED: Navigate to course page with access check
//   const handleViewCourse = (courseId) => {
//     const locked = isCourseLocked(courseId);
    
//     if (locked) {
//       // Find course for payment
//       const course = enrollments.find(e => e.course._id === courseId)?.course ||
//                     availableCourses.find(c => c._id === courseId);
      
//       if (course && course.price > 0) {
//         setSelectedCourseForPayment(course);
//         setShowPaymentModal(true);
//       } else {
//         alert("Course access not available. Please contact support.");
//       }
//     } else {
//       // Navigate to course page
//       navigate(`/student/courses/${courseId}`);
//     }
//   };

//   const getStatus = (progress) => {
//     if (progress === 100) {
//       return { text: "Completed", color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle /> };
//     }
//     if (progress > 0) {
//       return { text: "In Progress", color: "#F1D572", bg: "rgba(241, 213, 114, 0.2)", icon: <FaChartLine /> };
//     }
//     return { text: "Not Started", color: "#6b7280", bg: "#f3f4f6", icon: <FaBook /> };
//   };

//   const StatBadge = ({ label, value, color }) => (
//     <div style={styles.statBadgeContainer}>
//       <div style={{ ...styles.statBadgeValue, color }}>{value}</div>
//       <div style={styles.statBadgeLabel}>{label}</div>
//     </div>
//   );

//   // Calculate stats
//   const totalCourses = enrollments.length;
//   const completedCourses = enrollments.filter(e => (progressData[e.course._id] || 0) === 100).length;
//   const unlockedCourses = enrollments.filter(e => !isCourseLocked(e.course._id)).length;
//   const avgProgress = totalCourses > 0 
//     ? Math.round(enrollments.reduce((sum, e) => sum + (progressData[e.course._id] || 0), 0) / totalCourses)
//     : 0;

//   if (loading && enrollments.length === 0) {
//     return (
//       <div style={styles.pageContainer}>
//         <StudentSidebar />
//         <div style={styles.loadingContainer}>
//           <div style={styles.spinner}></div>
//           <div style={styles.loadingText}>Loading your courses...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       {/* Mobile Menu Button */}
//       <button 
//         style={styles.mobileMenuButton}
//         onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//         aria-label="Toggle menu"
//       >
//         {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
//       </button>

//       {/* Mobile Sidebar Overlay */}
//       {isMobileSidebarOpen && (
//         <div 
//           style={styles.mobileOverlay}
//           onClick={() => setIsMobileSidebarOpen(false)}
//         >
//           <div 
//             style={styles.mobileSidebar}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <StudentSidebar />
//           </div>
//         </div>
//       )}

//       {/* Desktop Sidebar */}
//       <div style={styles.desktopSidebar}>
//         <StudentSidebar />
//       </div>
      
//       <div style={styles.mainContent}>
//         {/* Header Section with Refresh Button */}
//         <div style={styles.headerSection}>
//           <div style={styles.headerTop}>
//             <div style={styles.headerLeft}>
//               <h1 style={styles.pageTitle}>
//                 <FaGraduationCap style={styles.titleIcon} />
//                 My Courses
//               </h1>
//               <p style={styles.pageSubtitle}>
//                 Track your progress, access course materials, and continue learning
//               </p>
//             </div>
            
//             <div style={styles.headerRight}>
//               <div style={styles.liveDataBadge}>
//                 <p style={styles.liveDataText}>
//                   Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </p>
//               </div>
              
//               <button 
//                 onClick={refreshPage}
//                 style={styles.refreshButton}
//                 title="Refresh courses"
//               >
//                 <FaRedo /> Refresh
//               </button>
//             </div>
//           </div>

//           <div style={styles.statsContainer}>
//             <StatBadge 
//               label="Total Courses" 
//               value={totalCourses} 
//               color="#3D1A5B" 
//             />
//             <StatBadge 
//               label="Completed" 
//               value={completedCourses} 
//               color="#10b981" 
//             />
//             <StatBadge 
//               label="Unlocked" 
//               value={unlockedCourses} 
//               color="#F1D572" 
//             />
//             <StatBadge 
//               label="Avg Progress" 
//               value={`${avgProgress}%`} 
//               color="#A68A46" 
//             />
//           </div>
//         </div>

//         {/* Enrollment Section */}
//         <div style={styles.enrollSection}>
//           <div style={styles.sectionHeader}>
//             <div style={styles.sectionIndicator}></div>
//             <h2 style={styles.sectionTitle}>Enroll in New Course</h2>
//           </div>
          
//           <p style={styles.enrollSubtitle}>
//             Choose from available courses to expand your learning
//           </p>
          
//           <div style={styles.enrollForm}>
//             <div style={styles.selectWrapper}>
//               <select
//                 value={selectedCourse}
//                 onChange={(e) => {
//                   setSelectedCourse(e.target.value);
//                   setError("");
//                 }}
//                 style={styles.selectStyle}
//                 disabled={enrolling}
//               >
//                 <option value="">Select a course to enroll...</option>
//                 {availableCourses
//                   .filter(c => !enrollments.some(e => e.course._id === c._id))
//                   .map(c => (
//                     <option key={c._id} value={c._id}>
//                       {c.title} {c.duration ? `(${c.duration}h)` : ''} - 
//                       {c.price > 0 ? ` ₹${c.price}` : ' FREE'}
//                     </option>
//                   ))}
//               </select>
//             </div>
            
//             <button
//               onClick={handleEnrollCourse}
//               disabled={!selectedCourse || enrolling}
//               style={{
//                 ...styles.enrollButton,
//                 opacity: (!selectedCourse || enrolling) ? 0.6 : 1,
//                 cursor: (!selectedCourse || enrolling) ? 'not-allowed' : 'pointer'
//               }}
//             >
//               {enrolling ? (
//                 <>
//                   <div style={styles.buttonSpinner}></div>
//                   Enrolling...
//                 </>
//               ) : selectedCourse && availableCourses.find(c => c._id === selectedCourse)?.price > 0 ? (
//                 <>
//                   <FaShoppingCart /> Enroll & Pay
//                   <FaArrowRight />
//                 </>
//               ) : (
//                 <>
//                   <FaBook /> Enroll Now
//                   <FaArrowRight />
//                 </>
//               )}
//             </button>
//           </div>
          
//           {error && (
//             <div style={styles.errorMessage}>
//               <FaTimesCircle />
//               {error}
//               <button 
//                 onClick={() => setError("")}
//                 style={styles.errorClose}
//               >
//                 ✕
//               </button>
//             </div>
//           )}
          
//           {availableCourses.length > 0 && (
//             <div style={{ marginTop: 16, fontSize: 14, color: '#64748b' }}>
//               {availableCourses.filter(c => !enrollments.some(e => e.course._id === c._id)).length} courses available for enrollment
//             </div>
//           )}
//         </div>

//         {/* Courses Grid Section */}
//         <div style={styles.coursesSection}>
//           <div style={styles.coursesSectionHeader}>
//             <div style={styles.sectionHeader}>
//               <div style={styles.sectionIndicator}></div>
//               <h2 style={styles.sectionTitle}>Your Courses</h2>
//             </div>
//             <div style={styles.coursesInfo}>
//               <span style={styles.courseCount}>
//                 {totalCourses} course{totalCourses !== 1 ? 's' : ''}
//               </span>
//               <div style={styles.courseStats}>
//                 {unlockedCourses} unlocked • {totalCourses - unlockedCourses} locked
//               </div>
//             </div>
//           </div>

//           {enrollments.length === 0 ? (
//             <div style={styles.emptyState}>
//               <FaBook style={styles.emptyIcon} />
//               <h3 style={styles.emptyTitle}>No courses enrolled yet</h3>
//               <p style={styles.emptyText}>
//                 Get started by enrolling in a course from the dropdown above
//               </p>
//             </div>
//           ) : (
//             <div style={styles.coursesGrid}>
//               {enrollments.map((enrollment) => {
//                 const course = enrollment.course;
//                 const courseId = course._id;
//                 const progress = progressData[courseId] || 0;
//                 const status = getStatus(progress);
//                 const accessType = getCourseAccessType(courseId);
//                 const locked = isCourseLocked(courseId);
//                 const coursePrice = course.price || 0;

//                 return (
//                   <div
//                     key={enrollment._id}
//                     style={{
//                       ...styles.courseCard,
//                       opacity: locked ? 0.85 : 1,
//                     }}
//                     className="course-card"
//                   >
//                     <div style={styles.cardHeader}>
//                       <div style={statusBadgeStyle(status)}>
//                         {status.icon}
//                         {status.text}
//                       </div>
                      
//                       <div style={styles.badgeContainer}>
//                         {/* Access Type Badge */}
//                         {accessType && (
//                           <div style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '4px',
//                             background: accessType.bg,
//                             color: accessType.color,
//                             padding: '6px 12px',
//                             borderRadius: '20px',
//                             fontSize: '12px',
//                             fontWeight: '600'
//                           }}>
//                             {accessType.icon}
//                             {accessType.label}
//                           </div>
//                         )}
                        
//                         {/* Price Badge */}
//                         {coursePrice > 0 && (
//                           <div style={styles.priceBadge}>
//                             <FaRupeeSign size={10} />
//                             ₹{coursePrice}
//                           </div>
//                         )}
                        
//                         {course.duration && (
//                           <div style={styles.durationBadge}>
//                             <FaClock style={styles.badgeIcon} />
//                             {course.duration}h
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div style={styles.cardBody}>
//                       <h3 style={styles.courseTitle}>{course.title}</h3>
//                       <p style={styles.courseDescription}>
//                         {course.description?.substring(0, 120) || 'No description available'}...
//                       </p>
                      
//                       {enrollment.enrolledAt && (
//                         <div style={styles.dateInfo}>
//                           <FaCalendarAlt style={styles.dateIcon} />
//                           Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
//                         </div>
//                       )}
//                     </div>

//                     <div style={styles.progressSection}>
//                       <div style={styles.progressHeader}>
//                         <div style={styles.progressLabel}>
//                           <FaChartLine style={styles.progressIcon} />
//                           Progress
//                         </div>
//                         <div style={styles.progressPercentage}>{progress}%</div>
//                       </div>
//                       <div style={styles.progressBarContainer}>
//                         <div style={styles.progressBarTrack}>
//                           <div 
//                             style={{
//                               ...styles.progressBarFill,
//                               width: `${progress}%`,
//                               backgroundColor: status.color
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div style={styles.buttonGroup}>
//                       <button
//                         onClick={() => handleViewCourse(courseId)}
//                         style={{
//                           ...styles.viewButton,
//                           background: locked 
//                             ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
//                             : progress === 100
//                             ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
//                             : 'linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)',
//                           flex: locked && coursePrice > 0 ? 1 : 2
//                         }}
//                         className="view-button"
//                       >
//                         {locked ? (
//                           <>
//                             <FaLock />
//                             Unlock Course
//                           </>
//                         ) : progress === 100 ? (
//                           <>
//                             <FaCheckCircle />
//                             Review Course
//                             <FaArrowRight style={styles.buttonArrow} />
//                           </>
//                         ) : (
//                           <>
//                             <FaPlay />
//                             Continue Learning
//                             <FaArrowRight style={styles.buttonArrow} />
//                           </>
//                         )}
//                       </button>
                      
//                       {locked && coursePrice > 0 && (
//                         <button
//                           onClick={() => {
//                             setSelectedCourseForPayment(course);
//                             setShowPaymentModal(true);
//                           }}
//                           disabled={processingPayment[courseId]}
//                           style={{
//                             ...styles.paymentButton,
//                             opacity: processingPayment[courseId] ? 0.7 : 1,
//                             cursor: processingPayment[courseId] ? 'not-allowed' : 'pointer'
//                           }}
//                           className="payment-button"
//                         >
//                           {processingPayment[courseId] ? (
//                             <>
//                               <div style={styles.buttonSpinner}></div>
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <FaMoneyBillWave />
//                               Pay ₹{coursePrice}
//                             </>
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payment Modal */}
//       {showPaymentModal && selectedCourseForPayment && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <div style={styles.modalHeader}>
//               <h3 style={styles.modalTitle}>
//                 <FaShoppingCart /> Complete Payment
//               </h3>
//               <button
//                 onClick={() => {
//                   setShowPaymentModal(false);
//                   setSelectedCourseForPayment(null);
//                 }}
//                 style={styles.modalClose}
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div style={styles.modalBody}>
//               <div style={styles.courseInfo}>
//                 <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>
//                   {selectedCourseForPayment.title}
//                 </h4>
//                 <p style={{ margin: '0 0 20px 0', color: '#64748b' }}>
//                   {selectedCourseForPayment.description?.substring(0, 150)}...
//                 </p>
                
//                 <div style={styles.priceDisplay}>
//                   <div style={{ fontSize: '14px', color: '#64748b' }}>Course Price:</div>
//                   <div style={{ fontSize: '32px', fontWeight: '800', color: '#3D1A5B' }}>
//                     ₹{selectedCourseForPayment.price || 0}
//                   </div>
//                 </div>
                
//                 <div style={styles.noteBox}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e' }}>
//                     <FaExclamationTriangle />
//                     <strong>Note:</strong> Payment unlocks lifetime access to all course materials.
//                   </div>
//                 </div>
//               </div>
              
//               <div style={styles.paymentMethods}>
//                 <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Select Payment Method</h4>
                
//                 <div style={styles.methodGrid}>
//                   <button
//                     onClick={() => handlePayment(selectedCourseForPayment._id, 'card')}
//                     disabled={processingPayment[selectedCourseForPayment._id]}
//                     style={styles.paymentMethodBtn}
//                   >
//                     <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
//                     <div style={{ fontWeight: '600' }}>Credit/Debit Card</div>
//                   </button>
                  
//                   <button
//                     onClick={() => handlePayment(selectedCourseForPayment._id, 'upi')}
//                     disabled={processingPayment[selectedCourseForPayment._id]}
//                     style={styles.paymentMethodBtn}
//                   >
//                     <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
//                     <div style={{ fontWeight: '600' }}>UPI</div>
//                   </button>
                  
//                   <button
//                     onClick={() => handlePayment(selectedCourseForPayment._id, 'netbanking')}
//                     disabled={processingPayment[selectedCourseForPayment._id]}
//                     style={styles.paymentMethodBtn}
//                   >
//                     <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏦</div>
//                     <div style={{ fontWeight: '600' }}>Net Banking</div>
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div style={styles.modalFooter}>
//               <button
//                 onClick={() => {
//                   setShowPaymentModal(false);
//                   setSelectedCourseForPayment(null);
//                 }}
//                 style={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//               <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', flex: 1 }}>
//                 Secure payment • SSL encrypted
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Add CSS for animations */}
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
        
//         .course-card {
//           transition: all 0.3s ease;
//         }
        
//         .course-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 35px rgba(61, 26, 91, 0.15);
//         }
        
//         .view-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
//         }
        
//         .payment-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
//         }
        
//         .enroll-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
//         }

//         input:focus, select:focus, textarea:focus {
//           border-color: #3D1A5B !important;
//           box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
//         }

//         /* Mobile Responsive Styles */
//         @media (max-width: 768px) {
//           .mobileMenuButton {
//             display: flex !important;
//           }

//           .desktopSidebar {
//             display: none !important;
//           }

//           .mainContent {
//             margin-left: 0 !important;
//             padding: 80px 20px 20px 20px !important;
//           }

//           .loadingContainer {
//             margin-left: 0 !important;
//             padding: 80px 20px 20px 20px !important;
//           }

//           .headerTop {
//             flex-direction: column !important;
//             align-items: flex-start !important;
//             gap: 16px !important;
//           }

//           .headerRight {
//             width: 100% !important;
//             flex-direction: column !important;
//             gap: 12px !important;
//           }

//           .statsContainer {
//             display: grid !important;
//             grid-template-columns: repeat(2, 1fr) !important;
//             width: 100% !important;
//             gap: 12px !important;
//           }

//           .enrollForm {
//             flex-direction: column !important;
//           }

//           .selectWrapper {
//             width: 100% !important;
//             min-width: auto !important;
//           }

//           .enrollButton {
//             width: 100% !important;
//           }

//           .coursesGrid {
//             grid-template-columns: 1fr !important;
//           }

//           .badgeContainer {
//             flex-wrap: wrap !important;
//           }

//           .buttonGroup {
//             flex-direction: column !important;
//           }

//           .viewButton, .paymentButton {
//             width: 100% !important;
//           }

//           .methodGrid {
//             grid-template-columns: 1fr !important;
//           }
//         }

//         @media (max-width: 480px) {
//           .mainContent {
//             padding: 70px 16px 16px 16px !important;
//           }

//           .pageTitle {
//             font-size: 24px !important;
//           }

//           .statsContainer {
//             grid-template-columns: 1fr !important;
//           }

//           .statBadgeContainer {
//             min-width: auto !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Updated Styles with new additions
// const styles = {
//   pageContainer: {
//     display: "flex",
//     minHeight: "100vh",
//     background: "#f9fafb",
//     position: "relative",
//   },

//   mobileMenuButton: {
//     display: "none",
//     position: "fixed",
//     top: "16px",
//     left: "16px",
//     zIndex: 1001,
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     padding: "12px",
//     fontSize: "20px",
//     cursor: "pointer",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     transition: "transform 0.2s ease",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   mobileOverlay: {
//     display: "block",
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     zIndex: 1000,
//   },

//   mobileSidebar: {
//     width: "280px",
//     height: "100%",
//     backgroundColor: "#fff",
//     boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)",
//   },

//   desktopSidebar: {
//     display: "block",
//   },

//   loadingContainer: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 250,
//   },

//   spinner: {
//     width: 50,
//     height: 50,
//     border: "4px solid #e5e7eb",
//     borderTop: "4px solid #3D1A5B",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },

//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#6b7280",
//     fontWeight: 500,
//   },

//   mainContent: {
//     flex: 1,
//     marginLeft: 250,
//     padding: "32px 40px",
//     maxWidth: 1400,
//   },

//   headerSection: {
//     marginBottom: 40,
//   },

//   headerTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//     gap: 24,
//     marginBottom: 24,
//   },

//   headerLeft: {
//     flex: 1,
//   },

//   headerRight: {
//     display: "flex",
//     alignItems: "center",
//     gap: 16,
//   },

//   pageTitle: {
//     fontSize: 28,
//     fontWeight: 700,
//     color: "#3D1A5B",
//     marginBottom: 8,
//     margin: 0,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },

//   titleIcon: {
//     color: "#F1D572",
//     fontSize: 28,
//   },

//   pageSubtitle: {
//     fontSize: 16,
//     color: "#6b7280",
//     lineHeight: 1.6,
//     margin: 0,
//   },

//   liveDataBadge: {
//     background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
//     border: "1px solid rgba(61, 26, 91, 0.2)",
//     borderRadius: "8px",
//     padding: "12px 16px",
//   },

//   liveDataText: {
//     color: "#3D1A5B",
//     fontSize: "14px",
//     fontWeight: "600",
//     margin: 0,
//   },

//   refreshButton: {
//     background: "linear-gradient(135deg, #F1D572 0%, #A68A46 100%)",
//     color: "#3D1A5B",
//     border: "none",
//     borderRadius: "8px",
//     padding: "12px 20px",
//     fontWeight: "600",
//     fontSize: "14px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     transition: "all 0.3s ease",
//     boxShadow: "0 2px 8px rgba(241, 213, 114, 0.3)",
//   },

//   statsContainer: {
//     display: "flex",
//     gap: 16,
//     flexWrap: "wrap",
//   },

//   statBadgeContainer: {
//     background: "#fff",
//     padding: "16px 24px",
//     borderRadius: 12,
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//     textAlign: "center",
//     minWidth: 120,
//     border: "1px solid #e2e8f0",
//   },

//   statBadgeValue: {
//     fontSize: 32,
//     fontWeight: 800,
//     marginBottom: 4,
//   },

//   statBadgeLabel: {
//     fontSize: 13,
//     color: "#64748b",
//     fontWeight: 600,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },

//   enrollSection: {
//     background: "#fff",
//     padding: 32,
//     borderRadius: 20,
//     marginBottom: 40,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//     border: "1px solid #e2e8f0",
//   },

//   sectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     marginBottom: "16px",
//   },

//   sectionIndicator: {
//     width: "4px",
//     height: "20px",
//     background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
//     borderRadius: "2px",
//   },

//   sectionTitle: {
//     fontSize: "20px",
//     fontWeight: "600",
//     color: "#374151",
//     margin: 0,
//   },

//   enrollSubtitle: {
//     fontSize: 14,
//     color: "#64748b",
//     marginBottom: 24,
//   },

//   enrollForm: {
//     display: "flex",
//     gap: 16,
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//   },

//   selectWrapper: {
//     flex: 1,
//     minWidth: 300,
//   },

//   selectStyle: {
//     width: "100%",
//     padding: "14px 16px",
//     fontSize: 15,
//     borderRadius: 12,
//     border: "2px solid #e2e8f0",
//     background: "#f8fafc",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//     fontFamily: "inherit",
//     outline: "none",
//   },

//   enrollButton: {
//     padding: "14px 32px",
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: 15,
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     whiteSpace: "nowrap",
//     cursor: "pointer",
//   },

//   buttonSpinner: {
//     width: 16,
//     height: 16,
//     border: "2px solid rgba(255,255,255,0.3)",
//     borderTop: "2px solid #fff",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },

//   errorMessage: {
//     marginTop: 16,
//     padding: "12px 16px",
//     background: "#fee2e2",
//     color: "#dc2626",
//     borderRadius: 10,
//     fontSize: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     fontWeight: 500,
//     justifyContent: "space-between",
//   },

//   errorClose: {
//     background: "transparent",
//     border: "none",
//     color: "#dc2626",
//     cursor: "pointer",
//     fontSize: "16px",
//     padding: "0",
//     width: "20px",
//     height: "20px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   coursesSection: {
//     marginTop: 40,
//   },

//   coursesSectionHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 24,
//     flexWrap: "wrap",
//     gap: 16,
//   },

//   coursesInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },

//   courseCount: {
//     fontSize: 20,
//     color: "#64748b",
//     fontWeight: 500,
//   },

//   courseStats: {
//     fontSize: 14,
//     color: "#64748b",
//     background: "#f8fafc",
//     padding: "6px 12px",
//     borderRadius: "20px",
//   },

//   emptyState: {
//     textAlign: "center",
//     padding: "80px 40px",
//     background: "#fff",
//     borderRadius: 20,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
//   },

//   emptyIcon: {
//     fontSize: 64,
//     color: "#cbd5e1",
//     marginBottom: 20,
//   },

//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#0f172a",
//     marginBottom: 8,
//   },

//   emptyText: {
//     fontSize: 16,
//     color: "#64748b",
//   },

//   coursesGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
//     gap: 28,
//   },

//   courseCard: {
//     background: "#fff",
//     borderRadius: 20,
//     padding: 28,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//     border: "1px solid #e2e8f0",
//     display: "flex",
//     flexDirection: "column",
//   },

//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//     flexWrap: "wrap",
//     gap: 10,
//   },

//   badgeContainer: {
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap",
//     justifyContent: "flex-end",
//   },

//   priceBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: "4px",
//     background: "rgba(241, 213, 114, 0.2)",
//     color: "#92400e",
//     padding: "6px 12px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "600",
//   },

//   durationBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#64748b",
//     fontSize: 14,
//     fontWeight: 600,
//   },

//   badgeIcon: {
//     fontSize: 13,
//   },

//   cardBody: {
//     flex: 1,
//     marginBottom: 20,
//   },

//   courseTitle: {
//     fontSize: 22,
//     fontWeight: 700,
//     color: "#0f172a",
//     marginBottom: 12,
//     lineHeight: 1.4,
//   },

//   courseDescription: {
//     color: "#64748b",
//     fontSize: 15,
//     lineHeight: 1.7,
//     marginBottom: 12,
//   },

//   dateInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     color: "#64748b",
//     fontSize: 14,
//     fontWeight: 500,
//     marginTop: 12,
//   },

//   dateIcon: {
//     fontSize: 13,
//     color: "#94a3b8",
//   },

//   progressSection: {
//     marginBottom: 20,
//   },

//   progressHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   progressLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#475569",
//   },

//   progressIcon: {
//     fontSize: 14,
//     color: "#3D1A5B",
//   },

//   progressPercentage: {
//     fontSize: 18,
//     fontWeight: 800,
//     color: "#0f172a",
//   },

//   progressBarContainer: {
//     marginTop: 8,
//   },

//   progressBarTrack: {
//     width: "100%",
//     height: 12,
//     background: "#e2e8f0",
//     borderRadius: 10,
//     overflow: "hidden",
//   },

//   progressBarFill: {
//     height: "100%",
//     borderRadius: 10,
//     transition: "width 0.5s ease",
//   },

//   buttonGroup: {
//     display: "flex",
//     gap: 10,
//   },

//   viewButton: {
//     padding: "14px 20px",
//     color: "#fff",
//     border: "none",
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: 15,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     cursor: "pointer",
//   },

//   paymentButton: {
//     padding: "14px 20px",
//     background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: 15,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
//     cursor: "pointer",
//     flex: 1
//   },

//   buttonArrow: {
//     fontSize: 14,
//     transition: "transform 0.3s ease",
//   },

//   // Modal Styles
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//     padding: "20px",
//   },

//   modalContent: {
//     background: "#fff",
//     borderRadius: "20px",
//     boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
//     width: "100%",
//     maxWidth: "500px",
//     overflow: "hidden",
//   },

//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "24px",
//     borderBottom: "1px solid #e2e8f0",
//   },

//   modalTitle: {
//     margin: 0,
//     fontSize: "20px",
//     fontWeight: "700",
//     color: "#0f172a",
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },

//   modalClose: {
//     background: "transparent",
//     border: "none",
//     fontSize: "24px",
//     cursor: "pointer",
//     color: "#64748b",
//     padding: "0",
//     width: "32px",
//     height: "32px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "6px",
//   },

//   modalBody: {
//     padding: "24px",
//   },

//   courseInfo: {
//     marginBottom: "24px",
//   },

//   priceDisplay: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "16px",
//     background: "rgba(61, 26, 91, 0.05)",
//     borderRadius: "12px",
//     border: "1px solid rgba(61, 26, 91, 0.1)",
//   },

//   noteBox: {
//     background: "rgba(241, 213, 114, 0.1)",
//     padding: "12px",
//     borderRadius: "8px",
//     marginTop: "20px",
//     border: "1px solid rgba(166, 138, 70, 0.2)",
//   },

//   paymentMethods: {
//     marginTop: "24px",
//   },

//   methodGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 1fr)",
//     gap: "12px",
//   },

//   paymentMethodBtn: {
//     background: "#fff",
//     border: "2px solid #e2e8f0",
//     borderRadius: "12px",
//     padding: "16px",
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   modalFooter: {
//     padding: "24px",
//     borderTop: "1px solid #e2e8f0",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   cancelButton: {
//     background: "#64748b",
//     color: "#fff",
//     border: "none",
//     padding: "10px 20px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
// };

// // Helper function for status badge style
// const statusBadgeStyle = (status) => ({
//   background: status.bg,
//   color: status.color,
//   padding: "8px 16px",
//   borderRadius: 20,
//   fontSize: 13,
//   fontWeight: 700,
//   display: "flex",
//   alignItems: "center",
//   gap: 6,
//   textTransform: "uppercase",
//   letterSpacing: 0.5,
// });

// export default StudentCoursesPage;