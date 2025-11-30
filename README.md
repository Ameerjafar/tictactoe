# 🎮 Multiplayer Tic-Tac-Toe

A real-time multiplayer Tic-Tac-Toe game built with Next.js, WebSockets, and PostgreSQL. Features include live gameplay, spectator mode, chat functionality, user profiles, and game statistics tracking.

## 📹 Demo

<!-- Add your demo video or GIF here -->
<!-- Example: -->

https://github.com/user-attachments/assets/18889c8d-7c71-44d7-a9df-d27c6dea8230


<!-- ![Demo](./demo.gif) -->
<!-- Or embed a video: -->
<!-- [![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID) -->



## ✨ Features

### 🎯 Core Gameplay
- **Real-time Multiplayer**: Play against other players in real-time using WebSocket connections
- **Spectator Mode**: Watch ongoing games without participating
- **Room System**: Create or join game rooms with unique room IDs
- **Turn-based Gameplay**: Automatic turn management with visual indicators
- **Win Detection**: Automatic detection of wins, losses, and draws
- **Sound Effects**: Audio feedback for moves, wins, and draws

### 👤 User Management
- **Authentication**: Secure JWT-based authentication with 1-hour token expiry
- **User Profiles**: View personal stats including total games, wins, losses, and draws
- **Game History**: Track and review your last 20 games

### 💬 Social Features
- **Live Chat**: In-game chat for players and spectators
- **Room Management**: Admin controls for starting games and closing rooms
- **Player Count**: Real-time display of connected players

### 🎨 UI/UX
- **Premium Design**: Modern, glassmorphic UI with gradient effects
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Eye-friendly dark color scheme
- **Smooth Animations**: Polished transitions and hover effects

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks & Context API
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **WebSocket**: Native WebSocket API

### Backend
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Express.js](https://expressjs.com/)
- **WebSocket**: [ws](https://github.com/websockets/ws)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [JWT](https://jwt.io/)
- **Password Hashing**: [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Validation**: [Zod](https://zod.dev/)

### Monorepo
- **Build System**: [Turborepo](https://turbo.build/)
- **Package Manager**: Bun
- **Workspace Structure**: Apps and shared packages

## 📁 Project Structure

```
tic-tac-toe/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── controller/   # Route controllers
│   │   ├── middleware/   # Auth middleware
│   │   └── routes/       # API routes
│   ├── web/             # Next.js frontend
│   │   ├── app/         # App router pages
│   │   ├── component/   # React components
│   │   ├── context/     # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Utility functions
│   └── ws/              # WebSocket server
│       ├── GameManager.ts
│       └── index.ts
└── packages/
    └── db/              # Shared Prisma schema
        └── prisma/
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **Bun** >= 1.2.22
- **PostgreSQL** database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ameerjafar/tictactoe.git
   cd tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create `.env` files in the following locations:

   **`apps/backend/.env`**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tictactoe"
   JWT_SECRET="your-secret-key-here"
   PORT=5000
   ```

   **`apps/web/.env`**
   ```env
   NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
   NEXT_PUBLIC_WS_URL="ws://localhost:8080"
   ```

   **`packages/db/.env`**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tictactoe"
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   bunx prisma migrate dev
   bunx prisma generate
   cd ../..
   ```

5. **Start the development servers**
   ```bash
   # Start all services (recommended)
   bun run dev

   # Or start individually:
   # Terminal 1 - Backend API
   cd apps/backend && bun run dev

   # Terminal 2 - WebSocket Server
   cd apps/ws && bun run dev

   # Terminal 3 - Frontend
   cd apps/web && bun run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - WebSocket: ws://localhost:8080

## 🎮 How to Play

1. **Sign Up / Sign In**
   - Create an account or sign in with existing credentials

2. **Create or Join a Room**
   - Click "Create New Room" to start a new game
   - Or enter a Room ID to join an existing game
   - Choose between Player or Spectator mode

3. **Wait for Players**
   - The game starts automatically when 2 players join
   - Spectators can watch and chat

4. **Play the Game**
   - Take turns placing X or O on the board
   - First to get 3 in a row wins!
   - Use the chat to communicate with other players

5. **View Your Stats**
   - Click "View Profile" to see your game statistics
   - Review your game history and performance

## 🔐 Authentication

- JWT-based authentication with 1-hour token expiry
- Automatic token validation on protected routes
- Secure password hashing with bcrypt
- Client-side token expiry checking

## 🗄️ Database Schema

### User
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `totalGames`: Integer
- `wins`: Integer
- `losses`: Integer
- `draws`: Integer

### Game
- `id`: UUID (Primary Key)
- `roomId`: String
- `userId`: String (Foreign Key)
- `isWin`: Boolean
- `createdAt`: DateTime

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user
- `POST /api/v1/auth/signin` - Sign in user

### Game
- `GET /api/v1/game/userstats` - Get user statistics
- `GET /api/v1/game/usergames` - Get user game history
- `POST /api/v1/game/creategame` - Create game record
- `POST /api/v1/game/updatestats` - Update user stats

## 🔌 WebSocket Events

### Client → Server
- `createRoom` - Create a new game room
- `joinRoom` - Join an existing room
- `updateGameState` - Send game move
- `message` - Send chat message
- `restartGame` - Restart game (admin only)
- `closeRoom` - Close room (admin only)

### Server → Client
- `userList` - Updated list of users in room
- `updateGameState` - Game state update
- `message` - Chat message
- `startGame` - Game started
- `restartGame` - Game restarted
- `closeRoom` - Room closed

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev          # Start all services in dev mode

# Build
bun run build        # Build all apps for production

# Linting
bun run lint         # Run ESLint on all packages

# Type Checking
bun run check-types  # Run TypeScript type checking

# Formatting
bun run format       # Format code with Prettier
```

### Database Migrations

```bash
cd packages/db

# Create a new migration
bunx prisma migrate dev --name migration_name

# Apply migrations
bunx prisma migrate deploy

# Generate Prisma Client
bunx prisma generate

# Open Prisma Studio
bunx prisma studio
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ameer Jafar**
- GitHub: [@Ameerjafar](https://github.com/Ameerjafar)

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by the classic Tic-Tac-Toe game
- Special thanks to the open-source community

---

**Enjoy playing! 🎮**
