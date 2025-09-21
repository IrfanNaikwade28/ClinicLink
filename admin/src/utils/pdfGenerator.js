import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate filename for PDF download
 * @param {Object} patientData - Patient information
 * @param {Object} reportData - Report information
 * @returns {string} Generated filename
 */
const generateFilename = (patientData = {}, reportData = {}) => {
  const patientName = (patientData.name || 'patient')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
  
  const date = new Date().toISOString().split('T')[0];
  const reportId = reportData._id ? reportData._id.slice(-6) : Math.random().toString(36).substr(2, 6);
  
  return `medical_report_${patientName}_${date}_${reportId}.pdf`;
};

/**
 * Generate unified PDF medical report
 * @param {Object} options - PDF generation options
 * @param {Object} options.patientData - Patient information
 * @param {Object} options.doctorData - Doctor information
 * @param {Object} options.appointmentData - Appointment details
 * @param {Object} options.reportData - Report information
 * @param {Object} options.currentVersion - Current version data
 * @param {string} options.filename - The filename for the PDF download
 * @returns {Promise<void>}
 */
export const generateUnifiedMedicalReportPDF = async ({
  patientData = {},
  doctorData = {},
  appointmentData = {},
  reportData = {},
  currentVersion = {},
  filename
}) => {
  let container = null;
  
  try {
    // Show loading indicator
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    loadingToast.textContent = 'Generating PDF...';
    loadingToast.id = 'pdf-loading-toast';
    document.body.appendChild(loadingToast);

    // Create the HTML content for the PDF
    container = createPDFReportHTML({
      patientData,
      doctorData,
      appointmentData,
      reportData,
      currentVersion
    });

    // Add to DOM temporarily for rendering
    document.body.appendChild(container);

    // Wait for fonts and rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Configure html2canvas for optimal PDF quality
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: container.offsetWidth,
      height: container.offsetHeight,
      scrollX: 0,
      scrollY: 0
    });

    // Create PDF with exact A4 dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = 297; // A4 height in mm
    
    // Add the canvas as a single page (no multi-page)
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

    // Generate filename if not provided
    const finalFilename = filename || generateFilename(patientData, reportData);

    // Download the PDF
    pdf.save(finalFilename);

    // Update loading indicator
    loadingToast.textContent = 'PDF Downloaded!';
    loadingToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    setTimeout(() => {
      if (loadingToast.parentNode) {
        document.body.removeChild(loadingToast);
      }
    }, 2000);

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Show error message
    const loadingToast = document.getElementById('pdf-loading-toast');
    if (loadingToast) {
      loadingToast.textContent = 'PDF Generation Failed';
      loadingToast.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      setTimeout(() => {
        if (loadingToast.parentNode) {
          document.body.removeChild(loadingToast);
        }
      }, 3000);
    }
    
    throw error;
  } finally {
    // Clean up
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
  }
};

/**
 * Create HTML content for PDF report
 */
const createPDFReportHTML = ({
  patientData,
  doctorData,
  appointmentData,
  reportData,
  currentVersion
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

  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 210mm;
    min-height: 297mm;
    background-color: #ffffff;
    font-family: Arial, sans-serif;
    font-size: 12px;
    line-height: 1.4;
    padding: 20mm;
    box-sizing: border-box;
    color: black;
  `;

  container.innerHTML = `
    <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 64px; height: 64px; background-color: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 20px;">CL</span>
          </div>
          <div>
            <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0 0 4px 0;">ClinicLink Hospital</h1>
            <p style="font-size: 14px; color: #374151; margin: 0;">123 Healthcare Avenue, Medical District</p>
            <p style="font-size: 14px; color: #374151; margin: 0;">Phone: (555) 123-4567 | Email: info@cliniclink.com</p>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 20px; font-weight: bold; color: #2563eb; margin: 0 0 4px 0;">MEDICAL REPORT</h2>
          <p style="font-size: 14px; font-weight: 500; color: #374151; margin: 0;">Report ID: ${reportId}</p>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
      <div>
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #dbeafe; padding-bottom: 8px; margin-bottom: 16px;">PATIENT INFORMATION</h3>
        <div style="display: grid; gap: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Full Name:</span>
            <span style="color: #111827;">${patient.name}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Birth Date:</span>
            <span style="color: #111827;">${patient.birthDate}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Patient ID:</span>
            <span style="color: #111827;">${patient.patientId}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Gender:</span>
            <span style="color: #111827;">${patient.gender}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Phone:</span>
            <span style="color: #111827; word-break: break-words;">${patient.phone}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Email:</span>
            <span style="color: #111827; word-break: break-words;">${patient.email}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #dbeafe; padding-bottom: 8px; margin-bottom: 16px;">VISIT INFORMATION</h3>
        <div style="display: grid; gap: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Doctor Name:</span>
            <span style="color: #111827;">Dr. ${doctor.name}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Specialization:</span>
            <span style="color: #111827;">${doctor.specialization}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Visit Date:</span>
            <span style="color: #111827;">${visit.visitDate}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Visit Time:</span>
            <span style="color: #111827;">${visit.visitTime}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Report Date:</span>
            <span style="color: #111827;">${visit.reportDate}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px;">
            <span style="font-weight: 500; color: #374151;">Version:</span>
            <span style="color: #111827;">v${visit.version}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #dbeafe; padding-bottom: 8px; margin-bottom: 16px;">CLINICAL ASSESSMENT</h3>
      <div style="border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: #374151; border-right: 1px solid #d1d5db;">Blood Pressure</th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: #374151; border-right: 1px solid #d1d5db;">Blood Sugar</th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: #374151;">BMI</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: white;">
              <td style="padding: 16px; color: #111827; border-right: 1px solid #d1d5db;">${clinical.bloodPressure}</td>
              <td style="padding: 16px; color: #111827; border-right: 1px solid #d1d5db;">${clinical.bloodSugar}</td>
              <td style="padding: 16px; color: #111827;">${clinical.bmi}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #dbeafe; padding-bottom: 8px; margin-bottom: 16px;">DIAGNOSIS & PRESCRIPTION</h3>
      <div style="border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; min-height: 128px;">
        <div style="color: #111827; white-space: pre-wrap; word-break: break-words;">${clinical.notes}</div>
      </div>
    </div>

    <div style="margin-top: auto; padding-top: 32px; border-top: 1px solid #e5e7eb;">
      <div style="text-align: center;">
        <p style="font-size: 14px; font-weight: 500; color: #2563eb; margin: 0 0 8px 0;">Your Health, Our Priority</p>
        <p style="font-size: 12px; color: #6b7280; margin: 0;">This report is confidential and intended only for the patient and authorized medical personnel.</p>
      </div>
    </div>
  `;

  return container;
};

// Legacy PDF generation functions (keep for backward compatibility)
export const generatePDF = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID '${elementId}' not found`);
  }
  
  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save(filename);
};

export const generatePatientReportPDF = async (reportData, patientData) => {
  const filename = generateFilename(patientData, reportData);
  return generatePDF('patient-report-content', filename);
};