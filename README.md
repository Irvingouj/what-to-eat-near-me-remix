# Full-Stack TypeScript App with Remix and Express

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Remix](https://img.shields.io/badge/Remix-2.0-purple)](https://remix.run/)
[![Express](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-yellow)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern full-stack TypeScript application template combining Remix for server-side rendering and React features with Express for backend services. This setup provides a powerful foundation for building scalable web applications with real-time capabilities.

## 🚀 Features

- **Full-Stack TypeScript**: End-to-end type safety across your entire application
- **Server-Side Rendering**: Fast initial page loads and SEO optimization with Remix
- **Real-Time Ready**: Built-in support for WebSocket connections
- **Modern Build System**: Lightning-fast builds with Vite
- **Database Integration**: Type-safe database operations with Drizzle ORM
- **Styling**: Modern UI with TailwindCSS
- **Docker Support**: Containerized deployment ready
- **Development Experience**: Hot Module Replacement (HMR) and fast refresh

## 📋 Prerequisites

- Node.js 20.x or later
- npm 9.x or later
- Docker (optional, for containerized deployment)
- PostgreSQL (or your preferred database)

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd your-project-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your database connection in `.env`

## 📁 Project Structure

```
.
├─ app/                 # Remix frontend code
│  ├─ components/       # React components
│  ├─ context/         # React context providers
│  ├─ hooks/           # Custom React hooks
│  ├─ routes/          # Remix routes
│  ├─ services/        # Frontend services
│  └─ types/           # TypeScript types
├─ build/              # Compiled output
│  ├─ client/          # Client-side build
│  ├─ node/            # Server-side build
│  └─ server/          # Remix server build
├─ common/             # Shared code
│  ├─ auth/            # Authentication logic
│  ├─ db/              # Database schemas
│  ├─ errors/          # Error definitions
│  └─ types/           # Shared types
├─ src/                # Backend code
│  ├─ api/             # Express routes
│  ├─ services/        # Backend services
│  └─ utils/           # Utility functions
├─ Dockerfile          # Docker configuration
├─ package.json        # Project dependencies
├─ server.ts           # Express server entry
├─ tsconfig.json       # TypeScript configuration
└─ vite.config.ts      # Vite configuration
```

## 💻 Development

Start the development server:

```bash
npm run dev
```

This will:
- Start the Express server in development mode
- Enable Vite's HMR
- Watch for TypeScript changes
- Start the development server at http://localhost:3000

## 🏗 Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

   This runs two build processes:
   - `build:remix`: Builds the Remix frontend
   - `build:server`: Compiles the TypeScript server

2. Start the production server:
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t your-app-name .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e DATABASE_URL=your_db_url your-app-name
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# Add other environment variables as needed
```

## 🔒 TypeScript Configuration

The project uses two TypeScript configurations:

- `tsconfig.json`: Shared between Vite and Remix
- `tsconfig.server.json`: Server-specific configuration

## 📚 Additional Documentation

- [Remix Documentation](https://remix.run/docs)
- [Express Documentation](https://expressjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Drizzle Documentation](https://orm.drizzle.team/docs/overview)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
