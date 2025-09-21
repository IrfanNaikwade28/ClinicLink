import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const PatientsList = () => {
  const { users, getAllUsers, removeUser, aToken } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllUsers();
  }, [aToken, getAllUsers]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Patients</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.phone || '-'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${u.name}? This will remove their appointments too.`)) {
                        removeUser(u._id);
                      }
                    }}
                    className="px-3 py-1 rounded-full border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsList;
