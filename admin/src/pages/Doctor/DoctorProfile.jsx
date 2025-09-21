import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { fetchProfile as apiGetProfile, updateProfile as apiUpdateProfile } from "../../api/doctor";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const formData = new FormData();

      // Add only editable fields
      formData.append("about", profileData.about);
      formData.append("fees", profileData.fees);
      formData.append("phone", profileData.phone || "");
      formData.append("available", profileData.available);

      const { data } = await apiUpdateProfile(formData, true); // true for multipart

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        // Reload latest profile
        const resp = await apiGetProfile();
        if (resp.data?.success) setProfileData(resp.data.profile);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await apiGetProfile();
      if (data.success) {
        setProfileData(data.profile);
      }
    })();
  }, [dToken, setProfileData]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          {/* Profile Image Section (Read-only) */}
          <div className="flex justify-center items-center size-60 rounded-full overflow-hidden bg-primary/5">
            <img
              className="w-full h-full object-cover"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* ------- Doc Info: name, degree, experience (Read-only) ------- */}

            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700 mb-2">
              {profileData.name}
            </p>

            <div className="flex items-center gap-2 mt-1 text-gray-600 mb-2">
              <div>
                <p>
                  {profileData.degree} - {profileData.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full mt-1">
                  {profileData.experience}
                </button>
              </div>
            </div>

            {/* ------- Doc About (Editable) ------- */}
            <div className="mb-4">
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3 mb-1">
                About:
              </p>
              {isEdit ? (
                <textarea
                  className="w-full bg-gray-50 p-2 rounded border"
                  rows={4}
                  value={profileData.about}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, about: e.target.value }))
                  }
                />
              ) : (
                <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                  {profileData.about}
                </p>
              )}
            </div>

            {/* Phone Field (Editable) */}
            <div className="flex gap-2 py-2">
              <p className="font-medium">Phone:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 px-2 py-1 rounded flex-1"
                  type="text"
                  placeholder="Phone number"
                  value={profileData.phone || ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-blue-400">{profileData.phone || "Not provided"}</p>
              )}
            </div>

            {/* Appointment Fee (Editable) */}
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    className="bg-gray-100 px-2 py-1 rounded w-24"
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
                name=""
                id=""
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
