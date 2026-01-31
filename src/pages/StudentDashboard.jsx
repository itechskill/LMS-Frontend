// // import React, { useEffect, useState } from "react";
// // import StudentSidebar from "../components/StudentSidebar";
// // import { FaBook, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
// // import {
// //   getStudentEnrollments,
// //   getProgress,
// //   getAllCourses,
// //   enrollStudentInCourse,
// // } from "../api/api";

// // const StudentDashboard = () => {
// //   /* ================= USER INFO ================= */
// //   const userInfo = localStorage.getItem("userInfo");
// //   const parsedUser = userInfo ? JSON.parse(userInfo) : null;

// //   const studentId = parsedUser?._id || parsedUser?.id || null;
// //   const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

// //   /* ================= STATES ================= */
// //   const [loading, setLoading] = useState(true);
// //   const [myCourses, setMyCourses] = useState(0);
// //   const [subscriptionTime, setSubscriptionTime] = useState("Loading...");
// //   const [coursesList, setCoursesList] = useState([]);
// //   const [enrolledCourses, setEnrolledCourses] = useState([]);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [errors, setErrors] = useState({});

// //   const [enrollData, setEnrollData] = useState({
// //     name: parsedUser?.fullName || "",
// //     email: parsedUser?.email || "",
// //     phone: "",
// //     country: "",
// //     dob: "",
// //     gender: "",
// //     courses: "",
// //     message: "",
// //     agree: false,
// //   });

// //   /* ================= EFFECTS ================= */
// //   useEffect(() => {
// //     const initializeDashboard = async () => {
// //       setLoading(true);
// //       await Promise.all([fetchDashboard(), fetchCourses()]);
// //       setLoading(false);
// //     };
// //     initializeDashboard();
// //   }, []);

// //   /* ================= FUNCTIONS ================= */
// //   const fetchDashboard = async () => {
// //     if (!studentId) return;

// //     try {
// //       const enrollments = await getStudentEnrollments(studentId);
// //       console.log("enrollement",enrollments);
// //       setMyCourses(enrollments.length);
// //       // setEnrolledCourses(enrollments.map((e) => e.course._id));
// //       setEnrolledCourses(
// //         enrollments.filter((e) => e.course)
// //         .map((e) => e.course._id)
// //       );

// //       const activeCourse=enrollements.find((e) => e.course && e.course.endDate);
// //       // if (enrollments[0]?.course?.endDate) {
// //       if(activeCourse){
// //       // const diff = new Date(enrollments[0].course.endDate) - new Date();
// //        const diff = new Date(activeCourse.course.endDate) - new Date();
// //         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// //         setSubscriptionTime(days > 0 ? `${days} Days Remaining` : "Expired");
// //       } else {
// //         setSubscriptionTime("N/A");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching dashboard:", error);
// //     }
// //   };

// //   const fetchCourses = async () => {
// //     try {
// //       const res = await getAllCourses();
// //       setCoursesList(res);
// //     } catch (error) {
// //       console.error("Error fetching courses:", error);
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};

// //     if (!enrollData.name.trim()) newErrors.name = "Full name is required";
// //     if (!enrollData.email.trim()) {
// //       newErrors.email = "Email is required";
// //     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollData.email)) {
// //       newErrors.email = "Invalid email format";
// //     }
// //     if (!enrollData.phone.trim()) newErrors.phone = "Phone number is required";
// //     if (!enrollData.country.trim()) newErrors.country = "Country is required";
// //     if (!enrollData.dob) newErrors.dob = "Date of birth is required";
// //     if (!enrollData.gender) newErrors.gender = "Gender is required";
// //     if (!enrollData.courses) newErrors.courses = "Please select a course";
// //     if (!enrollData.agree) newErrors.agree = "You must agree to the rules";

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setEnrollData({
// //       ...enrollData,
// //       [name]: type === "checkbox" ? checked : value,
// //     });
// //     // Clear error for this field when user starts typing
// //     if (errors[name]) {
// //       setErrors({ ...errors, [name]: "" });
// //     }
// //   };

// //   const handleEnroll = async (e) => {
// //     e.preventDefault();

// //     if (!validateForm()) return;

// //     if (enrolledCourses.includes(enrollData.courses)) {
// //       setErrors({ courses: "You are already enrolled in this course" });
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       await enrollStudentInCourse(studentId, enrollData.courses);
      
// //       // Show success message
// //       alert("✅ Enrolled successfully!");
      
// //       // Reset form
// //       setEnrollData({
// //         name: parsedUser?.fullName || "",
// //         email: parsedUser?.email || "",
// //         phone: "",
// //         country: "",
// //         dob: "",
// //         gender: "",
// //         courses: "",
// //         message: "",
// //         agree: false,
// //       });
      
// //       // Refresh dashboard
// //       await fetchDashboard();
// //     } catch (err) {
// //       setErrors({
// //         submit: err.response?.data?.message || "Enrollment failed. Please try again.",
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   /* ================= UI ================= */
// //   if (loading) {
// //     return (
// //       <div style={{ display: "flex" }}>
// //         <StudentSidebar />
// //         <div style={loadingContainer}>
// //           <div style={spinner}></div>
// //           <p>Loading dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
// //       <StudentSidebar />

// //       <div style={mainContainer}>
// //         {/* 🔹 HEADER SECTION */}
// //         <div style={headerSection}>
// //           <div>
// //             <h1 style={welcomeText}>
// //               Welcome back, <span style={{ color: "#0284c7" }}>{studentName}</span> 👋
// //             </h1>
// //             <p style={subtitleText}>Here's your learning overview and progress</p>
// //           </div>
// //         </div>

// //         {/* 🔹 STATISTICS CARDS */}
// //         <div style={cardGrid}>
// //           <StatCard
// //             icon={<FaBook />}
// //             title="My Courses"
// //             value={myCourses}
// //             subtitle={`${myCourses} ${myCourses === 1 ? 'course' : 'courses'} enrolled`}
// //             gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
// //           />
// //           <StatCard
// //             icon={<FaClock />}
// //             title="Subscription Time"
// //             value={subscriptionTime}
// //             subtitle="Until your access expires"
// //             gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
// //           />
// //         </div>

// //         {/* 🔹 ENROLLMENT FORM */}
// //         <div style={formSection}>
// //           <div style={formHeader}>
// //             <h2 style={formTitle}>Enroll in a New Course</h2>
// //             <p style={formSubtitle}>Fill out the form below to enroll in your desired course</p>
// //           </div>

// //           <div style={formStyle} onSubmit={handleEnroll}>
// //             <div className="form-grid">
// //               <FormInput
// //                 label="Full Name"
// //                 name="name"
// //                 value={enrollData.name}
// //                 onChange={handleChange}
// //                 error={errors.name}
// //                 required
// //               />
// //               <FormInput
// //                 label="Email Address"
// //                 name="email"
// //                 type="email"
// //                 value={enrollData.email}
// //                 onChange={handleChange}
// //                 error={errors.email}
// //                 required
// //               />
// //             </div>

// //             <div style={formGrid}>
// //               <FormInput
// //                 label="Phone Number"
// //                 name="phone"
// //                 type="tel"
// //                 value={enrollData.phone}
// //                 onChange={handleChange}
// //                 error={errors.phone}
// //                 required
// //               />
// //               <FormInput
// //                 label="Country"
// //                 name="country"
// //                 value={enrollData.country}
// //                 onChange={handleChange}
// //                 error={errors.country}
// //                 required
// //               />
// //             </div>

// //             <div style={formGrid}>
// //               <FormInput
// //                 label="Date of Birth"
// //                 name="dob"
// //                 type="date"
// //                 value={enrollData.dob}
// //                 onChange={handleChange}
// //                 error={errors.dob}
// //                 required
// //               />
// //               <FormSelect
// //                 label="Gender"
// //                 name="gender"
// //                 value={enrollData.gender}
// //                 onChange={handleChange}
// //                 error={errors.gender}
// //                 options={["Male", "Female", "Other"]}
// //                 required
// //               />
// //             </div>

// //             <FormSelect
// //               label="Select Course"
// //               name="courses"
// //               value={enrollData.courses}
// //               onChange={handleChange}
// //               error={errors.courses}
// //               options={coursesList.map((c) => ({ value: c._id, label: c.title }))}
// //               required
// //             />

// //             <div style={fieldContainer}>
// //               <label style={labelStyle}>Message (Optional)</label>
// //               <textarea
// //                 name="message"
// //                 value={enrollData.message}
// //                 onChange={handleChange}
// //                 style={textareaStyle}
// //                 placeholder="Add any additional information or questions..."
// //                 rows={4}
// //               />
// //             </div>

// //             <div style={rulesContainer}>
// //               <FaExclamationCircle style={{ color: "#f59e0b", fontSize: 18 }} />
// //               <p style={rulesText}>
// //                 Lectures downloads, screenshots, recordings, and sharing are strictly prohibited.
// //               </p>
// //             </div>

// //             <label style={checkboxLabel}>
// //               <input
// //                 type="checkbox"
// //                 name="agree"
// //                 checked={enrollData.agree}
// //                 onChange={handleChange}
// //                 style={checkboxStyle}
// //               />
// //               <span>I agree to the terms and rules stated above</span>
// //             </label>
// //             {errors.agree && <ErrorMessage message={errors.agree} />}
// //             {errors.submit && <ErrorMessage message={errors.submit} />}

// //             <button type="button" onClick={handleEnroll} style={submitButton} disabled={isSubmitting}>
// //               {isSubmitting ? (
// //                 <>
// //                   <div style={buttonSpinner}></div>
// //                   Processing...
// //                 </>
// //               ) : (
// //                 <>
// //                   <FaCheckCircle /> Submit & Proceed to Payment
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // /* ================= REUSABLE COMPONENTS ================= */
// // const StatCard = ({ icon, title, value, subtitle, gradient }) => (
// //   <div style={{ ...statCard, background: gradient }}>
// //     <div style={statIconContainer}>{icon}</div>
// //     <div style={statContent}>
// //       <h3 style={statTitle}>{title}</h3>
// //       <p style={statValue}>{value}</p>
// //       <p style={statSubtitle}>{subtitle}</p>
// //     </div>
// //   </div>
// // );

// // const FormInput = ({ label, name, type = "text", value, onChange, error, required }) => (
// //   <div style={fieldContainer}>
// //     <label style={labelStyle}>
// //       {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
// //     </label>
// //     <input
// //       name={name}
// //       type={type}
// //       value={value}
// //       onChange={onChange}
// //       style={{ ...inputStyle, ...(error ? errorInputStyle : {}) }}
// //     />
// //     {error && <ErrorMessage message={error} />}
// //   </div>
// // );

// // const FormSelect = ({ label, name, value, onChange, error, options, required }) => (
// //   <div style={fieldContainer}>
// //     <label style={labelStyle}>
// //       {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
// //     </label>
// //     <select
// //       name={name}
// //       value={value}
// //       onChange={onChange}
// //       style={{ ...inputStyle, ...(error ? errorInputStyle : {}) }}
// //     >
// //       <option value="">Select {label}</option>
// //       {options.map((opt) =>
// //         typeof opt === "string" ? (
// //           <option key={opt} value={opt}>
// //             {opt}
// //           </option>
// //         ) : (
// //           <option key={opt.value} value={opt.value}>
// //             {opt.label}
// //           </option>
// //         )
// //       )}
// //     </select>
// //     {error && <ErrorMessage message={error} />}
// //   </div>
// // );

// // const ErrorMessage = ({ message }) => (
// //   <p style={errorText}>
// //     <FaExclamationCircle style={{ fontSize: 12 }} /> {message}
// //   </p>
// // );





// import React, { useEffect, useState } from "react";
// import StudentSidebar from "../components/StudentSidebar";
// import { FaBook, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
// import {
//   getStudentEnrollments,
//   getProgress,
//   getAllCourses,
//   enrollStudentInCourse,
// } from "../api/api";

// const StudentDashboard = () => {
//   /* ================= USER INFO ================= */
//   const userInfo = localStorage.getItem("userInfo");
//   const parsedUser = userInfo ? JSON.parse(userInfo) : null;

//   const studentId = parsedUser?._id || parsedUser?.id || null;
//   const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

//   /* ================= STATES ================= */
//   const [loading, setLoading] = useState(true);
//   const [myCourses, setMyCourses] = useState(0);
//   const [subscriptionTime, setSubscriptionTime] = useState("Loading...");
//   const [coursesList, setCoursesList] = useState([]);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [enrollData, setEnrollData] = useState({
//     name: parsedUser?.fullName || "",
//     email: parsedUser?.email || "",
//     phone: "",
//     country: "",
//     dob: "",
//     gender: "",
//     courses: "",
//     message: "",
//     agree: false,
//   });

//   /* ================= EFFECTS ================= */
//   useEffect(() => {
//     const initializeDashboard = async () => {
//       setLoading(true);
//       await Promise.all([fetchDashboard(), fetchCourses()]);
//       setLoading(false);
//     };
//     initializeDashboard();
//   }, []);

//   /* ================= FUNCTIONS ================= */
//   const fetchDashboard = async () => {
//     if (!studentId) return;

//     try {
//       const enrollments = await getStudentEnrollments(studentId);
//       console.log("enrollement", enrollments);

//       // ✅ Count total courses
//       setMyCourses(enrollments.length);

//       // ✅ Save enrolled courses safely (filter out null courses)
//       setEnrolledCourses(
//         enrollments
//           .filter((e) => e.course) // only include non-null courses
//           .map((e) => e.course._id)
//       );

//       // ✅ Calculate subscription time using first active course
//       const activeCourse = enrollments.find((e) => e.course && e.course.endDate);
//       if (activeCourse) {
//         const diff = new Date(activeCourse.course.endDate) - new Date();
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         setSubscriptionTime(days > 0 ? `${days} Days Remaining` : "Expired");
//       } else {
//         setSubscriptionTime("N/A");
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard:", error);
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const res = await getAllCourses();
//       setCoursesList(res);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!enrollData.name.trim()) newErrors.name = "Full name is required";
//     if (!enrollData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollData.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     if (!enrollData.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!enrollData.country.trim()) newErrors.country = "Country is required";
//     if (!enrollData.dob) newErrors.dob = "Date of birth is required";
//     if (!enrollData.gender) newErrors.gender = "Gender is required";
//     if (!enrollData.courses) newErrors.courses = "Please select a course";
//     if (!enrollData.agree) newErrors.agree = "You must agree to the rules";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEnrollData({
//       ...enrollData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleEnroll = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     if (enrolledCourses.includes(enrollData.courses)) {
//       setErrors({ courses: "You are already enrolled in this course" });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await enrollStudentInCourse(studentId, enrollData.courses);

//       alert("✅ Enrolled successfully!");

//       // Reset form
//       setEnrollData({
//         name: parsedUser?.fullName || "",
//         email: parsedUser?.email || "",
//         phone: "",
//         country: "",
//         dob: "",
//         gender: "",
//         courses: "",
//         message: "",
//         agree: false,
//       });

//       // Refresh dashboard
//       await fetchDashboard();
//     } catch (err) {
//       setErrors({
//         submit: err.response?.data?.message || "Enrollment failed. Please try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ================= UI ================= */
//   if (loading) {
//     return (
//       <div style={{ display: "flex" }}>
//         <StudentSidebar />
//         <div style={loadingContainer}>
//           <div style={spinner}></div>
//           <p>Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
//       <StudentSidebar />

//       <div style={mainContainer}>
//         {/* 🔹 HEADER SECTION */}
//         <div style={headerSection}>
//           <div>
//             <h1 style={welcomeText}>
//               Welcome back, <span style={{ color: "#0284c7" }}>{studentName}</span> 👋
//             </h1>
//             <p style={subtitleText}>Here's your learning overview and progress</p>
//           </div>
//         </div>

//         {/* 🔹 STATISTICS CARDS */}
//         <div style={cardGrid}>
//           <StatCard
//             icon={<FaBook />}
//             title="My Courses"
//             value={myCourses}
//             subtitle={`${myCourses} ${myCourses === 1 ? "course" : "courses"} enrolled`}
//             gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//           />
//           <StatCard
//             icon={<FaClock />}
//             title="Subscription Time"
//             value={subscriptionTime}
//             subtitle="Until your access expires"
//             gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
//           />
//         </div>

//         {/* 🔹 ENROLLMENT FORM */}
//         <div style={formSection}>
//           <div style={formHeader}>
//             <h2 style={formTitle}>Enroll in a New Course</h2>
//             <p style={formSubtitle}>Fill out the form below to enroll in your desired course</p>
//           </div>

//           {/* ✅ Added onSubmit to form element */}
//           <form style={formStyle} onSubmit={handleEnroll}>
//             <div className="form-grid"> {/* ⚡ Use CSS class instead of inline media query */}
//               <FormInput
//                 label="Full Name"
//                 name="name"
//                 value={enrollData.name}
//                 onChange={handleChange}
//                 error={errors.name}
//                 required
//               />
//               <FormInput
//                 label="Email Address"
//                 name="email"
//                 type="email"
//                 value={enrollData.email}
//                 onChange={handleChange}
//                 error={errors.email}
//                 required
//               />
//             </div>

//             <div className="form-grid">
//               <FormInput
//                 label="Phone Number"
//                 name="phone"
//                 type="tel"
//                 value={enrollData.phone}
//                 onChange={handleChange}
//                 error={errors.phone}
//                 required
//               />
//               <FormInput
//                 label="Country"
//                 name="country"
//                 value={enrollData.country}
//                 onChange={handleChange}
//                 error={errors.country}
//                 required
//               />
//             </div>

//             <div className="form-grid">
//               <FormInput
//                 label="Date of Birth"
//                 name="dob"
//                 type="date"
//                 value={enrollData.dob}
//                 onChange={handleChange}
//                 error={errors.dob}
//                 required
//               />
//               <FormSelect
//                 label="Gender"
//                 name="gender"
//                 value={enrollData.gender}
//                 onChange={handleChange}
//                 error={errors.gender}
//                 options={["Male", "Female", "Other"]}
//                 required
//               />
//             </div>

//             <FormSelect
//               label="Select Course"
//               name="courses"
//               value={enrollData.courses}
//               onChange={handleChange}
//               error={errors.courses}
//               options={coursesList.map((c) => ({ value: c._id, label: c.title }))}
//               required
//             />

//             <div style={fieldContainer}>
//               <label style={labelStyle}>Message (Optional)</label>
//               <textarea
//                 name="message"
//                 value={enrollData.message}
//                 onChange={handleChange}
//                 style={textareaStyle}
//                 placeholder="Add any additional information or questions..."
//                 rows={4}
//               />
//             </div>

//             <div style={rulesContainer}>
//               <FaExclamationCircle style={{ color: "#f59e0b", fontSize: 18 }} />
//               <p style={rulesText}>
//                 Lectures downloads, screenshots, recordings, and sharing are strictly prohibited.
//               </p>
//             </div>

//             <label style={checkboxLabel}>
//               <input
//                 type="checkbox"
//                 name="agree"
//                 checked={enrollData.agree}
//                 onChange={handleChange}
//                 style={checkboxStyle}
//               />
//               <span>I agree to the terms and rules stated above</span>
//             </label>
//             {errors.agree && <ErrorMessage message={errors.agree} />}
//             {errors.submit && <ErrorMessage message={errors.submit} />}

//             <button type="submit" style={submitButton} disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <>
//                   <div style={buttonSpinner}></div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <FaCheckCircle /> Submit & Proceed to Payment
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ================= REUSABLE COMPONENTS ================= */
// const StatCard = ({ icon, title, value, subtitle, gradient }) => (
//   <div style={{ ...statCard, background: gradient }}>
//     <div style={statIconContainer}>{icon}</div>
//     <div style={statContent}>
//       <h3 style={statTitle}>{title}</h3>
//       <p style={statValue}>{value}</p>
//       <p style={statSubtitle}>{subtitle}</p>
//     </div>
//   </div>
// );

// const FormInput = ({ label, name, type = "text", value, onChange, error, required }) => (
//   <div style={fieldContainer}>
//     <label style={labelStyle}>
//       {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
//     </label>
//     <input
//       name={name}
//       type={type}
//       value={value}
//       onChange={onChange}
//       style={{ ...inputStyle, ...(error ? errorInputStyle : {}) }}
//     />
//     {error && <ErrorMessage message={error} />}
//   </div>
// );

// const FormSelect = ({ label, name, value, onChange, error, options, required }) => (
//   <div style={fieldContainer}>
//     <label style={labelStyle}>
//       {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       style={{ ...inputStyle, ...(error ? errorInputStyle : {}) }}
//     >
//       <option value="">Select {label}</option>
//       {options.map((opt) =>
//         typeof opt === "string" ? (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ) : (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         )
//       )}
//     </select>
//     {error && <ErrorMessage message={error} />}
//   </div>
// );

// const ErrorMessage = ({ message }) => (
//   <p style={errorText}>
//     <FaExclamationCircle style={{ fontSize: 12 }} /> {message}
//   </p>
// );

// /* ================= STYLES ================= */
// const loadingContainer = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   marginLeft: 250,
// };

// const spinner = {
//   width: 50,
//   height: 50,
//   border: "4px solid #e5e7eb",
//   borderTop: "4px solid #0284c7",
//   borderRadius: "50%",
//   animation: "spin 1s linear infinite",
// };

// const mainContainer = {
//   flex: 1,
//   marginLeft: 250,
//   padding: "32px 40px",
//   maxWidth: 1400,
// };

// const headerSection = {
//   marginBottom: 32,
// };

// const welcomeText = {
//   fontSize: 32,
//   fontWeight: 700,
//   color: "#0f172a",
//   marginBottom: 8,
// };

// const subtitleText = {
//   fontSize: 16,
//   color: "#64748b",
// };

// const cardGrid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//   gap: 24,
//   marginBottom: 48,
// };

// const statCard = {
//   color: "#fff",
//   padding: 28,
//   borderRadius: 16,
//   boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//   display: "flex",
//   alignItems: "center",
//   gap: 20,
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   cursor: "pointer",
// };

// const statIconContainer = {
//   fontSize: 36,
//   opacity: 0.9,
// };

// const statContent = {
//   flex: 1,
// };

// const statTitle = {
//   fontSize: 14,
//   fontWeight: 500,
//   opacity: 0.9,
//   marginBottom: 8,
//   textTransform: "uppercase",
//   letterSpacing: 0.5,
// };

// const statValue = {
//   fontSize: 28,
//   fontWeight: 700,
//   marginBottom: 4,
// };

// const statSubtitle = {
//   fontSize: 13,
//   opacity: 0.8,
// };

// const formSection = {
//   maxWidth: 800,
//   margin: "0 auto",
//   background: "#fff",
//   padding: 40,
//   borderRadius: 20,
//   boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
// };

// const formHeader = {
//   marginBottom: 32,
//   textAlign: "center",
// };

// const formTitle = {
//   fontSize: 28,
//   fontWeight: 700,
//   color: "#0f172a",
//   marginBottom: 8,
// };

// const formSubtitle = {
//   fontSize: 15,
//   color: "#64748b",
// };

// const formStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 24,
// };

// const formGrid = {
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr",
//   gap: 20,
//   "@media (max-width: 768px)": {
//     gridTemplateColumns: "1fr",
//   }
// };

// const fieldContainer = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 8,
// };

// const labelStyle = {
//   fontSize: 14,
//   fontWeight: 600,
//   color: "#334155",
// };

// const inputStyle = {
//   width: "90%",
//   padding: "12px 16px",
//   borderRadius: 10,
//   border: "2px solid #e2e8f0",
//   fontSize: 14,
//   transition: "border-color 0.3s ease",
//   outline: "none",
//   fontFamily: "inherit",
// };

// const errorInputStyle = {
//   borderColor: "#ef4444",
// };

// const textareaStyle = {
//   ...inputStyle,
//   resize: "vertical",
//   fontFamily: "inherit",
// };

// const rulesContainer = {
//   display: "flex",
//   alignItems: "flex-start",
//   gap: 12,
//   padding: 16,
//   backgroundColor: "#fef3c7",
//   borderRadius: 10,
//   border: "1px solid #fde68a",
// };

// const rulesText = {
//   fontSize: 13,
//   color: "#92400e",
//   margin: 0,
//   lineHeight: 1.6,
// };

// const checkboxLabel = {
//   display: "flex",
//   alignItems: "center",
//   gap: 10,
//   fontSize: 14,
//   color: "#475569",
//   cursor: "pointer",
// };

// const checkboxStyle = {
//   width: 18,
//   height: 18,
//   cursor: "pointer",
// };

// const errorText = {
//   fontSize: 13,
//   color: "#ef4444",
//   display: "flex",
//   alignItems: "center",
//   gap: 6,
//   marginTop: 4,
// };

// const submitButton = {
//   background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
//   color: "#fff",
//   padding: "14px 32px",
//   borderRadius: 10,
//   border: "none",
//   cursor: "pointer",
//   fontSize: 16,
//   fontWeight: 600,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 10,
//   transition: "transform 0.2s ease, box-shadow 0.2s ease",
//   boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
// };

// const buttonSpinner = {
//   width: 16,
//   height: 16,
//   border: "2px solid rgba(255,255,255,0.3)",
//   borderTop: "2px solid #fff",
//   borderRadius: "50%",
//   animation: "spin 0.8s linear infinite",
// };

// // Add keyframe animation
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }
  
//   button:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
//   }
  
//   button:disabled {
//     opacity: 0.7;
//     cursor: not-allowed;
//   }
  
//   input:focus, select:focus, textarea:focus {
//     border-color: #0284c7;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default StudentDashboard;
















// // import React, { useEffect, useState } from "react";
// // import StudentSidebar from "../components/StudentSidebar";
// // import { 
// //   FaBook, 
// //   FaClock, 
// //   FaCheckCircle, 
// //   FaExclamationCircle, 
// //   FaUser,
// //   FaEnvelope,
// //   FaPhone,
// //   FaGlobe,
// //   FaCalendar,
// //   FaVenusMars,
// //   FaGraduationCap,
// //   FaChevronRight,
// //   FaSpinner,
// //   FaSearch,
// //   FaPlus,
// //   FaLock,
// //   FaUnlock,
// //   FaUsers,
// //   FaRupeeSign,
// //   FaChartLine,
// //   FaMoneyBillWave,
// //   FaArrowRight,
// //   FaSort,
// //   FaFilter,
// //   FaTags,
// //   FaEdit,
// //   FaTrash,
// //   FaVideo
// // } from "react-icons/fa";
// // import {
// //   getStudentEnrollments,
// //   getAllCourses,
// //   enrollStudentInCourse,
// // } from "../api/api";

// // // Exact Color Theme from Courses Page
// // const COLORS = {
// //   sidebarDark: "#1a1d2e",
// //   deepPurple: "#3D1A5B",
// //   headerPurple: "#4B2D7A",
// //   brightGreen: "#00D9A3",
// //   goldBadge: "#D4A745",
// //   roleBg: "#E8DFF5",
// //   white: "#FFFFFF",
// //   bgGray: "#F9FAFB",
// //   lightGray: "#F3F4F6",
// //   darkGray: "#6B7280",
// //   textGray: "#4B5563",
// //   danger: "#EF4444",
// //   warning: "#F59E0B",
// //   info: "#3B82F6",
// //   orange: "#F97316",
// //   primaryButton: "#3D1A5B",
// //   formButton: "#3B82F6",
// //   cancelButton: "#6B7280",
// //   blueLight: "#dbeafe",
// //   greenLight: "#d1fae5",
// //   yellowLight: "#fef3c7",
// //   purpleLight: "#ede9fe",
// //   teal: "#0d9488",
// //   indigo: "#4f46e5",
// //   rose: "#f43f5e"
// // };

// // const StudentDashboard = () => {
// //   /* ================= USER INFO ================= */
// //   const userInfo = localStorage.getItem("userInfo");
// //   const parsedUser = userInfo ? JSON.parse(userInfo) : null;

// //   const studentId = parsedUser?._id || parsedUser?.id || null;
// //   const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

// //   /* ================= STATES ================= */
// //   const [loading, setLoading] = useState(true);
// //   const [myCourses, setMyCourses] = useState(0);
// //   const [subscriptionTime, setSubscriptionTime] = useState("Loading...");
// //   const [coursesList, setCoursesList] = useState([]);
// //   const [enrolledCourses, setEnrolledCourses] = useState([]);
// //   const [enrollmentsData, setEnrollmentsData] = useState([]);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [errors, setErrors] = useState({});
// //   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [stats, setStats] = useState({
// //     totalCourses: 0,
// //     totalHours: 0,
// //     activeCourses: 0,
// //     completionRate: 0
// //   });

// //   const [enrollData, setEnrollData] = useState({
// //     name: parsedUser?.fullName || "",
// //     email: parsedUser?.email || "",
// //     phone: "",
// //     country: "",
// //     dob: "",
// //     gender: "",
// //     courses: "",
// //     message: "",
// //     agree: false,
// //   });

// //   /* ================= EFFECTS ================= */
// //   useEffect(() => {
// //     const handleResize = () => {
// //       setIsMobile(window.innerWidth <= 768);
// //     };
// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   useEffect(() => {
// //     const initializeDashboard = async () => {
// //       setLoading(true);
// //       await Promise.all([fetchDashboard(), fetchCourses()]);
// //       setLoading(false);
// //     };
// //     initializeDashboard();
// //   }, []);

// //   /* ================= FUNCTIONS ================= */
// //   const fetchDashboard = async () => {
// //     if (!studentId) return;

// //     try {
// //       const enrollments = await getStudentEnrollments(studentId);
// //       setEnrollmentsData(enrollments);

// //       // Count total courses
// //       const courseCount = enrollments.length;
// //       setMyCourses(courseCount);

// //       // Save enrolled courses safely
// //       setEnrolledCourses(
// //         enrollments
// //           .filter((e) => e.course)
// //           .map((e) => e.course._id)
// //       );

// //       // Calculate subscription time
// //       const activeCourse = enrollments.find((e) => e.course && e.course.endDate);
// //       if (activeCourse) {
// //         const diff = new Date(activeCourse.course.endDate) - new Date();
// //         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// //         setSubscriptionTime(days > 0 ? `${days} Days Remaining` : "Expired");
// //       } else {
// //         setSubscriptionTime("No Active Subscription");
// //       }

// //       // Calculate statistics
// //       calculateStatistics(enrollments);
      
// //     } catch (error) {
// //       console.error("Error fetching dashboard:", error);
// //     }
// //   };

// //   const calculateStatistics = (enrollments) => {
// //     const totalCourses = enrollments.length;
// //     let totalHours = 0;
// //     let activeCourses = 0;
// //     let completedCourses = 0;

// //     enrollments.forEach(enrollment => {
// //       if (enrollment.course) {
// //         totalHours += enrollment.course.duration || 0;
// //         if (enrollment.status === "active") activeCourses++;
// //         if (enrollment.status === "completed") completedCourses++;
// //       }
// //     });

// //     const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

// //     setStats({
// //       totalCourses,
// //       totalHours,
// //       activeCourses,
// //       completionRate
// //     });
// //   };

// //   const fetchCourses = async () => {
// //     try {
// //       const res = await getAllCourses();
// //       setCoursesList(res);
// //     } catch (error) {
// //       console.error("Error fetching courses:", error);
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};

// //     if (!enrollData.name.trim()) newErrors.name = "Full name is required";
// //     if (!enrollData.email.trim()) {
// //       newErrors.email = "Email is required";
// //     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollData.email)) {
// //       newErrors.email = "Invalid email format";
// //     }
// //     if (!enrollData.phone.trim()) newErrors.phone = "Phone number is required";
// //     if (!enrollData.country.trim()) newErrors.country = "Country is required";
// //     if (!enrollData.dob) newErrors.dob = "Date of birth is required";
// //     if (!enrollData.gender) newErrors.gender = "Gender is required";
// //     if (!enrollData.courses) newErrors.courses = "Please select a course";
// //     if (!enrollData.agree) newErrors.agree = "You must agree to the rules";

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setEnrollData({
// //       ...enrollData,
// //       [name]: type === "checkbox" ? checked : value,
// //     });
// //     if (errors[name]) {
// //       setErrors({ ...errors, [name]: "" });
// //     }
// //   };

// //   const handleEnroll = async (e) => {
// //     e.preventDefault();

// //     if (!validateForm()) return;

// //     if (enrolledCourses.includes(enrollData.courses)) {
// //       setErrors({ courses: "You are already enrolled in this course" });
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       await enrollStudentInCourse(studentId, enrollData.courses);

// //       // Show success message
// //       setErrors({ 
// //         submit: {
// //           type: "success",
// //           message: "✅ Enrolled successfully! You can now access the course."
// //         }
// //       });

// //       // Reset form
// //       setEnrollData({
// //         name: parsedUser?.fullName || "",
// //         email: parsedUser?.email || "",
// //         phone: "",
// //         country: "",
// //         dob: "",
// //         gender: "",
// //         courses: "",
// //         message: "",
// //         agree: false,
// //       });

// //       // Refresh dashboard after 2 seconds
// //       setTimeout(async () => {
// //         await fetchDashboard();
// //         setErrors({});
// //       }, 2000);

// //     } catch (err) {
// //       setErrors({
// //         submit: {
// //           type: "error",
// //           message: err.response?.data?.message || "Enrollment failed. Please try again."
// //         }
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Filter courses for display
// //   const filteredCourses = coursesList.filter(
// //     (course) =>
// //       course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       course.category?.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   /* ================= LOADING STATE ================= */
// //   if (loading) {
// //     return (
// //       <div style={{ display: "flex", backgroundColor: COLORS.bgGray, minHeight: "100vh" }}>
// //         <StudentSidebar />
// //         <div style={{
// //           flex: 1,
// //           marginLeft: isMobile ? "0" : "250px",
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           padding: "32px",
// //         }}>
// //           <div style={{
// //             width: "60px",
// //             height: "60px",
// //             borderRadius: "12px",
// //             border: `4px solid ${COLORS.lightGray}`,
// //             borderTop: `4px solid ${COLORS.deepPurple}`,
// //             animation: "spin 1s linear infinite",
// //             marginBottom: "24px"
// //           }}></div>
// //           <h3 style={{ 
// //             color: COLORS.deepPurple, 
// //             marginBottom: "8px",
// //             fontSize: isMobile ? "20px" : "24px",
// //             fontWeight: "600"
// //           }}>
// //             Loading Your Dashboard
// //           </h3>
// //           <p style={{ color: COLORS.darkGray, fontSize: "14px" }}>
// //             Preparing your learning experience...
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={{ display: "flex", backgroundColor: COLORS.bgGray, minHeight: "100vh" }}>
// //       <StudentSidebar />

// //       <div style={{
// //         flex: 1,
// //         overflowX: "hidden",
// //         marginLeft: isMobile ? "0" : "250px",
// //         paddingTop: isMobile ? "80px" : "32px",
// //         padding: isMobile ? "80px 16px 32px 16px" : "32px",
// //       }}>
// //         {/* Header Section - Similar to Courses */}
// //         <div style={{ marginBottom: "32px" }}>
// //           <div style={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "flex-start",
// //             marginBottom: "24px",
// //             flexWrap: "wrap",
// //             gap: "16px",
// //           }}>
// //             <div>
// //               <h1 style={{
// //                 fontSize: isMobile ? "24px" : "28px",
// //                 fontWeight: "700",
// //                 color: COLORS.deepPurple,
// //                 margin: 0,
// //                 marginBottom: "8px",
// //               }}>
// //                 🎓 Student Dashboard
// //               </h1>
// //               <p style={{ 
// //                 color: COLORS.textGray, 
// //                 margin: 0, 
// //                 fontSize: isMobile ? "13px" : "14px" 
// //               }}>
// //                 Welcome back, {studentName}! Track your progress and enroll in new courses
// //               </p>
// //             </div>
            
// //             {/* Stats Card - Similar to Courses */}
// //             <div style={{
// //               background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
// //               border: "1px solid rgba(61, 26, 91, 0.2)",
// //               borderRadius: "12px",
// //               padding: "16px 24px",
// //               display: "flex",
// //               alignItems: "center",
// //               gap: "12px"
// //             }}>
// //               <div style={{
// //                 width: "44px",
// //                 height: "44px",
// //                 borderRadius: "10px",
// //                 background: COLORS.blueLight,
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 fontSize: "20px",
// //                 color: COLORS.info
// //               }}>
// //                 <FaGraduationCap />
// //               </div>
// //               <div>
// //                 <p style={{
// //                   color: COLORS.deepPurple,
// //                   fontSize: "14px",
// //                   fontWeight: "600",
// //                   margin: 0,
// //                   marginBottom: "2px"
// //                 }}>
// //                   Enrolled Courses
// //                 </p>
// //                 <p style={{
// //                   color: COLORS.deepPurple,
// //                   fontSize: "24px",
// //                   fontWeight: "700",
// //                   margin: 0
// //                 }}>
// //                   {stats.totalCourses}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Statistics Cards Grid - Similar to Courses */}
// //           <div style={{
// //             display: "grid",
// //             gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
// //             gap: isMobile ? "16px" : "24px",
// //             marginBottom: isMobile ? "24px" : "32px"
// //           }}>
// //             {/* My Courses Card */}
// //             <div style={{
// //               background: "linear-gradient(135deg, #3D1A5B 0%, #4B2D7A 100%)",
// //               color: COLORS.white,
// //               padding: isMobile ? "20px" : "24px",
// //               borderRadius: "16px",
// //               boxShadow: "0 10px 30px rgba(61, 26, 91, 0.15)",
// //               display: "flex",
// //               alignItems: "center",
// //               gap: isMobile ? "16px" : "20px",
// //               transition: "transform 0.3s ease, box-shadow 0.3s ease",
// //               cursor: "pointer",
// //               minHeight: "140px"
// //             }}>
// //               <div style={{
// //                 width: isMobile ? "56px" : "64px",
// //                 height: isMobile ? "56px" : "64px",
// //                 borderRadius: "12px",
// //                 background: "rgba(255, 255, 255, 0.2)",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 fontSize: isMobile ? "24px" : "28px",
// //                 backdropFilter: "blur(10px)"
// //               }}>
// //                 <FaBook />
// //               </div>
// //               <div style={{ flex: 1 }}>
// //                 <h3 style={{
// //                   fontSize: "14px",
// //                   fontWeight: "600",
// //                   opacity: 0.9,
// //                   marginBottom: "8px",
// //                   textTransform: "uppercase",
// //                   letterSpacing: "0.5px"
// //                 }}>
// //                   My Courses
// //                 </h3>
// //                 <p style={{
// //                   fontSize: isMobile ? "24px" : "28px",
// //                   fontWeight: "700",
// //                   marginBottom: "4px"
// //                 }}>
// //                   {stats.totalCourses}
// //                 </p>
// //                 <p style={{
// //                   fontSize: "13px",
// //                   opacity: 0.8
// //                 }}>
// //                   {stats.activeCourses} active • {stats.completionRate}% completion
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Subscription Time Card */}
// //             <div style={{
// //               background: "linear-gradient(135deg, #00D9A3 0%, #0d9488 100%)",
// //               color: COLORS.white,
// //               padding: isMobile ? "20px" : "24px",
// //               borderRadius: "16px",
// //               boxShadow: "0 10px 30px rgba(0, 217, 163, 0.15)",
// //               display: "flex",
// //               alignItems: "center",
// //               gap: isMobile ? "16px" : "20px",
// //               transition: "transform 0.3s ease, box-shadow 0.3s ease",
// //               cursor: "pointer",
// //               minHeight: "140px"
// //             }}>
// //               <div style={{
// //                 width: isMobile ? "56px" : "64px",
// //                 height: isMobile ? "56px" : "64px",
// //                 borderRadius: "12px",
// //                 background: "rgba(255, 255, 255, 0.2)",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 fontSize: isMobile ? "24px" : "28px",
// //                 backdropFilter: "blur(10px)"
// //               }}>
// //                 <FaClock />
// //               </div>
// //               <div style={{ flex: 1 }}>
// //                 <h3 style={{
// //                   fontSize: "14px",
// //                   fontWeight: "600",
// //                   opacity: 0.9,
// //                   marginBottom: "8px",
// //                   textTransform: "uppercase",
// //                   letterSpacing: "0.5px"
// //                 }}>
// //                   Subscription Time
// //                 </h3>
// //                 <p style={{
// //                   fontSize: isMobile ? "24px" : "28px",
// //                   fontWeight: "700",
// //                   marginBottom: "4px",
// //                   whiteSpace: "nowrap",
// //                   overflow: "hidden",
// //                   textOverflow: "ellipsis"
// //                 }}>
// //                   {subscriptionTime}
// //                 </p>
// //                 <p style={{
// //                   fontSize: "13px",
// //                   opacity: 0.8
// //                 }}>
// //                   Until your access expires
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Learning Hours Card */}
// //             <div style={{
// //               background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
// //               color: COLORS.white,
// //               padding: isMobile ? "20px" : "24px",
// //               borderRadius: "16px",
// //               boxShadow: "0 10px 30px rgba(245, 158, 11, 0.15)",
// //               display: "flex",
// //               alignItems: "center",
// //               gap: isMobile ? "16px" : "20px",
// //               transition: "transform 0.3s ease, box-shadow 0.3s ease",
// //               cursor: "pointer",
// //               minHeight: "140px"
// //             }}>
// //               <div style={{
// //                 width: isMobile ? "56px" : "64px",
// //                 height: isMobile ? "56px" : "64px",
// //                 borderRadius: "12px",
// //                 background: "rgba(255, 255, 255, 0.2)",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 fontSize: isMobile ? "24px" : "28px",
// //                 backdropFilter: "blur(10px)"
// //               }}>
// //                 <FaChartLine />
// //               </div>
// //               <div style={{ flex: 1 }}>
// //                 <h3 style={{
// //                   fontSize: "14px",
// //                   fontWeight: "600",
// //                   opacity: 0.9,
// //                   marginBottom: "8px",
// //                   textTransform: "uppercase",
// //                   letterSpacing: "0.5px"
// //                 }}>
// //                   Learning Hours
// //                 </h3>
// //                 <p style={{
// //                   fontSize: isMobile ? "24px" : "28px",
// //                   fontWeight: "700",
// //                   marginBottom: "4px"
// //                 }}>
// //                   {stats.totalHours}h
// //                 </p>
// //                 <p style={{
// //                   fontSize: "13px",
// //                   opacity: 0.8
// //                 }}>
// //                   Total learning time across all courses
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Available Courses Section - Similar to Courses Table */}
// //           <div style={{
// //             background: COLORS.white,
// //             borderRadius: "12px",
// //             padding: isMobile ? "20px 16px" : "24px",
// //             marginBottom: "32px",
// //             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
// //             border: `1px solid ${COLORS.lightGray}`
// //           }}>
// //             <div style={{ 
// //               display: "flex", 
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               marginBottom: isMobile ? "20px" : "24px",
// //               flexWrap: "wrap",
// //               gap: "16px"
// //             }}>
// //               <div>
// //                 <h2 style={{
// //                   fontSize: isMobile ? "20px" : "24px",
// //                   fontWeight: "700",
// //                   color: COLORS.deepPurple,
// //                   margin: 0,
// //                   marginBottom: "4px",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: "12px"
// //                 }}>
// //                   <FaGraduationCap />
// //                   Available Courses
// //                 </h2>
// //                 <p style={{ 
// //                   color: COLORS.textGray, 
// //                   margin: 0, 
// //                   fontSize: isMobile ? "13px" : "14px" 
// //                 }}>
// //                   Browse and enroll in new courses to expand your skills
// //                 </p>
// //               </div>
              
// //               {/* Search Bar - Similar to Courses */}
// //               <div style={{
// //                 position: "relative",
// //                 width: isMobile ? "100%" : "300px"
// //               }}>
// //                 <FaSearch style={{
// //                   position: "absolute",
// //                   left: "16px",
// //                   top: "50%",
// //                   transform: "translateY(-50%)",
// //                   color: COLORS.darkGray,
// //                   fontSize: "16px"
// //                 }} />
// //                 <input
// //                   type="text"
// //                   placeholder="Search courses..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   style={{ 
// //                     padding: isMobile ? "12px 16px 12px 44px" : "12px 16px 12px 44px", 
// //                     borderRadius: "8px", 
// //                     border: `1px solid ${COLORS.lightGray}`,
// //                     width: "100%",
// //                     fontSize: "14px",
// //                     background: COLORS.bgGray,
// //                     boxSizing: "border-box",
// //                     outline: "none"
// //                   }}
// //                 />
// //               </div>
// //             </div>

// //             {/* Courses Grid */}
// //             <div style={{
// //               display: "grid",
// //               gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))",
// //               gap: isMobile ? "16px" : "20px"
// //             }}>
// //               {filteredCourses.slice(0, 6).map((course) => {
// //                 const isEnrolled = enrolledCourses.includes(course._id);
                
// //                 return (
// //                   <div key={course._id} style={{
// //                     background: COLORS.white,
// //                     borderRadius: "12px",
// //                     border: `1px solid ${COLORS.lightGray}`,
// //                     padding: "20px",
// //                     transition: "all 0.3s ease",
// //                     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
// //                     position: "relative",
// //                     overflow: "hidden"
// //                   }}>
// //                     <div style={{
// //                       display: "flex",
// //                       justifyContent: "space-between",
// //                       alignItems: "flex-start",
// //                       marginBottom: "16px"
// //                     }}>
// //                       <div style={{ flex: 1 }}>
// //                         <h3 style={{
// //                           fontWeight: "600",
// //                           color: COLORS.deepPurple,
// //                           margin: 0,
// //                           fontSize: "17px",
// //                           marginBottom: "8px"
// //                         }}>
// //                           {course.title}
// //                         </h3>
// //                         <div style={{
// //                           display: "flex",
// //                           alignItems: "center",
// //                           gap: "8px",
// //                           marginBottom: "8px",
// //                           flexWrap: "wrap"
// //                         }}>
// //                           <span style={{
// //                             background: COLORS.roleBg,
// //                             color: COLORS.deepPurple,
// //                             padding: "4px 12px",
// //                             borderRadius: "6px",
// //                             fontSize: "12px",
// //                             fontWeight: "600"
// //                           }}>
// //                             {course.category}
// //                           </span>
// //                           <span style={{
// //                             background: course.level === "Beginner" ? COLORS.greenLight : 
// //                                       course.level === "Intermediate" ? COLORS.blueLight : COLORS.purpleLight,
// //                             color: course.level === "Beginner" ? "#065f46" : 
// //                                    course.level === "Intermediate" ? "#1e40af" : "#5b21b6",
// //                             padding: "4px 10px",
// //                             borderRadius: "6px",
// //                             fontSize: "11px",
// //                             fontWeight: "600"
// //                           }}>
// //                             {course.level}
// //                           </span>
// //                         </div>
// //                       </div>
                      
// //                       <div style={{
// //                         background: course.price > 0 ? COLORS.yellowLight : COLORS.greenLight,
// //                         color: course.price > 0 ? "#92400e" : "#065f46",
// //                         padding: "8px 12px",
// //                         borderRadius: "8px",
// //                         fontSize: "14px",
// //                         fontWeight: "700",
// //                         display: "flex",
// //                         alignItems: "center",
// //                         gap: "6px"
// //                       }}>
// //                         {course.price > 0 ? <FaLock size={12} /> : <FaUnlock size={12} />}
// //                         ₹{course.price}
// //                       </div>
// //                     </div>

// //                     <p style={{
// //                       color: COLORS.textGray,
// //                       fontSize: "14px",
// //                       marginBottom: "16px",
// //                       lineHeight: 1.5
// //                     }}>
// //                       {course.description?.substring(0, 100)}...
// //                     </p>

// //                     <div style={{
// //                       display: "flex",
// //                       justifyContent: "space-between",
// //                       alignItems: "center",
// //                       marginTop: "20px",
// //                       paddingTop: "16px",
// //                       borderTop: `1px solid ${COLORS.lightGray}`
// //                     }}>
// //                       <div style={{
// //                         display: "flex",
// //                         alignItems: "center",
// //                         gap: "8px",
// //                         fontSize: "13px",
// //                         color: COLORS.darkGray
// //                       }}>
// //                         <FaClock size={12} />
// //                         {course.duration}h • {course.status}
// //                       </div>

// //                       <button
// //                         onClick={() => {
// //                           if (isEnrolled) {
// //                             alert("You are already enrolled in this course!");
// //                           } else {
// //                             setEnrollData(prev => ({ ...prev, courses: course._id }));
// //                             document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
// //                           }
// //                         }}
// //                         disabled={isEnrolled}
// //                         style={{
// //                           background: isEnrolled ? COLORS.success : COLORS.primaryButton,
// //                           color: COLORS.white,
// //                           border: "none",
// //                           padding: "8px 16px",
// //                           borderRadius: "6px",
// //                           cursor: isEnrolled ? "default" : "pointer",
// //                           fontSize: "13px",
// //                           fontWeight: "600",
// //                           display: "flex",
// //                           alignItems: "center",
// //                           gap: "6px",
// //                           transition: "all 0.2s ease",
// //                           opacity: isEnrolled ? 0.7 : 1
// //                         }}
// //                         onMouseEnter={(e) => {
// //                           if (!isEnrolled) {
// //                             e.currentTarget.style.background = COLORS.headerPurple;
// //                             e.currentTarget.style.transform = "translateY(-2px)";
// //                           }
// //                         }}
// //                         onMouseLeave={(e) => {
// //                           if (!isEnrolled) {
// //                             e.currentTarget.style.background = COLORS.primaryButton;
// //                             e.currentTarget.style.transform = "translateY(0)";
// //                           }
// //                         }}
// //                       >
// //                         {isEnrolled ? (
// //                           <>
// //                             <FaCheckCircle /> Enrolled
// //                           </>
// //                         ) : (
// //                           <>
// //                             <FaPlus /> Enroll Now
// //                           </>
// //                         )}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             {filteredCourses.length === 0 && (
// //               <div style={{ 
// //                 padding: "40px", 
// //                 textAlign: "center", 
// //                 color: COLORS.darkGray,
// //                 fontSize: "14px"
// //               }}>
// //                 <FaGraduationCap style={{ fontSize: "48px", color: COLORS.lightGray, marginBottom: "16px" }} />
// //                 <p style={{ margin: 0 }}>No courses available at the moment</p>
// //               </div>
// //             )}
// //           </div>

// //           {/* Enrollment Form Section */}
// //           <div id="enrollment-form" style={{
// //             background: COLORS.white,
// //             borderRadius: "12px",
// //             padding: isMobile ? "24px 20px" : "32px",
// //             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
// //             border: `1px solid ${COLORS.lightGray}`
// //           }}>
// //             <div style={{ 
// //               marginBottom: isMobile ? "24px" : "32px",
// //               textAlign: "center"
// //             }}>
// //               <h2 style={{
// //                 fontSize: isMobile ? "22px" : "26px",
// //                 fontWeight: "700",
// //                 color: COLORS.deepPurple,
// //                 margin: 0,
// //                 marginBottom: "8px",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 gap: "12px"
// //               }}>
// //                 <FaGraduationCap color={COLORS.deepPurple} />
// //                 Enroll in a Course
// //               </h2>
// //               <p style={{
// //                 fontSize: isMobile ? "14px" : "15px",
// //                 color: COLORS.textGray,
// //                 maxWidth: "600px",
// //                 margin: "0 auto"
// //               }}>
// //                 Fill out the form below to enroll in your selected course
// //               </p>
// //             </div>

// //             <form onSubmit={handleEnroll} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
// //               {/* Form Grid */}
// //               <div style={{
// //                 display: "grid",
// //                 gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
// //                 gap: isMobile ? "20px" : "24px"
// //               }}>
// //                 {/* Name Field */}
// //                 <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                   <label style={{
// //                     fontSize: "14px",
// //                     fontWeight: "600",
// //                     color: COLORS.textGray,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "8px"
// //                   }}>
// //                     <FaUser size={14} />
// //                     Full Name *
// //                   </label>
// //                   <input
// //                     name="name"
// //                     type="text"
// //                     value={enrollData.name}
// //                     onChange={handleChange}
// //                     style={{
// //                       width: "100%",
// //                       padding: "12px 16px",
// //                       borderRadius: "8px",
// //                       border: `2px solid ${errors.name ? COLORS.danger : COLORS.lightGray}`,
// //                       fontSize: "14px",
// //                       transition: "all 0.3s ease",
// //                       outline: "none",
// //                       fontFamily: "inherit",
// //                       boxSizing: "border-box"
// //                     }}
// //                     placeholder="Enter your full name"
// //                   />
// //                   {errors.name && (
// //                     <p style={{
// //                       fontSize: "13px",
// //                       color: COLORS.danger,
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "6px",
// //                       marginTop: "4px"
// //                     }}>
// //                       <FaExclamationCircle size={12} /> {errors.name}
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* Email Field */}
// //                 <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                   <label style={{
// //                     fontSize: "14px",
// //                     fontWeight: "600",
// //                     color: COLORS.textGray,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "8px"
// //                   }}>
// //                     <FaEnvelope size={14} />
// //                     Email Address *
// //                   </label>
// //                   <input
// //                     name="email"
// //                     type="email"
// //                     value={enrollData.email}
// //                     onChange={handleChange}
// //                     style={{
// //                       width: "100%",
// //                       padding: "12px 16px",
// //                       borderRadius: "8px",
// //                       border: `2px solid ${errors.email ? COLORS.danger : COLORS.lightGray}`,
// //                       fontSize: "14px",
// //                       transition: "all 0.3s ease",
// //                       outline: "none",
// //                       fontFamily: "inherit",
// //                       boxSizing: "border-box"
// //                     }}
// //                     placeholder="Enter your email"
// //                   />
// //                   {errors.email && (
// //                     <p style={{
// //                       fontSize: "13px",
// //                       color: COLORS.danger,
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "6px",
// //                       marginTop: "4px"
// //                     }}>
// //                       <FaExclamationCircle size={12} /> {errors.email}
// //                     </p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Second Row */}
// //               <div style={{
// //                 display: "grid",
// //                 gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
// //                 gap: isMobile ? "20px" : "24px"
// //               }}>
// //                 {/* Phone Field */}
// //                 <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                   <label style={{
// //                     fontSize: "14px",
// //                     fontWeight: "600",
// //                     color: COLORS.textGray,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "8px"
// //                   }}>
// //                     <FaPhone size={14} />
// //                     Phone Number *
// //                   </label>
// //                   <input
// //                     name="phone"
// //                     type="tel"
// //                     value={enrollData.phone}
// //                     onChange={handleChange}
// //                     style={{
// //                       width: "100%",
// //                       padding: "12px 16px",
// //                       borderRadius: "8px",
// //                       border: `2px solid ${errors.phone ? COLORS.danger : COLORS.lightGray}`,
// //                       fontSize: "14px",
// //                       transition: "all 0.3s ease",
// //                       outline: "none",
// //                       fontFamily: "inherit",
// //                       boxSizing: "border-box"
// //                     }}
// //                     placeholder="Enter your phone number"
// //                   />
// //                   {errors.phone && (
// //                     <p style={{
// //                       fontSize: "13px",
// //                       color: COLORS.danger,
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "6px",
// //                       marginTop: "4px"
// //                     }}>
// //                       <FaExclamationCircle size={12} /> {errors.phone}
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* Country Field */}
// //                 <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                   <label style={{
// //                     fontSize: "14px",
// //                     fontWeight: "600",
// //                     color: COLORS.textGray,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "8px"
// //                   }}>
// //                     <FaGlobe size={14} />
// //                     Country *
// //                   </label>
// //                   <input
// //                     name="country"
// //                     type="text"
// //                     value={enrollData.country}
// //                     onChange={handleChange}
// //                     style={{
// //                       width: "100%",
// //                       padding: "12px 16px",
// //                       borderRadius: "8px",
// //                       border: `2px solid ${errors.country ? COLORS.danger : COLORS.lightGray}`,
// //                       fontSize: "14px",
// //                       transition: "all 0.3s ease",
// //                       outline: "none",
// //                       fontFamily: "inherit",
// //                       boxSizing: "border-box"
// //                     }}
// //                     placeholder="Enter your country"
// //                   />
// //                   {errors.country && (
// //                     <p style={{
// //                       fontSize: "13px",
// //                       color: COLORS.danger,
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "6px",
// //                       marginTop: "4px"
// //                     }}>
// //                       <FaExclamationCircle size={12} /> {errors.country}
// //                     </p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Third Row */}
// //               <div style={{
// //                 display: "grid",
// //                 gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
// //                 gap: isMobile ? "20px" : "24px"
// //               }}>
// //                 {/* Date of Birth */}
// //                 <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                   <label style={{
// //                     fontSize: "14px",
// //                     fontWeight: "600",
// //                     color: COLORS.textGray,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "8px"
// //                   }}>
// //                     <FaCalendar size={14} />
// //                     Date of Birth *
// //                   </label>
// //                   <input
// //                     name="dob"
// //                     type="date"
// //                     value={enrollData.dob}
// //                     onChange={handleChange}
// //                     style={{
// //                       width: "100%",
// //                       padding: "12px 16px",
// //                       borderRadius: "8px",
// //                       border: `2px solid ${errors.dob ? COLORS.danger : COLORS.lightGray}`,
// //                       fontSize: "14px",
// //                       transition: "all 0.3s ease",
// //                       outline: "none",
// //                       fontFamily: "inherit",
// //                       boxSizing: "border-box"
// //                     }}
// //                   />
// //                   {errors.dob && (
// //                     <p style={{
// //                       fontSize: "13px",
// //                       color: COLORS.danger,
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "6px",
// //                       marginTop: "4px"
// //                     }}>
// //                       <FaExclamationCircle size={12} /> {errors.dob}
// //                     </p>
// //                   )}
// //                 </div>

// //                 {/* Gender Field */}
// //                 <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                   <label style={{
// //                     fontSize: "14px",
// //                     fontWeight: "600",
// //                     color: COLORS.textGray,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "8px"
// //                   }}>
// //                     <FaVenusMars size={14} />
// //                     Gender *
// //                   </label>
// //                   <select
// //                     name="gender"
// //                     value={enrollData.gender}
// //                     onChange={handleChange}
// //                     style={{
// //                       width: "100%",
// //                       padding: "12px 16px",
// //                       borderRadius: "8px",
// //                       border: `2px solid ${errors.gender ? COLORS.danger : COLORS.lightGray}`,
// //                       fontSize: "14px",
// //                       transition: "all 0.3s ease",
// //                       outline: "none",
// //                       fontFamily: "inherit",
// //                       boxSizing: "border-box",
// //                       backgroundColor: "white",
// //                       cursor: "pointer"
// //                     }}
// //                   >
// //                     <option value="">Select Gender</option>
// //                     <option value="Male">Male</option>
// //                     <option value="Female">Female</option>
// //                     <option value="Other">Other</option>
// //                     <option value="Prefer not to say">Prefer not to say</option>
// //                   </select>
// //                   {errors.gender && (
// //                     <p style={{
// //                       fontSize: "13px",
// //                       color: COLORS.danger,
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "6px",
// //                       marginTop: "4px"
// //                     }}>
// //                       <FaExclamationCircle size={12} /> {errors.gender}
// //                     </p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Course Selection */}
// //               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                 <label style={{
// //                   fontSize: "14px",
// //                   fontWeight: "600",
// //                   color: COLORS.textGray,
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: "8px"
// //                 }}>
// //                   <FaGraduationCap size={14} />
// //                   Select Course *
// //                 </label>
// //                 <select
// //                   name="courses"
// //                   value={enrollData.courses}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: "100%",
// //                     padding: "12px 16px",
// //                     borderRadius: "8px",
// //                     border: `2px solid ${errors.courses ? COLORS.danger : COLORS.lightGray}`,
// //                     fontSize: "14px",
// //                     transition: "all 0.3s ease",
// //                     outline: "none",
// //                     fontFamily: "inherit",
// //                     boxSizing: "border-box",
// //                     backgroundColor: "white",
// //                     cursor: "pointer"
// //                   }}
// //                 >
// //                   <option value="">Select a course</option>
// //                   {coursesList.map((course) => (
// //                     <option key={course._id} value={course._id}>
// //                       {course.title} {course.price > 0 ? `(₹${course.price})` : "(Free)"}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 {errors.courses && (
// //                   <p style={{
// //                     fontSize: "13px",
// //                     color: COLORS.danger,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "6px",
// //                     marginTop: "4px"
// //                   }}>
// //                     <FaExclamationCircle size={12} /> {errors.courses}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Message Field */}
// //               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
// //                 <label style={{
// //                   fontSize: "14px",
// //                   fontWeight: "600",
// //                   color: COLORS.textGray
// //                 }}>
// //                   Message (Optional)
// //                 </label>
// //                 <textarea
// //                   name="message"
// //                   value={enrollData.message}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: "100%",
// //                     padding: "12px 16px",
// //                     borderRadius: "8px",
// //                     border: `2px solid ${COLORS.lightGray}`,
// //                     fontSize: "14px",
// //                     transition: "all 0.3s ease",
// //                     outline: "none",
// //                     fontFamily: "inherit",
// //                     boxSizing: "border-box",
// //                     resize: "vertical",
// //                     minHeight: "100px"
// //                   }}
// //                   placeholder="Add any additional information or questions..."
// //                   rows={4}
// //                 />
// //               </div>

// //               {/* Rules Notice */}
// //               <div style={{
// //                 display: "flex",
// //                 alignItems: "flex-start",
// //                 gap: "12px",
// //                 padding: isMobile ? "16px" : "20px",
// //                 backgroundColor: COLORS.yellowLight,
// //                 borderRadius: "12px",
// //                 border: `1px solid ${COLORS.warning}40`
// //               }}>
// //                 <FaExclamationCircle style={{ 
// //                   color: COLORS.warning, 
// //                   fontSize: isMobile ? "16px" : "18px",
// //                   flexShrink: 0,
// //                   marginTop: "2px"
// //                 }} />
// //                 <p style={{
// //                   fontSize: "13px",
// //                   color: "#92400e",
// //                   margin: 0,
// //                   lineHeight: 1.6
// //                 }}>
// //                   <strong>Important:</strong> Lecture downloads, screenshots, recordings, and sharing 
// //                   are strictly prohibited. Violation may result in account suspension.
// //                 </p>
// //               </div>

// //               {/* Agreement Checkbox */}
// //               <label style={{
// //                 display: "flex",
// //                 alignItems: "flex-start",
// //                 gap: "12px",
// //                 fontSize: "14px",
// //                 color: COLORS.textGray,
// //                 cursor: "pointer",
// //                 padding: "12px",
// //                 borderRadius: "10px",
// //                 border: `2px solid ${errors.agree ? COLORS.danger : COLORS.lightGray}`,
// //                 transition: "all 0.3s ease"
// //               }}>
// //                 <input
// //                   type="checkbox"
// //                   name="agree"
// //                   checked={enrollData.agree}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: "18px",
// //                     height: "18px",
// //                     cursor: "pointer",
// //                     marginTop: "2px",
// //                     accentColor: COLORS.deepPurple
// //                   }}
// //                 />
// //                 <span>
// //                   I agree to the <strong>terms and conditions</strong> and understand that any 
// //                   violation of the rules may result in account termination.
// //                 </span>
// //               </label>
// //               {errors.agree && (
// //                 <p style={{
// //                   fontSize: "13px",
// //                   color: COLORS.danger,
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: "6px",
// //                   marginTop: "-12px"
// //                 }}>
// //                   <FaExclamationCircle size={12} /> {errors.agree}
// //                 </p>
// //               )}

// //               {/* Success/Error Messages */}
// //               {errors.submit && (
// //                 <div style={{
// //                   padding: isMobile ? "16px" : "20px",
// //                   borderRadius: "12px",
// //                   backgroundColor: errors.submit.type === "success" ? COLORS.greenLight : "#fee2e2",
// //                   border: `1px solid ${errors.submit.type === "success" ? COLORS.success : COLORS.danger}`,
// //                   color: errors.submit.type === "success" ? "#065f46" : COLORS.danger
// //                 }}>
// //                   <p style={{ 
// //                     margin: 0, 
// //                     fontSize: "14px",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: "8px"
// //                   }}>
// //                     {errors.submit.type === "success" ? (
// //                       <FaCheckCircle />
// //                     ) : (
// //                       <FaExclamationCircle />
// //                     )}
// //                     {errors.submit.message}
// //                   </p>
// //                 </div>
// //               )}

// //               {/* Submit Button */}
// //               <button 
// //                 type="submit" 
// //                 disabled={isSubmitting}
// //                 style={{
// //                   background: `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)`,
// //                   color: COLORS.white,
// //                   padding: isMobile ? "16px 24px" : "18px 32px",
// //                   borderRadius: "10px",
// //                   border: "none",
// //                   cursor: isSubmitting ? "not-allowed" : "pointer",
// //                   fontSize: isMobile ? "15px" : "16px",
// //                   fontWeight: "600",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                   gap: "12px",
// //                   transition: "all 0.3s ease",
// //                   boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
// //                   opacity: isSubmitting ? 0.8 : 1,
// //                   marginTop: "8px"
// //                 }}
// //               >
// //                 {isSubmitting ? (
// //                   <>
// //                     <div style={{
// //                       width: "18px",
// //                       height: "18px",
// //                       border: `2px solid rgba(255, 255, 255, 0.3)`,
// //                       borderTop: `2px solid ${COLORS.white}`,
// //                       borderRadius: "50%",
// //                       animation: "spin 1s linear infinite"
// //                     }}></div>
// //                     Processing Enrollment...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <FaCheckCircle size={18} />
// //                     Submit & Proceed to Payment
// //                     <FaChevronRight size={14} />
// //                   </>
// //                 )}
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Add CSS animations */}
// //       <style>{`
// //         @keyframes spin {
// //           to { transform: rotate(360deg); }
// //         }
        
// //         button:hover:not(:disabled) {
// //           transform: translateY(-2px);
// //           box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
// //         }
        
// //         input:focus, select:focus, textarea:focus {
// //           border-color: ${COLORS.deepPurple};
// //           box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
// //         }
        
// //         .course-card:hover {
// //           transform: translateY(-4px);
// //           box-shadow: 0 12px 24px rgba(0,0,0,0.1);
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default StudentDashboard;














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