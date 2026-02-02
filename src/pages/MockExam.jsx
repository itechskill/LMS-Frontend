import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllExams, createExam, updateExam, deleteExam } from "../api/api";
import { useNavigate } from "react-router-dom";
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus, 
  FaClock, 
  FaStar, 
  FaGraduationCap,
  FaClipboardList,
  FaTimes,
  FaSearch
} from "react-icons/fa";

// Exact Color Theme from Previous Components
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

const MockExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
  });

  const navigate = useNavigate();

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchExams = async () => {
    try {
      const res = await getAllExams();
      setExams(res.exams || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load exams");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const resetForm = () => {
    setFormData({ 
      title: "", 
      description: "", 
      duration: "", 
      totalMarks: "",
      passingMarks: "" 
    });
    setEditingExam(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      duration: Number(formData.duration),
      totalMarks: Number(formData.totalMarks),
      passingMarks: Number(formData.passingMarks),
    };
    try {
      if (editingExam) await updateExam(editingExam._id, payload);
      else await createExam(payload);
      setFormVisible(false);
      resetForm();
      fetchExams();
      alert(editingExam ? "Exam updated successfully!" : "Exam created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save exam. Check all fields.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this exam? This action cannot be undone.")) {
      try {
        await deleteExam(id);
        fetchExams();
        alert("Exam deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete exam");
      }
    }
  };

  // Filter exams based on search
  const filteredExams = exams.filter(exam => 
    exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total exams
  const totalExams = exams.length;

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
        
        {/* Header Section */}
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
              <h1 style={{ 
                margin: 0, 
                color: COLORS.deepPurple,
                fontSize: isMobile ? "20px" : "28px",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
                📘 Mock Exams Management
              </h1>
              <p style={{ 
                margin: 0, 
                color: COLORS.textGray, 
                fontSize: isMobile ? "12px" : "14px" 
              }}>
                Create and manage mock exams for student assessment
              </p>
            </div>

            {/* Total Exams Card - Top Right */}
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
                <FaClipboardList />
              </div>
              <div>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  margin: 0,
                  marginBottom: "2px"
                }}>
                  Total Exams
                </p>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "700",
                  margin: 0
                }}>
                  {totalExams}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Add Button Row */}
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
                placeholder="Search exams by title or description..."
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

            {/* Add Exam Button */}
            <button
              onClick={() => {
                resetForm();
                setFormVisible(true);
              }}
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
                flex: isMobile ? "0" : "0 0 auto",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}
            >
              <FaPlus /> {isMobile ? "Create Exam" : "Create New Exam"}
            </button>
          </div>

          {/* Exams Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : "repeat(auto-fill, minmax(300px, 1fr))",
            gap: isMobile ? "12px" : "20px"
          }}>
            {filteredExams.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: isMobile ? "40px 20px" : "60px 40px",
                background: COLORS.white,
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                <FaClipboardList style={{
                  fontSize: isMobile ? "48px" : "64px",
                  color: COLORS.darkGray,
                  marginBottom: "16px"
                }} />
                <p style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: COLORS.darkGray,
                  margin: 0,
                  marginBottom: "8px"
                }}>
                  {searchTerm ? "No exams found matching your search" : "No exams created yet"}
                </p>
                {!searchTerm && (
                  <p style={{
                    fontSize: isMobile ? "13px" : "14px",
                    color: COLORS.textGray,
                    margin: 0
                  }}>
                    Create your first mock exam to get started
                  </p>
                )}
              </div>
            ) : (
              filteredExams.map((exam) => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  isMobile={isMobile}
                  onView={() => navigate(`/mock-exams/${exam._id}/questions`)}
                  onEdit={() => {
                    setEditingExam(exam);
                    setFormData({
                      title: exam.title,
                      description: exam.description || "",
                      duration: exam.duration,
                      totalMarks: exam.totalMarks,
                      passingMarks: exam.passingMarks || "",
                    });
                    setFormVisible(true);
                  }}
                  onDelete={() => handleDelete(exam._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {formVisible && (
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
            width: isMobile ? "100%" : "500px",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isMobile ? "16px" : "20px"
            }}>
              <h3 style={{
                margin: 0,
                fontSize: isMobile ? "18px" : "20px",
                color: COLORS.deepPurple
              }}>
                {editingExam ? "✏️ Edit Exam" : "➕ Create New Exam"}
              </h3>
              <button
                onClick={() => {
                  setFormVisible(false);
                  resetForm();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: isMobile ? "18px" : "20px",
                  cursor: "pointer",
                  color: COLORS.darkGray
                }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "14px" : "16px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.deepPurple,
                  fontWeight: "600",
                  fontSize: isMobile ? "13px" : "14px"
                }}>
                  Exam Title *
                </label>
                <input
                  placeholder="Enter exam title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`,
                    fontSize: isMobile ? "13px" : "14px",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.deepPurple,
                  fontWeight: "600",
                  fontSize: isMobile ? "13px" : "14px"
                }}>
                  Description *
                </label>
                <textarea
                  placeholder="Enter exam description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`,
                    fontSize: isMobile ? "13px" : "14px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "14px" : "16px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: COLORS.deepPurple,
                    fontWeight: "600",
                    fontSize: isMobile ? "13px" : "14px"
                  }}>
                    Duration (minutes) *
                  </label>
                  <input
                    placeholder="e.g., 60"
                    required
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`,
                      fontSize: isMobile ? "13px" : "14px",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: COLORS.deepPurple,
                    fontWeight: "600",
                    fontSize: isMobile ? "13px" : "14px"
                  }}>
                    Total Marks *
                  </label>
                  <input
                    placeholder="e.g., 100"
                    required
                    type="number"
                    min="1"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`,
                      fontSize: isMobile ? "13px" : "14px",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.deepPurple,
                  fontWeight: "600",
                  fontSize: isMobile ? "13px" : "14px"
                }}>
                  Passing Marks *
                </label>
                <input
                  placeholder="e.g., 40"
                  required
                  type="number"
                  min="1"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`,
                    fontSize: isMobile ? "13px" : "14px",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
                <div style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: COLORS.darkGray,
                  marginTop: "6px"
                }}>
                  💡 Minimum marks required to pass this exam
                </div>
              </div>

              <div style={{
                display: "flex",
                gap: isMobile ? "8px" : "12px",
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: `1px solid ${COLORS.lightGray}`,
                flexWrap: "wrap"
              }}>
                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.formButton} 0%, ${COLORS.indigo} 100%)`,
                    color: COLORS.white,
                    border: "none",
                    padding: isMobile ? "12px 24px" : "14px 28px",
                    borderRadius: "8px",
                    flex: "1 1 180px",
                    cursor: "pointer",
                    fontSize: isMobile ? "13px" : "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  {editingExam ? "Update Exam" : "Create Exam"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormVisible(false);
                    resetForm();
                  }}
                  style={{
                    background: COLORS.danger,
                    color: COLORS.white,
                    border: "none",
                    padding: isMobile ? "12px 24px" : "14px 28px",
                    borderRadius: "8px",
                    flex: "1 1 180px",
                    cursor: "pointer",
                    fontSize: isMobile ? "13px" : "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Exam Card Component
const ExamCard = ({ exam, isMobile, onView, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: COLORS.white,
        padding: isMobile ? "16px" : "20px",
        borderRadius: "12px",
        boxShadow: isHovered 
          ? "0 8px 20px rgba(0,0,0,0.15)" 
          : "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
        border: `1px solid ${isHovered ? COLORS.deepPurple : COLORS.lightGray}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 style={{
        margin: 0,
        marginBottom: "8px",
        color: COLORS.deepPurple,
        fontSize: isMobile ? "16px" : "18px",
        fontWeight: "700"
      }}>
        {exam.title}
      </h3>
      
      <p style={{
        margin: 0,
        color: COLORS.textGray,
        fontSize: isMobile ? "13px" : "14px",
        lineHeight: "1.5",
        marginBottom: "12px"
      }}>
        {exam.description}
      </p>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "12px",
        paddingTop: "12px",
        borderTop: `1px solid ${COLORS.lightGray}`
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: isMobile ? "12px" : "13px",
          color: COLORS.warning,
          background: COLORS.yellowLight,
          padding: "4px 10px",
          borderRadius: "6px",
          fontWeight: "600"
        }}>
          <FaClock size={isMobile ? 12 : 14} />
          {exam.duration} min
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: isMobile ? "12px" : "13px",
          color: COLORS.indigo,
          background: COLORS.purpleLight,
          padding: "4px 10px",
          borderRadius: "6px",
          fontWeight: "600"
        }}>
          <FaStar size={isMobile ? 12 : 14} />
          {exam.totalMarks} Marks
        </div>

        {exam.passingMarks && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: isMobile ? "12px" : "13px",
            color: COLORS.teal,
            background: COLORS.greenLight,
            padding: "4px 10px",
            borderRadius: "6px",
            fontWeight: "600"
          }}>
            <FaGraduationCap size={isMobile ? 12 : 14} />
            Pass: {exam.passingMarks}
          </div>
        )}
      </div>

      <div style={{
        display: "flex",
        gap: isMobile ? "6px" : "8px",
        paddingTop: "12px",
        borderTop: `1px solid ${COLORS.lightGray}`
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          style={{
            background: COLORS.info,
            color: COLORS.white,
            border: "none",
            padding: isMobile ? "8px 12px" : "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#2563EB"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.info}
        >
          <FaEye size={isMobile ? 12 : 14} />
          {!isMobile && "Questions"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          style={{
            background: COLORS.warning,
            color: COLORS.white,
            border: "none",
            padding: isMobile ? "8px 12px" : "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "12px" : "14px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#D97706"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.warning}
        >
          <FaEdit size={isMobile ? 12 : 14} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            background: COLORS.danger,
            color: COLORS.white,
            border: "none",
            padding: isMobile ? "8px 12px" : "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "12px" : "14px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.danger}
        >
          <FaTrash size={isMobile ? 12 : 14} />
        </button>
      </div>
    </div>
  );
};

export default MockExamsPage;