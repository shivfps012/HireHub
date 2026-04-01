# HireHub

HireHub is a full-stack job portal where candidates can explore openings, apply for jobs, and manage their profiles, while recruiters can create companies, post jobs, and review applicants from an admin dashboard.

## Features

- User authentication for candidates and recruiters
- Recruiter-only admin area protected by route guards
- Browse and search jobs by keyword
- Job detail pages with application flow
- Candidate profile management with resume upload
- Recruiter company creation and company profile updates
- Recruiter job posting and job editing
- Applicant tracking and application status updates
- Cloudinary-based file/image upload support

## Tech Stack

- Frontend: React, Vite, React Router, Redux Toolkit, Tailwind CSS, Radix UI
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT with cookie-based sessions
- File Uploads: Multer + Cloudinary

## Project Structure

```text
HireHub/
|-- backend/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   `-- index.js
|-- frontend/
|   `-- JobPortal/
|       |-- src/
|       |   |-- assets/
|       |   |-- components/
|       |   |-- hooks/
|       |   |-- lib/
|       |   |-- redux/
|       |   |-- utils/
|       |   |-- App.jsx
|       |   |-- index.css
|       |   `-- main.jsx
|       |-- public/
|       `-- package.json
`-- README.md
```

## Main Modules

### Candidate Side

- Sign up and log in
- Browse latest jobs
- Search jobs
- View job details
- Apply for jobs
- Update profile, bio, skills, and resume
- Track applied jobs

### Recruiter Side

- Access protected admin pages
- Create and manage companies
- Post and update jobs
- View applicants for a job
- Accept, reject, or manage application status

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB instance
- Cloudinary account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/shivfps012/HireHub.git
cd HireHub
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend/JobPortal
npm install
```

## Environment Variables

Create a `.env` file inside `backend/` and add:

```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

`PORT=8000` is recommended because the frontend is currently configured to call the backend at `http://localhost:8000`.

## Run the Project

### Start the backend

From `backend/`:

```bash
npm run dev
```

### Start the frontend

From `frontend/JobPortal/`:

```bash
npm run dev
```

Then open the frontend URL shown by Vite, usually:

```text
http://localhost:5173
```

## API Base Routes

- `/api/v1/user`
- `/api/v1/company`
- `/api/v1/job`
- `/api/v1/application`

## Notes

- The frontend API constants point to `http://localhost:8000`.
- Recruiter routes are protected in the frontend.
- Authentication uses cookies and JWT on the backend.
- Cloudinary is required for profile photos, resumes, and company logos.

## Future Improvements

- Add tests for frontend and backend
- Add pagination and advanced filtering
- Add email notifications for recruiters and applicants
- Add saved jobs and recruiter analytics
- Improve deployment configuration for production

## Author

Built by Shiv Gupta.
