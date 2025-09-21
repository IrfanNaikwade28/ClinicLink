import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createReport, updateReport, listReportsForPatient, fetchProfile } from '../../api/doctor';
import { toast } from 'react-toastify';

// Usage: navigate to /doctor-report?patientId=...&appointmentId=...
const ReportEditor = () => {
  const [params] = useSearchParams();
  const patientId = params.get('patientId');
  const appointmentId = params.get('appointmentId');

  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState({ bp: '', sugar: '', bmi: '' });
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState('');

  // Pick the correct report for this editor context:
  // 1) Prefer report tied to this appointment
  // 2) Fallback to a report authored by the current doctor (if any)
  const existingReport = useMemo(() => {
    if (!reports?.length) return null;
    const byAppointment = reports.find(r => String(r.appointmentId) === String(appointmentId));
    if (byAppointment) return byAppointment;
    if (doctorId) {
      const byDoctor = reports.find(r => String(r.doctorId) === String(doctorId));
      if (byDoctor) return byDoctor;
    }
    return null;
  }, [reports, appointmentId, doctorId]);

  useEffect(() => {
    const run = async () => {
      try {
        if (!patientId) return;
        const { data } = await listReportsForPatient(patientId);
        if (data.success) setReports(data.reports || []);
      } catch (e) {
        toast.error(e.message);
      }
    };
    run();
  }, [patientId]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await fetchProfile();
        if (data?.success && data?.profile?._id) {
          setDoctorId(data.profile._id);
        }
      } catch (e) {
        // Non-fatal for editor; only impacts selecting fallback report
        console.warn('Failed to load doctor profile for ReportEditor:', e);
      }
    };
    loadProfile();
  }, []);

  const onSave = async () => {
    try {
      setLoading(true);
      if (existingReport) {
        const { data } = await updateReport(existingReport._id, { status, description });
        if (data.success) {
          toast.success('Report updated');
          setReports((prev) => prev.map(r => r._id === data.report._id ? data.report : r));
          // Optional UX: clear inputs after successful append
          setStatus({ bp: '', sugar: '', bmi: '' });
          setDescription('');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await createReport({ patientId, appointmentId, status, description });
        if (data.success) {
          toast.success('Report created');
          setReports([data.report, ...reports]);
          setStatus({ bp: '', sugar: '', bmi: '' });
          setDescription('');
        } else {
          toast.error(data.message);
        }
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const latest = existingReport?.versions?.at(-1) || null;

  return (
    <div className="w-full max-w-3xl m-5">
      <p className="mb-3 text-lg font-medium">Patient Report</p>
      <div className="bg-white border rounded p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600">Blood Pressure</label>
            <input value={status.bp} onChange={(e) => setStatus({ ...status, bp: e.target.value })} className="border rounded px-3 py-2 w-full" placeholder="e.g., 120/80" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Sugar</label>
            <input value={status.sugar} onChange={(e) => setStatus({ ...status, sugar: e.target.value })} className="border rounded px-3 py-2 w-full" placeholder="e.g., 95 mg/dL" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">BMI</label>
            <input value={status.bmi} onChange={(e) => setStatus({ ...status, bmi: e.target.value })} className="border rounded px-3 py-2 w-full" placeholder="e.g., 22.1" />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-600">Doctor Notes</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2 w-full" rows={4} placeholder="Add notes" />
        </div>
        <button disabled={loading} onClick={onSave} className="mt-4 px-4 py-2 border border-primary rounded-full hover:bg-primary hover:text-white disabled:opacity-50">
          {existingReport ? 'Add Version' : 'Create Report'}
        </button>

        {existingReport && (
          <div className="mt-6">
            <p className="text-sm font-medium">Latest</p>
            <div className="text-sm text-gray-700 mt-1">
              <p>BP: {latest?.status?.bp || '-'}</p>
              <p>Sugar: {latest?.status?.sugar || '-'}</p>
              <p>BMI: {latest?.status?.bmi || '-'}</p>
              <p className="mt-2 whitespace-pre-line">{latest?.description || '-'}</p>
            </div>
            <p className="text-sm font-medium mt-4">History</p>
            <div className="text-sm text-gray-600 max-h-52 overflow-y-auto border rounded mt-2">
              {existingReport.versions.slice(0, -1).reverse().map((v) => (
                <div key={v._id || v.version} className="p-2 border-b last:border-b-0">
                  <p className="text-xs">v{v.version} • {new Date(v.updatedAt).toLocaleString()}</p>
                  <p className="line-clamp-2">{v.description || '-'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportEditor;
