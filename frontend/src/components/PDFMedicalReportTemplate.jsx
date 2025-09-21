import PropTypes from 'prop-types';

/**
 * Unified PDF Medical Report Template
 * Designed specifically for A4 PDF output with single-page layout
 * Used by both doctor and patient portals
 */
const PDFMedicalReportTemplate = ({
  patientData = {},
  doctorData = {},
  appointmentData = {},
  reportData = {},
  currentVersion = {}
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Extract data with fallbacks
  const patient = {
    name: patientData.name || '—',
    birthDate: formatDate(patientData.dob),
    patientId: patientData._id ? `PAT-${patientData._id.slice(-6)}` : '—',
    gender: patientData.gender || '—',
    phone: patientData.phone || '—',
    email: patientData.email || '—'
  };

  const doctor = {
    name: doctorData.name || '—',
    specialization: doctorData.speciality || '—'
  };

  const visit = {
    visitDate: formatDate(appointmentData.date || appointmentData.slotDate),
    visitTime: formatTime(appointmentData.date || appointmentData.slotTime),
    reportDate: formatDateTime(currentVersion.updatedAt || reportData.updatedAt),
    version: currentVersion.version || reportData.versions?.length || 1
  };

  const clinical = {
    bloodPressure: currentVersion.status?.bp || '—',
    bloodSugar: currentVersion.status?.sugar || '—',
    bmi: currentVersion.status?.bmi || '—',
    notes: currentVersion.description || '—'
  };

  const reportId = reportData._id ? `RPT-${reportData._id.slice(-6).toUpperCase()}` : 'RPT-000000';

  return (
    <div className="w-full max-w-none bg-white text-black font-sans" style={{ 
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.4',
      padding: '20mm',
      width: '210mm',
      minHeight: '257mm', // A4 height minus padding
      boxSizing: 'border-box'
    }}>
      {/* Hospital Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CL</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">ClinicLink Hospital</h1>
              <p className="text-sm text-gray-700">123 Healthcare Avenue, Medical District</p>
              <p className="text-sm text-gray-700">Phone: (555) 123-4567 | Email: info@cliniclink.com</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600 mb-1">MEDICAL REPORT</h2>
            <p className="text-sm font-medium text-gray-700">Report ID: {reportId}</p>
          </div>
        </div>
      </div>

      {/* Patient and Visit Information Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Patient Information */}
        <div>
          <h3 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-2 mb-4">
            PATIENT INFORMATION
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Full Name:</span>
              <span className="col-span-2 text-gray-900">{patient.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Birth Date:</span>
              <span className="col-span-2 text-gray-900">{patient.birthDate}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Patient ID:</span>
              <span className="col-span-2 text-gray-900">{patient.patientId}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Gender:</span>
              <span className="col-span-2 text-gray-900">{patient.gender}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="col-span-2 text-gray-900 break-words">{patient.phone}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="col-span-2 text-gray-900 break-words">{patient.email}</span>
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div>
          <h3 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-2 mb-4">
            VISIT INFORMATION
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Doctor Name:</span>
              <span className="col-span-2 text-gray-900">Dr. {doctor.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Specialization:</span>
              <span className="col-span-2 text-gray-900">{doctor.specialization}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Visit Date:</span>
              <span className="col-span-2 text-gray-900">{visit.visitDate}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Visit Time:</span>
              <span className="col-span-2 text-gray-900">{visit.visitTime}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Report Date:</span>
              <span className="col-span-2 text-gray-900">{visit.reportDate}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-700">Version:</span>
              <span className="col-span-2 text-gray-900">v{visit.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Assessment */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-2 mb-4">
          CLINICAL ASSESSMENT
        </h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-300">
                  Blood Pressure
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 border-r border-gray-300">
                  Blood Sugar
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  BMI
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-4 py-4 text-gray-900 border-r border-gray-300">
                  {clinical.bloodPressure}
                </td>
                <td className="px-4 py-4 text-gray-900 border-r border-gray-300">
                  {clinical.bloodSugar}
                </td>
                <td className="px-4 py-4 text-gray-900">
                  {clinical.bmi}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnosis & Prescription */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-blue-600 border-b border-blue-200 pb-2 mb-4">
          DIAGNOSIS & PRESCRIPTION
        </h3>
        <div className="border border-gray-300 rounded-lg p-4 min-h-32">
          <div className="text-gray-900 whitespace-pre-wrap break-words">
            {clinical.notes}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-blue-600">
            Your Health, Our Priority
          </p>
          <p className="text-xs text-gray-600">
            This report is confidential and intended only for the patient and authorized medical personnel.
          </p>
        </div>
      </div>
    </div>
  );
};

PDFMedicalReportTemplate.propTypes = {
  patientData: PropTypes.object,
  doctorData: PropTypes.object,
  appointmentData: PropTypes.object,
  reportData: PropTypes.object,
  currentVersion: PropTypes.object
};

export default PDFMedicalReportTemplate;