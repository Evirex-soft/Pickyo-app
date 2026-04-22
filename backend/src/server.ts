import 'dotenv/config';
import http from 'http';
import app from './app';
import { initSocket } from './config/socket';

const PORT = process.env.PORT || 8000;

// Create HTTP server 
const server = http.createServer(app);

// initialize Socket.IO
initSocket(server);

// Start  server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
