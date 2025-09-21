import PropTypes from 'prop-types';

const HospitalReportTemplate = ({ 
  mode = 'read', // 'read' or 'edit'
  patientData = {},
  doctorData = {},
  appointmentData = {},
  reportData = {},
  currentVersion = {},
  // Edit mode props
  status = {},
  description = '',
  onStatusChange,
  onDescriptionChange,
  onSave,
  loading = false,
  children // For additional content like history/other reports
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Hospital Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">CL</span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">ClinicLink Hospital</h1>
              <p className="text-xs lg:text-sm text-gray-600">123 Healthcare Avenue, Medical District</p>
              <p className="text-xs lg:text-sm text-gray-600">Phone: (555) 123-4567 | Email: info@cliniclink.com</p>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <h2 className="text-lg lg:text-xl font-bold text-blue-600">MEDICAL REPORT</h2>
            <p className="text-xs lg:text-sm text-gray-600">Report ID: {reportData._id?.slice(-8) || 'NEW'}</p>
          </div>
        </div>
      </div>

      {/* Patient & Visit Info Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Patient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">
            PATIENT INFORMATION
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Full Name:</span>
              <span className="text-gray-900">{patientData.name || patientData.email?.split('@')[0] || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Birth Date:</span>
              <span className="text-gray-900">{formatDate(patientData.dob)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Patient ID:</span>
              <span className="text-gray-900">{patientData._id?.slice(-8) || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Gender:</span>
              <span className="text-gray-900">{patientData.gender || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{patientData.phone || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900 break-words">{patientData.email || '-'}</span>
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">
            VISIT INFORMATION
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Doctor:</span>
              <span className="text-gray-900">{doctorData.name || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Specialization:</span>
              <span className="text-gray-900">{doctorData.speciality || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Visit Date:</span>
              <span className="text-gray-900">{appointmentData.slotDate || formatDate(appointmentData.date)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Visit Time:</span>
              <span className="text-gray-900">{appointmentData.slotTime || '-'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Report Date:</span>
              <span className="text-gray-900">{formatDateTime(currentVersion.updatedAt || new Date())}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-medium text-gray-700">Version:</span>
              <span className="text-gray-900">v{currentVersion.version || 'NEW'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-blue-600 border-b border-gray-300 pb-2 mb-4">
          CLINICAL ASSESSMENT
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Blood Pressure</label>
            {mode === 'edit' ? (
              <input
                type="text"
                value={status.bp || ''}
                onChange={(e) => onStatusChange?.({ ...status, bp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 120/80"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-900">{currentVersion.status?.bp || '-'}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Blood Sugar</label>
            {mode === 'edit' ? (
              <input
                type="text"
                value={status.sugar || ''}
                onChange={(e) => onStatusChange?.({ ...status, sugar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 95 mg/dL"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-900">{currentVersion.status?.sugar || '-'}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">BMI</label>
            {mode === 'edit' ? (
              <input
                type="text"
                value={status.bmi || ''}
                onChange={(e) => onStatusChange?.({ ...status, bmi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 22.1"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-900">{currentVersion.status?.bmi || '-'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diagnosis & Prescription Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-blue-600 border-b border-gray-300 pb-2 mb-4">
          DIAGNOSIS & PRESCRIPTION
        </h3>
        {mode === 'edit' ? (
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Enter diagnosis, prescription, and doctor notes..."
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-md border min-h-[120px]">
            <p className="text-gray-900 whitespace-pre-line">
              {currentVersion.description || 'No diagnosis or prescription noted.'}
            </p>
          </div>
        )}
      </div>

      {/* Action Button for Edit Mode */}
      {mode === 'edit' && (
        <div className="mb-8">
          <button
            onClick={onSave}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (currentVersion.version ? 'Add New Version' : 'Create Report')}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-300 pt-4 mt-8">
        <div className="text-center text-sm text-gray-600">
          <p>ClinicLink Hospital - Your Health, Our Priority</p>
          <p>This report is confidential and intended only for the patient and authorized medical personnel.</p>
        </div>
      </div>

      {/* Additional Content (History, Other Reports, etc.) */}
      {children && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

HospitalReportTemplate.propTypes = {
  mode: PropTypes.oneOf(['read', 'edit']),
  patientData: PropTypes.object,
  doctorData: PropTypes.object,
  appointmentData: PropTypes.object,
  reportData: PropTypes.object,
  currentVersion: PropTypes.object,
  status: PropTypes.object,
  description: PropTypes.string,
  onStatusChange: PropTypes.func,
  onDescriptionChange: PropTypes.func,
  onSave: PropTypes.func,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

export default HospitalReportTemplate;