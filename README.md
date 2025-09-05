ClinicLink 🏥

ClinicLink is a MERN stack (MongoDB, Express, React, Node.js) healthcare management system that streamlines clinic operations. It provides doctors, patients, and clinic staff with an efficient interface to manage appointments, patient records, and daily operations.

Features ✨

User Management: Separate roles for Admin, Doctors, and Patients.

Appointment Scheduling: Patients can book appointments with doctors; doctors can manage their schedule.

Patient Records: Store and manage patient medical history securely.

Authentication & Authorization: Secure login system for all users.

RESTful API: Fully functional backend API built with Express and Node.js.

Database Integration: MongoDB for storing all user and clinic data.

Frontend Interface: React.js for a responsive and interactive user experience.

Tech Stack 🛠️

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT-based token authentication

Environment: dotenv for configuration

Getting Started 🚀
Prerequisites

Node.js ≥ 16.x

MongoDB ≥ 5.x (local or cloud, e.g., MongoDB Atlas)

npm or yarn

Installation

Clone the repository:

git clone https://github.com/IrfanNaikwade28/ClinicLink.git
cd ClinicLink/Backend


Install dependencies:

npm install


Set up environment variables:

Create a .env file in the Backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


Start the server:

npm run dev


The backend server will run at http://localhost:5000.

For the frontend:

cd ../Frontend
npm install
npm start


The React frontend will run at http://localhost:3000.

API Endpoints 📝

Auth Routes:

POST /api/auth/register – Register a new user

POST /api/auth/login – User login

User Routes:

GET /api/users – Fetch all users

GET /api/users/:id – Fetch a single user

Appointment Routes:

POST /api/appointments – Create a new appointment

GET /api/appointments – Fetch all appointments

Patient Records Routes:

POST /api/patients – Add new patient record

GET /api/patients/:id – Fetch patient record

Project Structure 📂
ClinicLink/
│
├── Backend/
│   ├── config/      # Database and environment setup
│   ├── controllers/ # API route controllers
│   ├── models/      # MongoDB schemas
│   ├── routes/      # Express route definitions
│   ├── middleware/  # Auth & error handling middleware
│   ├── server.js    # Backend entry point
│   └── package.json
│
├── Frontend/
│   ├── src/         # React components and pages
│   ├── public/      # Static assets
│   └── package.json

Contributing 🤝

Contributions are welcome! Open an issue or submit a pull request to improve the project.
