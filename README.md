# 🛍️ UniThrift

A full-stack second-hand marketplace built for university students to buy and sell thrifted items. Built with **Vue 3** on the frontend and **Node.js + Express** on the backend, powered by a **MySQL** database.

---

## 📋 Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) `v20.19.0` or `v22.12.0+`
- [MySQL](https://dev.mysql.com/downloads/) `8.0+`
- npm (comes with Node.js)

---

## 🗄️ Database Setup

1. Open your MySQL client (MySQL Workbench, terminal, etc.)

2. Create the database:
   ```sql
   CREATE DATABASE unithrift;
   ```

3. Import the provided database dump:
   ```bash
   mysql -u root -p unithrift < updatedDb
   ```
   > Replace `root` with your MySQL username if different.

---

## ⚙️ Environment Variables

### Backend (`back-end/.env`)

Create a `.env` file inside the `back-end/` folder:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=unithrift
JWT_SECRET=your_jwt_secret_key
PORT=2006
```

### Frontend (`.env`)

A `.env` file already exists at the project root. Update it with your Google Maps API key if needed:

```env
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

---

## 🚀 Installation & Running the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/UniThrift.git
cd UniThrift
```

### 2. Install & Start the Backend

```bash
cd back-end
npm install
node index.js
```

The backend server will start on **http://localhost:2006**

> **Tip:** For development with auto-reload, use:
> ```bash
> npx nodemon index.js
> ```

### 3. Install & Start the Frontend

Open a **new terminal**, navigate back to the project root:

```bash
cd ..
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

## 📁 Project Structure

```
UniThrift/
├── back-end/               # Express.js backend
│   ├── controllers/        # Route controller logic
│   ├── models/             # Database models
│   ├── db/                 # Database connection helpers
│   ├── config.js           # MySQL connection pool
│   ├── index.js            # Server entry point
│   ├── bcryptAuth.js       # Authentication routes
│   ├── tokenAuth.js        # JWT middleware
│   └── package.json
├── src/                    # Vue 3 frontend
│   ├── views/              # Page components
│   ├── components/         # Reusable components
│   ├── composables/        # Vue composables
│   ├── router/             # Vue Router config
│   └── main.js
├── public/                 # Static assets
├── updatedDb               # MySQL database dump
├── .env                    # Frontend environment variables
├── vite.config.js
└── package.json
```

---

## 🛠️ Available Scripts

### Frontend (root directory)

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Backend (`back-end/` directory)

| Command | Description |
|---|---|
| `node index.js` | Start the backend server |
| `npx nodemon index.js` | Start with auto-reload (development) |

---

## 🔑 Key Features

- User authentication with JWT and bcrypt
- Product catalogue with search functionality
- Shopping cart and checkout flow
- Seller profiles and top sellers
- Product reviews
- Payment processing
- Admin dashboard
- Contact page with Google Maps integration

---

## 🐛 Common Issues

**MySQL connection refused**
- Ensure MySQL service is running: `sudo service mysql start` (Linux/Mac) or start it via MySQL Workbench (Windows)
- Double-check your `DB_USER` and `DB_PASSWORD` in `back-end/.env`

**Port already in use**
- Kill the process using the port: `npx kill-port 3000` or `npx kill-port 5173`

**`node_modules` missing errors**
- Run `npm install` in both the root directory and the `back-end/` directory

**Database import fails**
- Make sure the `unithrift` database exists before importing: `CREATE DATABASE unithrift;`
