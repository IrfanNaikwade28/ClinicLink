import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (dToken) {
      getAppointments(search);
    }
  }, [dToken, search, getAppointments]);

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-lg font-medium">All Appointments</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name/email"
          className="border rounded px-3 py-1 text-sm w-64"
        />
      </div>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh]">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.2fr_1.2fr] gap-4 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
          <p>Report</p>
        </div>

        {[...appointments].reverse().map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.2fr_1.2fr] gap-4 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />{" "}
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "ONLINE" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-500 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt="Cancel appointment"
                  title="Cancel appointment"
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt="Mark completed"
                  title="Mark completed"
                />
              </div>
            )}
            <div className="flex justify-start">
              <button
                onClick={() =>
                  navigate(`/doctor-report?patientId=${item.userId}&appointmentId=${item._id}`)
                }
                className="text-xs border border-primary rounded-full px-4 py-1 hover:bg-primary hover:text-white whitespace-nowrap"
              >
                Open Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
