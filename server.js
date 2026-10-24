const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// 托管前端页面（让浏览器能读到 index.html）
app.use(express.static(path.join(__dirname)));

// 连接 Neon 数据库
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 启动建表
pool.query(`
  CREATE TABLE IF NOT EXISTS gifts (
    id TEXT PRIMARY KEY,
    room_id TEXT,
    name TEXT,
    price TEXT,
    link TEXT,
    recipient TEXT,
    image TEXT,
    status TEXT,
    notes JSONB
  )
`).then(() => console.log('DB ready'))
  .catch(e => console.error('DB init error', e));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    const { rows } = await pool.query('SELECT * FROM gifts WHERE room_id=$1', [roomId]);
    socket.emit('gift-updated', { roomId, gifts: rows });
  });

  socket.on('add-gift', async ({ roomId, gift }) => {
    await pool.query(`
      INSERT INTO gifts (id, room_id, name, price, link, recipient, image, status, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT(id) DO UPDATE SET
        name=EXCLUDED.name, price=EXCLUDED.price, link=EXCLUDED.link,
        recipient=EXCLUDED.recipient, image=EXCLUDED.image,
        status=EXCLUDED.status, notes=EXCLUDED.notes
    `, [gift.id, roomId, gift.name, gift.price, gift.link, gift.recipient, gift.image, gift.status, JSON.stringify(gift.notes||{})]);
    const { rows } = await pool.query('SELECT * FROM gifts WHERE room_id=$1', [roomId]);
    io.to(roomId).emit('gift-updated', { roomId, gifts: rows });
  });

  socket.on('update-gift', async ({ roomId, gift }) => {
    await pool.query(`
      UPDATE gifts SET name=$3, price=$4, link=$5, recipient=$6, image=$7, status=$8, notes=$9
      WHERE id=$1 AND room_id=$2
    `, [gift.id, roomId, gift.name, gift.price, gift.link, gift.recipient, gift.image, gift.status, JSON.stringify(gift.notes||{})]);
    const { rows } = await pool.query('SELECT * FROM gifts WHERE room_id=$1', [roomId]);
    io.to(roomId).emit('gift-updated', { roomId, gifts: rows });
  });

  socket.on('delete-gift', async ({ roomId, id }) => {
    await pool.query('DELETE FROM gifts WHERE id=$1 AND room_id=$2', [id, roomId]);
    const { rows } = await pool.query('SELECT * FROM gifts WHERE room_id=$1', [roomId]);
    io.to(roomId).emit('gift-updated', { roomId, gifts: rows });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on', PORT));