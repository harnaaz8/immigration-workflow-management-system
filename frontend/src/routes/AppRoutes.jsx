import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminStudentView from "../pages/AdminStudentView";
import StaffProfile from "../pages/StaffProfile";
import Login from "../pages/Login";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import ReceptionDashboard from "../pages/ReceptionDashboard";
import EnquiryDashboard from "../pages/EnquiryDashboard";
import CounsellorDashboard from "../pages/CounsellorDashboard";
import AdmissionDashboard from "../pages/AdmissionDashboard";
import EnrollmentDashboard from "../pages/EnrollmentDashboard";
import VisaDashboard from "../pages/VisaDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import CreateStudent from "../pages/CreateStudent";
import Students from "../pages/Students";
import StudentCase from "../pages/StudentCase";
import StaffManagement from "../pages/StaffManagement";
import MyStudents from "../pages/MyStudents";
import Profile from "../pages/Profile";
import FranchiseManagement from '../pages/FranchiseManagement';
import InstituteManagement from '../pages/InstituteManagement';
import NotificationDispatcher from '../pages/NotificationDispatcher';
import ExpenseManagement from '../pages/ExpenseManagement';
import TaskManagement from '../pages/TaskManagement';
import RoleGuard from "../components/RoleGuard";
import Sidebar from "../components/Sidebar";

/**
 * 🛠️ CENTRAL APPLICATION LAYOUT WRAPPER
 * Keeps the sidebar locked on the left, and adds consistent 30px padding
 * around all workspace views rendering on the right.
 */
const AppLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#f3f4f6" }}>
      {/* Structural Global Sidebar System */}
      <Sidebar />
      
      {/* Content Canvas Container with padding to keep items beautifully framed */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, padding: "30px", boxSizing: "border-box" }}>
        <Outlet />
      </div>
    </div>
  );
};

const DashboardJunction = () => {
  const role = localStorage.getItem("role")?.toUpperCase();

  switch (role) {
    case "SUPER_ADMIN":
    case "SUPERADMIN":
      return <Navigate to="/super-admin" replace />;
    case "RECEPTIONIST": 
      return <Navigate to="/reception" replace />;
    case "ENQUIRY_OFFICER":
      return <Navigate to="/enquiry" replace />;
    case "COUNSELLOR":
      return <Navigate to="/counsellor" replace />;
    case "ADMISSION_OFFICER":
      return <Navigate to="/admission" replace />;
    case "ENROLLMENT_OFFICER":
      return <Navigate to="/enrollment" replace />;
    case "VISA_OFFICER":
      return <Navigate to="/visa" replace />;
    case "STUDENT":
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ACCESS CHANNELS */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED WORKSPACE ECOSYSTEM */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardJunction />} />
          <Route path="/admin-student/:id" element={<AdminStudentView />} />
          <Route path="/staff-profile/:id" element={<StaffProfile />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/reception" element={<ReceptionDashboard />} />
          <Route path="/enquiry" element={<EnquiryDashboard />} />
          <Route path="/counsellor" element={<CounsellorDashboard />} />
          <Route path="/admission" element={<AdmissionDashboard />} />
          <Route path="/enrollment" element={<EnrollmentDashboard />} />
          <Route path="/visa" element={<VisaDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/tasks" element={
  <RoleGuard allowedRoles={['SUPER_ADMIN', 'SUPERADMIN']}>
    <TaskManagement />
  </RoleGuard>
} />
          {/* Guarded Super Admin Modules */}
          <Route path="/franchises" element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'SUPERADMIN']}><FranchiseManagement /></RoleGuard>} />
          <Route path="/institutes" element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'SUPERADMIN']}><InstituteManagement /></RoleGuard>} />
          <Route path="/alerts" element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'SUPERADMIN']}><NotificationDispatcher /></RoleGuard>} />
          <Route path="/expenses" element={<RoleGuard allowedRoles={['SUPER_ADMIN', 'SUPERADMIN']}><ExpenseManagement /></RoleGuard>} />
          
          {/* Core Operations Queues */}
          <Route path="/create-student" element={<CreateStudent />} />
          <Route path="/my-students" element={<MyStudents />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student-case/:id" element={<StudentCase />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/staff" element={<StaffManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;