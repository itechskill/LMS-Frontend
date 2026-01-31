// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { FaEdit, FaTrash, FaPlus, FaEye, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaVideo, FaLink } from "react-icons/fa";
// import { getLecturesByCourse, createLecture, updateLecture, deleteLecture } from "../api/api";
// const BASE_URL = process.env.REACT_APP_API_URL;
// const Lectures = () => {
//   const { courseId } = useParams();

//   const [lectures, setLectures] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLecture, setSelectedLecture] = useState(null);

//   const [videoFile, setVideoFile] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [docFile, setDocFile] = useState(null);
//   const [excelFile, setExcelFile] = useState(null);
//   const [pptFile, setPptFile] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     lectureNumber: "",
//     duration: "",
//     videoUrl: "",
//     type: "video",
//     notes: "",
//   });

//   // ================= FETCH =================
//   const fetchLectures = async () => {
//     try {
//       const data = await getLecturesByCourse(courseId);
//       setLectures(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("FetchLectures Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLectures();
//   }, [courseId]);

//   // ================= FORM HANDLERS =================
//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       lectureNumber: "",
//       duration: "",
//       videoUrl: "",
//       type: "video",
//       notes: "",
//     });
//     setVideoFile(null);
//     setPdfFile(null);
//     setDocFile(null);
//     setExcelFile(null);
//     setPptFile(null);
//   };

//   const openAddForm = () => {
//     setEditingId(null);
//     resetForm();
//     setShowForm(true);
//   };

//   const openEditForm = (lec) => {
//     setEditingId(lec._id);
//     setFormData({
//       title: lec.title || "",
//       description: lec.description || "",
//       lectureNumber: lec.lectureNumber || "",
//       duration: lec.duration || "",
//       videoUrl: lec.videoUrl || "",
//       type: lec.type || "video",
//       notes: lec.notes || "",
//     });
//     setVideoFile(null);
//     setPdfFile(null);
//     setDocFile(null);
//     setExcelFile(null);
//     setPptFile(null);
//     setShowForm(true);
//   };

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const form = new FormData();
//       Object.entries(formData).forEach(([k, v]) => {
//         if (v !== null && v !== undefined) form.append(k, v);
//       });
//       form.append("course", courseId);

//       if (videoFile) form.append("video", videoFile);
//       if (pdfFile) form.append("pdf", pdfFile);
//       if (docFile) form.append("document", docFile);
//       if (excelFile) form.append("excel", excelFile);
//       if (pptFile) form.append("ppt", pptFile);

//       let response;
//       if (editingId) {
//         response = await updateLecture(editingId, form);
//         setLectures((prev) =>
//           prev.map((l) => (l._id === editingId ? response.lecture : l))
//         );
//       } else {
//         response = await createLecture(form);
//         setLectures((prev) => [...prev, response.lecture]);
//       }

//       resetForm();
//       setShowForm(false);
//     } catch (err) {
//       console.error("Lecture Submit Error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete lecture?")) return;
//     try {
//       await deleteLecture(id);
//       fetchLectures();
//     } catch (err) {
//       console.error("DeleteLecture Error:", err);
//       alert("Failed to delete lecture.");
//     }
//   };

//   const filteredLectures = lectures.filter(
//     (lec) =>
//       lec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lec.lectureNumber.toString().includes(searchTerm)
//   );

//   // const renderFile = (lec) => {
//   //   // const base = "/api";
//   //   const base = "http://localhost:5000/";
//   //   if (lec.videoPath) return <video width="120" controls src={base + lec.videoPath} />;
//   //   if (lec.videoUrl) return <a href={lec.videoUrl} target="_blank" rel="noreferrer"><FaLink /> Watch</a>;
//   //   if (lec.pdfPath) return <a href={base + lec.pdfPath} target="_blank" rel="noreferrer"><FaFilePdf /> PDF</a>;
//   //   if (lec.documentPath) return <a href={base + lec.documentPath} target="_blank" rel="noreferrer"><FaFileWord /> Doc</a>;
//   //   if (lec.excelPath) return <a href={base + lec.excelPath} target="_blank" rel="noreferrer"><FaFileExcel /> Excel</a>;
//   //   if (lec.pptPath) return <a href={base + lec.pptPath} target="_blank" rel="noreferrer"><FaFilePowerpoint /> PPT</a>;
//   //   return "—";
//   // };
// const renderFile = (lec) => {
//   if (lec.videoPath)
//     return (
//       <video
//         width="120"
//         controls
//         src={`${BASE_URL}/${lec.videoPath}`}
//       />
//     );

//   if (lec.videoUrl)
//     return (
//       <a href={lec.videoUrl} target="_blank" rel="noreferrer">
//         <FaLink /> Watch
//       </a>
//     );

//   if (lec.pdfPath)
//     return (
//       <a href={`${BASE_URL}/${lec.pdfPath}`} target="_blank" rel="noreferrer">
//         <FaFilePdf /> PDF
//       </a>
//     );

//   if (lec.documentPath)
//     return (
//       <a href={`${BASE_URL}/${lec.documentPath}`} target="_blank" rel="noreferrer">
//         <FaFileWord /> Doc
//       </a>
//     );

//   if (lec.excelPath)
//     return (
//       <a href={`${BASE_URL}/${lec.excelPath}`} target="_blank" rel="noreferrer">
//         <FaFileExcel /> Excel
//       </a>
//     );

//   if (lec.pptPath)
//     return (
//       <a href={`${BASE_URL}/${lec.pptPath}`} target="_blank" rel="noreferrer">
//         <FaFilePowerpoint /> PPT
//       </a>
//     );

//   return "—";
// };

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ marginLeft: "250px", padding: "24px", background: "#f3f4f6", minHeight: "100vh", flex: 1 }}>
//         <h2>📚 Lectures Management</h2>

//         {/* SEARCH + ADD */}
//         <div style={{ display: "flex", margin: "20px 0" }}>
//           <input
//             placeholder="Search lecture..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={searchStyle}
//           />
//           <button style={addBtn} onClick={openAddForm}>
//             + Add Lecture
//           </button>
//         </div>

//         {/* TABLE */}
//         <table style={tableStyle}>
//           <thead style={{ background: "#fafafa" }}>
//             <tr>
//               <th>#</th>
//               <th>Title</th>
//               <th>No</th>
//               <th>Type</th>
//               <th>Resource</th>
//               <th>Show</th>
//               <th>Edit</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredLectures.map((lec, i) => (
//               <tr key={lec._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                 <td>{i + 1}</td>
//                 <td>{lec.title}</td>
//                 <td>{lec.lectureNumber}</td>
//                 <td>{lec.type}</td>
//                 <td>{renderFile(lec)}</td>
//                 <td>
//                   <button style={viewBtn} onClick={() => setSelectedLecture(lec)}><FaEye /></button>
//                 </td>
//                 <td>
//                   <button style={editBtn} onClick={() => openEditForm(lec)}><FaEdit /></button>
//                 </td>
//                 <td>
//                   <button style={deleteBtn} onClick={() => handleDelete(lec._id)}><FaTrash /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* SHOW DETAILS MODAL */}
//         {selectedLecture && (
//           <div style={overlay}>
//             <div style={modalLarge}>
//               <h3>👁 Lecture Details</h3>
//               <p><b>Title:</b> {selectedLecture.title}</p>
//               <p><b>Description:</b> {selectedLecture.description}</p>
//               <p><b>Lecture No.:</b> {selectedLecture.lectureNumber}</p>
//               <p><b>Type:</b> {selectedLecture.type}</p>
//               <p><b>Notes:</b> {selectedLecture.notes}</p>
//               <p><b>Resource:</b> {renderFile(selectedLecture)}</p>
//               <button onClick={() => setSelectedLecture(null)} style={closeBtn}>Close</button>
//             </div>
//           </div>
//         )}

//         {/* ADD / EDIT FORM */}
//         {showForm && (
//           <div style={overlay}>
//             <div style={modalLarge}>
//               <h3>{editingId ? "Edit Lecture" : "Add Lecture"}</h3>
//               <form onSubmit={handleSubmit} style={formStyle}>
                
//                 <label>Title</label>
//                 <input style={inputStyle} placeholder="Title" name="title" value={formData.title} onChange={handleChange} required />

//                 <label>Description</label>
//                 <textarea style={inputStyle} placeholder="Description" name="description" value={formData.description} onChange={handleChange} />

//                 <label>Lecture Number</label>
//                 <input style={inputStyle} placeholder="Lecture Number" type="number" name="lectureNumber" value={formData.lectureNumber} onChange={handleChange} required />
// {/* 
//                 <label>Duration (minutes)</label>
//                 <input style={inputStyle} placeholder="Duration (minutes)" name="duration" value={formData.duration} onChange={handleChange} />

//                 <label>Notes</label>
//                 <textarea style={inputStyle} placeholder="Notes" name="notes" value={formData.notes} onChange={handleChange} /> */}

//                 <label>Type</label>
//                 <select style={inputStyle} name="type" value={formData.type} onChange={handleChange}>
//                   <option value="video">Video</option>
//                   <option value="pdf">PDF</option>
//                   <option value="document">Document</option>
//                   <option value="excel">Excel</option>
//                   <option value="ppt">PPT</option>
//                   <option value="link">Video Link</option>
//                 </select>

//                 {formData.type === "video" && (
//                   <>
//                     <label>Upload Video</label>
//                     <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} />
//                   </>
//                 )}
//                 {formData.type === "pdf" && (
//                   <>
//                     <label>Upload PDF</label>
//                     <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
//                   </>
//                 )}
//                 {formData.type === "document" && (
//                   <>
//                     <label>Upload Document</label>
//                     <input type="file" onChange={e => setDocFile(e.target.files[0])} />
//                   </>
//                 )}
//                 {formData.type === "excel" && (
//                   <>
//                     <label>Upload Excel</label>
//                     <input type="file" onChange={e => setExcelFile(e.target.files[0])} />
//                   </>
//                 )}
//                 {formData.type === "ppt" && (
//                   <>
//                     <label>Upload PPT</label>
//                     <input type="file" onChange={e => setPptFile(e.target.files[0])} />
//                   </>
//                 )}
//                 {formData.type === "link" && (
//                   <>
//                     <label>Video URL</label>
//                     <input type="text" placeholder="Video URL" name="videoUrl" value={formData.videoUrl} onChange={handleChange} />
//                   </>
//                 )}

//                 <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
//                   <button type="submit" style={saveBtn}>{editingId ? "Update Lecture" : "Add Lecture"}</button>
//                   <button type="button" onClick={() => setShowForm(false)} style={cancelBtn}>Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// /* ================= STYLES ================= */
// const inputStyle = { padding: "8px", borderRadius: "6px", border: "1px solid #ccc" };
// const searchStyle = { flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db" };
// const tableStyle = { width: "100%", background: "#fff", borderRadius: "12px", borderCollapse: "collapse" };
// const addBtn = { marginLeft: "10px", background: "#f97316", color: "#fff", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" };
// const editBtn = { background: "#fde047", borderRadius: "6px", padding: "6px" };
// const deleteBtn = { background: "#ef4444", color: "#fff", borderRadius: "6px", padding: "6px" };
// const viewBtn = { background: "#10b981", color: "#fff", borderRadius: "6px", padding: "6px" };
// const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50 };
// const modalLarge = { background: "#fff", padding: "30px", borderRadius: "12px", width: "500px", maxHeight: "90vh", overflowY: "auto" };
// const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
// const saveBtn = { flex: 1, background: "#3b82f6", color: "#fff", padding: "10px", borderRadius: "6px", border: "none" };
// const cancelBtn = { flex: 1, background: "#ef4444", color: "#fff", padding: "10px", borderRadius: "6px", border: "none" };
// const closeBtn = { marginTop: "10px", background: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: "6px", border: "none" };

// export default Lectures;











// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { 
//   FaEdit, 
//   FaTrash, 
//   FaPlus, 
//   FaEye, 
//   FaFilePdf, 
//   FaFileWord, 
//   FaFileExcel, 
//   FaFilePowerpoint, 
//   FaVideo, 
//   FaLink,
//   FaLock,
//   FaUnlock 
// } from "react-icons/fa";
// import { getLecturesByCourse, createLecture, updateLecture, deleteLecture } from "../api/api";

// const BASE_URL = process.env.REACT_APP_API_URL;

// const Lectures = () => {
//   const { courseId } = useParams();

//   const [lectures, setLectures] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLecture, setSelectedLecture] = useState(null);

//   const [videoFile, setVideoFile] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [docFile, setDocFile] = useState(null);
//   const [excelFile, setExcelFile] = useState(null);
//   const [pptFile, setPptFile] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     lectureNumber: "",
//     duration: "",
//     videoUrl: "",
//     type: "video",
//     notes: "",
//     isFreePreview: false,  // ✅ NEW: Free preview flag
//     priceRequired: 0,      // ✅ NEW: Individual lecture price (optional)
//     subCategory: "",       // ✅ NEW: Subcategory for lecture
//   });

//   // ================= FETCH =================
//   const fetchLectures = async () => {
//     try {
//       // ✅ Admin doesn't need studentId - they see all lectures
//       const data = await getLecturesByCourse(courseId);
      
//       // Handle different response formats
//       if (Array.isArray(data)) {
//         setLectures(data);
//       } else if (data?.lectures && Array.isArray(data.lectures)) {
//         setLectures(data.lectures);
//       } else {
//         setLectures([]);
//       }
//     } catch (err) {
//       console.error("FetchLectures Error:", err);
//       setLectures([]);
//     }
//   };

//   useEffect(() => {
//     fetchLectures();
//   }, [courseId]);

//   // ================= FORM HANDLERS =================
//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       lectureNumber: "",
//       duration: "",
//       videoUrl: "",
//       type: "video",
//       notes: "",
//       isFreePreview: false,
//       priceRequired: 0,
//       subCategory: "",
//     });
//     setVideoFile(null);
//     setPdfFile(null);
//     setDocFile(null);
//     setExcelFile(null);
//     setPptFile(null);
//   };

//   const openAddForm = () => {
//     setEditingId(null);
//     resetForm();
//     setShowForm(true);
//   };

//   const openEditForm = (lec) => {
//     setEditingId(lec._id);
//     setFormData({
//       title: lec.title || "",
//       description: lec.description || "",
//       lectureNumber: lec.lectureNumber || "",
//       duration: lec.duration || "",
//       videoUrl: lec.videoUrl || "",
//       type: lec.type || "video",
//       notes: lec.notes || "",
//       isFreePreview: lec.isFreePreview || false,
//       priceRequired: lec.priceRequired || 0,
//       subCategory: lec.subCategory || "",
//     });
//     setVideoFile(null);
//     setPdfFile(null);
//     setDocFile(null);
//     setExcelFile(null);
//     setPptFile(null);
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ 
//       ...formData, 
//       [name]: type === "checkbox" ? checked : value 
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const form = new FormData();
      
//       // ✅ Append all form data including new fields
//       Object.entries(formData).forEach(([k, v]) => {
//         if (v !== null && v !== undefined) {
//           form.append(k, v);
//         }
//       });
      
//       form.append("course", courseId);

//       // ✅ Append files
//       if (videoFile) form.append("video", videoFile);
//       if (pdfFile) form.append("pdf", pdfFile);
//       if (docFile) form.append("document", docFile);
//       if (excelFile) form.append("excel", excelFile);
//       if (pptFile) form.append("ppt", pptFile);

//       let response;
//       if (editingId) {
//         response = await updateLecture(editingId, form);
//       } else {
//         response = await createLecture(form);
//       }

//       // ✅ Refresh lecture list
//       await fetchLectures();
      
//       resetForm();
//       setShowForm(false);
//       alert(editingId ? "Lecture updated successfully!" : "Lecture added successfully!");
//     } catch (err) {
//       console.error("Lecture Submit Error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete lecture?")) return;
//     try {
//       await deleteLecture(id);
//       fetchLectures();
//       alert("Lecture deleted successfully!");
//     } catch (err) {
//       console.error("DeleteLecture Error:", err);
//       alert("Failed to delete lecture.");
//     }
//   };

//   const filteredLectures = lectures.filter(
//     (lec) =>
//       lec.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lec.lectureNumber?.toString().includes(searchTerm)
//   );

//   const renderFile = (lec) => {
//     if (lec.videoPath)
//       return (
//         <video
//           width="120"
//           controls
//           src={`${BASE_URL}/${lec.videoPath}`}
//         />
//       );

//     if (lec.videoUrl)
//       return (
//         <a href={lec.videoUrl} target="_blank" rel="noreferrer">
//           <FaLink /> Watch
//         </a>
//       );

//     if (lec.pdfPath)
//       return (
//         <a href={`${BASE_URL}/${lec.pdfPath}`} target="_blank" rel="noreferrer">
//           <FaFilePdf /> PDF
//         </a>
//       );

//     if (lec.documentPath)
//       return (
//         <a href={`${BASE_URL}/${lec.documentPath}`} target="_blank" rel="noreferrer">
//           <FaFileWord /> Doc
//         </a>
//       );

//     if (lec.excelPath)
//       return (
//         <a href={`${BASE_URL}/${lec.excelPath}`} target="_blank" rel="noreferrer">
//           <FaFileExcel /> Excel
//         </a>
//       );

//     if (lec.pptPath)
//       return (
//         <a href={`${BASE_URL}/${lec.pptPath}`} target="_blank" rel="noreferrer">
//           <FaFilePowerpoint /> PPT
//         </a>
//       );

//     return "—";
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ marginLeft: "250px", padding: "24px", background: "#f3f4f6", minHeight: "100vh", flex: 1 }}>
//         <h2>📚 Lectures Management</h2>

//         {/* SEARCH + ADD */}
//         <div style={{ display: "flex", margin: "20px 0" }}>
//           <input
//             placeholder="Search lecture..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={searchStyle}
//           />
//           <button style={addBtn} onClick={openAddForm}>
//             + Add Lecture
//           </button>
//         </div>

//         {/* TABLE */}
//         <div style={{ overflowX: "auto" }}>
//           <table style={tableStyle}>
//             <thead style={{ background: "#fafafa" }}>
//               <tr>
//                 <th style={{ padding: "12px", textAlign: "left" }}>#</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>No</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Access</th>
//                 <th style={{ padding: "12px", textAlign: "left" }}>Resource</th>
//                 <th style={{ padding: "12px", textAlign: "center" }}>Show</th>
//                 <th style={{ padding: "12px", textAlign: "center" }}>Edit</th>
//                 <th style={{ padding: "12px", textAlign: "center" }}>Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredLectures.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
//                     No lectures found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLectures.map((lec, i) => (
//                   <tr key={lec._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                     <td style={{ padding: "12px" }}>{i + 1}</td>
//                     <td style={{ padding: "12px" }}>{lec.title}</td>
//                     <td style={{ padding: "12px" }}>{lec.lectureNumber}</td>
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         background: "#e0e7ff",
//                         color: "#4338ca",
//                         padding: "4px 8px",
//                         borderRadius: "6px",
//                         fontSize: "12px",
//                         fontWeight: "500"
//                       }}>
//                         {lec.type}
//                       </span>
//                     </td>
//                     {/* ✅ NEW: Access Type Column */}
//                     <td style={{ padding: "12px" }}>
//                       <span style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: "4px",
//                         background: lec.isFreePreview ? "#d1fae5" : "#fee2e2",
//                         color: lec.isFreePreview ? "#065f46" : "#991b1b",
//                         padding: "4px 8px",
//                         borderRadius: "6px",
//                         fontSize: "11px",
//                         fontWeight: "600"
//                       }}>
//                         {lec.isFreePreview ? (
//                           <>
//                             <FaUnlock size={10} /> Free Preview
//                           </>
//                         ) : (
//                           <>
//                             <FaLock size={10} /> Paid Only
//                           </>
//                         )}
//                       </span>
//                     </td>
//                     <td style={{ padding: "12px" }}>{renderFile(lec)}</td>
//                     <td style={{ padding: "12px", textAlign: "center" }}>
//                       <button style={viewBtn} onClick={() => setSelectedLecture(lec)}>
//                         <FaEye />
//                       </button>
//                     </td>
//                     <td style={{ padding: "12px", textAlign: "center" }}>
//                       <button style={editBtn} onClick={() => openEditForm(lec)}>
//                         <FaEdit />
//                       </button>
//                     </td>
//                     <td style={{ padding: "12px", textAlign: "center" }}>
//                       <button style={deleteBtn} onClick={() => handleDelete(lec._id)}>
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* SHOW DETAILS MODAL */}
//         {selectedLecture && (
//           <div style={overlay}>
//             <div style={modalLarge}>
//               <h3>👁 Lecture Details</h3>
//               <p><b>Title:</b> {selectedLecture.title}</p>
//               <p><b>Description:</b> {selectedLecture.description}</p>
//               <p><b>Lecture No.:</b> {selectedLecture.lectureNumber}</p>
//               <p><b>Type:</b> {selectedLecture.type}</p>
//               <p><b>Duration:</b> {selectedLecture.duration || 0} minutes</p>
//               <p><b>Notes:</b> {selectedLecture.notes || "—"}</p>
//               <p><b>Subcategory:</b> {selectedLecture.subCategory || "—"}</p>
//               <p>
//                 <b>Access Type:</b>{" "}
//                 <span style={{
//                   color: selectedLecture.isFreePreview ? "#065f46" : "#991b1b",
//                   fontWeight: "600"
//                 }}>
//                   {selectedLecture.isFreePreview ? "🔓 Free Preview" : "🔒 Paid Only"}
//                 </span>
//               </p>
//               {selectedLecture.priceRequired > 0 && (
//                 <p><b>Individual Price:</b> ${selectedLecture.priceRequired}</p>
//               )}
//               <p><b>Resource:</b> {renderFile(selectedLecture)}</p>
//               <button onClick={() => setSelectedLecture(null)} style={closeBtn}>Close</button>
//             </div>
//           </div>
//         )}

//         {/* ADD / EDIT FORM */}
//         {showForm && (
//           <div style={overlay}>
//             <div style={modalLarge}>
//               <h3>{editingId ? "Edit Lecture" : "Add Lecture"}</h3>
//               <form onSubmit={handleSubmit} style={formStyle}>
                
//                 <label>Title *</label>
//                 <input 
//                   style={inputStyle} 
//                   placeholder="Lecture title" 
//                   name="title" 
//                   value={formData.title} 
//                   onChange={handleChange} 
//                   required 
//                 />

//                 <label>Description *</label>
//                 <textarea 
//                   style={inputStyle} 
//                   placeholder="Lecture description" 
//                   name="description" 
//                   value={formData.description} 
//                   onChange={handleChange}
//                   required
//                   rows={3}
//                 />

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                   <div>
//                     <label>Lecture Number *</label>
//                     <input 
//                       style={inputStyle} 
//                       placeholder="Lecture #" 
//                       type="number" 
//                       name="lectureNumber" 
//                       value={formData.lectureNumber} 
//                       onChange={handleChange} 
//                       required 
//                     />
//                   </div>

//                   <div>
//                     <label>Duration (minutes)</label>
//                     <input 
//                       style={inputStyle} 
//                       placeholder="Duration" 
//                       type="number"
//                       name="duration" 
//                       value={formData.duration} 
//                       onChange={handleChange} 
//                     />
//                   </div>
//                 </div>

//                 <label>Subcategory (Optional)</label>
//                 <input 
//                   style={inputStyle} 
//                   placeholder="e.g., React Basics, Python Loops" 
//                   name="subCategory" 
//                   value={formData.subCategory} 
//                   onChange={handleChange} 
//                 />

//                 {/* ✅ NEW: Free Preview Checkbox */}
//                 <div style={{ 
//                   display: "flex", 
//                   alignItems: "center", 
//                   gap: "8px",
//                   padding: "12px",
//                   background: "#f3f4f6",
//                   borderRadius: "8px"
//                 }}>
//                   <input 
//                     type="checkbox"
//                     name="isFreePreview"
//                     checked={formData.isFreePreview}
//                     onChange={handleChange}
//                     style={{ width: "18px", height: "18px", cursor: "pointer" }}
//                   />
//                   <label style={{ margin: 0, cursor: "pointer", fontWeight: "600" }}>
//                     🔓 Make this a Free Preview Lecture
//                     <span style={{ 
//                       fontSize: "12px", 
//                       color: "#6b7280", 
//                       fontWeight: "400",
//                       display: "block",
//                       marginTop: "4px"
//                     }}>
//                       Free preview lectures are visible to all users, even without payment
//                     </span>
//                   </label>
//                 </div>

//                 {/* ✅ NEW: Individual Lecture Price (Optional) */}
//                 <div>
//                   <label>Individual Lecture Price (Optional)</label>
//                   <input 
//                     style={inputStyle} 
//                     placeholder="0 for free, or enter amount" 
//                     type="number"
//                     step="0.01"
//                     name="priceRequired" 
//                     value={formData.priceRequired} 
//                     onChange={handleChange}
//                     min="0"
//                   />
//                   <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px", display: "block" }}>
//                     Leave at 0 to use course-level pricing
//                   </span>
//                 </div>

//                 <label>Content Type *</label>
//                 <select style={inputStyle} name="type" value={formData.type} onChange={handleChange}>
//                   <option value="video">Video</option>
//                   <option value="pdf">PDF</option>
//                   <option value="document">Document</option>
//                   <option value="excel">Excel</option>
//                   <option value="ppt">PPT</option>
//                   <option value="link">Video Link</option>
//                 </select>

//                 {formData.type === "video" && (
//                   <>
//                     <label>Upload Video</label>
//                     <input 
//                       type="file" 
//                       accept="video/*" 
//                       onChange={e => setVideoFile(e.target.files[0])} 
//                       style={{ padding: "8px" }}
//                     />
//                   </>
//                 )}
//                 {formData.type === "pdf" && (
//                   <>
//                     <label>Upload PDF</label>
//                     <input 
//                       type="file" 
//                       accept="application/pdf" 
//                       onChange={e => setPdfFile(e.target.files[0])}
//                       style={{ padding: "8px" }}
//                     />
//                   </>
//                 )}
//                 {formData.type === "document" && (
//                   <>
//                     <label>Upload Document</label>
//                     <input 
//                       type="file" 
//                       onChange={e => setDocFile(e.target.files[0])}
//                       style={{ padding: "8px" }}
//                     />
//                   </>
//                 )}
//                 {formData.type === "excel" && (
//                   <>
//                     <label>Upload Excel</label>
//                     <input 
//                       type="file" 
//                       onChange={e => setExcelFile(e.target.files[0])}
//                       style={{ padding: "8px" }}
//                     />
//                   </>
//                 )}
//                 {formData.type === "ppt" && (
//                   <>
//                     <label>Upload PPT</label>
//                     <input 
//                       type="file" 
//                       onChange={e => setPptFile(e.target.files[0])}
//                       style={{ padding: "8px" }}
//                     />
//                   </>
//                 )}
//                 {formData.type === "link" && (
//                   <>
//                     <label>Video URL</label>
//                     <input 
//                       type="url" 
//                       placeholder="https://youtube.com/watch?v=..." 
//                       name="videoUrl" 
//                       value={formData.videoUrl} 
//                       onChange={handleChange}
//                       style={inputStyle}
//                     />
//                   </>
//                 )}

//                 <label>Notes (Optional)</label>
//                 <textarea 
//                   style={inputStyle} 
//                   placeholder="Additional notes for this lecture" 
//                   name="notes" 
//                   value={formData.notes} 
//                   onChange={handleChange}
//                   rows={3}
//                 />

//                 <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
//                   <button 
//                     type="submit" 
//                     style={saveBtn}
//                     disabled={loading}
//                   >
//                     {loading ? "Saving..." : (editingId ? "Update Lecture" : "Add Lecture")}
//                   </button>
//                   <button 
//                     type="button" 
//                     onClick={() => setShowForm(false)} 
//                     style={cancelBtn}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// /* ================= STYLES ================= */
// const inputStyle = { 
//   padding: "8px", 
//   borderRadius: "6px", 
//   border: "1px solid #ccc",
//   width: "100%"
// };
// const searchStyle = { 
//   flex: 1, 
//   padding: "8px 12px", 
//   borderRadius: "8px", 
//   border: "1px solid #d1d5db" 
// };
// const tableStyle = { 
//   width: "100%", 
//   background: "#fff", 
//   borderRadius: "12px", 
//   borderCollapse: "collapse" 
// };
// const addBtn = { 
//   marginLeft: "10px", 
//   background: "#f97316", 
//   color: "#fff", 
//   padding: "8px 16px", 
//   borderRadius: "8px", 
//   border: "none", 
//   cursor: "pointer" 
// };
// const editBtn = { 
//   background: "#fde047", 
//   borderRadius: "6px", 
//   padding: "6px 10px",
//   border: "none",
//   cursor: "pointer"
// };
// const deleteBtn = { 
//   background: "#ef4444", 
//   color: "#fff", 
//   borderRadius: "6px", 
//   padding: "6px 10px",
//   border: "none",
//   cursor: "pointer"
// };
// const viewBtn = { 
//   background: "#10b981", 
//   color: "#fff", 
//   borderRadius: "6px", 
//   padding: "6px 10px",
//   border: "none",
//   cursor: "pointer"
// };
// const overlay = { 
//   position: "fixed", 
//   inset: 0, 
//   background: "rgba(0,0,0,0.5)", 
//   display: "flex", 
//   justifyContent: "center", 
//   alignItems: "center", 
//   zIndex: 50 
// };
// const modalLarge = { 
//   background: "#fff", 
//   padding: "30px", 
//   borderRadius: "12px", 
//   width: "600px", 
//   maxHeight: "90vh", 
//   overflowY: "auto" 
// };
// const formStyle = { 
//   display: "flex", 
//   flexDirection: "column", 
//   gap: "12px" 
// };
// const saveBtn = { 
//   flex: 1, 
//   background: "#3b82f6", 
//   color: "#fff", 
//   padding: "10px", 
//   borderRadius: "6px", 
//   border: "none",
//   cursor: "pointer"
// };
// const cancelBtn = { 
//   flex: 1, 
//   background: "#ef4444", 
//   color: "#fff", 
//   padding: "10px", 
//   borderRadius: "6px", 
//   border: "none",
//   cursor: "pointer"
// };
// const closeBtn = { 
//   marginTop: "10px", 
//   background: "#ef4444", 
//   color: "#fff", 
//   padding: "8px 16px", 
//   borderRadius: "6px", 
//   border: "none",
//   cursor: "pointer"
// };

// export default Lectures;







// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { 
//   FaEdit, 
//   FaTrash, 
//   FaPlus, 
//   FaEye, 
//   FaFilePdf, 
//   FaFileWord, 
//   FaFileExcel, 
//   FaFilePowerpoint, 
//   FaVideo, 
//   FaLink,
//   FaLock,
//   FaUnlock,
//   FaRupeeSign,
//   FaUsers,
//   FaChartLine,
//   FaFilter,
//   FaSort,
//   FaArrowLeft,
//   FaDownload,
//   FaPlay,
//   FaBook
// } from "react-icons/fa";
// import { 
//   getLecturesByCourse, 
//   createLecture, 
//   updateLecture, 
//   deleteLecture,
//   getCourseById 
// } from "../api/api";

// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const Lectures = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [lectures, setLectures] = useState([]);
//   const [course, setCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const [sortBy, setSortBy] = useState("lectureNumber");
//   const [filterAccess, setFilterAccess] = useState("all"); // all, free, paid
//   const [stats, setStats] = useState({
//     totalLectures: 0,
//     freeLectures: 0,
//     paidLectures: 0,
//     totalDuration: 0
//   });

//   const [videoFile, setVideoFile] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [docFile, setDocFile] = useState(null);
//   const [excelFile, setExcelFile] = useState(null);
//   const [pptFile, setPptFile] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     lectureNumber: "",
//     duration: "",
//     videoUrl: "",
//     type: "video",
//     notes: "",
//     isFreePreview: false,
//     priceRequired: 0,
//     subCategory: "",
//   });

//   // ================= FETCH DATA =================
//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch course details
//       try {
//         const courseData = await getCourseById(courseId);
//         setCourse(courseData);
//       } catch (err) {
//         console.error("Error fetching course:", err);
//       }
      
//       // Fetch lectures
//       const data = await getLecturesByCourse(courseId);
      
//       let lecturesArray = [];
//       if (Array.isArray(data)) {
//         lecturesArray = data;
//       } else if (data?.lectures && Array.isArray(data.lectures)) {
//         lecturesArray = data.lectures;
//       }
      
//       setLectures(lecturesArray);
      
//       // Calculate statistics
//       calculateStats(lecturesArray);
      
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       alert("Failed to load lectures");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (lecturesArray) => {
//     const totalLectures = lecturesArray.length;
//     const freeLectures = lecturesArray.filter(l => l.isFreePreview).length;
//     const paidLectures = totalLectures - freeLectures;
//     const totalDuration = lecturesArray.reduce((sum, l) => sum + (parseInt(l.duration) || 0), 0);
    
//     setStats({
//       totalLectures,
//       freeLectures,
//       paidLectures,
//       totalDuration
//     });
//   };

//   useEffect(() => {
//     fetchData();
//   }, [courseId]);

//   // ================= FORM HANDLERS =================
//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       lectureNumber: "",
//       duration: "",
//       videoUrl: "",
//       type: "video",
//       notes: "",
//       isFreePreview: false,
//       priceRequired: 0,
//       subCategory: "",
//     });
//     setVideoFile(null);
//     setPdfFile(null);
//     setDocFile(null);
//     setExcelFile(null);
//     setPptFile(null);
//   };

//   const openAddForm = () => {
//     setEditingId(null);
//     resetForm();
    
//     // Set next lecture number
//     const nextNumber = lectures.length > 0 
//       ? Math.max(...lectures.map(l => parseInt(l.lectureNumber) || 0)) + 1 
//       : 1;
    
//     setFormData(prev => ({
//       ...prev,
//       lectureNumber: nextNumber
//     }));
    
//     setShowForm(true);
//   };

//   const openEditForm = (lec) => {
//     setEditingId(lec._id);
//     setFormData({
//       title: lec.title || "",
//       description: lec.description || "",
//       lectureNumber: lec.lectureNumber || "",
//       duration: lec.duration || "",
//       videoUrl: lec.videoUrl || "",
//       type: lec.type || "video",
//       notes: lec.notes || "",
//       isFreePreview: lec.isFreePreview || false,
//       priceRequired: lec.priceRequired || 0,
//       subCategory: lec.subCategory || "",
//     });
//     setVideoFile(null);
//     setPdfFile(null);
//     setDocFile(null);
//     setExcelFile(null);
//     setPptFile(null);
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ 
//       ...formData, 
//       [name]: type === "checkbox" ? checked : value 
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const form = new FormData();
      
//       // Append all form data
//       Object.entries(formData).forEach(([k, v]) => {
//         if (v !== null && v !== undefined) {
//           form.append(k, v);
//         }
//       });
      
//       form.append("course", courseId);

//       // Append files
//       if (videoFile) form.append("video", videoFile);
//       if (pdfFile) form.append("pdf", pdfFile);
//       if (docFile) form.append("document", docFile);
//       if (excelFile) form.append("excel", excelFile);
//       if (pptFile) form.append("ppt", pptFile);

//       let response;
//       if (editingId) {
//         response = await updateLecture(editingId, form);
//       } else {
//         response = await createLecture(form);
//       }

//       // Refresh lecture list
//       await fetchData();
      
//       resetForm();
//       setShowForm(false);
//       alert(editingId ? "Lecture updated successfully!" : "Lecture added successfully!");
//     } catch (err) {
//       console.error("Lecture Submit Error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this lecture? This action cannot be undone.")) return;
//     try {
//       await deleteLecture(id);
//       await fetchData();
//       alert("Lecture deleted successfully!");
//     } catch (err) {
//       console.error("DeleteLecture Error:", err);
//       alert("Failed to delete lecture.");
//     }
//   };

//   // ================= FILTER AND SORT =================
//   const filteredAndSortedLectures = lectures
//     .filter(lec => {
//       // Search filter
//       const matchesSearch = 
//         lec.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lec.lectureNumber?.toString().includes(searchTerm) ||
//         lec.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());
      
//       // Access filter
//       const matchesAccess = 
//         filterAccess === "all" ||
//         (filterAccess === "free" && lec.isFreePreview) ||
//         (filterAccess === "paid" && !lec.isFreePreview);
      
//       return matchesSearch && matchesAccess;
//     })
//     .sort((a, b) => {
//       if (sortBy === "lectureNumber") {
//         return (parseInt(a.lectureNumber) || 0) - (parseInt(b.lectureNumber) || 0);
//       } else if (sortBy === "title") {
//         return (a.title || "").localeCompare(b.title || "");
//       } else if (sortBy === "duration") {
//         return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
//       }
//       return 0;
//     });

//   // ================= RENDER FUNCTIONS =================
//   const renderFile = (lec) => {
//     if (lec.videoPath) {
//       return (
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaPlay style={{ color: "#ef4444" }} />
//           <a 
//             href={`${BASE_URL}/${lec.videoPath}`} 
//             target="_blank" 
//             rel="noreferrer"
//             style={{ color: "#3b82f6", textDecoration: "none" }}
//           >
//             Play Video
//           </a>
//         </div>
//       );
//     }

//     if (lec.videoUrl) {
//       return (
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaLink style={{ color: "#3b82f6" }} />
//           <a href={lec.videoUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>
//             Watch
//           </a>
//         </div>
//       );
//     }

//     if (lec.pdfPath) {
//       return (
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaFilePdf style={{ color: "#ef4444" }} />
//           <a 
//             href={`${BASE_URL}/${lec.pdfPath}`} 
//             target="_blank" 
//             rel="noreferrer"
//             style={{ color: "#3b82f6", textDecoration: "none" }}
//             download
//           >
//             PDF <FaDownload size={10} />
//           </a>
//         </div>
//       );
//     }

//     if (lec.documentPath) {
//       return (
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaFileWord style={{ color: "#2563eb" }} />
//           <a 
//             href={`${BASE_URL}/${lec.documentPath}`} 
//             target="_blank" 
//             rel="noreferrer"
//             style={{ color: "#3b82f6", textDecoration: "none" }}
//             download
//           >
//             Doc <FaDownload size={10} />
//           </a>
//         </div>
//       );
//     }

//     if (lec.excelPath) {
//       return (
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaFileExcel style={{ color: "#10b981" }} />
//           <a 
//             href={`${BASE_URL}/${lec.excelPath}`} 
//             target="_blank" 
//             rel="noreferrer"
//             style={{ color: "#3b82f6", textDecoration: "none" }}
//             download
//           >
//             Excel <FaDownload size={10} />
//           </a>
//         </div>
//       );
//     }

//     if (lec.pptPath) {
//       return (
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaFilePowerpoint style={{ color: "#f59e0b" }} />
//           <a 
//             href={`${BASE_URL}/${lec.pptPath}`} 
//             target="_blank" 
//             rel="noreferrer"
//             style={{ color: "#3b82f6", textDecoration: "none" }}
//             download
//           >
//             PPT <FaDownload size={10} />
//           </a>
//         </div>
//       );
//     }

//     return (
//       <span style={{ color: "#9ca3af", fontStyle: "italic" }}>No file</span>
//     );
//   };

//   const getLectureTypeColor = (type) => {
//     switch(type?.toLowerCase()) {
//       case 'video': return { bg: '#fee2e2', text: '#dc2626' };
//       case 'pdf': return { bg: '#dbeafe', text: '#1d4ed8' };
//       case 'document': return { bg: '#d1fae5', text: '#047857' };
//       case 'excel': return { bg: '#fef3c7', text: '#92400e' };
//       case 'ppt': return { bg: '#f3e8ff', text: '#7c3aed' };
//       case 'link': return { bg: '#e0f2fe', text: '#0369a1' };
//       default: return { bg: '#f3f4f6', text: '#6b7280' };
//     }
//   };

//   // ================= STATS CARD =================
//   const StatCard = ({ icon, title, value, color, bgColor }) => (
//     <div style={{
//       background: "#fff",
//       padding: "16px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
//       display: "flex",
//       alignItems: "center",
//       gap: "12px",
//       flex: 1,
//       minWidth: "160px",
//     }}>
//       <div style={{
//         width: "40px",
//         height: "40px",
//         borderRadius: "8px",
//         background: bgColor,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: "18px",
//         color: color
//       }}>
//         {icon}
//       </div>
//       <div>
//         <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>
//           {title}
//         </div>
//         <div style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
//           {value}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ 
//         marginLeft: "250px", 
//         padding: "24px", 
//         background: "#f3f4f6", 
//         minHeight: "100vh", 
//         flex: 1 
//       }}>
        
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
//           <button
//             onClick={() => navigate("/courses")}
//             style={{
//               background: "transparent",
//               border: "none",
//               fontSize: "20px",
//               cursor: "pointer",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}
//           >
//             <FaArrowLeft /> Back
//           </button>
//           <div>
//             <h2 style={{ margin: 0, color: "#1e293b" }}>
//               📚 Lectures Management
//             </h2>
//             {course && (
//               <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
//                 Course: <strong>{course.title}</strong> • 
//                 Price: <strong>₹{course.price || 0}</strong> • 
//                 Category: <strong>{course.category || "Uncategorized"}</strong>
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Statistics */}
//         <div style={{ 
//           display: "flex", 
//           gap: "15px", 
//           marginBottom: "25px",
//           flexWrap: "wrap" 
//         }}>
//           <StatCard
//             icon={<FaBook />}
//             title="Total Lectures"
//             value={stats.totalLectures}
//             color="#3b82f6"
//             bgColor="#dbeafe"
//           />
//           <StatCard
//             icon={<FaUnlock />}
//             title="Free Preview"
//             value={stats.freeLectures}
//             color="#10b981"
//             bgColor="#d1fae5"
//           />
//           <StatCard
//             icon={<FaLock />}
//             title="Paid Lectures"
//             value={stats.paidLectures}
//             color="#f59e0b"
//             bgColor="#fef3c7"
//           />
//           <StatCard
//             icon={<FaChartLine />}
//             title="Total Duration"
//             value={`${stats.totalDuration} min`}
//             color="#8b5cf6"
//             bgColor="#ede9fe"
//           />
//         </div>

//         {/* Search and Filter Bar */}
//         <div style={{ 
//           background: "#fff", 
//           padding: "20px", 
//           borderRadius: "12px",
//           marginBottom: "20px",
//           boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
//         }}>
//           <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
//             {/* Search */}
//             <div style={{ flex: 1 }}>
//               <input
//                 placeholder="Search lectures by title, number, or subcategory..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "10px 15px",
//                   borderRadius: "8px",
//                   border: "1px solid #d1d5db",
//                   fontSize: "14px"
//                 }}
//               />
//             </div>

//             {/* Sort */}
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <FaSort style={{ color: "#64748b" }} />
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 style={{
//                   padding: "10px",
//                   borderRadius: "6px",
//                   border: "1px solid #d1d5db",
//                   fontSize: "14px",
//                   background: "#fff",
//                   cursor: "pointer"
//                 }}
//               >
//                 <option value="lectureNumber">Sort by Number</option>
//                 <option value="title">Sort by Title</option>
//                 <option value="duration">Sort by Duration</option>
//               </select>
//             </div>

//             {/* Filter */}
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <FaFilter style={{ color: "#64748b" }} />
//               <select
//                 value={filterAccess}
//                 onChange={(e) => setFilterAccess(e.target.value)}
//                 style={{
//                   padding: "10px",
//                   borderRadius: "6px",
//                   border: "1px solid #d1d5db",
//                   fontSize: "14px",
//                   background: "#fff",
//                   cursor: "pointer"
//                 }}
//               >
//                 <option value="all">All Lectures</option>
//                 <option value="free">Free Preview Only</option>
//                 <option value="paid">Paid Only</option>
//               </select>
//             </div>

//             {/* Add Button */}
//             <button
//               onClick={openAddForm}
//               style={{
//                 background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
//                 color: "#fff",
//                 border: "none",
//                 padding: "10px 20px",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 boxShadow: "0 2px 5px rgba(249, 115, 22, 0.3)"
//               }}
//             >
//               <FaPlus /> Add Lecture
//             </button>
//           </div>
//         </div>

//         {/* Lectures Table */}
//         <div style={{ 
//           background: "#fff", 
//           borderRadius: "12px",
//           overflow: "hidden",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
//         }}>
//           <div style={{ overflowX: "auto" }}>
//             <table style={{ 
//               width: "100%", 
//               borderCollapse: "collapse",
//               fontSize: "14px"
//             }}>
//               <thead style={{ background: "#f8fafc" }}>
//                 <tr>
//                   <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#475569", borderBottom: "2px solid #e2e8f0" }}>#</th>
//                   <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#475569", borderBottom: "2px solid #e2e8f0" }}>Lecture Details</th>
//                   <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#475569", borderBottom: "2px solid #e2e8f0" }}>Access</th>
//                   <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#475569", borderBottom: "2px solid #e2e8f0" }}>Resource</th>
//                   <th style={{ padding: "16px 12px", textAlign: "center", fontWeight: "600", color: "#475569", borderBottom: "2px solid #e2e8f0" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAndSortedLectures.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
//                       {loading ? "Loading lectures..." : "No lectures found"}
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredAndSortedLectures.map((lec, i) => {
//                     const typeColors = getLectureTypeColor(lec.type);
                    
//                     return (
//                       <tr 
//                         key={lec._id} 
//                         style={{ 
//                           borderBottom: "1px solid #e2e8f0",
//                           transition: "background-color 0.2s",
//                           ":hover": { backgroundColor: "#f8fafc" }
//                         }}
//                       >
//                         <td style={{ padding: "16px 12px", color: "#64748b", fontWeight: "600" }}>
//                           {lec.lectureNumber}
//                         </td>
//                         <td style={{ padding: "16px 12px" }}>
//                           <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>
//                             {lec.title}
//                           </div>
//                           <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "6px" }}>
//                             {lec.description?.substring(0, 80)}...
//                           </div>
//                           <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
//                             <span style={{
//                               background: typeColors.bg,
//                               color: typeColors.text,
//                               padding: "3px 8px",
//                               borderRadius: "4px",
//                               fontSize: "11px",
//                               fontWeight: "600",
//                               textTransform: "uppercase"
//                             }}>
//                               {lec.type}
//                             </span>
//                             {lec.duration && (
//                               <span style={{ fontSize: "12px", color: "#6b7280" }}>
//                                 ⏱️ {lec.duration} min
//                               </span>
//                             )}
//                             {lec.subCategory && (
//                               <span style={{ 
//                                 fontSize: "12px", 
//                                 color: "#3b82f6",
//                                 background: "#e0f2fe",
//                                 padding: "2px 6px",
//                                 borderRadius: "4px"
//                               }}>
//                                 {lec.subCategory}
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td style={{ padding: "16px 12px" }}>
//                           <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//                             <span style={{
//                               display: "inline-flex",
//                               alignItems: "center",
//                               gap: "6px",
//                               background: lec.isFreePreview ? "#d1fae5" : "#fee2e2",
//                               color: lec.isFreePreview ? "#065f46" : "#991b1b",
//                               padding: "6px 10px",
//                               borderRadius: "6px",
//                               fontSize: "12px",
//                               fontWeight: "600",
//                               width: "fit-content"
//                             }}>
//                               {lec.isFreePreview ? (
//                                 <>
//                                   <FaUnlock size={12} /> Free Preview
//                                 </>
//                               ) : (
//                                 <>
//                                   <FaLock size={12} /> Paid Only
//                                 </>
//                               )}
//                             </span>
//                             {lec.priceRequired > 0 && (
//                               <div style={{ 
//                                 display: "flex", 
//                                 alignItems: "center", 
//                                 gap: "4px",
//                                 fontSize: "12px",
//                                 color: "#92400e"
//                               }}>
//                                 <FaRupeeSign size={10} />
//                                 <span>₹{lec.priceRequired} (Individual)</span>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td style={{ padding: "16px 12px" }}>
//                           {renderFile(lec)}
//                         </td>
//                         <td style={{ padding: "16px 12px", textAlign: "center" }}>
//                           <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
//                             <button
//                               onClick={() => setSelectedLecture(lec)}
//                               style={{
//                                 background: "#10b981",
//                                 color: "#fff",
//                                 border: "none",
//                                 padding: "8px 12px",
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "6px",
//                                 fontSize: "13px"
//                               }}
//                               title="View Details"
//                             >
//                               <FaEye /> View
//                             </button>
//                             <button
//                               onClick={() => openEditForm(lec)}
//                               style={{
//                                 background: "#f59e0b",
//                                 color: "#fff",
//                                 border: "none",
//                                 padding: "8px 12px",
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "6px",
//                                 fontSize: "13px"
//                               }}
//                               title="Edit Lecture"
//                             >
//                               <FaEdit /> Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(lec._id)}
//                               style={{
//                                 background: "#ef4444",
//                                 color: "#fff",
//                                 border: "none",
//                                 padding: "8px 12px",
//                                 borderRadius: "6px",
//                                 cursor: "pointer",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "6px",
//                                 fontSize: "13px"
//                               }}
//                               title="Delete Lecture"
//                             >
//                               <FaTrash /> Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Lecture Details Modal */}
//         {selectedLecture && (
//           <div style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//             padding: "20px"
//           }}>
//             <div style={{
//               background: "#fff",
//               padding: "30px",
//               borderRadius: "12px",
//               width: "600px",
//               maxWidth: "90%",
//               maxHeight: "90vh",
//               overflowY: "auto",
//               boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
//             }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//                 <h3 style={{ margin: 0, fontSize: "20px", color: "#1e293b" }}>
//                   📄 Lecture Details
//                 </h3>
//                 <button
//                   onClick={() => setSelectedLecture(null)}
//                   style={{
//                     background: "transparent",
//                     border: "none",
//                     fontSize: "20px",
//                     cursor: "pointer",
//                     color: "#64748b"
//                   }}
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//                 <div>
//                   <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Title</label>
//                   <div style={{ fontSize: "16px", color: "#1e293b", marginTop: "4px" }}>{selectedLecture.title}</div>
//                 </div>
                
//                 <div>
//                   <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Description</label>
//                   <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px", lineHeight: "1.6" }}>{selectedLecture.description}</div>
//                 </div>
                
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                   <div>
//                     <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Lecture Number</label>
//                     <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>{selectedLecture.lectureNumber}</div>
//                   </div>
//                   <div>
//                     <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Duration</label>
//                     <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>{selectedLecture.duration || 0} minutes</div>
//                   </div>
//                 </div>
                
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                   <div>
//                     <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Type</label>
//                     <div style={{ 
//                       fontSize: "13px", 
//                       color: getLectureTypeColor(selectedLecture.type).text,
//                       background: getLectureTypeColor(selectedLecture.type).bg,
//                       padding: "4px 10px",
//                       borderRadius: "4px",
//                       marginTop: "4px",
//                       display: "inline-block",
//                       fontWeight: "600",
//                       textTransform: "uppercase"
//                     }}>
//                       {selectedLecture.type}
//                     </div>
//                   </div>
//                   <div>
//                     <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Subcategory</label>
//                     <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>{selectedLecture.subCategory || "—"}</div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Access Type</label>
//                   <div style={{ 
//                     fontSize: "14px", 
//                     marginTop: "4px",
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: "6px",
//                     background: selectedLecture.isFreePreview ? "#d1fae5" : "#fee2e2",
//                     color: selectedLecture.isFreePreview ? "#065f46" : "#991b1b",
//                     padding: "6px 12px",
//                     borderRadius: "6px",
//                     fontWeight: "600"
//                   }}>
//                     {selectedLecture.isFreePreview ? (
//                       <>
//                         <FaUnlock size={12} /> Free Preview (Visible to all users)
//                       </>
//                     ) : (
//                       <>
//                         <FaLock size={12} /> Paid Only (Requires course purchase)
//                       </>
//                     )}
//                   </div>
//                 </div>
                
//                 {selectedLecture.priceRequired > 0 && (
//                   <div>
//                     <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Individual Price</label>
//                     <div style={{ 
//                       fontSize: "16px", 
//                       color: "#92400e",
//                       marginTop: "4px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "6px"
//                     }}>
//                       <FaRupeeSign /> {selectedLecture.priceRequired}
//                       <span style={{ fontSize: "12px", color: "#6b7280" }}>(Separate from course price)</span>
//                     </div>
//                   </div>
//                 )}
                
//                 <div>
//                   <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Notes</label>
//                   <div style={{ 
//                     fontSize: "14px", 
//                     color: "#4b5563", 
//                     marginTop: "4px", 
//                     padding: "12px",
//                     background: "#f9fafb",
//                     borderRadius: "6px",
//                     lineHeight: "1.6"
//                   }}>
//                     {selectedLecture.notes || "No additional notes"}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label style={{ fontWeight: "600", color: "#475569", fontSize: "13px" }}>Resource</label>
//                   <div style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>
//                     {renderFile(selectedLecture)}
//                   </div>
//                 </div>
//               </div>
              
//               <div style={{ display: "flex", gap: "10px", marginTop: "25px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
//                 <button
//                   onClick={() => setSelectedLecture(null)}
//                   style={{
//                     background: "#6b7280",
//                     color: "#fff",
//                     border: "none",
//                     padding: "10px 20px",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     flex: 1
//                   }}
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => {
//                     setSelectedLecture(null);
//                     openEditForm(selectedLecture);
//                   }}
//                   style={{
//                     background: "#3b82f6",
//                     color: "#fff",
//                     border: "none",
//                     padding: "10px 20px",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     flex: 1,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "8px"
//                   }}
//                 >
//                   <FaEdit /> Edit Lecture
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add/Edit Form Modal */}
//         {showForm && (
//           <div style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//             padding: "20px"
//           }}>
//             <div style={{
//               background: "#fff",
//               padding: "30px",
//               borderRadius: "12px",
//               width: "700px",
//               maxWidth: "90%",
//               maxHeight: "90vh",
//               overflowY: "auto",
//               boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
//             }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
//                 <h3 style={{ margin: 0, fontSize: "20px", color: "#1e293b" }}>
//                   {editingId ? "✏️ Edit Lecture" : "➕ Add New Lecture"}
//                 </h3>
//                 <button
//                   onClick={() => setShowForm(false)}
//                   style={{
//                     background: "transparent",
//                     border: "none",
//                     fontSize: "20px",
//                     cursor: "pointer",
//                     color: "#64748b"
//                   }}
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
//                 <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px" }}>
//                   <div>
//                     <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                       Lecture Title *
//                     </label>
//                     <input
//                       placeholder="Enter lecture title"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleChange}
//                       required
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderRadius: "8px",
//                         border: "1px solid #d1d5db",
//                         fontSize: "14px",
//                         transition: "border-color 0.2s"
//                       }}
//                     />
//                   </div>
                  
//                   <div>
//                     <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                       Lecture Number *
//                     </label>
//                     <input
//                       placeholder="Lecture #"
//                       type="number"
//                       name="lectureNumber"
//                       value={formData.lectureNumber}
//                       onChange={handleChange}
//                       required
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderRadius: "8px",
//                         border: "1px solid #d1d5db",
//                         fontSize: "14px"
//                       }}
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                     Description *
//                   </label>
//                   <textarea
//                     placeholder="Enter lecture description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     required
//                     rows={3}
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       borderRadius: "8px",
//                       border: "1px solid #d1d5db",
//                       fontSize: "14px",
//                       resize: "vertical"
//                     }}
//                   />
//                 </div>
                
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                   <div>
//                     <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                       Duration (minutes)
//                     </label>
//                     <input
//                       placeholder="Duration in minutes"
//                       type="number"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleChange}
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderRadius: "8px",
//                         border: "1px solid #d1d5db",
//                         fontSize: "14px"
//                       }}
//                     />
//                   </div>
                  
//                   <div>
//                     <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                       Subcategory (Optional)
//                     </label>
//                     <input
//                       placeholder="e.g., React Basics, Python Loops"
//                       name="subCategory"
//                       value={formData.subCategory}
//                       onChange={handleChange}
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderRadius: "8px",
//                         border: "1px solid #d1d5db",
//                         fontSize: "14px"
//                       }}
//                     />
//                   </div>
//                 </div>
                
//                 {/* Access Type Section */}
//                 <div style={{ 
//                   padding: "20px", 
//                   background: "#f8fafc", 
//                   borderRadius: "10px",
//                   border: "1px solid #e2e8f0"
//                 }}>
//                   <h4 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "16px" }}>
//                     🔒 Access Settings
//                   </h4>
                  
//                   <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//                     {/* Free Preview Checkbox */}
//                     <div style={{ 
//                       display: "flex", 
//                       alignItems: "flex-start", 
//                       gap: "12px",
//                       padding: "15px",
//                       background: "#fff",
//                       borderRadius: "8px",
//                       border: "1px solid #e2e8f0"
//                     }}>
//                       <input
//                         type="checkbox"
//                         id="isFreePreview"
//                         name="isFreePreview"
//                         checked={formData.isFreePreview}
//                         onChange={handleChange}
//                         style={{ 
//                           width: "18px", 
//                           height: "18px", 
//                           cursor: "pointer",
//                           marginTop: "3px"
//                         }}
//                       />
//                       <div>
//                         <label 
//                           htmlFor="isFreePreview" 
//                           style={{ 
//                             margin: 0, 
//                             cursor: "pointer", 
//                             fontWeight: "600",
//                             color: "#1e293b",
//                             fontSize: "14px",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "8px"
//                           }}
//                         >
//                           🔓 Make this a Free Preview Lecture
//                         </label>
//                         <div style={{ 
//                           fontSize: "13px", 
//                           color: "#64748b", 
//                           marginTop: "6px",
//                           lineHeight: "1.5"
//                         }}>
//                           Free preview lectures are visible to all users, even without payment. 
//                           <br />
//                           <strong style={{ color: "#059669" }}>Note:</strong> This is particularly useful for marketing your course content.
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Individual Price */}
//                     <div style={{ 
//                       padding: "15px",
//                       background: "#fff",
//                       borderRadius: "8px",
//                       border: "1px solid #e2e8f0"
//                     }}>
//                       <label style={{ 
//                         fontWeight: "600", 
//                         marginBottom: "8px", 
//                         display: "block", 
//                         color: "#374151", 
//                         fontSize: "14px" 
//                       }}>
//                         Individual Lecture Price (Optional)
//                       </label>
//                       <input
//                         placeholder="0 for free, or enter amount in ₹"
//                         type="number"
//                         name="priceRequired"
//                         value={formData.priceRequired}
//                         onChange={handleChange}
//                         min="0"
//                         step="0.01"
//                         style={{
//                           width: "100%",
//                           padding: "12px",
//                           borderRadius: "8px",
//                           border: "1px solid #d1d5db",
//                           fontSize: "14px",
//                           marginBottom: "8px"
//                         }}
//                       />
//                       <div style={{ 
//                         fontSize: "13px", 
//                         color: "#6b7280",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "6px"
//                       }}>
//                         💡 <span>Leave at 0 to use course-level pricing. Set individual price if this lecture should be sold separately.</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Content Type Section */}
//                 <div style={{ 
//                   padding: "20px", 
//                   background: "#f8fafc", 
//                   borderRadius: "10px",
//                   border: "1px solid #e2e8f0"
//                 }}>
//                   <h4 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "16px" }}>
//                     📁 Content Type
//                   </h4>
                  
//                   <div>
//                     <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                       Select Content Type *
//                     </label>
//                     <select
//                       name="type"
//                       value={formData.type}
//                       onChange={handleChange}
//                       style={{
//                         width: "100%",
//                         padding: "12px",
//                         borderRadius: "8px",
//                         border: "1px solid #d1d5db",
//                         fontSize: "14px",
//                         background: "#fff",
//                         cursor: "pointer",
//                         marginBottom: "15px"
//                       }}
//                     >
//                       <option value="video">🎬 Video Lecture</option>
//                       <option value="pdf">📄 PDF Document</option>
//                       <option value="document">📝 Word Document</option>
//                       <option value="excel">📊 Excel Spreadsheet</option>
//                       <option value="ppt">📽️ PowerPoint Presentation</option>
//                       <option value="link">🔗 External Video Link</option>
//                     </select>
                    
//                     {/* File Upload based on type */}
//                     {formData.type === "video" && (
//                       <div>
//                         <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                           Upload Video File
//                         </label>
//                         <input
//                           type="file"
//                           accept="video/*"
//                           onChange={e => setVideoFile(e.target.files[0])}
//                           style={{
//                             width: "100%",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #d1d5db",
//                             fontSize: "14px"
//                           }}
//                         />
//                         {!videoFile && (
//                           <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
//                             Max file size: 100MB • Supported: MP4, MOV, AVI
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     {formData.type === "pdf" && (
//                       <div>
//                         <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                           Upload PDF File
//                         </label>
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={e => setPdfFile(e.target.files[0])}
//                           style={{
//                             width: "100%",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #d1d5db",
//                             fontSize: "14px"
//                           }}
//                         />
//                       </div>
//                     )}
                    
//                     {formData.type === "document" && (
//                       <div>
//                         <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                           Upload Document (DOC/DOCX)
//                         </label>
//                         <input
//                           type="file"
//                           accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//                           onChange={e => setDocFile(e.target.files[0])}
//                           style={{
//                             width: "100%",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #d1d5db",
//                             fontSize: "14px"
//                           }}
//                         />
//                       </div>
//                     )}
                    
//                     {formData.type === "excel" && (
//                       <div>
//                         <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                           Upload Excel File
//                         </label>
//                         <input
//                           type="file"
//                           accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//                           onChange={e => setExcelFile(e.target.files[0])}
//                           style={{
//                             width: "100%",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #d1d5db",
//                             fontSize: "14px"
//                           }}
//                         />
//                       </div>
//                     )}
                    
//                     {formData.type === "ppt" && (
//                       <div>
//                         <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                           Upload PowerPoint Presentation
//                         </label>
//                         <input
//                           type="file"
//                           accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
//                           onChange={e => setPptFile(e.target.files[0])}
//                           style={{
//                             width: "100%",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             border: "1px solid #d1d5db",
//                             fontSize: "14px"
//                           }}
//                         />
//                       </div>
//                     )}
                    
//                     {formData.type === "link" && (
//                       <div>
//                         <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                           Video URL
//                         </label>
//                         <input
//                           type="url"
//                           placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
//                           name="videoUrl"
//                           value={formData.videoUrl}
//                           onChange={handleChange}
//                           style={{
//                             width: "100%",
//                             padding: "12px",
//                             borderRadius: "8px",
//                             border: "1px solid #d1d5db",
//                             fontSize: "14px"
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Notes Section */}
//                 <div>
//                   <label style={{ fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151", fontSize: "14px" }}>
//                     Additional Notes (Optional)
//                   </label>
//                   <textarea
//                     placeholder="Add any additional notes, instructions, or resources for this lecture..."
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleChange}
//                     rows={3}
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       borderRadius: "8px",
//                       border: "1px solid #d1d5db",
//                       fontSize: "14px",
//                       resize: "vertical"
//                     }}
//                   />
//                 </div>
                
//                 {/* Submit Buttons */}
//                 <div style={{ 
//                   display: "flex", 
//                   gap: "12px", 
//                   marginTop: "20px",
//                   paddingTop: "20px",
//                   borderTop: "1px solid #e5e7eb"
//                 }}>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     style={{
//                       background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
//                       color: "#fff",
//                       border: "none",
//                       padding: "14px 28px",
//                       borderRadius: "8px",
//                       flex: 1,
//                       cursor: loading ? "not-allowed" : "pointer",
//                       opacity: loading ? 0.7 : 1,
//                       fontSize: "15px",
//                       fontWeight: "600",
//                       transition: "transform 0.2s"
//                     }}
//                     onMouseOver={e => !loading && (e.target.style.transform = "translateY(-2px)")}
//                     onMouseOut={e => !loading && (e.target.style.transform = "translateY(0)")}
//                   >
//                     {loading ? (
//                       <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
//                         <div style={{
//                           width: "16px",
//                           height: "16px",
//                           border: "2px solid rgba(255,255,255,0.3)",
//                           borderTop: "2px solid #fff",
//                           borderRadius: "50%",
//                           animation: "spin 0.8s linear infinite"
//                         }} />
//                         Saving...
//                       </span>
//                     ) : editingId ? (
//                       "Update Lecture"
//                     ) : (
//                       "Add Lecture"
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     style={{
//                       background: "#ef4444",
//                       color: "#fff",
//                       border: "none",
//                       padding: "14px 28px",
//                       borderRadius: "8px",
//                       flex: 1,
//                       cursor: "pointer",
//                       fontSize: "15px",
//                       fontWeight: "600",
//                       transition: "background-color 0.2s"
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
        
//         {/* Add CSS animation */}
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default Lectures;




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
  FaBars,
  FaTimes,
  FaSearch
} from "react-icons/fa";
import { 
  getLecturesByCourse, 
  createLecture, 
  updateLecture, 
  deleteLecture,
  getCourseById 
} from "../api/api";

const BASE_URL = "http://itechskill.com";

// Exact Color Theme from UsersPage
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
                  <span>Price: <strong style={{ color: COLORS.deepPurple }}>₹{course.price || 0}</strong></span>
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

          {/* Lectures Table */}
          <div style={{ 
            background: COLORS.white, 
            borderRadius: "12px",
            overflow: isMobile ? "auto" : "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
                    fontSize: isMobile ? "12px" : "15px"
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
                    fontSize: isMobile ? "12px" : "15px"
                  }}>Access</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "left", 
                    fontWeight: "700",
                    fontSize: isMobile ? "12px" : "15px"
                  }}>Resource</th>
                  <th style={{ 
                    padding: isMobile ? "14px 12px" : "18px 24px", 
                    textAlign: "center", 
                    fontWeight: "700",
                    fontSize: isMobile ? "12px" : "15px"
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedLectures.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ 
                      textAlign: "center", 
                      padding: isMobile ? "30px" : "40px", 
                      color: COLORS.darkGray,
                      fontSize: isMobile ? "13px" : "15px"
                    }}>
                      {loading ? "Loading lectures..." : "No lectures found"}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedLectures.map((lec, i) => {
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
                            {lec.subCategory && (
                              <span style={{ 
                                fontSize: isMobile ? "10px" : "12px", 
                                color: COLORS.info,
                                background: COLORS.blueLight,
                                padding: "2px 6px",
                                borderRadius: "4px"
                              }}>
                                {lec.subCategory}
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
      </div>

      {/* Lecture Details Modal */}
      {selectedLecture && (
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
            width: isMobile ? "100%" : "600px",
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
                📄 Lecture Details
              </h3>
              <button
                onClick={() => setSelectedLecture(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: isMobile ? "18px" : "20px",
                  cursor: "pointer",
                  color: COLORS.darkGray
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "12px" : "15px" }}>
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "12px" : "13px" 
                }}>
                  Title
                </label>
                <div style={{ 
                  fontSize: isMobile ? "14px" : "16px", 
                  color: COLORS.deepPurple, 
                  marginTop: "4px",
                  wordBreak: "break-word" 
                }}>
                  {selectedLecture.title}
                </div>
              </div>
              
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "12px" : "13px" 
                }}>
                  Description
                </label>
                <div style={{ 
                  fontSize: isMobile ? "13px" : "14px", 
                  color: COLORS.textGray, 
                  marginTop: "4px", 
                  lineHeight: "1.6",
                  wordBreak: "break-word" 
                }}>
                  {selectedLecture.description}
                </div>
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: isMobile ? "12px" : "15px"
              }}>
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "12px" : "13px" 
                  }}>
                    Lecture Number
                  </label>
                  <div style={{ 
                    fontSize: isMobile ? "13px" : "14px", 
                    color: COLORS.textGray, 
                    marginTop: "4px" 
                  }}>
                    {selectedLecture.lectureNumber}
                  </div>
                </div>
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "12px" : "13px" 
                  }}>
                    Duration
                  </label>
                  <div style={{ 
                    fontSize: isMobile ? "13px" : "14px", 
                    color: COLORS.textGray, 
                    marginTop: "4px" 
                  }}>
                    {selectedLecture.duration || 0} minutes
                  </div>
                </div>
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: isMobile ? "12px" : "15px"
              }}>
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "12px" : "13px" 
                  }}>
                    Type
                  </label>
                  <div style={{ 
                    fontSize: isMobile ? "11px" : "13px", 
                    color: getLectureTypeColor(selectedLecture.type).text,
                    background: getLectureTypeColor(selectedLecture.type).bg,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    marginTop: "4px",
                    display: "inline-block",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>
                    {selectedLecture.type}
                  </div>
                </div>
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "12px" : "13px" 
                  }}>
                    Subcategory
                  </label>
                  <div style={{ 
                    fontSize: isMobile ? "13px" : "14px", 
                    color: COLORS.textGray, 
                    marginTop: "4px" 
                  }}>
                    {selectedLecture.subCategory || "—"}
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "12px" : "13px" 
                }}>
                  Access Type
                </label>
                <div style={{ 
                  fontSize: isMobile ? "12px" : "14px", 
                  marginTop: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: selectedLecture.isFreePreview ? COLORS.greenLight : "#fee2e2",
                  color: selectedLecture.isFreePreview ? "#065f46" : "#991b1b",
                  padding: isMobile ? "4px 10px" : "6px 12px",
                  borderRadius: "6px",
                  fontWeight: "600"
                }}>
                  {selectedLecture.isFreePreview ? (
                    <>
                      <FaUnlock size={12} /> Free Preview
                    </>
                  ) : (
                    <>
                      <FaLock size={12} /> Paid Only
                    </>
                  )}
                </div>
              </div>
              
              {selectedLecture.priceRequired > 0 && (
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "12px" : "13px" 
                  }}>
                    Individual Price
                  </label>
                  <div style={{ 
                    fontSize: isMobile ? "14px" : "16px", 
                    color: "#92400e",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap"
                  }}>
                    <FaRupeeSign /> {selectedLecture.priceRequired}
                    <span style={{ 
                      fontSize: isMobile ? "11px" : "12px", 
                      color: COLORS.darkGray 
                    }}>
                      (Separate from course price)
                    </span>
                  </div>
                </div>
              )}
              
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "12px" : "13px" 
                }}>
                  Notes
                </label>
                <div style={{ 
                  fontSize: isMobile ? "12px" : "14px", 
                  color: COLORS.textGray, 
                  marginTop: "4px", 
                  padding: isMobile ? "10px" : "12px",
                  background: COLORS.bgGray,
                  borderRadius: "6px",
                  lineHeight: "1.6",
                  wordBreak: "break-word"
                }}>
                  {selectedLecture.notes || "No additional notes"}
                </div>
              </div>
              
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "12px" : "13px" 
                }}>
                  Resource
                </label>
                <div style={{ 
                  fontSize: isMobile ? "12px" : "14px", 
                  color: COLORS.textGray, 
                  marginTop: "4px" 
                }}>
                  {renderFile(selectedLecture)}
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: "flex", 
              gap: isMobile ? "8px" : "10px", 
              marginTop: isMobile ? "20px" : "25px", 
              paddingTop: isMobile ? "16px" : "20px", 
              borderTop: `1px solid ${COLORS.lightGray}`,
              flexWrap: "wrap"
            }}>
              <button
                onClick={() => setSelectedLecture(null)}
                style={{
                  background: COLORS.cancelButton,
                  color: COLORS.white,
                  border: "none",
                  padding: isMobile ? "10px 16px" : "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: "600",
                  flex: "1 1 120px"
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedLecture(null);
                  openEditForm(selectedLecture);
                }}
                style={{
                  background: COLORS.formButton,
                  color: COLORS.white,
                  border: "none",
                  padding: isMobile ? "10px 16px" : "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: "600",
                  flex: "1 1 120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

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
              marginBottom: isMobile ? "20px" : "25px" 
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: isMobile ? "18px" : "20px", 
                color: COLORS.deepPurple 
              }}>
                {editingId ? "✏️ Edit Lecture" : "➕ Add New Lecture"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: isMobile ? "18px" : "20px",
                  cursor: "pointer",
                  color: COLORS.darkGray
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "18px" }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", 
                gap: isMobile ? "14px" : "15px"
              }}>
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    marginBottom: "8px", 
                    display: "block", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "13px" : "14px" 
                  }}>
                    Lecture Title *
                  </label>
                  <input
                    placeholder="Enter lecture title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`,
                      fontSize: isMobile ? "13px" : "14px",
                      transition: "border-color 0.2s",
                      background: COLORS.white,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    marginBottom: "8px", 
                    display: "block", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "13px" : "14px" 
                  }}>
                    Lecture Number *
                  </label>
                  <input
                    placeholder="Lecture #"
                    type="number"
                    name="lectureNumber"
                    value={formData.lectureNumber}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`,
                      fontSize: isMobile ? "13px" : "14px",
                      background: COLORS.white,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  marginBottom: "8px", 
                  display: "block", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "13px" : "14px" 
                }}>
                  Description *
                </label>
                <textarea
                  placeholder="Enter lecture description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`,
                    fontSize: isMobile ? "13px" : "14px",
                    resize: "vertical",
                    background: COLORS.white,
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: isMobile ? "14px" : "15px"
              }}>
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    marginBottom: "8px", 
                    display: "block", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "13px" : "14px" 
                  }}>
                    Duration (minutes)
                  </label>
                  <input
                    placeholder="Duration in minutes"
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`,
                      fontSize: isMobile ? "13px" : "14px",
                      background: COLORS.white,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    marginBottom: "8px", 
                    display: "block", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "13px" : "14px" 
                  }}>
                    Subcategory (Optional)
                  </label>
                  <input
                    placeholder="e.g., React Basics"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`,
                      fontSize: isMobile ? "13px" : "14px",
                      background: COLORS.white,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
              </div>
              
              {/* Access Type Section */}
              <div style={{ 
                padding: isMobile ? "16px" : "20px", 
                background: COLORS.bgGray, 
                borderRadius: "10px",
                border: `1px solid ${COLORS.lightGray}`
              }}>
                <h4 style={{ 
                  margin: "0 0 15px 0", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "14px" : "16px" 
                }}>
                  🔒 Access Settings
                </h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {/* Free Preview Checkbox */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "12px",
                    padding: isMobile ? "12px" : "15px",
                    background: COLORS.white,
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`
                  }}>
                    <input
                      type="checkbox"
                      id="isFreePreview"
                      name="isFreePreview"
                      checked={formData.isFreePreview}
                      onChange={handleChange}
                      style={{ 
                        width: "18px", 
                        height: "18px", 
                        cursor: "pointer",
                        marginTop: "3px"
                      }}
                    />
                    <div>
                      <label 
                        htmlFor="isFreePreview" 
                        style={{ 
                          margin: 0, 
                          cursor: "pointer", 
                          fontWeight: "600",
                          color: COLORS.deepPurple,
                          fontSize: isMobile ? "13px" : "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        🔓 Make this a Free Preview Lecture
                      </label>
                      <div style={{ 
                        fontSize: isMobile ? "11px" : "13px", 
                        color: COLORS.darkGray, 
                        marginTop: "6px",
                        lineHeight: "1.5"
                      }}>
                        Free preview lectures are visible to all users, even without payment.
                      </div>
                    </div>
                  </div>
                  
                  {/* Individual Price */}
                  <div style={{ 
                    padding: isMobile ? "12px" : "15px",
                    background: COLORS.white,
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`
                  }}>
                    <label style={{ 
                      fontWeight: "600", 
                      marginBottom: "8px", 
                      display: "block", 
                      color: COLORS.deepPurple, 
                      fontSize: isMobile ? "13px" : "14px" 
                    }}>
                      Individual Lecture Price (Optional)
                    </label>
                    <input
                      placeholder="0 for free, or enter amount in ₹"
                      type="number"
                      name="priceRequired"
                      value={formData.priceRequired}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      style={{
                        width: "100%",
                        padding: isMobile ? "10px" : "12px",
                        borderRadius: "8px",
                        border: `1px solid ${COLORS.lightGray}`,
                        fontSize: isMobile ? "13px" : "14px",
                        marginBottom: "8px",
                        background: COLORS.white,
                        boxSizing: "border-box",
                        outline: "none"
                      }}
                    />
                    <div style={{ 
                      fontSize: isMobile ? "11px" : "13px", 
                      color: COLORS.darkGray,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      💡 <span>Leave at 0 to use course-level pricing.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Type Section */}
              <div style={{ 
                padding: isMobile ? "16px" : "20px", 
                background: COLORS.bgGray, 
                borderRadius: "10px",
                border: `1px solid ${COLORS.lightGray}`
              }}>
                <h4 style={{ 
                  margin: "0 0 15px 0", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "14px" : "16px" 
                }}>
                  📁 Content Type
                </h4>
                
                <div>
                  <label style={{ 
                    fontWeight: "600", 
                    marginBottom: "8px", 
                    display: "block", 
                    color: COLORS.deepPurple, 
                    fontSize: isMobile ? "13px" : "14px" 
                  }}>
                    Select Content Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`,
                      fontSize: isMobile ? "13px" : "14px",
                      background: COLORS.white,
                      cursor: "pointer",
                      marginBottom: "15px",
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  >
                    <option value="video">🎬 Video Lecture</option>
                    <option value="pdf">📄 PDF Document</option>
                    <option value="document">📝 Word Document</option>
                    <option value="excel">📊 Excel Spreadsheet</option>
                    <option value="ppt">📽️ PowerPoint Presentation</option>
                    <option value="link">🔗 External Video Link</option>
                  </select>
                  
                  {/* File Upload based on type */}
                  {formData.type === "video" && (
                    <div>
                      <label style={{ 
                        fontWeight: "600", 
                        marginBottom: "8px", 
                        display: "block", 
                        color: COLORS.deepPurple, 
                        fontSize: isMobile ? "13px" : "14px" 
                      }}>
                        Upload Video File
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={e => setVideoFile(e.target.files[0])}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: `1px solid ${COLORS.lightGray}`,
                          fontSize: isMobile ? "12px" : "14px",
                          boxSizing: "border-box"
                        }}
                      />
                      {!videoFile && (
                        <div style={{ 
                          fontSize: isMobile ? "11px" : "13px", 
                          color: COLORS.darkGray, 
                          marginTop: "6px" 
                        }}>
                          Max file size: 100MB • Supported: MP4, MOV, AVI
                        </div>
                      )}
                    </div>
                  )}
                  
                  {formData.type === "pdf" && (
                    <div>
                      <label style={{ 
                        fontWeight: "600", 
                        marginBottom: "8px", 
                        display: "block", 
                        color: COLORS.deepPurple, 
                        fontSize: isMobile ? "13px" : "14px" 
                      }}>
                        Upload PDF File
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={e => setPdfFile(e.target.files[0])}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: `1px solid ${COLORS.lightGray}`,
                          fontSize: isMobile ? "12px" : "14px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  )}
                  
                  {formData.type === "document" && (
                    <div>
                      <label style={{ 
                        fontWeight: "600", 
                        marginBottom: "8px", 
                        display: "block", 
                        color: COLORS.deepPurple, 
                        fontSize: isMobile ? "13px" : "14px" 
                      }}>
                        Upload Document (DOC/DOCX)
                      </label>
                      <input
                        type="file"
                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={e => setDocFile(e.target.files[0])}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: `1px solid ${COLORS.lightGray}`,
                          fontSize: isMobile ? "12px" : "14px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  )}
                  
                  {formData.type === "excel" && (
                    <div>
                      <label style={{ 
                        fontWeight: "600", 
                        marginBottom: "8px", 
                        display: "block", 
                        color: COLORS.deepPurple, 
                        fontSize: isMobile ? "13px" : "14px" 
                      }}>
                        Upload Excel File
                      </label>
                      <input
                        type="file"
                        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={e => setExcelFile(e.target.files[0])}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: `1px solid ${COLORS.lightGray}`,
                          fontSize: isMobile ? "12px" : "14px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  )}
                  
                  {formData.type === "ppt" && (
                    <div>
                      <label style={{ 
                        fontWeight: "600", 
                        marginBottom: "8px", 
                        display: "block", 
                        color: COLORS.deepPurple, 
                        fontSize: isMobile ? "13px" : "14px" 
                      }}>
                        Upload PowerPoint Presentation
                      </label>
                      <input
                        type="file"
                        accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        onChange={e => setPptFile(e.target.files[0])}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: `1px solid ${COLORS.lightGray}`,
                          fontSize: isMobile ? "12px" : "14px",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  )}
                  
                  {formData.type === "link" && (
                    <div>
                      <label style={{ 
                        fontWeight: "600", 
                        marginBottom: "8px", 
                        display: "block", 
                        color: COLORS.deepPurple, 
                        fontSize: isMobile ? "13px" : "14px" 
                      }}>
                        Video URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          padding: isMobile ? "10px" : "12px",
                          borderRadius: "8px",
                          border: `1px solid ${COLORS.lightGray}`,
                          fontSize: isMobile ? "13px" : "14px",
                          background: COLORS.white,
                          boxSizing: "border-box",
                          outline: "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notes Section */}
              <div>
                <label style={{ 
                  fontWeight: "600", 
                  marginBottom: "8px", 
                  display: "block", 
                  color: COLORS.deepPurple, 
                  fontSize: isMobile ? "13px" : "14px" 
                }}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes..."
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`,
                    fontSize: isMobile ? "13px" : "14px",
                    resize: "vertical",
                    background: COLORS.white,
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>
              
              {/* Submit Buttons */}
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
                  disabled={loading}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.formButton} 0%, ${COLORS.indigo} 100%)`,
                    color: COLORS.white,
                    border: "none",
                    padding: isMobile ? "12px 24px" : "14px 28px",
                    borderRadius: "8px",
                    flex: "1 1 180px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    fontSize: isMobile ? "13px" : "15px",
                    fontWeight: "600",
                    transition: "transform 0.2s"
                  }}
                >
                  {loading ? "Saving..." : editingId ? "Update Lecture" : "Add Lecture"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                    transition: "background-color 0.2s"
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

export default Lectures;