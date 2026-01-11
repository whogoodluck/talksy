# 💬 Talksy

<div align="center">

**A modern real-time chat platform that makes conversations fast, fun, and effortless.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

[Live Demo](https://talksy.yourdomain.com) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Configuration](#configuration) • [Development](#development)

### 🌐 [Try Talksy Live →](https://talksy-mptl.onrender.com/)

</div>

---

## 📸 Preview

<div align="center">

![Talksy Preview](./public/preview.png)

_Experience real-time conversations with a modern, intuitive interface_

</div>

## ✨ Features

- **Real-time Messaging** - Instant message delivery using WebSocket technology
- **User Authentication** - Secure JWT-based authentication system
- **Email Verification** - Email-based user verification with Brevo SMTP
- **Image Upload** - Cloudinary integration for seamless image sharing
- **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- **Type Safety** - Full TypeScript support across the stack
- **Database** - PostgreSQL with Prisma ORM for robust data management

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Email**: Nodemailer + Brevo SMTP
- **File Upload**: Multer + Cloudinary
- **Validation**: Zod

### Frontend

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Forms**: React Hook Form
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Real-time**: Socket.io Client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

You'll also need accounts for:

- [Cloudinary](https://cloudinary.com/) (for image uploads)
- [Brevo](https://www.brevo.com/) (for email services)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/whogoodluck/talksy.git
cd talksy
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd web
npm install
cd ..
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb talksy
```

### 4. Environment Configuration

Create a `.env` file in the `src` directory:

```bash
cp src/.env.example src/.env
```

Update the `.env` file with your credentials:

```env
PORT=3002

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/talksy
DEV_DATABASE_URL=postgresql://username:password@localhost:5432/talksy

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Brevo SMTP
BREVO_SMTP_KEY=your_brevo_api_key

# Application
APP_NAME=Talksy
SENDER_EMAIL=noreply@yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6. Start Development Servers

**Backend:**

```bash
npm run dev
```

**Frontend (in a new terminal):**

```bash
cd web
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3002`

## ⚙️ Configuration

### Environment Variables

| Variable                | Description                  | Required |
| ----------------------- | ---------------------------- | -------- |
| `PORT`                  | Backend server port          | Yes      |
| `DATABASE_URL`          | PostgreSQL connection string | Yes      |
| `JWT_SECRET`            | Secret key for JWT tokens    | Yes      |
| `BREVO_SMTP_KEY`        | Brevo SMTP API key           | Yes      |
| `APP_NAME`              | Application name             | Yes      |
| `SENDER_EMAIL`          | Email sender address         | Yes      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name        | Yes      |
| `CLOUDINARY_API_KEY`    | Cloudinary API key           | Yes      |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret        | Yes      |

## 🔧 Development

### Available Scripts

**Backend (`src/`):**

```bash
npm run dev              # Start development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run studio           # Open Prisma Studio
npm run cleanup          # Run cleanup job
npm run lint             # Lint code
npm run format           # Format code with Prettier
```

**Frontend (`web/`):**

```bash
npm run dev              # Start Vite development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
npm run format           # Format code with Prettier
```

**Full Stack:**

```bash
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
npm run build:all        # Build both frontend and backend
```

### Project Structure

```
talksy/
├── src/                    # Backend source code
│   ├── index.ts           # Application entry point
│   ├── jobs/              # Background jobs
│   ├── prisma/            # Database schema and migrations
│   └── ...
├── web/                   # Frontend source code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── ...
└── package.json
```

## 📦 Deployment

### Build for Production

```bash
# Build both frontend and backend
npm run build:all
```

### Production Environment

Ensure all environment variables are set in your production environment. The production server runs on:

```bash
npm start
```

### Recommended Hosting Platforms

- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Railway, Render, Supabase, Neon

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/whogoodluck/talksy/issues).

## 📧 Contact

For questions or support, please reach out through the [GitHub repository](https://github.com/whogoodluck/talksy).

---

<div align="center">

**Built with ❤️ using TypeScript, React, and Express**

</div>
