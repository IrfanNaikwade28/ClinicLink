import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createReport, updateReport, getReportForEditing } from '../../api/doctor';
import { toast } from 'react-toastify';
import HospitalReportTemplate from '../../components/HospitalReportTemplate';
import { generateUnifiedMedicalReportPDF } from '../../utils/pdfGenerator';

// Usage: navigate to /doctor-report?patientId=...&appointmentId=...
const ReportEditor = () => {
  const [params] = useSearchParams();
  const patientId = params.get('patientId');
  const appointmentId = params.get('appointmentId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data from comprehensive API
  const [patientData, setPatientData] = useState({});
  const [doctorData, setDoctorData] = useState({});
  const [appointmentData, setAppointmentData] = useState({});
  const [reports, setReports] = useState([]);
  const [editableReport, setEditableReport] = useState(null);
  
  // Version selection state
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  
  // Form state
  const [status, setStatus] = useState({ bp: '', sugar: '', bmi: '' });
  const [description, setDescription] = useState('');  const loadReportData = useCallback(async () => {
    try {
      setLoading(true);
      if (!patientId || !appointmentId) return;
      
      const { data } = await getReportForEditing(patientId, appointmentId);
      if (data.success) {
        setPatientData(data.patientData || {});
        setDoctorData(data.doctorData || {});
        setAppointmentData(data.appointmentData || {});
        setReports(data.reports || []);
        setEditableReport(data.editableReport);
        
        // Set initial selected report and version
        const allReports = data.reports || [];
        if (allReports.length > 0) {
          const firstReport = data.editableReport || allReports[0];
          setSelectedReport(firstReport);
          setSelectedVersionIndex(firstReport.versions?.length - 1 || 0);
        }
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [patientId, appointmentId]);

  // Handle report selection
  const handleReportSelect = (report) => {
    setSelectedReport(report);
    setSelectedVersionIndex(report.versions?.length - 1 || 0);
  };

  // Handle version selection
  const handleVersionSelect = (versionIndex) => {
    setSelectedVersionIndex(versionIndex);
  };

  // Get current selected version data
  const getSelectedVersion = () => {
    if (!selectedReport?.versions) return {};
    return selectedReport.versions[selectedVersionIndex] || {};
  };

  // Check if current doctor can edit the selected report
  const canEditSelectedReport = () => {
    return selectedReport && editableReport && selectedReport._id === editableReport._id;
  };

  // Check if viewing the latest version of editable report
  const isViewingLatestEditableVersion = () => {
    if (!canEditSelectedReport()) return false;
    if (!selectedReport?.versions) return false;
    return selectedVersionIndex === selectedReport.versions.length - 1;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!selectedReport) {
      toast.error('No report selected for download');
      return;
    }

    try {
      const currentVersion = selectedReport.versions?.[selectedVersionIndex] || selectedReport;
      const filename = `Medical_Report_${patientData.name || 'Patient'}_${selectedReport._id?.slice(-6) || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await generateUnifiedMedicalReportPDF({
        patientData,
        doctorData,
        appointmentData,
        reportData: selectedReport,
        currentVersion,
        filename
      });
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // Update form state when switching to latest editable version
  useEffect(() => {
    const isLatestEditable = selectedReport && editableReport && 
                            selectedReport._id === editableReport._id &&
                            selectedReport.versions &&
                            selectedVersionIndex === selectedReport.versions.length - 1;
    
    if (isLatestEditable && editableReport) {
      const latestVersion = editableReport.versions?.at(-1) || {};
      setStatus(latestVersion.status || { bp: '', sugar: '', bmi: '' });
      setDescription(latestVersion.description || '');
    }
  }, [selectedReport, selectedVersionIndex, editableReport]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (editableReport) {
        // Update existing report
        const { data } = await updateReport(editableReport._id, { status, description });
        if (data.success) {
          toast.success('Report updated successfully');
          await loadReportData(); // Refresh data
          setStatus({ bp: '', sugar: '', bmi: '' });
          setDescription('');
        } else {
          toast.error(data.message);
        }
      } else {
        // Create new report
        const { data } = await createReport({ patientId, appointmentId, status, description });
        if (data.success) {
          toast.success('Report created successfully');
          await loadReportData(); // Refresh data
          setStatus({ bp: '', sugar: '', bmi: '' });
          setDescription('');
        } else {
          toast.error(data.message);
        }
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Medical Report Editor</h1>
      
      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        {/* Reports List & Version Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 lg:max-h-[80vh] lg:overflow-hidden lg:flex lg:flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Reports</h2>
          
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No reports yet.</p>
              <p className="text-gray-400 text-xs mt-1">Create your first report to get started.</p>
            </div>
          ) : (
            <div className="space-y-4 lg:flex-1 lg:overflow-y-auto">
              {reports.map((report) => {
                const doctor = report.doctorId || {};
                const latestVersion = report.versions?.at(-1) || {};
                const isActive = selectedReport?._id === report._id;
                const isEditable = editableReport && report._id === editableReport._id;
                
                return (
                  <div key={report._id} className="space-y-3">
                    {/* Report Card */}
                    <div
                      onClick={() => handleReportSelect(report)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        {doctor.image ? (
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {doctor.name?.charAt(0) || 'D'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Dr. {doctor.name || 'Unknown'}
                            {isEditable && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Editable</span>}
                          </p>
                          <p className="text-xs text-gray-500">{doctor.speciality || 'General'}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>Latest: {formatDate(latestVersion.updatedAt)}</p>
                        <p>Versions: {report.versions?.length || 0}</p>
                      </div>
                    </div>
                    
                    {/* Version Selector for Active Report */}
                    {isActive && report.versions && report.versions.length > 1 && (
                      <div className="ml-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Select Version</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {report.versions.map((version, index) => (
                            <button
                              key={index}
                              onClick={() => handleVersionSelect(index)}
                              className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                                selectedVersionIndex === index
                                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              v{version.version}
                              <br />
                              <span className="text-xs opacity-75">
                                {formatDate(version.updatedAt)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Report Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {selectedReport ? (
            <div className="p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isViewingLatestEditableVersion() ? 'Edit Medical Report' : 'View Medical Report'}
                  {canEditSelectedReport() && !isViewingLatestEditableVersion() && (
                    <span className="ml-2 text-sm text-amber-600">(Previous Version)</span>
                  )}
                </h2>
                <div className="flex items-center space-x-3">
                  {/* Download PDF Button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF</span>
                  </button>
                  
                  {/* Edit indicator */}
                  {isViewingLatestEditableVersion() && (
                    <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z" />
                      </svg>
                      <span>You can edit this report</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hospital Report Template */}
              <div>
                <HospitalReportTemplate
                  mode={isViewingLatestEditableVersion() ? "edit" : "read"}
                  patientData={patientData}
                  doctorData={canEditSelectedReport() ? doctorData : (selectedReport.doctorId || {})}
                  appointmentData={appointmentData}
                  reportData={selectedReport}
                  currentVersion={getSelectedVersion()}
                  status={isViewingLatestEditableVersion() ? status : getSelectedVersion().status || {}}
                  description={isViewingLatestEditableVersion() ? description : getSelectedVersion().description || ''}
                  onStatusChange={isViewingLatestEditableVersion() ? setStatus : undefined}
                  onDescriptionChange={isViewingLatestEditableVersion() ? setDescription : undefined}
                  onSave={isViewingLatestEditableVersion() ? handleSave : undefined}
                  loading={saving}
                />
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your First Report</h3>
              <p className="text-gray-500 mb-6">Start documenting this patient&apos;s medical information</p>
              
              {/* Create Report Form */}
              <div className="max-w-2xl mx-auto">
                <HospitalReportTemplate
                  mode="edit"
                  patientData={patientData}
                  doctorData={doctorData}
                  appointmentData={appointmentData}
                  reportData={{}}
                  currentVersion={{}}
                  status={status}
                  description={description}
                  onStatusChange={setStatus}
                  onDescriptionChange={setDescription}
                  onSave={handleSave}
                  loading={saving}
                />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">Select a report to view or edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportEditor;
