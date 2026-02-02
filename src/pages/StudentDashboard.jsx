import React, { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { FaBook, FaClock, FaCheckCircle, FaExclamationCircle, FaBars, FaTimes } from "react-icons/fa";
import {
  getStudentEnrollments,
  getProgress,
  getAllCourses,
  enrollStudentInCourse,
} from "../api/api";

const StudentDashboard = () => {
  /* ================= USER INFO ================= */
  const userInfo = localStorage.getItem("userInfo");
  const parsedUser = userInfo ? JSON.parse(userInfo) : null;

  const studentId = parsedUser?._id || parsedUser?.id || null;
  const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState(0);
  const [subscriptionTime, setSubscriptionTime] = useState("Loading...");
  const [coursesList, setCoursesList] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [enrollData, setEnrollData] = useState({
    name: parsedUser?.fullName || "",
    email: parsedUser?.email || "",
    phone: "",
    country: "",
    dob: "",
    gender: "",
    courses: "",
    message: "",
    agree: false,
  });

  /* ================= EFFECTS ================= */
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchCourses()]);
      setLoading(false);
    };
    initializeDashboard();
  }, []);

  /* ================= FUNCTIONS ================= */
  const fetchDashboard = async () => {
    if (!studentId) return;

    try {
      const enrollments = await getStudentEnrollments(studentId);
      console.log("enrollement", enrollments);

      // ✅ Count total courses
      setMyCourses(enrollments.length);

      // ✅ Save enrolled courses safely (filter out null courses)
      setEnrolledCourses(
        enrollments
          .filter((e) => e.course) // only include non-null courses
          .map((e) => e.course._id)
      );

      // ✅ Calculate subscription time using first active course
      const activeCourse = enrollments.find((e) => e.course && e.course.endDate);
      if (activeCourse) {
        const diff = new Date(activeCourse.course.endDate) - new Date();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setSubscriptionTime(days > 0 ? `${days} Days Remaining` : "Expired");
      } else {
        setSubscriptionTime("N/A");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      setCoursesList(res);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!enrollData.name.trim()) newErrors.name = "Full name is required";
    if (!enrollData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!enrollData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!enrollData.country.trim()) newErrors.country = "Country is required";
    if (!enrollData.dob) newErrors.dob = "Date of birth is required";
    if (!enrollData.gender) newErrors.gender = "Gender is required";
    if (!enrollData.courses) newErrors.courses = "Please select a course";
    if (!enrollData.agree) newErrors.agree = "You must agree to the rules";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollData({
      ...enrollData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (enrolledCourses.includes(enrollData.courses)) {
      setErrors({ courses: "You are already enrolled in this course" });
      return;
    }

    setIsSubmitting(true);

    try {
      await enrollStudentInCourse(studentId, enrollData.courses);

      alert("✅ Enrolled successfully!");

      // Reset form
      setEnrollData({
        name: parsedUser?.fullName || "",
        email: parsedUser?.email || "",
        phone: "",
        country: "",
        dob: "",
        gender: "",
        courses: "",
        message: "",
        agree: false,
      });

      // Refresh dashboard
      await fetchDashboard();
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Enrollment failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <StudentSidebar />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
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

      <div style={styles.mainContent}>
        {/* 🔹 HEADER SECTION */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.pageTitle}>
                Welcome back, <span style={styles.highlightText}>{studentName}</span> 👋
              </h1>
              <p style={styles.pageSubtitle}>Here's your learning overview and progress</p>
            </div>
            <div style={styles.liveDataBadge}>
              <p style={styles.liveDataText}>
                Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 STATISTICS CARDS */}
        <div style={styles.statsSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIndicator}></div>
            <h2 style={styles.sectionTitle}>Overview</h2>
          </div>
          <div style={styles.cardGrid}>
            <StatCard
              icon={<FaBook />}
              title="My Courses"
              value={myCourses}
              subtitle={`${myCourses} ${myCourses === 1 ? "course" : "courses"} enrolled`}
              gradient="linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)"
            />
            <StatCard
              icon={<FaClock />}
              title="Subscription Time"
              value={subscriptionTime}
              subtitle="Until your access expires"
              gradient="linear-gradient(135deg, #F1D572 0%, #A68A46 100%)"
            />
          </div>
        </div>

        {/* 🔹 ENROLLMENT FORM */}
        <div style={styles.formSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIndicator}></div>
            <h2 style={styles.sectionTitle}>Enroll in a New Course</h2>
          </div>
          
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h3 style={styles.formTitle}>Course Enrollment</h3>
              <p style={styles.formSubtitle}>Fill out the form below to enroll in your desired course</p>
            </div>

            <form style={styles.formStyle} onSubmit={handleEnroll}>
              <div style={styles.formRow}>
                <FormInput
                  label="Full Name"
                  name="name"
                  value={enrollData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={enrollData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={enrollData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
                <FormInput
                  label="Country"
                  name="country"
                  value={enrollData.country}
                  onChange={handleChange}
                  error={errors.country}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <FormInput
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={enrollData.dob}
                  onChange={handleChange}
                  error={errors.dob}
                  required
                />
                <FormSelect
                  label="Gender"
                  name="gender"
                  value={enrollData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  options={["Male", "Female", "Other"]}
                  required
                />
              </div>

              <FormSelect
                label="Select Course"
                name="courses"
                value={enrollData.courses}
                onChange={handleChange}
                error={errors.courses}
                options={coursesList.map((c) => ({ value: c._id, label: c.title }))}
                required
              />

              <div style={styles.fieldContainer}>
                <label style={styles.labelStyle}>Message (Optional)</label>
                <textarea
                  name="message"
                  value={enrollData.message}
                  onChange={handleChange}
                  style={styles.textareaStyle}
                  placeholder="Add any additional information or questions..."
                  rows={4}
                />
              </div>

              <div style={styles.rulesContainer}>
                <FaExclamationCircle style={{ color: "#A68A46", fontSize: 18, flexShrink: 0 }} />
                <p style={styles.rulesText}>
                  Lectures downloads, screenshots, recordings, and sharing are strictly prohibited.
                </p>
              </div>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="agree"
                  checked={enrollData.agree}
                  onChange={handleChange}
                  style={styles.checkboxStyle}
                />
                <span>I agree to the terms and rules stated above</span>
              </label>
              {errors.agree && <ErrorMessage message={errors.agree} />}
              {errors.submit && <ErrorMessage message={errors.submit} />}

              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div style={styles.buttonSpinner}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Submit & Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */
const StatCard = ({ icon, title, value, subtitle, gradient }) => (
  <div style={{ ...styles.statCard, background: gradient }}>
    <div style={styles.statIconContainer}>{icon}</div>
    <div style={styles.statContent}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statSubtitle}>{subtitle}</p>
    </div>
  </div>
);

const FormInput = ({ label, name, type = "text", value, onChange, error, required }) => (
  <div style={styles.fieldContainer}>
    <label style={styles.labelStyle}>
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      style={{ ...styles.inputStyle, ...(error ? styles.errorInputStyle : {}) }}
    />
    {error && <ErrorMessage message={error} />}
  </div>
);

const FormSelect = ({ label, name, value, onChange, error, options, required }) => (
  <div style={styles.fieldContainer}>
    <label style={styles.labelStyle}>
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{ ...styles.inputStyle, ...(error ? styles.errorInputStyle : {}) }}
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "string" ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
    {error && <ErrorMessage message={error} />}
  </div>
);

const ErrorMessage = ({ message }) => (
  <p style={styles.errorText}>
    <FaExclamationCircle style={{ fontSize: 12 }} /> {message}
  </p>
);

/* ================= STYLES ================= */
const styles = {
  pageContainer: {
    display: "flex",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
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
  },

  // Mobile Overlay
  mobileOverlay: {
    display: "none",
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
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "250px",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #3D1A5B",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },

  loadingText: {
    color: "#6b7280",
    fontSize: "16px",
  },

  mainContent: {
    flex: 1,
    marginLeft: "250px",
    padding: "32px 40px",
    maxWidth: "1400px",
  },

  headerSection: {
    marginBottom: "32px",
  },

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },

  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#3D1A5B",
    margin: 0,
    marginBottom: "8px",
  },

  highlightText: {
    background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  pageSubtitle: {
    color: "#6b7280",
    fontSize: "16px",
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

  statsSection: {
    marginBottom: "48px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
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

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  statCard: {
    color: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },

  statIconContainer: {
    fontSize: "36px",
    opacity: 0.9,
  },

  statContent: {
    flex: 1,
  },

  statTitle: {
    fontSize: "14px",
    fontWeight: "500",
    opacity: 0.9,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
    margin: 0,
  },

  statSubtitle: {
    fontSize: "13px",
    opacity: 0.8,
    margin: 0,
  },

  formSection: {
    marginBottom: "40px",
  },

  formCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },

  formHeader: {
    marginBottom: "32px",
  },

  formTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#3D1A5B",
    marginBottom: "8px",
    margin: 0,
  },

  formSubtitle: {
    fontSize: "15px",
    color: "#6b7280",
    margin: 0,
  },

  formStyle: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  labelStyle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  inputStyle: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },

  errorInputStyle: {
    borderColor: "#ef4444",
  },

  textareaStyle: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    transition: "border-color 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  },

  rulesContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    background: "linear-gradient(135deg, rgba(241, 213, 114, 0.1) 0%, rgba(166, 138, 70, 0.1) 100%)",
    borderRadius: "10px",
    border: "1px solid rgba(166, 138, 70, 0.2)",
  },

  rulesText: {
    fontSize: "13px",
    color: "#92400e",
    margin: 0,
    lineHeight: "1.6",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#475569",
    cursor: "pointer",
  },

  checkboxStyle: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },

  errorText: {
    fontSize: "13px",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "4px",
  },

  submitButton: {
    background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
    color: "#fff",
    padding: "14px 32px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
  },

  buttonSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// Add responsive CSS and animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: #3D1A5B !important;
    box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
  }

  /* Stat card hover effect */
  [style*="statCard"]:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.2);
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    /* Show mobile menu button */
    button[style*="mobileMenuButton"] {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }

    /* Show mobile overlay when open */
    .mobile-sidebar-open {
      display: block !important;
    }

    /* Hide desktop sidebar */
    [style*="desktopSidebar"] {
      display: none !important;
    }

    /* Adjust main content for mobile */
    [style*="mainContent"] {
      margin-left: 0 !important;
      padding: 80px 20px 20px 20px !important;
    }

    /* Adjust loading container */
    [style*="loadingContainer"] {
      margin-left: 0 !important;
      padding: 80px 20px 20px 20px !important;
    }

    /* Stack header items */
    [style*="headerTop"] {
      flex-direction: column;
      align-items: flex-start !important;
    }

    /* Adjust title size */
    [style*="pageTitle"] {
      fontSize: 24px !important;
    }

    /* Adjust page subtitle */
    [style*="pageSubtitle"] {
      fontSize: 14px !important;
    }

    /* Full width badge */
    [style*="liveDataBadge"] {
      width: 100%;
    }

    /* Single column card grid */
    [style*="cardGrid"] {
      grid-template-columns: 1fr !important;
    }

    /* Adjust stat card */
    [style*="statCard"] {
      padding: 20px !important;
    }

    /* Adjust form card */
    [style*="formCard"] {
      padding: 24px 20px !important;
      border-radius: 16px !important;
    }

    /* Single column form rows */
    [style*="formRow"] {
      grid-template-columns: 1fr !important;
    }

    /* Adjust section title */
    [style*="sectionTitle"] {
      fontSize: 18px !important;
    }

    /* Adjust form title */
    [style*="formTitle"] {
      fontSize: 20px !important;
    }

    /* Adjust button */
    [style*="submitButton"] {
      width: 100%;
      font-size: 14px !important;
      padding: 12px 24px !important;
    }
  }

  @media (max-width: 480px) {
    /* Extra small devices */
    [style*="mainContent"] {
      padding: 70px 16px 16px 16px !important;
    }

    [style*="pageTitle"] {
      fontSize: 20px !important;
    }

    [style*="statValue"] {
      fontSize: 24px !important;
    }

    [style*="statIconContainer"] {
      font-size: 28px !important;
    }

    [style*="formCard"] {
      padding: 20px 16px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default StudentDashboard;