import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { listReportsForPatient } from '../api/reports';
import { toast } from 'react-toastify';

const Reports = () => {
  const { userData } = useContext(AppContext);
  const [reports, setReports] = useState([]);
  const [active, setActive] = useState(null); // active report index

  useEffect(() => {
    const run = async () => {
      try {
        if (!userData?._id) return;
        const { data } = await listReportsForPatient(userData._id);
        if (data.success) {
          setReports(data.reports || []);
          setActive(0);
        } else {
          toast.error(data.message);
        }
      } catch (e) {
        toast.error(e.message);
      }
    };
    run();
  }, [userData?._id]);

  const activeReport = reports[active] || null;
  const latest = activeReport?.versions?.at(-1) || null;

  return (
    <div className="w-full max-w-4xl m-5">
      <p className="mb-3 text-lg font-medium">My Health Reports</p>
      <div className="bg-white border rounded p-4 grid md:grid-cols-[1fr_2fr] gap-4">
        <div className="border rounded p-3 max-h-[70vh] overflow-y-auto">
          <p className="text-sm font-medium mb-2">Reports</p>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-500">No reports yet.</p>
          ) : (
            <ul className="text-sm">
              {reports.map((r, idx) => (
                <li
                  key={r._id}
                  className={`px-3 py-2 rounded cursor-pointer ${idx === active ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
                  onClick={() => setActive(idx)}
                >
                  <div className="flex justify-between">
                    <span>Report #{idx + 1}</span>
                    <span className="text-xs text-gray-500">{new Date(r.updatedAt).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border rounded p-3">
          {activeReport ? (
            <div>
              <p className="text-sm font-medium">Current Status</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {latest?.status ? (
                  Object.entries(latest.status).map(([k, v]) => (
                    <div key={k} className="border rounded p-2 bg-gray-50">
                      <p className="text-gray-600 text-xs uppercase">{k}</p>
                      <p className="text-gray-800">{String(v)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No status fields.</p>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">Doctor Notes</p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{latest?.description || '-'}</p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium">Previous Versions</p>
                <div className="mt-2 max-h-56 overflow-y-auto border rounded">
                  {activeReport.versions?.length > 1 ? (
                    activeReport.versions
                      .slice(0, -1)
                      .reverse()
                      .map((v) => (
                        <div key={v._id || v.version} className="p-2 border-b last:border-b-0">
                          <p className="text-xs text-gray-500">Version {v.version} • {new Date(v.updatedAt).toLocaleString()}</p>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-2">{v.description || '-'}</p>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500 p-2">No previous versions.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a report to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
