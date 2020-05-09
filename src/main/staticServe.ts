import fs from 'fs';
import http, { Server } from 'http';
import finalhandler from 'finalhandler';
import serveStatic from 'serve-static';
import { ipcMain } from 'electron';
import path from 'path';

let server: Server | null = null;

const initStaticServe = () => {
  ipcMain.handle('startup-server-static-message', async (event, modelPath) => {
    const hasLocalModel = fs.existsSync(modelPath);
    if (!hasLocalModel) {
      return;
    }

    if (server) {
      server.close();
    }

    const folder = path.dirname(modelPath);

    const serve = serveStatic(folder, {
      index: 'model.json',
      maxAge: 48 * 60 * 60 * 1e3
    });

    return new Promise(resolve => {
      // 重启解决缓存问题
      server = http
        .createServer(function onRequest(req, res) {
          serve(req, res, finalhandler(req, res));
        })
        .listen(0, '127.0.0.1', () => {
          const address = server?.address();
          resolve(address);
        });
    });
  });

  ipcMain.on('close-server-static-message', () => {
    if (server) {
      server.close();
    }
  });
};

export default initStaticServe;
