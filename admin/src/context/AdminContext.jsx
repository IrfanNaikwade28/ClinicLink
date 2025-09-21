import {
  fetchAllDoctors,
  toggleDoctorAvailability,
  fetchAllAppointments,
  cancelAdminAppointment,
  fetchAdminDashboard,
  listUsers as apiListUsers,
  deleteUser as apiDeleteUser,
  deleteDoctor as apiDeleteDoctor,
} from "../api/admin";
import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("atoken") ? localStorage.getItem("atoken") : ""
  );
  
  // Admin logout function
  const logoutAdmin = () => {
    setAToken("");
    localStorage.removeItem("atoken");
    localStorage.removeItem("dtoken"); // Clear doctor token too for safety
  };
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [users, setUsers] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // still exposed for legacy components

  const getAllDoctors = async () => {
    try {
  const { data } = await fetchAllDoctors();
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
  const { data } = await toggleDoctorAvailability(docId);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async (search) => {
    try {
  const { data } = await fetchAllAppointments(search);

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
  const { data } = await cancelAdminAppointment(appointmentId);
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
  const { data } = await fetchAdminDashboard();

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Users Management
  const getAllUsers = async () => {
    try {
      const { data } = await apiListUsers();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeUser = async (userId) => {
    try {
      const { data } = await apiDeleteUser(userId);
      if (data.success) {
        toast.success(data.message);
        getAllUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Doctors Management
  const removeDoctor = async (doctorId) => {
    try {
      const { data } = await apiDeleteDoctor(doctorId);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    logoutAdmin,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
  getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    // Users
    users,
    getAllUsers,
    removeUser,
    // Doctors delete
    removeDoctor,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

AdminContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
