# VDOTUBE 🎥

A simple **Node.js + Express** based project for learning backend development.  
This project demonstrates APIs, routes, and controllers for managing users and videos.

---

## 🚀 Features
- User management with routes and controllers
- API endpoints for CRUD operations
- Organized MVC structure (routes, controllers, models)
- Logging and event handling
- MongoDB database integration (via Mongoose)
- Easy to extend for future projects

---

## 📦 Required Packages

Make sure you have **Node.js (>= 16.x)** installed.  
Install dependencies using:

```bash
npm install
```

Main dependencies:
- **express** → Web framework  
- **mongoose** → MongoDB object modeling  
- **dotenv** → Manage environment variables  
- **nodemon** (dev dependency) → For auto-restart during development  

Install manually (if not already in `package.json`):
```bash
npm install express mongoose dotenv
npm install --save-dev nodemon
```

---

## ⚙️ Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/VDOTUBE.git
   cd VDOTUBE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root folder and add the following:
   ```env
   PORT=3000
   MONGO_URI=your-mongodb-cluster-url
   ```

---

## 🗄️ Setting up MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Create a free account (or log in if you already have one).
3. Click **"Create" → "New Cluster"**.
4. Choose:
   - Free shared cluster (M0 Sandbox)
   - Any cloud provider (AWS/GCP/Azure)
   - Region close to you
5. Once the cluster is created:
   - Go to **Database Access → Add New Database User**  
     - Username: `vdotube_user`  
     - Password: `yourpassword`  
     - Role: Atlas Admin (for development)
   - Go to **Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)**
6. Copy your connection string:  
   ```
   mongodb+srv://vdotube_user:yourpassword@cluster0.abcde.mongodb.net/vdotube
   ```
7. Replace it in `.env`:
   ```env
   MONGO_URI=mongodb+srv://vdotube_user:yourpassword@cluster0.abcde.mongodb.net/vdotube
   ```

---

## ▶️ Running the Project

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

Make sure `package.json` has these scripts:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

## 📂 Project Structure

```
VDOTUBE/
│── controllers/    # Contains user & video controllers
│── routes/         # Express routes
│── models/         # Database models (if implemented)
│── index.js        # Entry point of the application
│── package.json    # Dependencies & scripts
│── .gitignore      # Ignored files/folders
│── .env.example    # Example env file
```

---

## 📌 Usage

- Start the server → Open browser/Postman at:
  ```
  http://localhost:3000
  ```
- Example routes:
  - `/users` → User-related APIs
  - `/videos` → Video-related APIs

---

## 🛠 Future Improvements
- Add JWT-based authentication
- Video upload & streaming
- Admin dashboard

---

## 👩‍💻 Author
Developed by **Saniya Musa Hakim** ✨  
(Frontend Developer | AI & Data Science)
