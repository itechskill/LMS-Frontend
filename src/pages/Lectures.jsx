import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaEye, 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint, 
  FaVideo, 
  FaLink,
  FaLock,
  FaUnlock,
  FaRupeeSign,
  FaChartLine,
  FaFilter,
  FaSort,
  FaArrowLeft,
  FaDownload,
  FaPlay,
  FaBook,
  FaSearch,
  FaTag,
  FaTimes
} from "react-icons/fa";
import { 
  getLecturesByCourse, 
  createLecture, 
  updateLecture, 
  deleteLecture,
  getCourseById 
} from "../api/api";

const BASE_URL = "https://itechskill.com";

// Color Theme
const COLORS = {
  sidebarDark: "#1a1d2e",
  deepPurple: "#3D1A5B",
  headerPurple: "#4B2D7A",
  brightGreen: "#00D9A3",
  goldBadge: "#D4A745",
  roleBg: "#E8DFF5",
  white: "#FFFFFF",
  bgGray: "#F9FAFB",
  lightGray: "#F3F4F6",
  darkGray: "#6B7280",
  textGray: "#4B5563",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  orange: "#F97316",
  primaryButton: "#3D1A5B",
  formButton: "#3B82F6",
  cancelButton: "#6B7280",
  blueLight: "#dbeafe",
  greenLight: "#d1fae5",
  yellowLight: "#fef3c7",
  purpleLight: "#ede9fe",
  teal: "#0d9488",
  indigo: "#4f46e5",
  rose: "#f43f5e"
};

const Lectures = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [course, setCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [sortBy, setSortBy] = useState("lectureNumber");
  const [filterAccess, setFilterAccess] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [stats, setStats] = useState({
    totalLectures: 0,
    freeLectures: 0,
    paidLectures: 0,
    totalDuration: 0
  });

  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lectureNumber: "",
    duration: "",
    videoUrl: "",
    type: "video",
    notes: "",
    isFreePreview: false,
    priceRequired: 0,
    subCategory: "",
  });

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
      
      const data = await getLecturesByCourse(courseId);
      
      let lecturesArray = [];
      if (Array.isArray(data)) {
        lecturesArray = data;
      } else if (data?.lectures && Array.isArray(data.lectures)) {
        lecturesArray = data.lectures;
      }
      
      setLectures(lecturesArray);
      calculateStats(lecturesArray);
      
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (lecturesArray) => {
    const totalLectures = lecturesArray.length;
    const freeLectures = lecturesArray.filter(l => l.isFreePreview).length;
    const paidLectures = totalLectures - freeLectures;
    const totalDuration = lecturesArray.reduce((sum, l) => sum + (parseInt(l.duration) || 0), 0);
    
    setStats({
      totalLectures,
      freeLectures,
      paidLectures,
      totalDuration
    });
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  // ================= FORM HANDLERS =================
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      lectureNumber: "",
      duration: "",
      videoUrl: "",
      type: "video",
      notes: "",
      isFreePreview: false,
      priceRequired: 0,
      subCategory: "",
    });
    setVideoFile(null);
    setPdfFile(null);
    setDocFile(null);
    setExcelFile(null);
    setPptFile(null);
  };

  const openAddForm = () => {
    setEditingId(null);
    resetForm();
    
    const nextNumber = lectures.length > 0 
      ? Math.max(...lectures.map(l => parseInt(l.lectureNumber) || 0)) + 1 
      : 1;
    
    setFormData(prev => ({
      ...prev,
      lectureNumber: nextNumber
    }));
    
    setShowForm(true);
  };

  const openEditForm = (lec) => {
    setEditingId(lec._id);
    setFormData({
      title: lec.title || "",
      description: lec.description || "",
      lectureNumber: lec.lectureNumber || "",
      duration: lec.duration || "",
      videoUrl: lec.videoUrl || "",
      type: lec.type || "video",
      notes: lec.notes || "",
      isFreePreview: lec.isFreePreview || false,
      priceRequired: lec.priceRequired || 0,
      subCategory: lec.subCategory || "",
    });
    setVideoFile(null);
    setPdfFile(null);
    setDocFile(null);
    setExcelFile(null);
    setPptFile(null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          form.append(k, v);
        }
      });
      
      form.append("course", courseId);

      if (videoFile) form.append("video", videoFile);
      if (pdfFile) form.append("pdf", pdfFile);
      if (docFile) form.append("document", docFile);
      if (excelFile) form.append("excel", excelFile);
      if (pptFile) form.append("ppt", pptFile);

      let response;
      if (editingId) {
        response = await updateLecture(editingId, form);
      } else {
        response = await createLecture(form);
      }

      await fetchData();
      resetForm();
      setShowForm(false);
      alert(editingId ? "Lecture updated successfully!" : "Lecture added successfully!");
    } catch (err) {
      console.error("Lecture Submit Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lecture? This action cannot be undone.")) return;
    try {
      await deleteLecture(id);
      await fetchData();
      alert("Lecture deleted successfully!");
    } catch (err) {
      console.error("DeleteLecture Error:", err);
      alert("Failed to delete lecture.");
    }
  };

  // ================= FILTER AND SORT =================
  const filteredAndSortedLectures = lectures
    .filter(lec => {
      const matchesSearch = 
        lec.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lec.lectureNumber?.toString().includes(searchTerm) ||
        lec.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAccess = 
        filterAccess === "all" ||
        (filterAccess === "free" && lec.isFreePreview) ||
        (filterAccess === "paid" && !lec.isFreePreview);
      
      return matchesSearch && matchesAccess;
    })
    .sort((a, b) => {
      if (sortBy === "lectureNumber") {
        return (parseInt(a.lectureNumber) || 0) - (parseInt(b.lectureNumber) || 0);
      } else if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      } else if (sortBy === "duration") {
        return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
      }
      return 0;
    });

  // ================= RENDER FUNCTIONS =================
  const renderFile = (lec) => {
    if (lec.videoPath) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaPlay style={{ color: COLORS.danger }} />
          <a 
            href={`${BASE_URL}/${lec.videoPath}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: COLORS.info, textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}
          >
            Play Video
          </a>
        </div>
      );
    }

    if (lec.videoUrl) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaLink style={{ color: COLORS.info }} />
          <a href={lec.videoUrl} target="_blank" rel="noreferrer" style={{ color: COLORS.info, textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}>
            Watch
          </a>
        </div>
      );
    }

    if (lec.pdfPath) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaFilePdf style={{ color: COLORS.danger }} />
          <a 
            href={`${BASE_URL}/${lec.pdfPath}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: COLORS.info, textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}
            download
          >
            PDF <FaDownload size={10} />
          </a>
        </div>
      );
    }

    if (lec.documentPath) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaFileWord style={{ color: COLORS.indigo }} />
          <a 
            href={`${BASE_URL}/${lec.documentPath}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: COLORS.info, textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}
            download
          >
            Doc <FaDownload size={10} />
          </a>
        </div>
      );
    }

    if (lec.excelPath) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaFileExcel style={{ color: COLORS.teal }} />
          <a 
            href={`${BASE_URL}/${lec.excelPath}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: COLORS.info, textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}
            download
          >
            Excel <FaDownload size={10} />
          </a>
        </div>
      );
    }

    if (lec.pptPath) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaFilePowerpoint style={{ color: COLORS.warning }} />
          <a 
            href={`${BASE_URL}/${lec.pptPath}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: COLORS.info, textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}
            download
          >
            PPT <FaDownload size={10} />
          </a>
        </div>
      );
    }

    return (
      <span style={{ color: COLORS.darkGray, fontStyle: "italic", fontSize: isMobile ? "11px" : "13px" }}>No file</span>
    );
  };

  const getLectureTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'video': return { bg: '#fee2e2', text: COLORS.danger };
      case 'pdf': return { bg: COLORS.blueLight, text: COLORS.info };
      case 'document': return { bg: COLORS.greenLight, text: COLORS.teal };
      case 'excel': return { bg: COLORS.yellowLight, text: '#92400e' };
      case 'ppt': return { bg: COLORS.purpleLight, text: COLORS.indigo };
      case 'link': return { bg: '#e0f2fe', text: COLORS.info };
      default: return { bg: COLORS.lightGray, text: COLORS.darkGray };
    }
  };

  // ================= STATS CARD =================
  const StatCard = ({ icon, title, value, color, bgColor }) => (
    <div style={{
      background: COLORS.white,
      padding: isMobile ? "12px" : "16px",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "8px" : "12px",
      flex: "1 1 180px",
      minWidth: isMobile ? "150px" : "180px",
    }}>
      <div style={{
        width: isMobile ? "35px" : "40px",
        height: isMobile ? "35px" : "40px",
        borderRadius: "8px",
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isMobile ? "16px" : "18px",
        color: color
      }}>
        {icon}
      </div>
      <div style={{ minWidth: "0" }}>
        <div style={{ fontSize: isMobile ? "11px" : "12px", color: COLORS.darkGray, marginBottom: "2px", whiteSpace: "nowrap" }}>
          {title}
        </div>
        <div style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "700", color: COLORS.deepPurple }}>
          {value}
        </div>
      </div>
    </div>
  );

  // Group lectures by subcategory
  const lecturesBySubcategory = {};
  filteredAndSortedLectures.forEach(lecture => {
    const subCategory = lecture.subCategory || "Uncategorized";
    if (!lecturesBySubcategory[subCategory]) {
      lecturesBySubcategory[subCategory] = [];
    }
    lecturesBySubcategory[subCategory].push(lecture);
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: COLORS.bgGray }}>
      <Sidebar />
      
      <div style={{ 
        flex: 1,
        overflowX: "hidden",
        marginLeft: isMobile ? "0" : "280px",
        paddingTop: isMobile ? "80px" : "32px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: isMobile ? "20px" : "24px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: isMobile ? "16px" : "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <button
                onClick={() => navigate("/courses")}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: isMobile ? "14px" : "16px",
                  cursor: "pointer",
                  color: COLORS.darkGray,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 0",
                  marginBottom: "8px"
                }}
              >
                <FaArrowLeft /> Back to Courses
              </button>
              <h1 style={{ 
                margin: 0, 
                color: COLORS.deepPurple,
                fontSize: isMobile ? "20px" : "28px",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
                📚 Lectures Management
              </h1>
              {course && (
                <p style={{ 
                  margin: "0", 
                  color: COLORS.textGray, 
                  fontSize: isMobile ? "12px" : "14px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? "6px" : "8px",
                  alignItems: "center"
                }}>
                  <span>Course: <strong style={{ color: COLORS.deepPurple }}>{course.title}</strong></span>
                  <span style={{ color: COLORS.darkGray }}>•</span>
                  <span>Price: <strong style={{ color: course.price > 0 ? COLORS.deepPurple : COLORS.brightGreen }}>₹{course.price || 0} {course.price === 0 && "(FREE)"}</strong></span>
                  <span style={{ color: COLORS.darkGray }}>•</span>
                  <span>Category: <strong style={{ color: COLORS.deepPurple }}>{course.category || "Uncategorized"}</strong></span>
                </p>
              )}
            </div>

            {/* Total Lectures Card - Top Right */}
            <div style={{
              background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
              border: "1px solid rgba(61, 26, 91, 0.2)",
              borderRadius: "8px",
              padding: isMobile ? "10px 16px" : "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: isMobile ? "35px" : "40px",
                height: isMobile ? "35px" : "40px",
                borderRadius: "8px",
                background: COLORS.blueLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "16px" : "20px",
                color: COLORS.info
              }}>
                <FaBook />
              </div>
              <div>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  margin: 0,
                  marginBottom: "2px"
                }}>
                  Total Lectures
                </p>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "700",
                  margin: 0
                }}>
                  {stats.totalLectures}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: "flex",
            gap: isMobile ? "10px" : "15px",
            marginBottom: isMobile ? "16px" : "20px",
            overflowX: "auto",
            paddingBottom: "5px"
          }}>
            <StatCard
              icon={<FaBook />}
              title="Total Lectures"
              value={stats.totalLectures}
              color={COLORS.info}
              bgColor={COLORS.blueLight}
            />
            <StatCard
              icon={<FaUnlock />}
              title="Free Lectures"
              value={stats.freeLectures}
              color="#059669"
              bgColor="#d1fae5"
            />
            <StatCard
              icon={<FaLock />}
              title="Paid Lectures"
              value={stats.paidLectures}
              color={COLORS.danger}
              bgColor="#fee2e2"
            />
            <StatCard
              icon={<FaChartLine />}
              title="Total Duration"
              value={`${stats.totalDuration} min`}
              color={COLORS.orange}
              bgColor="#fed7aa"
            />
          </div>

          {/* Search, Filter & Add Button Row */}
          <div style={{ 
            display: "flex", 
            gap: isMobile ? "8px" : "12px",
            marginBottom: isMobile ? "16px" : "20px",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            {/* Search Input */}
            <div style={{
              position: "relative",
              flex: isMobile ? "1" : "1 1 400px",
              maxWidth: isMobile ? "100%" : "500px"
            }}>
              <FaSearch style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.darkGray,
                fontSize: isMobile ? "14px" : "16px"
              }} />
              <input
                placeholder="Search lectures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: isMobile ? "10px 14px 10px 40px" : "12px 16px 12px 44px",
                  borderRadius: "8px",
                  border: `1px solid #D1D5DB`,
                  fontSize: isMobile ? "13px" : "14px",
                  background: COLORS.white,
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>

            {/* Filters Container */}
            <div style={{ 
              display: "flex", 
              gap: isMobile ? "8px" : "10px",
              flex: isMobile ? "1" : "0 0 auto",
              flexWrap: isMobile ? "wrap" : "nowrap"
            }}>
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: isMobile ? "10px" : "12px",
                  borderRadius: "8px",
                  border: `1px solid #D1D5DB`,
                  fontSize: isMobile ? "12px" : "14px",
                  background: COLORS.white,
                  cursor: "pointer",
                  flex: isMobile ? "1 1 45%" : "0 0 auto",
                  minWidth: isMobile ? "0" : "150px",
                  outline: "none"
                }}
              >
                <option value="lectureNumber">Sort by Number</option>
                <option value="title">Sort by Title</option>
                <option value="duration">Sort by Duration</option>
              </select>

              {/* Filter Dropdown */}
              <select
                value={filterAccess}
                onChange={(e) => setFilterAccess(e.target.value)}
                style={{
                  padding: isMobile ? "10px" : "12px",
                  borderRadius: "8px",
                  border: `1px solid #D1D5DB`,
                  fontSize: isMobile ? "12px" : "14px",
                  background: COLORS.white,
                  cursor: "pointer",
                  flex: isMobile ? "1 1 45%" : "0 0 auto",
                  minWidth: isMobile ? "0" : "150px",
                  outline: "none"
                }}
              >
                <option value="all">All Lectures</option>
                <option value="free">Free Preview</option>
                <option value="paid">Paid Only</option>
              </select>

              {/* Add Lecture Button */}
              <button
                onClick={openAddForm}
                style={{
                  background: COLORS.primaryButton,
                  color: COLORS.white,
                  border: "none",
                  padding: isMobile ? "10px 20px" : "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 2px 5px rgba(139, 92, 246, 0.3)",
                  whiteSpace: "nowrap",
                  flex: isMobile ? "1 1 100%" : "0 0 auto",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
                onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}
              >
                <FaPlus /> {isMobile ? "Add Lecture" : "New Lecture"}
              </button>
            </div>
          </div>

          {/* Lectures by Subcategory */}
          {Object.keys(lecturesBySubcategory).map((subcategory, index) => (
            <div key={subcategory} style={{ marginBottom: "30px" }}>
              {/* Subcategory Header */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: "16px",
                padding: "12px 20px",
                background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
                borderRadius: "10px",
                borderLeft: `4px solid ${COLORS.deepPurple}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <FaTag style={{ color: COLORS.deepPurple, fontSize: "18px" }} />
                  <h3 style={{ 
                    margin: 0, 
                    color: COLORS.deepPurple,
                    fontSize: "18px",
                    fontWeight: "600"
                  }}>
                    {subcategory}
                  </h3>
                  <span style={{ 
                    background: COLORS.deepPurple,
                    color: COLORS.white,
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {lecturesBySubcategory[subcategory].length} lectures
                  </span>
                </div>
              </div>

              {/* Lectures Table for this subcategory */}
              <div style={{ 
                background: COLORS.white, 
                borderRadius: "12px",
                overflow: isMobile ? "auto" : "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                marginBottom: "20px"
              }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse",
                  minWidth: isMobile ? "1000px" : "auto"
                }}>
                  <thead>
                    <tr style={{ 
                      background: COLORS.headerPurple,
                      color: COLORS.white
                    }}>
                      <th style={{ 
                        padding: isMobile ? "14px 12px" : "18px 24px", 
                        textAlign: "left", 
                        fontWeight: "700", 
                        fontSize: isMobile ? "12px" : "15px",
                        width: "80px"
                      }}>#</th>
                      <th style={{ 
                        padding: isMobile ? "14px 12px" : "18px 24px", 
                        textAlign: "left", 
                        fontWeight: "700",
                        fontSize: isMobile ? "12px" : "15px"
                      }}>Lecture Details</th>
                      <th style={{ 
                        padding: isMobile ? "14px 12px" : "18px 24px", 
                        textAlign: "left", 
                        fontWeight: "700",
                        fontSize: isMobile ? "12px" : "15px",
                        width: "120px"
                      }}>Access</th>
                      <th style={{ 
                        padding: isMobile ? "14px 12px" : "18px 24px", 
                        textAlign: "left", 
                        fontWeight: "700",
                        fontSize: isMobile ? "12px" : "15px",
                        width: "150px"
                      }}>Resource</th>
                      <th style={{ 
                        padding: isMobile ? "14px 12px" : "18px 24px", 
                        textAlign: "center", 
                        fontWeight: "700",
                        fontSize: isMobile ? "12px" : "15px",
                        width: "180px"
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturesBySubcategory[subcategory].length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ 
                          textAlign: "center", 
                          padding: isMobile ? "30px" : "40px", 
                          color: COLORS.darkGray,
                          fontSize: isMobile ? "13px" : "15px"
                        }}>
                          No lectures found
                        </td>
                      </tr>
                    ) : (
                      lecturesBySubcategory[subcategory].map((lec, i) => {
                        const typeColors = getLectureTypeColor(lec.type);
                        
                        return (
                          <tr 
                            key={lec._id} 
                            style={{ 
                              borderBottom: `1px solid ${COLORS.lightGray}`,
                              background: i % 2 === 0 ? COLORS.white : COLORS.bgGray
                            }}
                          >
                            <td style={{ 
                              padding: isMobile ? "14px 12px" : "18px 24px", 
                              color: COLORS.deepPurple, 
                              fontWeight: "600",
                              fontSize: isMobile ? "13px" : "15px"
                            }}>
                              {lec.lectureNumber}
                            </td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                              <div style={{ 
                                fontWeight: "600", 
                                color: COLORS.deepPurple, 
                                marginBottom: "4px",
                                fontSize: isMobile ? "13px" : "15px"
                              }}>
                                {lec.title}
                              </div>
                              <div style={{ 
                                fontSize: isMobile ? "11px" : "13px", 
                                color: COLORS.textGray, 
                                marginBottom: "6px",
                                wordBreak: "break-word" 
                              }}>
                                {lec.description?.substring(0, isMobile ? 50 : 80)}...
                              </div>
                              <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: isMobile ? "6px" : "10px", 
                                flexWrap: "wrap" 
                              }}>
                                <span style={{
                                  background: typeColors.bg,
                                  color: typeColors.text,
                                  padding: "3px 8px",
                                  borderRadius: "4px",
                                  fontSize: isMobile ? "10px" : "11px",
                                  fontWeight: "600",
                                  textTransform: "uppercase"
                                }}>
                                  {lec.type}
                                </span>
                                {lec.duration && (
                                  <span style={{ 
                                    fontSize: isMobile ? "11px" : "12px", 
                                    color: COLORS.darkGray 
                                  }}>
                                    ⏱️ {lec.duration} min
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: lec.isFreePreview ? COLORS.greenLight : "#fee2e2",
                                  color: lec.isFreePreview ? "#065f46" : "#991b1b",
                                  padding: isMobile ? "4px 8px" : "6px 10px",
                                  borderRadius: "6px",
                                  fontSize: isMobile ? "10px" : "12px",
                                  fontWeight: "600",
                                  width: "fit-content"
                                }}>
                                  {lec.isFreePreview ? (
                                    <>
                                      <FaUnlock size={10} /> Free
                                    </>
                                  ) : (
                                    <>
                                      <FaLock size={10} /> Paid
                                    </>
                                  )}
                                </span>
                                {lec.priceRequired > 0 && (
                                  <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "4px",
                                    fontSize: isMobile ? "10px" : "12px",
                                    color: "#92400e"
                                  }}>
                                    <FaRupeeSign size={9} />
                                    <span>₹{lec.priceRequired}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                              {renderFile(lec)}
                            </td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px", textAlign: "center" }}>
                              <div style={{ 
                                display: "flex", 
                                gap: isMobile ? "4px" : "8px", 
                                justifyContent: "center",
                                flexWrap: "wrap" 
                              }}>
                                <button
                                  onClick={() => setSelectedLecture(lec)}
                                  style={{
                                    background: COLORS.brightGreen,
                                    color: COLORS.white,
                                    border: "none",
                                    padding: isMobile ? "6px 8px" : "8px 12px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: isMobile ? "11px" : "13px",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.2s ease"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "#00C9A7"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.brightGreen}
                                  title="View Details"
                                >
                                  <FaEye size={isMobile ? 10 : 12} /> {!isMobile && "View"}
                                </button>
                                <button
                                  onClick={() => openEditForm(lec)}
                                  style={{
                                    background: COLORS.warning,
                                    color: COLORS.white,
                                    border: "none",
                                    padding: isMobile ? "6px 8px" : "8px 12px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: isMobile ? "11px" : "13px",
                                    transition: "all 0.2s ease"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "#D97706"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.warning}
                                  title="Edit Lecture"
                                >
                                  <FaEdit size={isMobile ? 10 : 12} />
                                </button>
                                <button
                                  onClick={() => handleDelete(lec._id)}
                                  style={{
                                    background: COLORS.danger,
                                    color: COLORS.white,
                                    border: "none",
                                    padding: isMobile ? "6px 8px" : "8px 12px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: isMobile ? "11px" : "13px",
                                    transition: "all 0.2s ease"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.danger}
                                  title="Delete Lecture"
                                >
                                  <FaTrash size={isMobile ? 10 : 12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          padding: isMobile ? "16px" : "20px"
        }}>
          <div style={{
            background: COLORS.white,
            padding: isMobile ? "20px" : "30px",
            borderRadius: "12px",
            width: isMobile ? "100%" : "700px",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: `2px solid ${COLORS.lightGray}`
            }}>
              <h3 style={{
                margin: 0,
                color: COLORS.deepPurple,
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "700"
              }}>
                {editingId ? "✏️ Edit Lecture" : "➕ Add New Lecture"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: COLORS.deepPurple,
                  padding: "4px",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.danger}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.deepPurple}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Lecture Title */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.textGray,
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  Lecture Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter lecture title"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.darkGray}`,
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.textGray,
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Enter lecture description"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.darkGray}`,
                    fontSize: "14px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              {/* Subcategory */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.textGray,
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  Subcategory *
                </label>
                
                {course?.subCategories && course.subCategories.length > 0 ? (
                  <>
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${COLORS.darkGray}`,
                        fontSize: "14px",
                        background: COLORS.white,
                        cursor: "pointer",
                        boxSizing: "border-box",
                        outline: "none"
                      }}
                    >
                      <option value="">Select subcategory...</option>
                      {(typeof course.subCategories === 'string' 
                        ? JSON.parse(course.subCategories) 
                        : course.subCategories
                      ).map((subcat, idx) => (
                        <option key={idx} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                    <div style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <FaTag size={10} />
                      Select from course subcategories or type custom below
                    </div>
                  </>
                ) : (
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    required
                    placeholder="Enter subcategory (e.g., Photoshop, React, Python)"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                )}
                
                {/* Custom subcategory input */}
                <input
                  type="text"
                  placeholder="Or enter custom subcategory"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `1px dashed ${COLORS.darkGray}`,
                    fontSize: "13px",
                    marginTop: "8px",
                    background: COLORS.bgGray,
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
                
                {formData.subCategory && (
                  <div style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    background: COLORS.purpleLight,
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: COLORS.deepPurple,
                    fontWeight: "600"
                  }}>
                    <FaTag size={12} />
                    Selected: {formData.subCategory}
                  </div>
                )}
              </div>

              {/* Lecture Number & Duration */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: COLORS.textGray,
                    fontWeight: "600",
                    fontSize: "14px"
                  }}>
                    Lecture Number *
                  </label>
                  <input
                    type="number"
                    name="lectureNumber"
                    value={formData.lectureNumber}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 1"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: COLORS.textGray,
                    fontWeight: "600",
                    fontSize: "14px"
                  }}>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g., 30"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Lecture Type */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.textGray,
                  fontWeight: "600",
                  fontSize: "14px"
                }}>
                  Lecture Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.darkGray}`,
                    fontSize: "14px",
                    background: COLORS.white,
                    cursor: "pointer",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF Document</option>
                  <option value="document">Word Document</option>
                  <option value="excel">Excel File</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="link">External Link</option>
                </select>
              </div>

              {/* Video URL */}
              {(formData.type === "video" || formData.type === "link") && (
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: COLORS.textGray,
                    fontWeight: "600",
                    fontSize: "14px"
                  }}>
                    Video URL {formData.type === "link" && "*"}
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    required={formData.type === "link"}
                    placeholder="https://youtube.com/... or https://vimeo.com/..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
              )}

              {/* File Uploads */}
              <div style={{
                padding: "16px",
                background: COLORS.bgGray,
                borderRadius: "8px",
                border: `1px dashed ${COLORS.darkGray}`
              }}>
                <h4 style={{
                  margin: "0 0 12px 0",
                  color: COLORS.deepPurple,
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  📎 Upload Files (Optional)
                </h4>

                {/* Video File */}
                {formData.type === "video" && (
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: COLORS.textGray,
                      fontWeight: "500"
                    }}>
                      <FaVideo style={{ marginRight: "6px" }} />
                      Video File
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                )}

                {/* PDF File */}
                {formData.type === "pdf" && (
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: COLORS.textGray,
                      fontWeight: "500"
                    }}>
                      <FaFilePdf style={{ marginRight: "6px" }} />
                      PDF File
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                )}

                {/* Document File */}
                {formData.type === "document" && (
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: COLORS.textGray,
                      fontWeight: "500"
                    }}>
                      <FaFileWord style={{ marginRight: "6px" }} />
                      Document File (.doc, .docx)
                    </label>
                    <input
                      type="file"
                      accept=".doc,.docx"
                      onChange={(e) => setDocFile(e.target.files[0])}
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                )}

                {/* Excel File */}
                {formData.type === "excel" && (
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: COLORS.textGray,
                      fontWeight: "500"
                    }}>
                      <FaFileExcel style={{ marginRight: "6px" }} />
                      Excel File (.xls, .xlsx)
                    </label>
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => setExcelFile(e.target.files[0])}
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                )}

                {/* PowerPoint File */}
                {formData.type === "ppt" && (
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "4px",
                      fontSize: "13px",
                      color: COLORS.textGray,
                      fontWeight: "500"
                    }}>
                      <FaFilePowerpoint style={{ marginRight: "6px" }} />
                      PowerPoint File (.ppt, .pptx)
                    </label>
                    <input
                      type="file"
                      accept=".ppt,.pptx"
                      onChange={(e) => setPptFile(e.target.files[0])}
                      style={{ fontSize: "13px" }}
                    />
                  </div>
                )}
              </div>

              {/* Access Control */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px",
                padding: "16px",
                background: COLORS.yellowLight,
                borderRadius: "8px",
                border: `1px solid rgba(166, 138, 70, 0.3)`
              }}>
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: COLORS.textGray
                  }}>
                    <input
                      type="checkbox"
                      name="isFreePreview"
                      checked={formData.isFreePreview}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        accentColor: COLORS.brightGreen
                      }}
                    />
                    {formData.isFreePreview ? (
                      <span style={{ color: "#065f46" }}>
                        <FaUnlock style={{ marginRight: "4px" }} />
                        Free Preview
                      </span>
                    ) : (
                      <span style={{ color: "#92400e" }}>
                        <FaLock style={{ marginRight: "4px" }} />
                        Paid Only
                      </span>
                    )}
                  </label>
                  <div style={{
                    fontSize: "12px",
                    color: COLORS.darkGray,
                    marginTop: "4px",
                    marginLeft: "26px"
                  }}>
                    {formData.isFreePreview 
                      ? "Anyone can view this lecture" 
                      : "Only paid students can view"}
                  </div>
                </div>

                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: COLORS.textGray
                  }}>
                    Price Required (₹)
                  </label>
                  <input
                    type="number"
                    name="priceRequired"
                    value={formData.priceRequired}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.darkGray}`,
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: `2px solid ${COLORS.lightGray}`
              }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: loading ? COLORS.darkGray : COLORS.formButton,
                    color: COLORS.white,
                    border: "none",
                    padding: "14px",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = "#2563EB";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.background = COLORS.formButton;
                  }}
                >
                  {loading ? (
                    <>Processing...</>
                  ) : editingId ? (
                    <>✅ Update Lecture</>
                  ) : (
                    <>➕ Create Lecture</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    background: COLORS.cancelButton,
                    color: COLORS.white,
                    border: "none",
                    padding: "14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "700",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#4B5563"}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.cancelButton}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lectures;