import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import {
  getLecturesByCourse,
  getProgress,
  trackLectureProgress,
  getCoursePrice,
  checkPaymentStatus,
  getEnrollmentStatus,
  getFilteredLectures,
  canAccessCourse,
  getCourseById,
  completePaymentProcess
} from "../api/api";
import {
  FaCheckCircle,
  FaFilePdf,
  FaClock,
  FaPlay,
  FaFileExcel,
  FaFileWord,
  FaFile,
  FaLock,
  FaUnlock,
  FaArrowRight,
  FaExclamationTriangle,
  FaRupeeSign,
  FaShoppingCart,
  FaChartLine,
  FaBook,
  FaVideo,
  FaSpinner,
  FaDownload,
  FaLink,
  FaBars,
  FaTimes,
  FaTag,
  FaGraduationCap,
  FaMoneyBillWave
} from "react-icons/fa";
import { getUserId, isAuthenticated } from "../utils/auth";

const BASE_URL = "https://itechskill.com";

const StudentLecturesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [lectureProgress, setLectureProgress] = useState({});
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [courseAccess, setCourseAccess] = useState({
    hasFullAccess: false,
    isPaid: false,
    coursePrice: 0,
    hasAccess: false
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [lecturesBySubcategory, setLecturesBySubcategory] = useState({});
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);

  const studentId = getUserId();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log("=== FETCHING COURSE DATA ===");
        console.log("Course ID:", courseId);
        console.log("Student ID:", studentId);
        
        // STEP 1: Get course details
        console.log("📚 Fetching course details...");
        const courseRes = await getCourseById(courseId);
        console.log("Course Data:", courseRes);
        console.log("Course Price:", courseRes.price);
        setCourseData(courseRes);
        
        // STEP 2: Check course access
        console.log("=== CHECKING COURSE ACCESS ===");
        const access = await canAccessCourse(courseId, studentId);
        console.log("Access Result:", access);
        
        setCourseAccess({
          hasFullAccess: access.hasFullAccess || false,
          isPaid: access.isPaid || false,
          coursePrice: access.coursePrice || courseRes.price || 0,
          hasAccess: access.canAccess || false
        });
        
        // STEP 3: Get filtered lectures based on payment status
        console.log("=== FETCHING LECTURES ===");
        const filteredResult = await getFilteredLectures(courseId, studentId);
        console.log("Filtered Lectures Result:", filteredResult);
        console.log("Number of lectures:", filteredResult.lectures?.length || 0);
        
        // ✅ CRITICAL: Check if we got lectures
        if (!filteredResult.lectures || filteredResult.lectures.length === 0) {
          console.error("❌ NO LECTURES RECEIVED!");
          console.log("Full response:", filteredResult);
          
          // Show alert only if it's not a filtering issue
          if (!filteredResult.message || !filteredResult.message.includes("free preview")) {
            alert("No lectures found for this course. Please contact support.");
          } else {
            console.log("ℹ️ No free preview lectures available - this is expected for unpaid students");
          }
        } else {
          console.log("✅ Successfully loaded", filteredResult.lectures.length, "lectures");
          
          if (filteredResult.message) {
            console.log("📝 Message:", filteredResult.message);
          }
        }
        
        const lectureData = filteredResult.lectures || [];
        setLectures(lectureData);
        
        // STEP 4: Group lectures by subcategory
        console.log("📂 Grouping lectures by subcategory...");
        const groupedLectures = {};
        lectureData.forEach(lecture => {
          const subCategory = lecture.subCategory || "General Lectures";
          if (!groupedLectures[subCategory]) {
            groupedLectures[subCategory] = [];
          }
          groupedLectures[subCategory].push(lecture);
        });
        console.log("Grouped Lectures:", groupedLectures);
        setLecturesBySubcategory(groupedLectures);
        
        // STEP 5: Get progress
        console.log("=== FETCHING PROGRESS ===");
        const progressRes = await getProgress(studentId, courseId);
        console.log("Progress Result:", progressRes);
        
        const completed = progressRes?.completedLectures || 
                         progressRes?.progress?.completedLectures || 
                         [];

        const completedIds = Array.isArray(completed) 
          ? completed.map(l => l._id || l)
          : [];

        setCompletedLectures(completedIds);
        console.log("Completed Lecture IDs:", completedIds);

        // Progress %
        const progressData = {};
        completedIds.forEach((id) => (progressData[id] = 100));
        setLectureProgress(progressData);

        // STEP 6: Auto select first lecture
        if (lectureData.length > 0) {
          console.log("🎯 Auto-selecting first allowed lecture...");
          let firstAllowed;
          
          // For free courses or students with full access, select first lecture
          if (access.hasFullAccess || courseRes.price === 0) {
            firstAllowed = lectureData[0];
            console.log("✅ Free course or full access - selecting first lecture:", firstAllowed.title);
          } 
          // For paid courses, check if student has paid
          else if (access.isPaid) {
            firstAllowed = lectureData[0];
            console.log("✅ Paid student - selecting first lecture:", firstAllowed.title);
          }
          // Otherwise find first free preview
          else {
            firstAllowed = lectureData.find(l => l.isFreePreview === true);
            console.log("⚠️ Unpaid student - selecting first free preview:", firstAllowed?.title || "None available");
          }
          
          setSelectedLecture(firstAllowed || lectureData[0]);
        } else {
          console.log("⚠️ No lectures available to select");
        }

        // STEP 7: Check if course completed
        if (lectureData.length && completedIds.length === lectureData.length) {
          console.log("🎉 Course completed!");
          setCourseCompleted(true);
        }
        
        // STEP 8: Get enrollment status
        console.log("=== FETCHING ENROLLMENT STATUS ===");
        try {
          const enrollmentRes = await getEnrollmentStatus(studentId, courseId);
          console.log("Enrollment Status:", enrollmentRes);
          setCourseDetails({
            ...courseRes,
            enrollment: enrollmentRes
          });
        } catch (err) {
          console.warn("Could not fetch enrollment details:", err);
        }
        
        console.log("=== FETCH COMPLETE ===");
        
      } catch (err) {
        console.error("❌ LOAD ERROR:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        alert(`Failed to load course lectures: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, studentId, navigate]);

  /* ================= HELPERS ================= */

  const isLockedLecture = (lecture) => {
    console.log("🔍 Checking if lecture is locked:", {
      title: lecture.title,
      coursePrice: courseAccess.coursePrice,
      hasFullAccess: courseAccess.hasFullAccess,
      isPaid: courseAccess.isPaid,
      isFreePreview: lecture.isFreePreview
    });
    
    // FREE course - no lectures locked
    if (courseAccess.coursePrice === 0) {
      console.log("-> Course is FREE - NOT LOCKED");
      return false;
    }
    
    // Student has full access or has paid
    if (courseAccess.hasFullAccess || courseAccess.isPaid) {
      console.log("-> Student has full access - NOT LOCKED");
      return false;
    }
    
    // Free preview lectures are never locked
    if (lecture.isFreePreview === true) {
      console.log("-> Lecture is free preview - NOT LOCKED");
      return false;
    }
    
    // All other lectures in paid courses are locked if not paid
    console.log("-> LOCKED (paid course, not paid, not free preview)");
    return true;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (lectureId) =>
    completedLectures.includes(lectureId)
      ? 100
      : lectureProgress[lectureId] || 0;

  /* ================= VIDEO PROGRESS ================= */
  const handleVideoTimeUpdate = (e, lectureId) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;

    setCurrentVideoTime(current);
    setVideoDuration(duration);

    if (duration && duration > 0) {
      const percent = (current / duration) * 100;
      setLectureProgress((p) => ({ ...p, [lectureId]: percent }));

      // Auto-complete in last 10 seconds
      if (duration - current <= 10 && !completedLectures.includes(lectureId)) {
        handleAutoComplete(lectureId);
      }
    }
  };

  const handleAutoComplete = async (lectureId) => {
    if (completedLectures.includes(lectureId)) return;

    try {
      await trackLectureProgress(studentId, courseId, lectureId);
      
      setCompletedLectures((p) => [...new Set([...p, lectureId])]);
      setLectureProgress((p) => ({ ...p, [lectureId]: 100 }));
      
      // Check if all lectures completed
      if (lectures.length && completedLectures.length + 1 === lectures.length) {
        setCourseCompleted(true);
      }
    } catch (err) {
      console.error("Auto-complete error:", err);
    }
  };

  /* ================= PAYMENT HANDLING ================= */
  const handlePayment = async (paymentMethod) => {
    try {
      setProcessingPayment(true);
      
      console.log("💳 Processing payment:", { courseId, paymentMethod, amount: courseAccess.coursePrice });
      
      const result = await completePaymentProcess(courseId, paymentMethod, courseAccess.coursePrice);
      
      console.log("Payment result:", result);
      
      if (result.success) {
        alert("Payment successful! Course is now unlocked.");
        setShowPaymentMethodsModal(false);
        setShowPaymentModal(false);
        
        console.log("🔄 Refreshing course access...");
        
        // Refresh course access
        const access = await canAccessCourse(courseId, studentId);
        setCourseAccess({
          hasFullAccess: access.hasFullAccess || access.canAccess || false,
          isPaid: access.isPaid || false,
          coursePrice: access.coursePrice || courseData?.price || 0,
          hasAccess: access.canAccess || false
        });
        
        // Refresh lectures
        const filteredResult = await getFilteredLectures(courseId, studentId);
        const lectureData = filteredResult.lectures || [];
        setLectures(lectureData);
        
        // Group lectures by subcategory
        const groupedLectures = {};
        lectureData.forEach(lecture => {
          const subCategory = lecture.subCategory || "General Lectures";
          if (!groupedLectures[subCategory]) {
            groupedLectures[subCategory] = [];
          }
          groupedLectures[subCategory].push(lecture);
        });
        setLecturesBySubcategory(groupedLectures);
        
        // Select first lecture if none selected
        if (!selectedLecture && lectureData.length > 0) {
          setSelectedLecture(lectureData[0]);
        }
        
        console.log("✅ Course access refreshed successfully");
        
      } else {
        alert(result.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment processing error. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  /* ================= STYLES ================= */
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

    contentContainer: {
      flex: 1,
      display: "flex",
      marginLeft: "250px",
    },

    mainContainer: {
      flex: 1,
      display: "flex",
      gap: "20px",
      padding: "20px",
      width: "calc(100vw - 250px)",
    },

    leftPanel: {
      width: "380px",
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      height: "calc(100vh - 40px)",
      overflowY: "auto",
      flexShrink: 0,
    },

    rightPanel: {
      flex: 1,
      background: "#fff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      overflowY: "auto",
      height: "calc(100vh - 40px)",
      minWidth: "600px",
    },

    courseHeader: {
      marginBottom: "20px",
      paddingBottom: "16px",
      borderBottom: "1px solid #e5e7eb",
    },

    courseTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#3D1A5B",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    courseMeta: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      fontSize: "14px",
      color: "#6b7280",
      flexWrap: "wrap",
    },

    coursePriceBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: courseData?.price === 0 ? "#d1fae5" : "rgba(61, 26, 91, 0.1)",
      color: courseData?.price === 0 ? "#065f46" : "#3D1A5B",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "600",
    },

    subcategorySection: {
      marginBottom: "24px",
    },

    subcategoryHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
      padding: "12px 16px",
      background: "rgba(61, 26, 91, 0.05)",
      borderRadius: "8px",
      borderLeft: "4px solid #3D1A5B",
    },

    subcategoryTitle: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "16px",
      fontWeight: "600",
      color: "#3D1A5B",
      margin: 0,
    },

    lectureCount: {
      background: "#3D1A5B",
      color: "#fff",
      padding: "2px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
    },

    lectureCard: {
      padding: "16px",
      marginBottom: "12px",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
      cursor: "pointer",
      transition: "all 0.2s ease",
      position: "relative",
      overflow: "hidden",
    },

    lockedCard: {
      opacity: 0.7,
      cursor: "not-allowed",
      background: "#f3f4f6",
    },

    selectedCard: {
      background: "rgba(61, 26, 91, 0.05)",
      borderColor: "#3D1A5B",
      borderWidth: "2px",
    },

    progressBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: "4px",
      background: "#10b981",
      transition: "width 0.3s ease",
    },

    accessBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      marginTop: "8px",
    },

    freeBadge: {
      background: "#d1fae5",
      color: "#065f46",
    },

    lockedBadge: {
      background: "#fee2e2",
      color: "#991b1b",
    },

    paymentBanner: {
      background: "linear-gradient(135deg, rgba(241, 213, 114, 0.2) 0%, rgba(166, 138, 70, 0.1) 100%)",
      border: "1px solid rgba(166, 138, 70, 0.3)",
      borderRadius: "10px",
      padding: "16px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    videoContainer: {
      width: "100%",
      borderRadius: "12px",
      overflow: "hidden",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },

    resourceCard: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "16px",
      marginTop: "20px",
    },

    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },

    modalContent: {
      background: "#fff",
      borderRadius: "16px",
      padding: "30px",
      maxWidth: "500px",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    },

    loadingContainer: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "20px",
      marginLeft: "250px",
    },

    spinner: {
      width: "60px",
      height: "60px",
      border: "4px solid #e5e7eb",
      borderTop: "4px solid #3D1A5B",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },

    loadingText: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#4b5563",
    },

    // Payment Methods Modal Styles
    paymentMethodBtn: {
      background: "#fff",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px 16px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100px",
      width: "100%",
    },

    methodGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
      marginTop: "16px",
    },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
        <StudentSidebar />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>
            Loading course lectures...
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
      
      {/* Main Content Area */}
      <div style={styles.contentContainer}>
        <div style={styles.mainContainer}>
          
          {/* LEFT PANEL - LECTURE LIST */}
          <div style={styles.leftPanel} className="lecture-list-panel">
            {/* Course Header */}
            <div style={styles.courseHeader}>
              <h1 style={styles.courseTitle}>
                <FaGraduationCap /> {courseData?.title || "Course"}
              </h1>
              <div style={styles.courseMeta}>
                <span style={styles.coursePriceBadge}>
                  {courseAccess.coursePrice === 0 ? (
                    <>
                      <FaUnlock /> FREE COURSE
                    </>
                  ) : (
                    <>
                      <FaRupeeSign /> ₹{courseAccess.coursePrice || 0}
                    </>
                  )}
                </span>
                <span>{lectures.length} lectures</span>
                <span>{completedLectures.length} completed</span>
              </div>
              
              {/* Course Access Status */}
              <div style={{ 
                marginTop: "12px", 
                padding: "8px 12px",
                borderRadius: "8px",
                background: courseAccess.hasFullAccess ? "#d1fae5" : "#fee2e2",
                color: courseAccess.hasFullAccess ? "#065f46" : "#991b1b",
                fontSize: "14px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}>
                {courseAccess.hasFullAccess ? (
                  <>
                    <FaUnlock /> Full Access
                  </>
                ) : courseAccess.coursePrice === 0 ? (
                  <>
                    <FaUnlock /> Free Course
                  </>
                ) : (
                  <>
                    <FaLock /> Limited Access
                  </>
                )}
              </div>
            </div>

            {/* Payment Required Banner - Only show for paid courses that aren't purchased */}
            {courseAccess.coursePrice > 0 && !courseAccess.hasFullAccess && (
              <div style={styles.paymentBanner}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <FaExclamationTriangle style={{ color: "#92400e" }} />
                    <strong style={{ color: "#92400e" }}>Purchase Required</strong>
                  </div>
                  <div style={{ fontSize: "14px", color: "#92400e" }}>
                    Purchase course to unlock all lectures
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #F1D572 0%, #A68A46 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    boxShadow: "0 2px 8px rgba(166, 138, 70, 0.3)",
                  }}
                >
                  <FaShoppingCart /> Purchase
                </button>
              </div>
            )}

            {/* Free Course Notice */}
            {courseAccess.coursePrice === 0 && (
              <div style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <FaUnlock style={{ color: "#059669", fontSize: "20px" }} />
                  <strong style={{ color: "#059669" }}>Free Course</strong>
                </div>
                <p style={{ fontSize: "14px", color: "#065f46", margin: 0 }}>
                  All {lectures.length} lectures are available for free in this course.
                </p>
              </div>
            )}

            {/* Lectures by Subcategory */}
            {Object.keys(lecturesBySubcategory).length > 0 ? (
              Object.keys(lecturesBySubcategory).map((subcategory) => (
                <div key={subcategory} style={styles.subcategorySection}>
                  <div style={styles.subcategoryHeader}>
                    <h3 style={styles.subcategoryTitle}>
                      <FaTag /> {subcategory}
                      <span style={styles.lectureCount}>
                        {lecturesBySubcategory[subcategory].length}
                      </span>
                    </h3>
                  </div>

                  {/* Lecture List for this subcategory */}
                  {lecturesBySubcategory[subcategory].map((lecture) => {
                    const locked = isLockedLecture(lecture);
                    const completed = completedLectures.includes(lecture._id);
                    const progress = getProgressPercentage(lecture._id);
                    const isSelected = selectedLecture?._id === lecture._id;
                    const isFreePreview = lecture.isFreePreview;

                    return (
                      <div
                        key={lecture._id}
                        onClick={() => {
                          if (locked && courseAccess.coursePrice > 0) {
                            setShowPaymentModal(true);
                            return;
                          }
                          setSelectedLecture(lecture);
                        }}
                        style={{
                          ...styles.lectureCard,
                          ...(locked ? styles.lockedCard : {}),
                          ...(isSelected ? styles.selectedCard : {}),
                        }}
                      >
                        {/* Progress Bar */}
                        {!locked && (
                          <div style={{
                            ...styles.progressBar,
                            width: `${progress}%`,
                            background: completed 
                              ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)" 
                              : "linear-gradient(90deg, #3D1A5B 0%, #5E427B 100%)"
                          }} />
                        )}

                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            background: locked ? "#f3f4f6" : completed ? "#d1fae5" : "rgba(61, 26, 91, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: locked ? "#9ca3af" : completed ? "#10b981" : "#3D1A5B",
                            fontWeight: "700",
                            fontSize: "16px",
                            flexShrink: 0
                          }}>
                            {completed ? <FaCheckCircle /> : lecture.lectureNumber}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "flex-start",
                              marginBottom: "4px"
                            }}>
                              <div style={{ 
                                fontSize: "15px", 
                                fontWeight: "600", 
                                color: locked ? "#9ca3af" : "#111827",
                                lineHeight: "1.4"
                              }}>
                                {lecture.title}
                                {isFreePreview && !locked && (
                                  <span style={{ 
                                    fontSize: "11px", 
                                    color: "#059669",
                                    marginLeft: "8px",
                                    background: "#d1fae5",
                                    padding: "2px 6px",
                                    borderRadius: "4px"
                                  }}>
                                    FREE PREVIEW
                                  </span>
                                )}
                              </div>
                              <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "6px",
                                fontSize: "12px",
                                color: "#6b7280"
                              }}>
                                {lecture.duration && (
                                  <>
                                    <FaClock size={10} />
                                    {lecture.duration}m
                                  </>
                                )}
                              </div>
                            </div>

                            <div style={{ 
                              fontSize: "13px", 
                              color: locked ? "#9ca3af" : "#6b7280",
                              marginBottom: "8px",
                              textTransform: "uppercase"
                            }}>
                              {lecture.type}
                            </div>

                            {/* Access Status */}
                            <div style={{
                              ...styles.accessBadge,
                              ...(locked ? styles.lockedBadge : isFreePreview ? styles.freeBadge : {
                                background: "rgba(61, 26, 91, 0.1)",
                                color: "#3D1A5B"
                              })
                            }}>
                              {locked ? (
                                <>
                                  <FaLock size={10} /> Locked
                                </>
                              ) : isFreePreview ? (
                                <>
                                  <FaUnlock size={10} /> Free Preview
                                </>
                              ) : (
                                <>
                                  <FaPlay size={10} /> Unlocked
                                </>
                              )}
                            </div>

                            {/* Progress Display */}
                            {!locked && progress > 0 && (
                              <div style={{ marginTop: "8px" }}>
                                <div style={{ 
                                  display: "flex", 
                                  justifyContent: "space-between", 
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginBottom: "4px"
                                }}>
                                  <span>Progress</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <div style={{
                                  width: "100%",
                                  height: "4px",
                                  background: "#e5e7eb",
                                  borderRadius: "2px",
                                  overflow: "hidden"
                                }}>
                                  <div style={{
                                    width: `${progress}%`,
                                    height: "100%",
                                    background: completed 
                                      ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)" 
                                      : "linear-gradient(90deg, #3D1A5B 0%, #5E427B 100%)",
                                    transition: "width 0.3s ease"
                                  }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: "40px 20px", 
                color: "#9ca3af" 
              }}>
                <FaBook style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }} />
                <p style={{ fontSize: "16px", fontWeight: "500" }}>
                  No lectures available
                </p>
                {courseAccess.coursePrice > 0 && !courseAccess.isPaid && (
                  <p style={{ fontSize: "14px", marginTop: "12px", color: "#6b7280" }}>
                    This course has no free preview lectures. Purchase the course to access all content.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANEL - LECTURE CONTENT */}
          <div style={styles.rightPanel} className="lecture-content-panel">
            {!selectedLecture ? (
              <div style={{ 
                textAlign: "center", 
                padding: "60px 20px", 
                color: "#9ca3af" 
              }}>
                <FaPlay style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }} />
                <p style={{ fontSize: "16px", fontWeight: "500" }}>
                  Select a lecture to start learning
                </p>
              </div>
            ) : isLockedLecture(selectedLecture) ? (
              <div style={{ 
                textAlign: "center", 
                padding: "60px 20px" 
              }}>
                <FaLock style={{ fontSize: "64px", color: "#ef4444", marginBottom: "24px" }} />
                <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
                  🔒 Lecture Locked
                </h3>
                <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px" }}>
                  {selectedLecture.isFreePreview 
                    ? "This free preview lecture is available to all users."
                    : "This lecture is part of the paid course content. Purchase the course to unlock all lectures and continue your learning journey."
                  }
                </p>
                {courseAccess.coursePrice > 0 && !selectedLecture.isFreePreview && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    style={{
                      background: "linear-gradient(135deg, #F1D572 0%, #A68A46 100%)",
                      color: "#fff",
                      border: "none",
                      padding: "14px 28px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "16px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "12px",
                      boxShadow: "0 4px 12px rgba(166, 138, 70, 0.3)",
                      marginBottom: "12px"
                    }}
                  >
                    <FaShoppingCart /> Unlock Course for ₹{courseAccess.coursePrice || 0}
                  </button>
                )}
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  {courseAccess.coursePrice > 0 
                    ? `${lectures.filter(l => l.isFreePreview === true).length} free preview lectures available` 
                    : "All lectures are available for free"}
                </div>
              </div>
            ) : (
              <>
                {/* Lecture Header */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ 
                        fontSize: "24px", 
                        fontWeight: "700", 
                        color: "#3D1A5B", 
                        marginBottom: "8px",
                        lineHeight: "1.3"
                      }}>
                        {selectedLecture.title}
                      </h2>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                        flexWrap: "wrap"
                      }}>
                        <span style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: "6px" 
                        }}>
                          <FaClock /> Lecture {selectedLecture.lectureNumber}
                        </span>
                        {selectedLecture.duration && (
                          <span>Duration: {selectedLecture.duration} minutes</span>
                        )}
                        {selectedLecture.subCategory && (
                          <span style={{ 
                            background: "rgba(61, 26, 91, 0.1)",
                            color: "#3D1A5B",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <FaTag size={10} /> {selectedLecture.subCategory}
                          </span>
                        )}
                        {selectedLecture.isFreePreview && (
                          <span style={{ 
                            background: "#d1fae5",
                            color: "#065f46",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            <FaUnlock size={10} style={{ marginRight: "4px" }} />
                            Free Preview
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {completedLectures.includes(selectedLecture._id) && (
                      <div style={{
                        background: "#d1fae5",
                        color: "#065f46",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <FaCheckCircle /> Completed
                      </div>
                    )}
                  </div>

                  <p style={{ 
                    fontSize: "15px", 
                    color: "#4b5563", 
                    lineHeight: "1.6",
                    marginBottom: "16px"
                  }}>
                    {selectedLecture.description}
                  </p>

                  {/* Lecture Progress */}
                  <div style={{
                    padding: "16px",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      marginBottom: "8px"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                      }}>
                        <FaChartLine /> Lecture Progress
                      </div>
                      <div style={{ 
                        fontSize: "16px", 
                        fontWeight: "700",
                        color: completedLectures.includes(selectedLecture._id) ? "#10b981" : "#3D1A5B"
                      }}>
                        {Math.round(getProgressPercentage(selectedLecture._id))}%
                      </div>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      background: "#e5e7eb",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${getProgressPercentage(selectedLecture._id)}%`,
                        height: "100%",
                        background: completedLectures.includes(selectedLecture._id) 
                          ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                          : "linear-gradient(90deg, #3D1A5B 0%, #5E427B 100%)",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                {selectedLecture.videoPath && (
                  <div style={styles.videoContainer}>
                    <video
                      key={selectedLecture._id}
                      controls
                      onTimeUpdate={(e) => handleVideoTimeUpdate(e, selectedLecture._id)}
                      onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
                      style={{
                        width: "100%",
                        maxHeight: "600px",
                        background: "#000",
                      }}
                    >
                      <source src={`${BASE_URL}/${selectedLecture.videoPath}`} />
                      Your browser does not support the video tag.
                    </video>
                    
                    {videoDuration > 0 && (
                      <div style={{
                        padding: "12px 16px",
                        background: "#f9fafb",
                        borderTop: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "#6b7280"
                      }}>
                        <span>Current time: {formatTime(currentVideoTime)}</span>
                        <span>Duration: {formatTime(videoDuration)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Resource Files */}
                {(selectedLecture.pdfPath || selectedLecture.excelPath || selectedLecture.documentPath || selectedLecture.videoUrl) && (
                  <div style={styles.resourceCard}>
                    <h3 style={{ 
                      fontSize: "18px", 
                      fontWeight: "600", 
                      color: "#111827",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <FaDownload /> Lecture Resources
                    </h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {selectedLecture.pdfPath && (
                        <a
                          href={`${BASE_URL}/${selectedLecture.pdfPath}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: "#991b1b",
                            transition: "all 0.2s ease"
                          }}
                          onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
                          onMouseOut={e => e.target.style.transform = "translateY(0)"}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <FaFilePdf style={{ fontSize: "20px" }} />
                            <div>
                              <div style={{ fontWeight: "600" }}>Lecture Notes (PDF)</div>
                              <div style={{ fontSize: "12px", color: "#dc2626" }}>Click to view/download</div>
                            </div>
                          </div>
                          <FaArrowRight />
                        </a>
                      )}

                      {selectedLecture.excelPath && (
                        <a
                          href={`${BASE_URL}/${selectedLecture.excelPath}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: "#166534",
                            transition: "all 0.2s ease"
                          }}
                          onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
                          onMouseOut={e => e.target.style.transform = "translateY(0)"}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <FaFileExcel style={{ fontSize: "20px" }} />
                            <div>
                              <div style={{ fontWeight: "600" }}>Exercise Files (Excel)</div>
                              <div style={{ fontSize: "12px", color: "#16a34a" }}>Download practice files</div>
                            </div>
                          </div>
                          <FaArrowRight />
                        </a>
                      )}

                      {selectedLecture.videoUrl && (
                        <a
                          href={selectedLecture.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: "rgba(61, 26, 91, 0.05)",
                            border: "1px solid rgba(61, 26, 91, 0.2)",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: "#3D1A5B",
                            transition: "all 0.2s ease"
                          }}
                          onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
                          onMouseOut={e => e.target.style.transform = "translateY(0)"}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <FaLink style={{ fontSize: "20px" }} />
                            <div>
                              <div style={{ fontWeight: "600" }}>External Video</div>
                              <div style={{ fontSize: "12px", color: "#5E427B" }}>Watch on external platform</div>
                            </div>
                          </div>
                          <FaArrowRight />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL - Only for paid courses */}
      {showPaymentModal && courseAccess.coursePrice > 0 && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                margin: "0 auto 20px",
                background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FaLock style={{ fontSize: "36px", color: "#fff" }} />
              </div>
              
              <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#3D1A5B", marginBottom: "12px" }}>
                Unlock Full Course Access
              </h3>
              
              <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px", lineHeight: "1.6" }}>
                Get access to all lectures, downloadable resources, and certificate of completion
              </p>
            </div>
            
            <div style={{ 
              background: "rgba(61, 26, 91, 0.05)", 
              padding: "24px", 
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid rgba(61, 26, 91, 0.2)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "14px", color: "#5E427B", marginBottom: "8px", fontWeight: "600" }}>
                Course: {courseData?.title || "Course"}
              </div>
              <div style={{ fontSize: "40px", fontWeight: "800", color: "#3D1A5B", marginTop: "8px" }}>
                ₹{courseAccess.coursePrice || 0}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                One-time payment • Lifetime access
              </div>
            </div>

            <div style={{ 
              background: "rgba(241, 213, 114, 0.1)", 
              padding: "14px", 
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid rgba(166, 138, 70, 0.3)"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <FaCheckCircle style={{ color: "#059669", marginTop: "2px", fontSize: "18px" }} />
                <div style={{ fontSize: "14px", color: "#92400e", lineHeight: "1.6" }}>
                  <strong>What's included:</strong> All lectures, downloadable materials, progress tracking, and completion certificate
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  setShowPaymentMethodsModal(true);
                  setShowPaymentModal(false);
                }}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={e => e.target.style.transform = "translateY(0)"}
              >
                <FaShoppingCart /> Proceed to Payment
              </button>
            </div>
            
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                width: "100%",
                background: "transparent",
                color: "#64748b",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                marginTop: "12px"
              }}
            >
              Continue Browsing Free Lectures
            </button>
            
            <div style={{ 
              fontSize: "12px", 
              color: "#64748b", 
              textAlign: "center", 
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
              <FaCheckCircle style={{ color: "#059669" }} />
              Secure payment • 30-day money-back guarantee
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT METHODS MODAL */}
      {showPaymentMethodsModal && courseAccess.coursePrice > 0 && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentMethodsModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#3D1A5B", marginBottom: "8px" }}>
                Select Payment Method
              </h3>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>
                Total Amount: <strong style={{ color: "#3D1A5B" }}>₹{courseAccess.coursePrice || 0}</strong>
              </p>
            </div>

            <div style={styles.methodGrid}>
              <button
                onClick={() => handlePayment('card')}
                disabled={processingPayment}
                style={{
                  ...styles.paymentMethodBtn,
                  opacity: processingPayment ? 0.7 : 1,
                  cursor: processingPayment ? 'not-allowed' : 'pointer'
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>💳</div>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>Credit/Debit Card</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Pay with card</div>
              </button>
              
              <button
                onClick={() => handlePayment('upi')}
                disabled={processingPayment}
                style={{
                  ...styles.paymentMethodBtn,
                  opacity: processingPayment ? 0.7 : 1,
                  cursor: processingPayment ? 'not-allowed' : 'pointer'
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📱</div>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>UPI</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Pay with UPI ID</div>
              </button>
              
              <button
                onClick={() => handlePayment('netbanking')}
                disabled={processingPayment}
                style={{
                  ...styles.paymentMethodBtn,
                  opacity: processingPayment ? 0.7 : 1,
                  cursor: processingPayment ? 'not-allowed' : 'pointer'
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏦</div>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>Net Banking</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>All banks supported</div>
              </button>
              
              <button
                onClick={() => handlePayment('wallet')}
                disabled={processingPayment}
                style={{
                  ...styles.paymentMethodBtn,
                  opacity: processingPayment ? 0.7 : 1,
                  cursor: processingPayment ? 'not-allowed' : 'pointer'
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>👛</div>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>Wallet</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Paytm, PhonePe, etc.</div>
              </button>
            </div>

            {processingPayment && (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginTop: "20px",
                padding: "16px",
                background: "rgba(61, 26, 91, 0.05)",
                borderRadius: "8px"
              }}>
                <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "20px", color: "#3D1A5B" }} />
                <span style={{ fontSize: "14px", color: "#3D1A5B", fontWeight: "600" }}>
                  Processing payment...
                </span>
              </div>
            )}

            <button
              onClick={() => {
                setShowPaymentMethodsModal(false);
                setShowPaymentModal(true);
              }}
              style={{
                width: "100%",
                background: "transparent",
                color: "#64748b",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                marginTop: "20px"
              }}
            >
              ← Back
            </button>
            
            <div style={{ 
              fontSize: "12px", 
              color: "#64748b", 
              textAlign: "center", 
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb"
            }}>
              Your payment is secure and encrypted
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations and responsive */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .mainContainer {
            flex-direction: column !important;
          }

          .leftPanel, .rightPanel {
            width: 100% !important;
            min-width: auto !important;
            height: auto !important;
            max-height: none !important;
          }

          .lecture-list-panel {
            order: 2;
            margin-top: 20px;
          }

          .lecture-content-panel {
            order: 1;
          }
        }

        @media (max-width: 768px) {
          .mobileMenuButton {
            display: flex !important;
          }

          .desktopSidebar {
            display: none !important;
          }

          .contentContainer {
            margin-left: 0 !important;
          }

          .mainContainer {
            width: 100% !important;
            padding: 80px 16px 16px 16px !important;
          }

          .loadingContainer {
            margin-left: 0 !important;
            padding: 80px 20px 20px 20px !important;
          }

          .leftPanel, .rightPanel {
            padding: 16px !important;
          }

          .paymentBanner {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
          }

          .videoContainer video {
            max-height: 300px !important;
          }

          .methodGrid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .mainContainer {
            padding: 70px 12px 12px 12px !important;
          }

          .modalContent {
            padding: 20px !important;
          }

          .courseMeta {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentLecturesPage;