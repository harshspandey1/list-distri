##MERN Task Distributor
An admin dashboard built with the MERN stack to manage agents and distribute tasks via CSV uploads.

This application provides a secure admin interface to create and manage a team of agents. The core feature allows the admin to upload a list of tasks in a CSV file, which are then automatically and evenly distributed among the available agents.

##Features
* Secure Authentication: Admin login is protected using JSON Web Tokens (JWT).

* Dashboard Overview: A home page with key statistics, including total agents, active tasks, and completed tasks.

* Agent Management: Create, view, and delete agents from the system.

* CSV Task Upload: Upload a .csv or .xlsx file containing tasks, which are then parsed and saved to the database.

* Automatic Distribution: Tasks from the uploaded file are automatically distributed in a round-robin fashion among agents.

* Task Management: View all distributed tasks in a filterable and sortable table.

* Status Toggling: Change the status of a task from "active" to "completed" with a single click.

* Reset Functionality: A "danger zone" option to delete all tasks from the database.

##Tech Stack
##Frontend: React.js, Vite, TailwindCSS, React Router, Axios

##Backend: Node.js, Express.js

##Database: MongoDB with Mongoose

* Authentication: JSON Web Tokens (JWT), bcrypt.js

* File Handling: Multer, Papaparse

* Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

* Prerequisites

You'll need to have the following software installed on your computer:

Node.js (which includes npm)

MongoDB Atlas account (or a local MongoDB instance)

Git

Installation & Setup

Clone the repository:

* Bash
git clone <your-repository-url>
cd <your-project-folder>
* Backend Setup:

Navigate to the backend directory:

* Bash
cd backend
Install the dependencies:

* Bash
npm install
* Create a .env file in the backend directory and add the following environment variables. Replace the values with your own.

* Code snippet
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
* Create the First Admin User (Important)
* Since there is no public sign-up page for admins, you must create the first admin account by sending a POST request to the registration endpoint using an API client like Postman.

* Method: POST

* URL: http://localhost:5001/api/auth/register

* Body (select raw and JSON):

JSON
{
  "email": "admin@example.com",
  "password": "your-secure-password"
}
Once this is done, you can log in with these credentials on the frontend.

* Frontend Setup:

 Navigate to the frontend directory:

* Bash
cd ../frontend
Install the dependencies:

* Bash
npm install
Running the Application
You'll need to run the backend and frontend servers in two separate terminals.

Run the Backend Server:

In the backend directory, run:

* Bash
npm run dev
The server will start on http://localhost:5001.

Run the Frontend Server:

In the frontend directory, run:

* Bash
npm run dev
The application will be available at http://localhost:5173.