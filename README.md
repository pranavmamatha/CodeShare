# CodeShare

<div align="center">
  <img src="https://github.com/pranavmamatha/CodeShare/blob/main/frontend/public/android-chrome-512x512.png" alt="CodeShare Logo" width="200" height="200">
  
  <h3>Real-time collaborative code editor with auto-save functionality</h3>
  
  <h2>👉 <a href="https://pranav-codeshare.vercel.app/">Live Preview</a> 👈</h2>
  
  <img alt="WebSocket" src="https://img.shields.io/badge/WebSocket-010101.svg?style=flat&logo=Socket.io&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=flat&logo=PostgreSQL&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=Node.js&logoColor=white" />
</div>

<br><br>

## 🚀 Why CodeShare?

Real-time collaboration. See changes instantly. Auto-saves.

<br><br>

## ⚡ How It Works

1. **Create Room** → Get unique room ID
2. **Join & Collaborate** → Multiple users connect via WebSocket
3. **Real-time Sync** → Changes broadcast instantly
4. **Auto-save** → Saves after 10 seconds of inactivity

<br><br>

## ✨ What Makes It Unique

- **Debounced Auto-save** → No data loss
- **Hybrid State** → Memory + database
- **Zero Config** → Generate rooms on-demand

<br><br>

## 📚 What I Learned

- **WebSocket State Management** → Connection cleanup
- **Performance Optimization** → Memory vs database balance
- **Timeout Management** → Debounced auto-save
- **Real-time Architecture** → Data consistency

<br><br>

## 🛠️ Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

<br><br>

## 🔌 API

**Create Room:**
```
GET / → { roomId: "abc12" }
```

**WebSocket Events:**
```javascript
// Join room
{ type: "join", payload: { roomId: "abc12" } }

// Send code
{ type: "code", payload: { roomId: "abc12", code: "console.log('hello');" } }
```

<br><br>

## 🚀 Future Development

- **Better Error Handling** → Retry mechanisms
- **Read-only Mode** → Observer permissions
- **Permanent Storage** → Persistent repositories
- **User Cursors** → Real-time editing positions

<br><br>

## 💻 Tech Stack

- **Backend** → Node.js + TypeScript + Express
- **Real-time** → WebSocket (ws library)
- **Database** → PostgreSQL + Prisma ORM
