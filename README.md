# ClinicLink 🏥

A comprehensive healthcare management system that connects patients, doctors, and administrators through a seamless digital platform.

## Demo Video


## 🌟 Overview

ClinicLink is a full-stack medical appointment and health record management system built with modern web technologies. It provides three distinct interfaces:
- **Patient Portal** - For patients to book appointments, view medical records, and manage their health data
- **Doctor Panel** - For healthcare providers to manage appointments, create medical reports, and maintain patient records  
- **Admin Dashboard** - For administrators to oversee the entire system, manage users, and generate comprehensive reports

## 🏗️ Architecture

```
ClinicLink/
├── frontend/          # Patient Portal (React + Vite)
├── admin/            # Doctor & Admin Panel (React + Vite) 
├── backend/          # API Server (Node.js + Express)
└── frontend-mock/    # Mock/Testing Environment
```

## 🚀 Technologies

### Frontend & Admin Panel
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Toastify** - User notification system

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Cloudinary** - Image upload and storage
- **Multer** - File upload middleware

### PDF Generation
- **jsPDF** - PDF generation library
- **html2canvas** - HTML to canvas conversion
- Unified medical report templating system

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/IrfanNaikwade28/ClinicLink.git
cd ClinicLink
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with required environment variables
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_key
# CLOUDINARY_API_SECRET=your_cloudinary_secret

# Seed sample doctors (optional)
npm run seed:doctors

# Start development server
npm run dev
```

### 3. Frontend Setup (Patient Portal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Panel Setup
```bash
cd admin  
npm install
npm run dev
```

## 🌐 Access Points

- **Patient Portal**: http://localhost:5173
- **Admin/Doctor Panel**: http://localhost:5174  
- **Backend API**: http://localhost:8000

## 📱 Features

### Patient Portal
- ✅ User registration and authentication
- ✅ Browse and filter doctors by specialty
- ✅ Book, reschedule, and cancel appointments
- ✅ View medical history and reports
- ✅ Download medical reports as PDF
- ✅ Profile management with image upload
- ✅ Responsive design for mobile devices

### Doctor Panel
- ✅ Doctor authentication and profile management
- ✅ View and manage appointments
- ✅ Create and edit medical reports with version control
- ✅ Patient management and medical history
- ✅ Generate and download PDF reports
- ✅ Dashboard with appointment analytics
- ✅ Editable profile (about, phone, fees)

### Admin Dashboard
- ✅ Admin authentication and access control
- ✅ Comprehensive user management (patients & doctors)
- ✅ System-wide appointment oversight
- ✅ Medical report management and viewing
- ✅ Analytics and reporting features
- ✅ Doctor registration and profile management

### PDF Generation System
- ✅ Unified medical report templates
- ✅ Single-page A4 format consistency
- ✅ Professional medical document layout
- ✅ Patient, doctor, and appointment data integration
- ✅ Version control for medical reports

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (Patient/Doctor/Admin)
- Password encryption with bcrypt
- Protected API routes with middleware
- Input validation and sanitization
- Secure file upload handling

## 📊 API Endpoints

### Authentication
- `POST /api/user/register` - Patient registration
- `POST /api/user/login` - Patient login
- `POST /api/doctor/login` - Doctor login
- `POST /api/admin/login` - Admin login

### Profiles
- `GET /api/profile` - Get user profile (unified)
- `PUT /api/profile` - Update user profile (unified)

### Appointments
- `POST /api/user/book-appointment` - Book appointment
- `GET /api/user/appointments` - Get user appointments
- `GET /api/doctor/appointments` - Get doctor appointments
- `POST /api/doctor/complete-appointment` - Complete appointment

### Medical Reports
- `POST /api/reports` - Create medical report
- `PUT /api/reports/:id` - Update medical report
- `GET /api/reports/patient/:id` - Get patient reports
- `GET /api/reports/comprehensive/:patientId/:appointmentId` - Get comprehensive report data

## 🚀 Deployment

### Backend
- Compatible with platforms like Heroku, Railway, or Vercel
- Set environment variables in deployment platform
- Ensure MongoDB connection is configured

### Frontend Applications
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or similar platforms
- Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Irfan Naikwade**
- GitHub: [@IrfanNaikwade28](https://github.com/IrfanNaikwade28)

## 🙏 Acknowledgments

- React and Vite communities for excellent documentation
- MongoDB and Express.js for robust backend solutions
- Tailwind CSS for making styling enjoyable
- All contributors and testers

---

*Built with ❤️ for modern healthcare management*
