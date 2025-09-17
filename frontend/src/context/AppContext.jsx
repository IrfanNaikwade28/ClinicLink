import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { listDoctors, getUserProfile } from "../api/auth";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDoctorsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await listDoctors();
      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfileData = async () => {
    try {
  const { data } = await getUserProfile();
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
  loadUserProfileData,
  loading,
  error,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
