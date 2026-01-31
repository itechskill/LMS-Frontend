// // src/pages/Dashboard.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import DashboardCards from "../components/DashboardCards";
// import Sidebar from "../components/Sidebar";
// import { getAllUsers, getCourses, getLecturesByCourse, getAllExams } from "../api/api";

// const Dashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [lectures, setLectures] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [previousData, setPreviousData] = useState({
//     users: [],
//     courses: [],
//     lectures: [],
//     exams: []
//   });

//   // Calculate dates for comparison
//   const today = useMemo(() => {
//     const date = new Date();
//     date.setHours(0, 0, 0, 0);
//     return date;
//   }, []);

//   const yesterday = useMemo(() => {
//     const date = new Date();
//     date.setDate(date.getDate() - 1);
//     date.setHours(0, 0, 0, 0);
//     return date;
//   }, []);

//   const startOfWeek = useMemo(() => {
//     const date = new Date();
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
//     const startOfWeek = new Date(date.setDate(diff));
//     startOfWeek.setHours(0, 0, 0, 0);
//     return startOfWeek;
//   }, []);

//   const startOfMonth = useMemo(() => {
//     const date = new Date();
//     date.setDate(1);
//     date.setHours(0, 0, 0, 0);
//     return date;
//   }, []);

//   const startOfQuarter = useMemo(() => {
//     const date = new Date();
//     const month = date.getMonth();
//     const quarterStartMonth = Math.floor(month / 3) * 3;
//     const startOfQuarter = new Date(date.getFullYear(), quarterStartMonth, 1);
//     startOfQuarter.setHours(0, 0, 0, 0);
//     return startOfQuarter;
//   }, []);

//   // Function to calculate growth percentage
//   const calculateGrowth = (current, previous) => {
//     if (previous === 0) return current > 0 ? 100 : 0; // Handle division by zero
//     const growth = ((current - previous) / previous) * 100;
//     return Math.round(growth * 10) / 10; // Round to 1 decimal place
//   };

//   // Filter users by creation/activity date
//   const filterUsersByDate = (userList, startDate, endDate = new Date()) => {
//     return userList.filter(user => {
//       const dateField = user.createdAt || user.updatedAt;
//       if (!dateField) return false;
//       const userDate = new Date(dateField);
//       return userDate >= startDate && userDate < endDate;
//     });
//   };

//   // Filter students by role
//   const filterStudents = (userList) => {
//     return userList.filter(u => 
//       u.role === "Student" || 
//       u.role === "student" ||
//       (!u.role && u.userType === "student")
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [usersData, coursesData, examsData] = await Promise.all([
//           getAllUsers(),
//           getCourses(),
//           getAllExams(),
//         ]);

//         // Process users
//         const processedUsers = Array.isArray(usersData) 
//           ? usersData 
//           : (usersData?.users || []);

//         // Process courses
//         let processedCourses = [];
//         if (Array.isArray(coursesData)) {
//           processedCourses = coursesData;
//         } else if (Array.isArray(coursesData?.courses)) {
//           processedCourses = coursesData.courses;
//         }

//         // Fetch lectures
//         let allLectures = [];
//         if (processedCourses.length > 0) {
//           const lecturePromises = processedCourses.map(course => 
//             getLecturesByCourse(course._id).catch(() => [])
//           );
//           const lectureArrays = await Promise.all(lecturePromises);
//           allLectures = lectureArrays.flat();
//         }

//         // Process exams
//         const processedExams = Array.isArray(examsData) 
//           ? examsData 
//           : (examsData?.exams || []);

//         // Store current data as previous for next comparison
//         setPreviousData({
//           users: processedUsers,
//           courses: processedCourses,
//           lectures: allLectures,
//           exams: processedExams
//         });

//         // Set current data
//         setUsers(processedUsers);
//         setCourses(processedCourses);
//         setLectures(allLectures);
//         setExams(processedExams);

//       } catch (err) {
//         console.error("Dashboard Error:", err);
//         alert("Failed to fetch dashboard data!");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Calculate dynamic metrics
//   const metrics = useMemo(() => {
//     if (users.length === 0) return {};

//     // Filter students
//     const students = filterStudents(users);

//     // Today's active users (users with activity today)
//     const todayActiveUsers = users.filter(user => {
//       const lastActive = user.lastLogin || user.updatedAt || user.createdAt;
//       if (!lastActive) return false;
//       const activeDate = new Date(lastActive);
//       return activeDate >= today;
//     }).length;

//     // Yesterday's active users
//     const yesterdayActiveUsers = users.filter(user => {
//       const lastActive = user.lastLogin || user.updatedAt || user.createdAt;
//       if (!lastActive) return false;
//       const activeDate = new Date(lastActive);
//       return activeDate >= yesterday && activeDate < today;
//     }).length;

//     // Students created in different time periods
//     const todayStudents = filterUsersByDate(students, today).length;
//     const yesterdayStudents = filterUsersByDate(students, yesterday, today).length;
//     const weeklyStudents = filterUsersByDate(students, startOfWeek).length;
//     const monthlyStudents = filterUsersByDate(students, startOfMonth).length;
//     const quarterlyStudents = filterUsersByDate(students, startOfQuarter).length;

//     // Courses created today
//     const todayCourses = filterUsersByDate(courses, today).length;
//     const yesterdayCourses = filterUsersByDate(courses, yesterday, today).length;

//     // Lectures created today (if lectures have createdAt)
//     const todayLectures = lectures.filter(lecture => {
//       if (!lecture.createdAt) return false;
//       const lectureDate = new Date(lecture.createdAt);
//       return lectureDate >= today;
//     }).length;

//     // Lectures created yesterday
//     const yesterdayLectures = lectures.filter(lecture => {
//       if (!lecture.createdAt) return false;
//       const lectureDate = new Date(lecture.createdAt);
//       return lectureDate >= yesterday && lectureDate < today;
//     }).length;

//     // Exams created today
//     const todayExams = filterUsersByDate(exams, today).length;
//     const yesterdayExams = filterUsersByDate(exams, yesterday, today).length;

//     // Calculate growth percentages
//     const studentGrowth = calculateGrowth(todayStudents, yesterdayStudents);
//     const courseGrowth = calculateGrowth(todayCourses, yesterdayCourses);
//     const lectureGrowth = calculateGrowth(todayLectures, yesterdayLectures);
//     const examGrowth = calculateGrowth(todayExams, yesterdayExams);
//     const userGrowth = calculateGrowth(todayActiveUsers, yesterdayActiveUsers);

//     return {
//       todayActiveUsers,
//       yesterdayActiveUsers,
//       students: students.length,
//       todayStudents,
//       yesterdayStudents,
//       weeklyStudents,
//       monthlyStudents,
//       quarterlyStudents,
//       todayCourses,
//       yesterdayCourses,
//       todayLectures,
//       yesterdayLectures,
//       todayExams,
//       yesterdayExams,
//       studentGrowth,
//       courseGrowth,
//       lectureGrowth,
//       examGrowth,
//       userGrowth
//     };
//   }, [users, courses, lectures, exams, today, yesterday, startOfWeek, startOfMonth, startOfQuarter]);

//   if (loading) {
//     return (
//       <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
//         <Sidebar />
//         <div style={{ 
//           flex: 1, 
//           marginLeft: "250px",
//           padding: "32px", 
//           display: "flex", 
//           justifyContent: "center", 
//           alignItems: "center" 
//         }}>
//           <div style={{ textAlign: "center" }}>
//             <div style={{
//               width: "50px",
//               height: "50px",
//               border: "3px solid #e5e7eb",
//               borderTop: "3px solid #3b82f6",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//               margin: "0 auto 16px auto"
//             }} />
//             <style>{`
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}</style>
//             <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading dashboard data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
//       <Sidebar />
      
//       <div style={{ 
//         flex: 1, 
//         marginLeft: "250px",
//         padding: "32px",
//         overflowX: "hidden"
//       }}>
//         {/* Header */}
//         <div style={{ marginBottom: "32px" }}>
//           <div style={{ 
//             display: "flex", 
//             justifyContent: "space-between", 
//             alignItems: "flex-start",
//             marginBottom: "24px",
//             flexWrap: "wrap",
//             gap: "16px"
//           }}>
//             <div>
//               <h1 style={{ 
//                 fontSize: "28px", 
//                 fontWeight: "700", 
//                 color: "#111827",
//                 margin: 0,
//                 marginBottom: "8px"
//               }}>
//                 Admin Dashboard
//               </h1>
//               <p style={{ 
//                 color: "#6b7280", 
//                 fontSize: "16px",
//                 margin: 0
//               }}>
//                 Real-time platform overview • Updated just now
//               </p>
//             </div>
//             <div style={{
//               backgroundColor: "#f0f9ff",
//               border: "1px solid #bae6fd",
//               borderRadius: "8px",
//               padding: "12px 16px"
//             }}>
//               <p style={{ 
//                 color: "#0369a1", 
//                 fontSize: "14px", 
//                 fontWeight: "600",
//                 margin: 0
//               }}>
//                 Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>
//           </div>

//           {/* Info Note about Periods */}
//           <div style={{
//             backgroundColor: "#f0f9ff",
//             border: "1px solid #bae6fd",
//             borderRadius: "8px",
//             padding: "12px 16px",
//             marginBottom: "24px"
//           }}>
//             <p style={{ 
//               color: "#0369a1", 
//               fontSize: "13px", 
//               margin: 0,
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}>
//               <span style={{ fontWeight: "600" }}>📅 Period Definitions:</span> 
//               Weekly (Mon-Sun), Monthly (current month), Quarterly (current quarter)
//             </p>
//           </div>

//           {/* Dashboard Cards */}
//           <div style={{ marginBottom: "40px" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
//               <div style={{ width: "4px", height: "20px", backgroundColor: "#3b82f6", borderRadius: "2px" }} />
//               <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#374151", margin: 0 }}>
//                 Platform Overview
//               </h2>
//             </div>
            
//             <DashboardCards 
//               totalStudents={metrics.students || 0}
//               totalCourses={courses.length}
//               totalLectures={lectures.length}
//               totalExams={exams.length}
//               todayUsers={metrics.todayActiveUsers || 0}
//               weeklyStudents={metrics.weeklyStudents || 0}
//               monthlyStudents={metrics.monthlyStudents || 0}
//               quarterlyStudents={metrics.quarterlyStudents || 0}
//               studentGrowth={metrics.studentGrowth || 0}
//               courseGrowth={metrics.courseGrowth || 0}
//               lectureGrowth={metrics.lectureGrowth || 0}
//               examGrowth={metrics.examGrowth || 0}
//               userGrowth={metrics.userGrowth || 0}
//             />
//           </div>
//           </div>
//         </div>
//       </div>
//   );
// };

// export default Dashboard;



// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import DashboardCards from "../components/DashboardCards";
import Sidebar from "../components/Sidebar";
import { getAllUsers, getCourses, getLecturesByCourse, getAllExams } from "../api/api";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate dates for comparison
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const yesterday = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const startOfWeek = useMemo(() => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }, []);

  const startOfMonth = useMemo(() => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const startOfQuarter = useMemo(() => {
    const date = new Date();
    const month = date.getMonth();
    const quarterStartMonth = Math.floor(month / 3) * 3;
    const startOfQuarter = new Date(date.getFullYear(), quarterStartMonth, 1);
    startOfQuarter.setHours(0, 0, 0, 0);
    return startOfQuarter;
  }, []);

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    const growth = ((current - previous) / previous) * 100;
    return Math.round(growth * 10) / 10;
  };

  const filterUsersByDate = (userList, startDate, endDate = new Date()) => {
    return userList.filter(user => {
      const dateField = user.createdAt || user.updatedAt;
      if (!dateField) return false;
      const userDate = new Date(dateField);
      return userDate >= startDate && userDate < endDate;
    });
  };

  const filterStudents = (userList) => {
    return userList.filter(u => 
      u.role === "Student" || 
      u.role === "student" ||
      (!u.role && u.userType === "student")
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [usersData, coursesData, examsData] = await Promise.all([
          getAllUsers(),
          getCourses(),
          getAllExams(),
        ]);

        const processedUsers = Array.isArray(usersData) 
          ? usersData 
          : (usersData?.users || []);

        let processedCourses = [];
        if (Array.isArray(coursesData)) {
          processedCourses = coursesData;
        } else if (Array.isArray(coursesData?.courses)) {
          processedCourses = coursesData.courses;
        }

        let allLectures = [];
        if (processedCourses.length > 0) {
          const lecturePromises = processedCourses.map(course => 
            getLecturesByCourse(course._id).catch(() => [])
          );
          const lectureArrays = await Promise.all(lecturePromises);
          allLectures = lectureArrays.flat();
        }

        const processedExams = Array.isArray(examsData) 
          ? examsData 
          : (examsData?.exams || []);

        setUsers(processedUsers);
        setCourses(processedCourses);
        setLectures(allLectures);
        setExams(processedExams);

      } catch (err) {
        console.error("Dashboard Error:", err);
        alert("Failed to fetch dashboard data!");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const metrics = useMemo(() => {
    if (users.length === 0) return {};

    const students = filterStudents(users);

    const todayActiveUsers = users.filter(user => {
      const lastActive = user.lastLogin || user.updatedAt || user.createdAt;
      if (!lastActive) return false;
      const activeDate = new Date(lastActive);
      return activeDate >= today;
    }).length;

    const yesterdayActiveUsers = users.filter(user => {
      const lastActive = user.lastLogin || user.updatedAt || user.createdAt;
      if (!lastActive) return false;
      const activeDate = new Date(lastActive);
      return activeDate >= yesterday && activeDate < today;
    }).length;

    const todayStudents = filterUsersByDate(students, today).length;
    const yesterdayStudents = filterUsersByDate(students, yesterday, today).length;
    const weeklyStudents = filterUsersByDate(students, startOfWeek).length;
    const monthlyStudents = filterUsersByDate(students, startOfMonth).length;
    const quarterlyStudents = filterUsersByDate(students, startOfQuarter).length;

    const todayCourses = filterUsersByDate(courses, today).length;
    const yesterdayCourses = filterUsersByDate(courses, yesterday, today).length;

    const todayLectures = lectures.filter(lecture => {
      if (!lecture.createdAt) return false;
      const lectureDate = new Date(lecture.createdAt);
      return lectureDate >= today;
    }).length;

    const yesterdayLectures = lectures.filter(lecture => {
      if (!lecture.createdAt) return false;
      const lectureDate = new Date(lecture.createdAt);
      return lectureDate >= yesterday && lectureDate < today;
    }).length;

    const todayExams = filterUsersByDate(exams, today).length;
    const yesterdayExams = filterUsersByDate(exams, yesterday, today).length;

    const studentGrowth = calculateGrowth(todayStudents, yesterdayStudents);
    const courseGrowth = calculateGrowth(todayCourses, yesterdayCourses);
    const lectureGrowth = calculateGrowth(todayLectures, yesterdayLectures);
    const examGrowth = calculateGrowth(todayExams, yesterdayExams);
    const userGrowth = calculateGrowth(todayActiveUsers, yesterdayActiveUsers);

    return {
      todayActiveUsers,
      students: students.length,
      weeklyStudents,
      monthlyStudents,
      quarterlyStudents,
      studentGrowth,
      courseGrowth,
      lectureGrowth,
      examGrowth,
      userGrowth
    };
  }, [users, courses, lectures, exams, today, yesterday, startOfWeek, startOfMonth, startOfQuarter]);

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <Sidebar />
        <div style={{
          ...styles.mainContent,
          marginLeft: isMobile ? "0" : "280px",
          paddingTop: isMobile ? "80px" : "32px",
        }}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={styles.loadingText}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      
      <div style={{
        ...styles.mainContent,
        marginLeft: isMobile ? "0" : "280px",
        paddingTop: isMobile ? "80px" : "32px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        {/* Header */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.pageTitle}>
                Admin Dashboard
              </h1>
              <p style={styles.pageSubtitle}>
                Real-time platform overview • Updated just now
              </p>
            </div>
            <div style={styles.liveDataBadge}>
              <p style={styles.liveDataText}>
                Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Info Note */}
          <div style={styles.infoCard}>
            <p style={styles.infoText}>
              <span style={{ fontWeight: "600" }}>📅 Period Definitions:</span> 
              {" "}Weekly (Mon-Sun), Monthly (current month), Quarterly (current quarter)
            </p>
          </div>

          {/* Dashboard Cards */}
          <div style={{ marginBottom: "40px" }}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator} />
              <h2 style={styles.sectionTitle}>
                Platform Overview
              </h2>
            </div>
            
            <DashboardCards 
              totalStudents={metrics.students || 0}
              totalCourses={courses.length}
              totalLectures={lectures.length}
              totalExams={exams.length}
              todayUsers={metrics.todayActiveUsers || 0}
              weeklyStudents={metrics.weeklyStudents || 0}
              monthlyStudents={metrics.monthlyStudents || 0}
              quarterlyStudents={metrics.quarterlyStudents || 0}
              studentGrowth={metrics.studentGrowth || 0}
              courseGrowth={metrics.courseGrowth || 0}
              lectureGrowth={metrics.lectureGrowth || 0}
              examGrowth={metrics.examGrowth || 0}
              userGrowth={metrics.userGrowth || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  mainContent: {
    flex: 1,
    overflowX: "hidden",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
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
  headerSection: {
    marginBottom: "32px",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#3D1A5B",
    margin: 0,
    marginBottom: "8px",
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
  infoCard: {
    background: "linear-gradient(135deg, rgba(241, 213, 114, 0.1) 0%, rgba(166, 138, 70, 0.1) 100%)",
    border: "1px solid rgba(166, 138, 70, 0.2)",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "24px",
  },
  infoText: {
    color: "#A68A46",
    fontSize: "13px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
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
};

export default Dashboard;