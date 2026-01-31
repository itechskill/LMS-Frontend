// // src/components/DashboardCards.jsx
// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { 
//   faUserGraduate, 
//   faBook, 
//   faVideo, 
//   faPenFancy,
//   faUsers,
//   faCalendarWeek,
//   faCalendarAlt,
//   faCalendar,
//   faArrowUp,
//   faArrowDown,
//   faEquals
// } from "@fortawesome/free-solid-svg-icons";

// const DashboardCards = ({ 
//   totalStudents, 
//   totalCourses, 
//   totalLectures, 
//   totalExams,
//   todayUsers,
//   weeklyStudents,
//   monthlyStudents,
//   quarterlyStudents,
//   studentGrowth = 0,
//   courseGrowth = 0,
//   lectureGrowth = 0,
//   examGrowth = 0,
//   userGrowth = 0
// }) => {
//   const getGrowthIcon = (growth) => {
//     if (growth > 0) return <FontAwesomeIcon icon={faArrowUp} style={{color: "#10b981", marginLeft: "4px"}} />;
//     if (growth < 0) return <FontAwesomeIcon icon={faArrowDown} style={{color: "#ef4444", marginLeft: "4px"}} />;
//     return <FontAwesomeIcon icon={faEquals} style={{color: "#6b7280", marginLeft: "4px"}} />;
//   };

//   const getGrowthText = (growth) => {
//     if (growth > 0) return `+${growth}%`;
//     if (growth < 0) return `${growth}%`;
//     return "0%";
//   };

//   const getGrowthColor = (growth) => {
//     if (growth > 0) return "#10b981";
//     if (growth < 0) return "#ef4444";
//     return "#6b7280";
//   };

//   const cards = [
//     {
//       title: "Total Students",
//       count: totalStudents || 0,
//       icon: faUserGraduate,
//       textColor: "#1e40af",
//       borderColor: "#3b82f6",
//       gradient: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
//       growth: studentGrowth,
//       detail: "Registered students"
//     },
//     {
//       title: "Weekly Students",
//       count: weeklyStudents || 0,
//       icon: faCalendarWeek,
//       textColor: "#7c3aed",
//       borderColor: "#8b5cf6",
//       gradient: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
//       detail: "This week",
//       isPeriod: true
//     },
//     {
//       title: "Monthly Students",
//       count: monthlyStudents || 0,
//       icon: faCalendarAlt,
//       textColor: "#059669",
//       borderColor: "#10b981",
//       gradient: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)",
//       detail: "This month",
//       isPeriod: true
//     },
//     {
//       title: "Quarterly Students",
//       count: quarterlyStudents || 0,
//       icon: faCalendar,
//       textColor: "#dc2626",
//       borderColor: "#ef4444",
//       gradient: "linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)",
//       detail: "This quarter",
//       isPeriod: true
//     },
//     {
//       title: "Total Courses",
//       count: totalCourses || 0,
//       icon: faBook,
//       textColor: "#92400e",
//       borderColor: "#f59e0b",
//       gradient: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)",
//       growth: courseGrowth,
//       detail: "Active courses"
//     },
//     {
//       title: "Total Lectures",
//       count: totalLectures || 0,
//       icon: faVideo,
//       textColor: "#065f46",
//       borderColor: "#10b981",
//       gradient: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)",
//       growth: lectureGrowth,
//       detail: "Video lectures"
//     },
//     {
//       title: "Mock Exams",
//       count: totalExams || 0,
//       icon: faPenFancy,
//       textColor: "#831843",
//       borderColor: "#ec4899",
//       gradient: "linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)",
//       growth: examGrowth,
//       detail: "Available exams"
//     },
//     {
//       title: "Today's Users",
//       count: todayUsers || 0,
//       icon: faUsers,
//       textColor: "#7c3aed",
//       borderColor: "#8b5cf6",
//       gradient: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
//       growth: userGrowth,
//       detail: "Active today",
//       isToday: true
//     }
//   ];

//   return (
//     <div style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//       gap: "20px",
//       width: "100%"
//     }}>
//       {cards.map((card, index) => (
//         <div
//           key={index}
//           style={{
//             background: "#ffffff",
//             padding: "20px",
//             borderRadius: "12px",
//             borderLeft: `4px solid ${card.borderColor}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
//             transition: "all 0.3s ease",
//             cursor: "pointer",
//             position: "relative",
//             overflow: "hidden",
//             minHeight: "120px"
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = "translateY(-4px)";
//             e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.12)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = "translateY(0)";
//             e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
//           }}
//         >
//           <div style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             height: "100%",
//             background: card.gradient,
//             opacity: 0.1,
//             zIndex: 0
//           }} />
          
//           <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
//             <div style={{ 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               marginBottom: "8px"
//             }}>
//               <p style={{ 
//                 color: card.textColor, 
//                 fontSize: "13px", 
//                 fontWeight: "600",
//                 margin: 0,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.5px",
//                 opacity: 0.9
//               }}>
//                 {card.title}
//               </p>
//               {card.isToday && (
//                 <span style={{
//                   backgroundColor: "#8b5cf6",
//                   color: "white",
//                   fontSize: "10px",
//                   fontWeight: "600",
//                   padding: "2px 6px",
//                   borderRadius: "10px",
//                   textTransform: "uppercase"
//                 }}>
//                   Today
//                 </span>
//               )}
//               {card.isPeriod && (
//                 <span style={{
//                   backgroundColor: card.borderColor,
//                   color: "white",
//                   fontSize: "10px",
//                   fontWeight: "600",
//                   padding: "2px 6px",
//                   borderRadius: "10px",
//                   textTransform: "uppercase"
//                 }}>
//                   Period
//                 </span>
//               )}
//             </div>
            
//             <h2 style={{ 
//               color: "#111827", 
//               fontSize: "32px", 
//               fontWeight: "700", 
//               margin: "6px 0",
//               lineHeight: 1
//             }}>
//               {card.count.toLocaleString()}
//             </h2>
            
//             <div style={{ 
//               display: "flex", 
//               alignItems: "center", 
//               justifyContent: "space-between",
//               marginTop: "8px"
//             }}>
//               <span style={{ 
//                 color: "#6b7280", 
//                 fontSize: "12px", 
//                 fontWeight: "500" 
//               }}>
//                 {card.detail}
//               </span>
//               {card.growth !== undefined && (
//                 <div style={{ 
//                   display: "flex", 
//                   alignItems: "center",
//                   fontSize: "12px",
//                   fontWeight: "600",
//                   color: getGrowthColor(card.growth)
//                 }}>
//                   {getGrowthIcon(card.growth)}
//                   <span style={{ marginLeft: "4px" }}>
//                     {getGrowthText(card.growth)}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div style={{ 
//             position: "relative",
//             zIndex: 1,
//             fontSize: "42px",
//             opacity: 0.9,
//             color: card.borderColor,
//             marginLeft: "12px"
//           }}>
//             <FontAwesomeIcon icon={card.icon} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DashboardCards;













// src/components/DashboardCards.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserGraduate, 
  faBook, 
  faVideo, 
  faPenFancy,
  faUsers,
  faCalendarWeek,
  faCalendarAlt,
  faCalendar,
  faArrowUp,
  faArrowDown,
  faEquals
} from "@fortawesome/free-solid-svg-icons";

const DashboardCards = ({ 
  totalStudents, 
  totalCourses, 
  totalLectures, 
  totalExams,
  todayUsers,
  weeklyStudents,
  monthlyStudents,
  quarterlyStudents,
  studentGrowth = 0,
  courseGrowth = 0,
  lectureGrowth = 0,
  examGrowth = 0,
  userGrowth = 0
}) => {
  const getGrowthIcon = (growth) => {
    if (growth > 0) return <FontAwesomeIcon icon={faArrowUp} style={{color: "#10b981", marginLeft: "4px"}} />;
    if (growth < 0) return <FontAwesomeIcon icon={faArrowDown} style={{color: "#ef4444", marginLeft: "4px"}} />;
    return <FontAwesomeIcon icon={faEquals} style={{color: "#6b7280", marginLeft: "4px"}} />;
  };

  const getGrowthText = (growth) => {
    if (growth > 0) return `+${growth}%`;
    if (growth < 0) return `${growth}%`;
    return "0%";
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return "#10b981";
    if (growth < 0) return "#ef4444";
    return "#6b7280";
  };

  const cards = [
    {
      title: "Total Students",
      count: totalStudents || 0,
      icon: faUserGraduate,
      textColor: "#3D1A5B",
      borderColor: "#3D1A5B",
      gradient: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
      growth: studentGrowth,
      detail: "Registered students"
    },
    {
      title: "Weekly Students",
      count: weeklyStudents || 0,
      icon: faCalendarWeek,
      textColor: "#5E427B",
      borderColor: "#5E427B",
      gradient: "linear-gradient(135deg, rgba(94, 66, 123, 0.1) 0%, rgba(61, 26, 91, 0.1) 100%)",
      detail: "This week",
      isPeriod: true
    },
    {
      title: "Monthly Students",
      count: monthlyStudents || 0,
      icon: faCalendarAlt,
      textColor: "#A68A46",
      borderColor: "#A68A46",
      gradient: "linear-gradient(135deg, rgba(166, 138, 70, 0.1) 0%, rgba(241, 213, 114, 0.1) 100%)",
      detail: "This month",
      isPeriod: true
    },
    {
      title: "Quarterly Students",
      count: quarterlyStudents || 0,
      icon: faCalendar,
      textColor: "#F1D572",
      borderColor: "#A68A46",
      gradient: "linear-gradient(135deg, rgba(241, 213, 114, 0.1) 0%, rgba(166, 138, 70, 0.1) 100%)",
      detail: "This quarter",
      isPeriod: true
    },
    {
      title: "Total Courses",
      count: totalCourses || 0,
      icon: faBook,
      textColor: "#3D1A5B",
      borderColor: "#3D1A5B",
      gradient: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
      growth: courseGrowth,
      detail: "Active courses"
    },
    {
      title: "Total Lectures",
      count: totalLectures || 0,
      icon: faVideo,
      textColor: "#5E427B",
      borderColor: "#5E427B",
      gradient: "linear-gradient(135deg, rgba(94, 66, 123, 0.1) 0%, rgba(61, 26, 91, 0.1) 100%)",
      growth: lectureGrowth,
      detail: "Video lectures"
    },
    {
      title: "Mock Exams",
      count: totalExams || 0,
      icon: faPenFancy,
      textColor: "#A68A46",
      borderColor: "#A68A46",
      gradient: "linear-gradient(135deg, rgba(166, 138, 70, 0.1) 0%, rgba(241, 213, 114, 0.1) 100%)",
      growth: examGrowth,
      detail: "Available exams"
    },
    {
      title: "Today's Users",
      count: todayUsers || 0,
      icon: faUsers,
      textColor: "#3D1A5B",
      borderColor: "#F1D572",
      gradient: "linear-gradient(135deg, rgba(241, 213, 114, 0.15) 0%, rgba(166, 138, 70, 0.1) 100%)",
      growth: userGrowth,
      detail: "Active today",
      isToday: true
    }
  ];

  return (
    <div style={styles.container}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            ...styles.card,
            borderLeft: `4px solid ${card.borderColor}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(61, 26, 91, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
          }}
        >
          <div style={{
            ...styles.gradientOverlay,
            background: card.gradient,
          }} />
          
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <p style={{ 
                ...styles.cardTitle,
                color: card.textColor,
              }}>
                {card.title}
              </p>
              {card.isToday && (
                <span style={{
                  ...styles.badge,
                  backgroundColor: "#3D1A5B",
                }}>
                  Today
                </span>
              )}
              {card.isPeriod && (
                <span style={{
                  ...styles.badge,
                  backgroundColor: card.borderColor,
                }}>
                  Period
                </span>
              )}
            </div>
            
            <h2 style={styles.cardCount}>
              {card.count.toLocaleString()}
            </h2>
            
            <div style={styles.cardFooter}>
              <span style={styles.cardDetail}>
                {card.detail}
              </span>
              {card.growth !== undefined && (
                <div style={{ 
                  ...styles.growthContainer,
                  color: getGrowthColor(card.growth)
                }}>
                  {getGrowthIcon(card.growth)}
                  <span style={{ marginLeft: "4px" }}>
                    {getGrowthText(card.growth)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            ...styles.iconContainer,
            color: card.borderColor,
          }}>
            <FontAwesomeIcon icon={card.icon} />
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    width: "100%",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    minHeight: "120px",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    opacity: 1,
    zIndex: 0,
  },
  cardContent: {
    position: "relative",
    zIndex: 1,
    flex: 1,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "600",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    opacity: 0.95,
  },
  badge: {
    color: "white",
    fontSize: "10px",
    fontWeight: "600",
    padding: "2px 6px",
    borderRadius: "10px",
    textTransform: "uppercase",
  },
  cardCount: {
    color: "#111827",
    fontSize: "32px",
    fontWeight: "700",
    margin: "6px 0",
    lineHeight: 1,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  cardDetail: {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "500",
  },
  growthContainer: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "600",
  },
  iconContainer: {
    position: "relative",
    zIndex: 1,
    fontSize: "42px",
    opacity: 0.9,
    marginLeft: "12px",
  },
};

// Media query handling
if (typeof window !== 'undefined') {
  const updateStyles = () => {
    if (window.innerWidth <= 768) {
      styles.container.gridTemplateColumns = "repeat(auto-fill, minmax(100%, 1fr))";
      styles.card.minHeight = "110px";
      styles.iconContainer.fontSize = "36px";
      styles.cardCount.fontSize = "28px";
    } else if (window.innerWidth <= 1024) {
      styles.container.gridTemplateColumns = "repeat(auto-fill, minmax(240px, 1fr))";
    }
  };
  
  updateStyles();
  window.addEventListener('resize', updateStyles);
}

export default DashboardCards;