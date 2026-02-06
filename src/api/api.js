import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// const BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  }
});

/* ================= TOKEN INTERCEPTOR ================= */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */
export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  localStorage.setItem("token", data.token);
  localStorage.setItem("userInfo", JSON.stringify(data));
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
};

/* ================= USERS (ADMIN) ================= */
export const getAllUsers = async () => {
  const { data } = await API.get("/users");
  return Array.isArray(data) ? data : [];
};

export const getUserById = async (id) => {
  const { data } = await API.get(`/users/${id}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post("/users", userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/users/${id}`);
  return data;
};

/* ================= COURSES ================= */
export const getCourses = async () => {
  const { data } = await API.get("/courses");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.courses)) return data.courses;
  return [];
};

export const getCourseById = async (id) => {
  const { data } = await API.get(`/courses/${id}`);
  return data;
};

export const createCourse = async (formData) => {
  const { data } = await API.post("/courses/create", formData);
  return data;
};

export const updateCourse = async (id, formData) => {
  const { data } = await API.put(`/courses/update/${id}`, formData);
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await API.delete(`/courses/delete/${id}`);
  return data;
};

// ✅ Get course price
export const getCoursePrice = async (courseId) => {
  const { data } = await API.get(`/courses/${courseId}/price`);
  return data;
};

/* ================= ENROLLMENTS ================= */
// ✅ Enroll student in course with optional payment status
export const enrollStudentInCourse = async (studentId, courseId, isPaid = false) => {
  const { data } = await API.post("/enrollments/enroll", { 
    studentId, 
    courseId, 
    isPaid 
  });
  return data;
};

// ✅ Get student enrollments
export const getStudentEnrollments = async (studentId) => {
  const { data } = await API.get(`/enrollments/student/${studentId}`);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.enrollments)) return data.enrollments;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// ✅ Check enrollment status with payment info
export const getEnrollmentStatus = async (studentId, courseId) => {
  const { data } = await API.get(`/enrollments/status/${studentId}/${courseId}`);
  return data;
};

// ✅ Get all enrollments for admin with payment details
export const getAdminEnrollments = async () => {
  const { data } = await API.get("/enrollments/admin/all");
  return data;
};

// ✅ Update enrollment payment status
export const updateEnrollmentPayment = async (enrollmentId, paymentData) => {
  const { data } = await API.patch(`/enrollments/${enrollmentId}/payment`, paymentData);
  return data;
};

// ✅ Remove enrollment
export const removeEnrollment = async (enrollmentId) => {
  const { data } = await API.delete(`/enrollments/${enrollmentId}`);
  return data;
};

/* ================= ADMIN ENROLLMENT ================= */
// ✅ Grant free access to a student (Admin only)
export const grantFreeAccessToStudent = async (studentId, courseId) => {
  try {
    const { data } = await API.post("/api/admin/enrollment/grant-free-access", {
      studentId,
      courseId
    });
    return data;
  } catch (error) {
    console.error("Error granting free access:", error);
    throw error.response?.data || { message: "Error granting free access" };
  }
};

/* ================= PAYMENTS ================= */
// ✅ Process payment
export const processPayment = async (studentId, courseId, paymentData) => {
  const { data } = await API.post("/payments/process", {
    studentId,
    courseId,
    ...paymentData
  });
  return data;
};

// ✅ Check payment status
export const checkPaymentStatus = async (studentId, courseId) => {
  const { data } = await API.get("/payments/status", {
    params: { studentId, courseId }
  });
  return data;
};

// ✅ Get payment history
export const getPaymentHistory = async (studentId) => {
  const { data } = await API.get(`/payments/history/${studentId}`);
  return data;
};

// ✅ Get admin payments dashboard
export const getAdminPayments = async () => {
  const { data } = await API.get("/payments/admin");
  return data;
};

/* ================= PROGRESS ================= */
export const trackLectureProgress = async (studentId, courseId, lectureId) => {
  const { data } = await API.post("/progress/track", { studentId, courseId, lectureId });
  return data;
};

export const getProgress = async (studentId, courseId) => {
  const { data } = await API.get(`/progress/${studentId}/${courseId}`);
  const completed = data?.completedLectures?.length || 0;
  const total = data?.totalLectures || 0;
  return { 
    ...data, 
    progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0 
  };
};

/* ================= LECTURES ================= */
export const getLectures = async () => {
  const { data } = await API.get("/lectures");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.lectures)) return data.lectures;
  return [];
};

// ✅ UPDATED: Get lectures with payment check
export const getLecturesByCourse = async (courseId, studentId = null) => {
  let url = `/lectures/course/${courseId}`;
  
  // Add studentId as query parameter for backend to check access
  if (studentId) {
    url += `?studentId=${studentId}`;
  }
  
  const { data } = await API.get(url);
  
  // Handle different response formats
  if (Array.isArray(data)) {
    return { 
      lectures: data, 
      isPaidStudent: false,
      hasFullAccess: false,  // ✅ FIXED: Added hasFullAccess
      coursePrice: 0 
    };
  }
  
  if (data?.lectures) {
    return {
      lectures: data.lectures || [],
      isPaidStudent: data.isPaidStudent || false,
      hasFullAccess: data.hasFullAccess || data.isPaidStudent || false,  // ✅ FIXED: Added hasFullAccess
      coursePrice: data.coursePrice || 0,
      hasAccess: data.hasAccess || data.hasFullAccess || false  // ✅ FIXED: Updated hasAccess
    };
  }
  
  return { 
    lectures: [], 
    isPaidStudent: false,
    hasFullAccess: false,  // ✅ FIXED: Added hasFullAccess
    coursePrice: 0,
    hasAccess: false 
  };
};

export const getLectureById = async (id) => {
  const { data } = await API.get(`/lectures/${id}`);
  return data;
};

// export const createLecture = async (formData) => {
//   const { data } = await API.post("/lectures/create", formData);
//   return data;
// };
export const createLecture = async (formData) => {
  try {
    console.log("=== SENDING FORM DATA TO /lectures/create ===");
    
    // 🔴 Pehle FormData content check karein
    const formDataEntries = [];
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        formDataEntries.push(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        formDataEntries.push(`${key}: ${value}`);
      }
    }
    console.log("FormData entries:", formDataEntries);
    
    const response = await API.post("/lectures/create", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    
    console.log("✅ Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error in createLecture:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const updateLecture = async (id, formData) => {
  const { data } = await API.put(`/lectures/update/${id}`, formData);
  return data;
};

export const deleteLecture = async (id) => {
  const { data } = await API.delete(`/lectures/delete/${id}`);
  return data;
};

/* ================= EXAMS ================= */
export const getAllExams = async () => {
  const { data } = await API.get("/exams");
  return data;
};

export const getExamById = async (id) => {
  const { data } = await API.get(`/exams/${id}`);
  return data;
};

export const createExam = async (examData) => {
  const { data } = await API.post("/exams", examData);
  return data;
};

export const updateExam = async (id, examData) => {
  const { data } = await API.put(`/exams/${id}`, examData);
  return data;
};

export const deleteExam = async (id) => {
  const { data } = await API.delete(`/exams/${id}`);
  return data;
};

/* ================= QUESTIONS ================= */
export const getQuestionsByExam = async (examId) => {
  const { data } = await API.get(`/questions/exam/${examId}`);
  return Array.isArray(data) ? data : [];
};

export const addQuestion = async (questionData) => {
  const { data } = await API.post("/questions", questionData);
  return data;
};

export const updateQuestion = async (questionId, questionData) => {
  const { data } = await API.put(`/questions/${questionId}`, questionData);
  return data;
};

export const deleteQuestion = async (questionId) => {
  const { data } = await API.delete(`/questions/${questionId}`);
  return data;
};

/* ================= ATTEMPTS ================= */
export const submitAttempt = async (attemptData) => {
  const { data } = await API.post("/attempts", attemptData);
  return data;
};

export const getAttemptsByUser = async (userId) => {
  const { data } = await API.get(`/attempts/user/${userId}`);
  return Array.isArray(data) ? data : data?.attempts || [];
};

export const getAttemptsByExam = async (examId) => {
  const { data } = await API.get(`/attempts/exam/${examId}`);
  return Array.isArray(data) ? data : data?.attempts || [];
};

export const getExamStatus = async (studentId, examId) => {
  const { data } = await API.get(`/attempts/status/${studentId}/${examId}`);
  return data;
};

/* ================= MESSAGES ================= */
export const sendMessage = async (messageData) => {
  const { data } = await API.post("/messages", messageData);
  return data;
};

export const getMessages = async (userId) => {
  const { data } = await API.get(`/messages/${userId}`);
  return data;
};

export const getUsersForMessaging = async () => {
  const { data } = await API.get("/messages");
  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await API.delete(`/messages/${messageId}`);
  return data;
};

/* ================= EXAM RESULTS ================= */
export const getAllExamResults = async () => {
  const { data } = await API.get("/admin/exam-results");
  return data;
};

/* ================= HEALTH CHECK ================= */
export const checkServerHealth = async () => {
  try {
    const { data } = await API.get("/health");
    return { healthy: true, data };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

/* ================= UTILITY FUNCTIONS ================= */
// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Get user ID from localStorage
export const getUserId = () => {
  const user = getCurrentUser();
  return user?.id || user?._id || null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "Admin" || user?.role === "admin";
};

/* ================= COURSE ACCESS HELPERS ================= */
// ✅ UPDATED: Check if user can access course (free or paid)
export const canAccessCourse = async (courseId, studentId = null) => {
  try {
    // Use provided studentId or get from localStorage
    const userId = studentId || getUserId();
    
    if (!userId) {
      return { 
        canAccess: false, 
        hasFullAccess: false,
        isPaid: false,
        coursePrice: 0,
        reason: "Not logged in" 
      };
    }
    
    // ✅ IMPORTANT: Pehle course price check karo
    const coursePrice = await getCoursePrice(courseId);
    
    // ✅ FREE course hai to direct access
    if (coursePrice.price === 0) {
      return { 
        canAccess: true, 
        hasFullAccess: true,
        isPaid: true,  // Free course = automatically paid
        coursePrice: 0,
        reason: "Free course" 
      };
    }
    
    // ✅ Enrollment status check karo
    const enrollmentStatus = await getEnrollmentStatus(userId, courseId);
    
    if (!enrollmentStatus.isEnrolled) {
      return { 
        canAccess: false, 
        hasFullAccess: false,
        isPaid: false,
        coursePrice: coursePrice.price,
        reason: "Not enrolled" 
      };
    }
    
    if (enrollmentStatus.isPaid) {
      return { 
        canAccess: true, 
        hasFullAccess: true,
        isPaid: true,
        coursePrice: coursePrice.price,
        reason: "Paid enrollment" 
      };
    }
    
    return { 
      canAccess: false, 
      hasFullAccess: false,
      isPaid: false,
      coursePrice: coursePrice.price,
      reason: "Payment required" 
    };
  } catch (error) {
    console.error("Error checking course access:", error);
    return { 
      canAccess: false, 
      hasFullAccess: false,
      isPaid: false,
      coursePrice: 0,
      reason: "Error checking access" 
    };
  }
};

// ✅ UPDATED: Get filtered lectures based on payment status
export const getFilteredLectures = async (courseId, studentId = null) => {
  try {
    // Use provided studentId or get from localStorage
    const userId = studentId || getUserId();
    
    const result = await getLecturesByCourse(courseId, userId);
    
    // If no studentId provided or error, return all lectures
    if (!userId || !result.lectures) {
      return { 
        lectures: result.lectures || [], 
        hasFullAccess: false,
        isPaid: false,
        coursePrice: result.coursePrice || 0
      };
    }
    
    // ✅ IMPORTANT: Check if course is free FIRST
    if (result.coursePrice === 0) {
      return { 
        lectures: result.lectures, 
        hasFullAccess: true,
        isPaid: true,  // Free course = automatically paid
        coursePrice: 0,
        message: "Free course - all lectures available"
      };
    }
    
    // If user has paid, return all lectures
    if (result.isPaidStudent || result.hasFullAccess) {
      return { 
        lectures: result.lectures, 
        hasFullAccess: true,
        isPaid: true,
        coursePrice: result.coursePrice || 0
      };
    }
    
    // For unpaid paid courses, filter to show only free preview lectures
    const filteredLectures = result.lectures.filter(lecture => 
      lecture.isFreePreview === true
    );
    
    return { 
      lectures: filteredLectures, 
      hasFullAccess: false,
      isPaid: false,
      coursePrice: result.coursePrice || 0,
      message: "Showing free preview lectures only. Purchase course to access all content."
    };
  } catch (error) {
    console.error("Error getting filtered lectures:", error);
    return { 
      lectures: [], 
      hasFullAccess: false,
      isPaid: false,
      coursePrice: 0,
      error: error.message 
    };
  }
};

/* ================= PAYMENT HELPER FUNCTIONS ================= */
// Mock payment processor (replace with real payment gateway)
export const mockPaymentProcessor = async (paymentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: `mock_pay_${Date.now()}`,
        transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
        amount: paymentData.amount,
        currency: "INR",
        status: "completed",
        timestamp: new Date().toISOString()
      });
    }, 1500);
  });
};

// Process payment and update enrollment
export const completePaymentProcess = async (courseId, paymentMethod, amount) => {
  try {
    const studentId = getUserId();
    
    if (!studentId) {
      throw new Error("User not logged in");
    }
    
    // Process payment (mock or real)
    const paymentResult = await mockPaymentProcessor({
      amount,
      method: paymentMethod,
      courseId,
      studentId
    });
    
    if (!paymentResult.success) {
      throw new Error("Payment failed");
    }
    
    // Update backend with payment info
    const paymentResponse = await processPayment(studentId, courseId, {
      paymentMethod,
      amount: paymentResult.amount,
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId
    });
    
    return {
      success: true,
      message: "Payment successful! Course unlocked.",
      payment: paymentResult,
      enrollment: paymentResponse
    };
  } catch (error) {
    console.error("Payment process error:", error);
    return {
      success: false,
      message: error.message || "Payment failed. Please try again."
    };
  }
};

/* ================= EXPORT HELPERS ================= */
export const getAllCourses = getCourses;
export const getAllLectures = getLectures;

export default API;










// import axios from "axios";

// /* ================= AXIOS INSTANCE ================= */
// // const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// const BASE_URL = "http://localhost:5000/api";

// const API = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
//   timeout: 30000, // 30 seconds timeout
//   headers: {
//     "Content-Type": "application/json",
//   }
// });

// /* ================= TOKEN INTERCEPTOR ================= */
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// /* ================= RESPONSE INTERCEPTOR ================= */
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem("token");
//       localStorage.removeItem("userInfo");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// /* ================= AUTH ================= */
// export const registerUser = async (userData) => {
//   const { data } = await API.post("/auth/register", userData);
//   return data;
// };

// export const loginUser = async (credentials) => {
//   const { data } = await API.post("/auth/login", credentials);
//   localStorage.setItem("token", data.token);
//   localStorage.setItem("userInfo", JSON.stringify(data));
//   return data;
// };

// export const logoutUser = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("userInfo");
// };

// /* ================= USERS (ADMIN) ================= */
// export const getAllUsers = async () => {
//   const { data } = await API.get("/users");
//   return Array.isArray(data) ? data : [];
// };

// export const getUserById = async (id) => {
//   const { data } = await API.get(`/users/${id}`);
//   return data;
// };

// export const createUser = async (userData) => {
//   const { data } = await API.post("/users", userData);
//   return data;
// };

// export const updateUser = async (id, userData) => {
//   const { data } = await API.put(`/users/${id}`, userData);
//   return data;
// };

// export const deleteUser = async (id) => {
//   const { data } = await API.delete(`/users/${id}`);
//   return data;
// };

// /* ================= COURSES ================= */
// export const getCourses = async () => {
//   const { data } = await API.get("/courses");
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.courses)) return data.courses;
//   return [];
// };

// export const getCourseById = async (id) => {
//   const { data } = await API.get(`/courses/${id}`);
//   return data;
// };

// export const createCourse = async (formData) => {
//   const { data } = await API.post("/courses/create", formData);
//   return data;
// };

// export const updateCourse = async (id, formData) => {
//   const { data } = await API.put(`/courses/update/${id}`, formData);
//   return data;
// };

// export const deleteCourse = async (id) => {
//   const { data } = await API.delete(`/courses/delete/${id}`);
//   return data;
// };

// // ✅ Get course price
// export const getCoursePrice = async (courseId) => {
//   const { data } = await API.get(`/courses/${courseId}/price`);
//   return data;
// };

// /* ================= ENROLLMENTS ================= */
// // ✅ Enroll student in course with optional payment status
// export const enrollStudentInCourse = async (studentId, courseId, isPaid = false) => {
//   const { data } = await API.post("/enrollments/enroll", { 
//     studentId, 
//     courseId, 
//     isPaid 
//   });
//   return data;
// };

// // ✅ Get student enrollments
// export const getStudentEnrollments = async (studentId) => {
//   const { data } = await API.get(`/enrollments/student/${studentId}`);
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.enrollments)) return data.enrollments;
//   if (Array.isArray(data?.data)) return data.data;
//   return [];
// };

// // ✅ Check enrollment status with payment info
// export const getEnrollmentStatus = async (studentId, courseId) => {
//   const { data } = await API.get(`/enrollments/status/${studentId}/${courseId}`);
//   return data;
// };

// // ✅ Get all enrollments for admin with payment details
// export const getAdminEnrollments = async () => {
//   const { data } = await API.get("/enrollments/admin/all");
//   return data;
// };

// // ✅ Update enrollment payment status
// export const updateEnrollmentPayment = async (enrollmentId, paymentData) => {
//   const { data } = await API.patch(`/enrollments/${enrollmentId}/payment`, paymentData);
//   return data;
// };

// // ✅ Remove enrollment
// export const removeEnrollment = async (enrollmentId) => {
//   const { data } = await API.delete(`/enrollments/${enrollmentId}`);
//   return data;
// };

// /* ================= ADMIN ENROLLMENT ================= */
// export const grantFreeAccessToStudent = async (studentId, courseId) => {
//   const token = localStorage.getItem("token");

//   const res = await axios.post(
//     `/api/admin/enroll/free`,
//     { studentId, courseId },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return res.data;
// };

// /* ================= PAYMENTS ================= */
// // ✅ Process payment
// export const processPayment = async (studentId, courseId, paymentData) => {
//   const { data } = await API.post("/payments/process", {
//     studentId,
//     courseId,
//     ...paymentData
//   });
//   return data;
// };

// // ✅ Check payment status
// export const checkPaymentStatus = async (studentId, courseId) => {
//   const { data } = await API.get("/payments/status", {
//     params: { studentId, courseId }
//   });
//   return data;
// };

// // ✅ Get payment history
// export const getPaymentHistory = async (studentId) => {
//   const { data } = await API.get(`/payments/history/${studentId}`);
//   return data;
// };

// // ✅ Get admin payments dashboard
// export const getAdminPayments = async () => {
//   const { data } = await API.get("/payments/admin");
//   return data;
// };

// /* ================= PROGRESS ================= */
// export const trackLectureProgress = async (studentId, courseId, lectureId) => {
//   const { data } = await API.post("/progress/track", { studentId, courseId, lectureId });
//   return data;
// };

// export const getProgress = async (studentId, courseId) => {
//   const { data } = await API.get(`/progress/${studentId}/${courseId}`);
//   const completed = data?.completedLectures?.length || 0;
//   const total = data?.totalLectures || 0;
//   return { 
//     ...data, 
//     progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0 
//   };
// };

// /* ================= LECTURES ================= */
// export const getLectures = async () => {
//   const { data } = await API.get("/lectures");
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.lectures)) return data.lectures;
//   return [];
// };

// // ✅ UPDATED: Get lectures with payment check
// export const getLecturesByCourse = async (courseId, studentId = null) => {
//   let url = `/lectures/course/${courseId}`;
  
//   // Add studentId as query parameter for backend to check access
//   if (studentId) {
//     url += `?studentId=${studentId}`;
//   }
  
//   const { data } = await API.get(url);
  
//   console.log("getLecturesByCourse raw response:", data);
  
//   // Handle different response formats
//   if (Array.isArray(data)) {
//     return { 
//       lectures: data, 
//       isPaidStudent: false,
//       hasFullAccess: false,
//       coursePrice: 0 
//     };
//   }
  
//   if (data?.lectures) {
//     return {
//       lectures: data.lectures || [],
//       isPaidStudent: data.isPaidStudent || false,
//       hasFullAccess: data.hasFullAccess || data.isPaidStudent || false,
//       coursePrice: data.coursePrice || 0,
//       hasAccess: data.hasAccess || data.hasFullAccess || false
//     };
//   }
  
//   return { 
//     lectures: [], 
//     isPaidStudent: false,
//     hasFullAccess: false,
//     coursePrice: 0,
//     hasAccess: false 
//   };
// };

// export const getLectureById = async (id) => {
//   const { data } = await API.get(`/lectures/${id}`);
//   return data;
// };

// export const createLecture = async (formData) => {
//   const { data } = await API.post("/lectures/create", formData);
//   return data;
// };

// export const updateLecture = async (id, formData) => {
//   const { data } = await API.put(`/lectures/update/${id}`, formData);
//   return data;
// };

// export const deleteLecture = async (id) => {
//   const { data } = await API.delete(`/lectures/delete/${id}`);
//   return data;
// };

// /* ================= EXAMS ================= */
// export const getAllExams = async () => {
//   const { data } = await API.get("/exams");
//   return data;
// };

// export const getExamById = async (id) => {
//   const { data } = await API.get(`/exams/${id}`);
//   return data;
// };

// export const createExam = async (examData) => {
//   const { data } = await API.post("/exams", examData);
//   return data;
// };

// export const updateExam = async (id, examData) => {
//   const { data } = await API.put(`/exams/${id}`, examData);
//   return data;
// };

// export const deleteExam = async (id) => {
//   const { data } = await API.delete(`/exams/${id}`);
//   return data;
// };

// /* ================= QUESTIONS ================= */
// export const getQuestionsByExam = async (examId) => {
//   const { data } = await API.get(`/questions/exam/${examId}`);
//   return Array.isArray(data) ? data : [];
// };

// export const addQuestion = async (questionData) => {
//   const { data } = await API.post("/questions", questionData);
//   return data;
// };

// export const updateQuestion = async (questionId, questionData) => {
//   const { data } = await API.put(`/questions/${questionId}`, questionData);
//   return data;
// };

// export const deleteQuestion = async (questionId) => {
//   const { data } = await API.delete(`/questions/${questionId}`);
//   return data;
// };

// /* ================= ATTEMPTS ================= */
// export const submitAttempt = async (attemptData) => {
//   const { data } = await API.post("/attempts", attemptData);
//   return data;
// };

// export const getAttemptsByUser = async (userId) => {
//   const { data } = await API.get(`/attempts/user/${userId}`);
//   return Array.isArray(data) ? data : data?.attempts || [];
// };

// export const getAttemptsByExam = async (examId) => {
//   const { data } = await API.get(`/attempts/exam/${examId}`);
//   return Array.isArray(data) ? data : data?.attempts || [];
// };

// export const getExamStatus = async (studentId, examId) => {
//   const { data } = await API.get(`/attempts/status/${studentId}/${examId}`);
//   return data;
// };

// /* ================= MESSAGES ================= */
// export const sendMessage = async (messageData) => {
//   const { data } = await API.post("/messages", messageData);
//   return data;
// };

// export const getMessages = async (userId) => {
//   const { data } = await API.get(`/messages/${userId}`);
//   return data;
// };

// export const getUsersForMessaging = async () => {
//   const { data } = await API.get("/messages");
//   return data;
// };

// export const deleteMessage = async (messageId) => {
//   const { data } = await API.delete(`/messages/${messageId}`);
//   return data;
// };

// /* ================= EXAM RESULTS ================= */
// export const getAllExamResults = async () => {
//   const { data } = await API.get("/admin/exam-results");
//   return data;
// };

// /* ================= HEALTH CHECK ================= */
// export const checkServerHealth = async () => {
//   try {
//     const { data } = await API.get("/health");
//     return { healthy: true, data };
//   } catch (error) {
//     return { healthy: false, error: error.message };
//   }
// };

// /* ================= UTILITY FUNCTIONS ================= */
// // Get current user from localStorage
// export const getCurrentUser = () => {
//   try {
//     const userInfo = localStorage.getItem("userInfo");
//     return userInfo ? JSON.parse(userInfo) : null;
//   } catch (error) {
//     console.error("Error getting current user:", error);
//     return null;
//   }
// };

// // Get user ID from localStorage
// export const getUserId = () => {
//   const user = getCurrentUser();
//   return user?.id || user?._id || null;
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   return !!localStorage.getItem("token");
// };

// // Check if user is admin
// export const isAdmin = () => {
//   const user = getCurrentUser();
//   return user?.role === "Admin" || user?.role === "admin";
// };

// /* ================= COURSE ACCESS HELPERS ================= */
// // ✅ FIXED: Check if user can access course (free or paid)
// export const canAccessCourse = async (courseId, studentId = null) => {
//   try {
//     console.log("🔍 canAccessCourse called:", { courseId, studentId });
    
//     // Use provided studentId or get from localStorage
//     const userId = studentId || getUserId();
    
//     if (!userId) {
//       console.log("❌ No user ID found");
//       return { 
//         canAccess: false, 
//         hasFullAccess: false,
//         isPaid: false,
//         coursePrice: 0,
//         reason: "Not logged in" 
//       };
//     }
    
//     console.log("✅ User ID:", userId);
    
//     // ✅ STEP 1: Get course price with error handling
//     let coursePrice = 0;
//     try {
//       console.log("📊 Fetching course price...");
//       const priceData = await getCoursePrice(courseId);
//       console.log("Price data response:", priceData);
//       coursePrice = priceData?.price || 0;
//     } catch (err) {
//       console.warn("⚠️ Could not fetch course price via getCoursePrice, trying getCourseById:", err);
//       try {
//         const courseData = await getCourseById(courseId);
//         console.log("Course data response:", courseData);
//         coursePrice = courseData?.price || 0;
//       } catch (err2) {
//         console.error("❌ Could not fetch course details:", err2);
//         coursePrice = 0;
//       }
//     }
    
//     console.log("💰 Course Price:", coursePrice);
    
//     // ✅ STEP 2: FREE course = automatic full access (NO enrollment check needed)
//     if (coursePrice === 0) {
//       console.log("🎉 FREE COURSE - Granting full access");
//       return { 
//         canAccess: true, 
//         hasFullAccess: true,
//         isPaid: true,  // Free course = automatically paid
//         coursePrice: 0,
//         reason: "Free course" 
//       };
//     }
    
//     // ✅ STEP 3: For PAID courses, check enrollment
//     console.log("💳 Paid course - checking enrollment status...");
//     try {
//       const enrollmentStatus = await getEnrollmentStatus(userId, courseId);
//       console.log("Enrollment status:", enrollmentStatus);
      
//       if (!enrollmentStatus?.isEnrolled) {
//         console.log("❌ User not enrolled");
//         return { 
//           canAccess: false, 
//           hasFullAccess: false,
//           isPaid: false,
//           coursePrice: coursePrice,
//           reason: "Not enrolled" 
//         };
//       }
      
//       if (enrollmentStatus.isPaid) {
//         console.log("✅ User has PAID enrollment");
//         return { 
//           canAccess: true, 
//           hasFullAccess: true,
//           isPaid: true,
//           coursePrice: coursePrice,
//           reason: "Paid enrollment" 
//         };
//       }
      
//       console.log("⚠️ User enrolled but NOT paid");
//       return { 
//         canAccess: true,  // Can access free preview lectures
//         hasFullAccess: false,
//         isPaid: false,
//         coursePrice: coursePrice,
//         reason: "Payment required for full access" 
//       };
      
//     } catch (enrollErr) {
//       console.error("❌ Could not check enrollment:", enrollErr);
//       return { 
//         canAccess: false, 
//         hasFullAccess: false,
//         isPaid: false,
//         coursePrice: coursePrice,
//         reason: "Not enrolled" 
//       };
//     }
    
//   } catch (error) {
//     console.error("❌ Error in canAccessCourse:", error);
//     return { 
//       canAccess: false, 
//       hasFullAccess: false,
//       isPaid: false,
//       coursePrice: 0,
//       reason: "Error checking access" 
//     };
//   }
// };

// // ✅ FIXED: Get filtered lectures based on payment status
// export const getFilteredLectures = async (courseId, studentId = null) => {
//   try {
//     console.log("📚 getFilteredLectures called:", { courseId, studentId });
    
//     // Use provided studentId or get from localStorage
//     const userId = studentId || getUserId();
    
//     const result = await getLecturesByCourse(courseId, userId);
//     console.log("getLecturesByCourse result:", result);
    
//     // If no lectures or error
//     if (!result.lectures || result.lectures.length === 0) {
//       console.log("❌ No lectures found in response");
//       return { 
//         lectures: [], 
//         hasFullAccess: false,
//         isPaid: false,
//         coursePrice: result.coursePrice || 0
//       };
//     }
    
//     console.log(`📖 Found ${result.lectures.length} lectures`);
    
//     // ✅ CRITICAL: Check if course is FREE first
//     const coursePrice = result.coursePrice || 0;
//     console.log("💰 Course price from result:", coursePrice);
    
//     if (coursePrice === 0) {
//       console.log("🎉 FREE COURSE - Returning all lectures");
//       return { 
//         lectures: result.lectures, 
//         hasFullAccess: true,
//         isPaid: true,  // Free course = automatically paid
//         coursePrice: 0,
//         message: "Free course - all lectures available"
//       };
//     }
    
//     // ✅ For PAID courses, check payment status
//     const isPaidStudent = result.isPaidStudent || result.hasFullAccess || false;
//     console.log("💳 Is paid student?", isPaidStudent);
    
//     if (isPaidStudent) {
//       console.log("✅ PAID STUDENT - Returning all lectures");
//       return { 
//         lectures: result.lectures, 
//         hasFullAccess: true,
//         isPaid: true,
//         coursePrice: coursePrice
//       };
//     }
    
//     // ✅ Unpaid students only see free preview lectures
//     console.log("⚠️ UNPAID STUDENT - Filtering to free preview only");
//     const filteredLectures = result.lectures.filter(lecture => 
//       lecture.isFreePreview === true
//     );
    
//     console.log(`🔒 Filtered to ${filteredLectures.length} free preview lectures out of ${result.lectures.length} total`);
    
//     return { 
//       lectures: filteredLectures, 
//       hasFullAccess: false,
//       isPaid: false,
//       coursePrice: coursePrice,
//       message: `Showing ${filteredLectures.length} free preview lectures. Purchase course to access all ${result.lectures.length} lectures.`
//     };
    
//   } catch (error) {
//     console.error("❌ Error in getFilteredLectures:", error);
//     return { 
//       lectures: [], 
//       hasFullAccess: false,
//       isPaid: false,
//       coursePrice: 0,
//       error: error.message 
//     };
//   }
// };

// /* ================= PAYMENT HELPER FUNCTIONS ================= */
// // Mock payment processor (replace with real payment gateway)
// export const mockPaymentProcessor = async (paymentData) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         paymentId: `mock_pay_${Date.now()}`,
//         transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
//         amount: paymentData.amount,
//         currency: "INR",
//         status: "completed",
//         timestamp: new Date().toISOString()
//       });
//     }, 1500);
//   });
// };

// // Process payment and update enrollment
// export const completePaymentProcess = async (courseId, paymentMethod, amount) => {
//   try {
//     const studentId = getUserId();
    
//     if (!studentId) {
//       throw new Error("User not logged in");
//     }
    
//     // Process payment (mock or real)
//     const paymentResult = await mockPaymentProcessor({
//       amount,
//       method: paymentMethod,
//       courseId,
//       studentId
//     });
    
//     if (!paymentResult.success) {
//       throw new Error("Payment failed");
//     }
    
//     // Update backend with payment info
//     const paymentResponse = await processPayment(studentId, courseId, {
//       paymentMethod,
//       amount: paymentResult.amount,
//       paymentId: paymentResult.paymentId,
//       transactionId: paymentResult.transactionId
//     });
    
//     return {
//       success: true,
//       message: "Payment successful! Course unlocked.",
//       payment: paymentResult,
//       enrollment: paymentResponse
//     };
//   } catch (error) {
//     console.error("Payment process error:", error);
//     return {
//       success: false,
//       message: error.message || "Payment failed. Please try again."
//     };
//   }
// };

// /* ================= EXPORT HELPERS ================= */
// export const getAllCourses = getCourses;
// export const getAllLectures = getLectures;

// export default API;









// import axios from "axios";

// /* ================= AXIOS INSTANCE ================= */
// // const API = axios.create({
// //   baseURL: "http://localhost:5000/api",
// // });


// const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// const API = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true
// });


// /* ================= TOKEN INTERCEPTOR ================= */
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// /* ================= AUTH ================= */
// export const registerUser = async (userData) => {
//   const { data } = await API.post("/auth/register", userData);
//   return data;
// };

// export const loginUser = async (credentials) => {
//   const { data } = await API.post("/auth/login", credentials);
//   localStorage.setItem("token", data.token);
//   localStorage.setItem("userInfo", JSON.stringify(data));
//   return data;
// };

// export const logoutUser = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("userInfo");
// };

// /* ================= USERS (ADMIN) ================= */
// export const getAllUsers = async () => {
//   const { data } = await API.get("/users");
//   return Array.isArray(data) ? data : [];
  
// export const createUser = async (userData) => {
//   const { data } = await API.post("/users", userData);
//   return data;
// };

// export const updateUser = async (id, userData) => {
//   const { data } = await API.put(`/users/${id}`, userData);
//   return data;
// };

// export const deleteUser = async (id) => {
//   const { data } = await API.delete(`/users/${id}`);
//   return data;
// };

// /* ================= COURSES ================= */
// export const getCourses = async () => {
//   const { data } = await API.get("/courses");
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.courses)) return data.courses;
//   return [];
// };

// export const getCourseById = async (id) => {
//   const { data } = await API.get(`/courses/${id}`);
//   return data;
// };

// export const createCourse = async (formData) => {
//   const { data } = await API.post("/courses/create", formData);
//   return data;
// };

// export const updateCourse = async (id, formData) => {
//   const { data } = await API.put(`/courses/update/${id}`, formData);
//   return data;
// };

// export const deleteCourse = async (id) => {
//   const { data } = await API.delete(`/courses/delete/${id}`);
//   return data;
// };

// /* ================= ENROLLMENTS ================= */
// export const enrollStudentInCourse = async (studentId, courseId) => {
//   const { data } = await API.post("/enrollments/enroll", { studentId, courseId });
//     return data;
// };

// export const getStudentEnrollments = async (studentId) => {
//   const { data } = await API.get(`/enrollments/student/${studentId}`);
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.enrollments)) return data.enrollments;
//   if (Array.isArray(data?.data)) return data.data;
//   return [];
// };

// export const removeEnrollment = async (enrollmentId) => {
//   const { data } = await API.delete(`/enrollments/${enrollmentId}`);
//   return data;
// };

// /* ================= PROGRESS ================= */
// export const trackLectureProgress = async (studentId, courseId, lectureId) => {
//   const { data } = await API.post("/progress/track", { studentId, courseId, lectureId });
//   return data;
// };

// export const getProgress = async (studentId, courseId) => {
//   const { data } = await API.get(`/progress/${studentId}/${courseId}`);
//   const completed = data?.completedLectures?.length || 0;
//   const total = data?.totalLectures || 0;
//   return { ...data, progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
// };

// /* ================= LECTURES ================= */
// export const getLectures = async () => {
//   const { data } = await API.get("/lectures");
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.lectures)) return data.lectures;
//   return [];
// };

// export const getLecturesByCourse = async (courseId) => {
//   const { data } = await API.get(`/lectures/course/${courseId}`);
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.lectures)) return data.lectures;
//   return [];
// };
// export const getLectureById = async (id) => {
//   const { data } = await API.get(`/lectures/${id}`);
//   return data;
// };

// export const createLecture = async (formData) => {
//   const { data } = await API.post("/lectures/create", formData);
//   return data;
// };

// export const updateLecture = async (id, formData) => {
//   const { data } = await API.put(`/lectures/update/${id}`, formData);
//   return data;
// };

// export const deleteLecture = async (id) => {
//   const { data } = await API.delete(`/lectures/delete/${id}`);
//   return data;
// };

// /* ================= EXAMS ================= */
// export const getAllExams = async () => {
//   const { data } = await API.get("/exams");
//   return data;
// };

// export const getExamById = async (id) => {
//   const { data } = await API.get(`/exams/${id}`);
//   return data;
// };

// export const createExam = async (examData) => {
//   const { data } = await API.post("/exams", examData);
//   return data;
// };

// export const updateExam = async (id, examData) => {
//   const { data } = await API.put(`/exams/${id}`, examData);
//   return data;
// };

// export const deleteExam = async (id) => {
//   const { data } = await API.delete(`/exams/${id}`);
//   return data;
// };

// /* ================= QUESTIONS ================= */
// export const getQuestionsByExam = async (examId) => {
//     const { data } = await API.get(`/questions/exam/${examId}`);
//   return Array.isArray(data) ? data : [];
// };

// export const addQuestion = async (questionData) => {
//   const { data } = await API.post("/questions", questionData);
//   return data;
// };

// export const updateQuestion = async (questionId, questionData) => {
//   const { data } = await API.put(`/questions/${questionId}`, questionData);
//   return data;
// };

// export const deleteQuestion = async (questionId) => {
//   const { data } = await API.delete(`/questions/${questionId}`);
//   return data;
// };

// /* ================= ATTEMPTS ================= */
// export const submitAttempt = async (attemptData) => {
//   const { data } = await API.post("/attempts", attemptData);
//   return data;
// };

// export const getAttemptsByUser = async (userId) => {
//   const { data } = await API.get(`/attempts/user/${userId}`);
//   return Array.isArray(data) ? data : data?.attempts || [];
// };

// export const getAttemptsByExam = async (examId) => {
//   const { data } = await API.get(`/attempts/exam/${examId}`);
//   return Array.isArray(data) ? data : data?.attempts || [];
// };

// export const getExamStatus = async (studentId, examId) => {
//   const { data } = await API.get(`/attempts/status/${studentId}/${examId}`);
//   return data;
// };

// /* ================= MESSAGES ================= */
// export const sendMessage = async (messageData) => {
//   const { data } = await API.post("/messages", messageData);
//   return data;
// };
// export const getMessages = async (userId) => {
//   const { data } = await API.get(`/messages/${userId}`);
//   return data;
// };

// export const getUsersForMessaging = async () => {
//   const { data } = await API.get("/messages");
//   return data;
// };

// export const deleteMessage = async (messageId) => {
//   const { data } = await API.delete(`/messages/${messageId}`);
//   return data;
// };

// /* ================= NEW: EXAM RESULTS ================= */
// export const getAllExamResults = async () => {
//   const { data } = await API.get("/admin/exam-results");
//   return data;
// };


// /* ================= EXPORT HELPERS ================= */
// export const getAllCourses = getCourses;
// export const getAllLectures = getLectures;

// export default API;
