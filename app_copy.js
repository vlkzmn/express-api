import { v4 as uuidV4 } from 'uuid';
import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

import 'dotenv/config';
import { dbService } from './src/services/dbService.js';

const emitter = new EventEmitter();

const wss = new WebSocketServer({ port: process.env.PORT });

wss.on('listening', () => console.log('server started'));

wss.on('connection', (client) => {
  client.on('error', (error) => {
    console.error(`WebSocket error: ${error.message}`);
  });

  client.on('message', async(data) => {
    const clientData = JSON.parse(data.toString());

    switch (clientData.action) {
      case 'registration':
        const id = uuidV4();

        const confirmation = {
          action: 'confirmation',
          name: clientData.name,
          id,
        };

        client.send(JSON.stringify(confirmation));
        break;

      case 'createRoom':
        try {
          await dbService.createRoom(clientData.title, clientData.userId);

          emitter.emit('sendUpdatedRoomsList');
        } catch (error) {
          const message = `Can't create room`;

          emitter.emit('isError', {
            client, message, error,
          });
        }

        break;

      case 'renameRoom':
        let messageRenameRoom;

        try {
          await dbService.renameRoom(clientData.roomId, clientData.newTitle);

          emitter.emit('sendUpdatedRoomsList');

          messageRenameRoom = {
            action: 'messages',
            room: await dbService.getOneRoom(clientData.roomId),
          };
        } catch (error) {
          const message = `Can't rename room`;

          emitter.emit('isError', {
            client, message, error,
          });
        }

        for (const oneOfClients of wss.clients) {
          if (oneOfClients.roomId === clientData.roomId) {
            oneOfClients.send(JSON.stringify(messageRenameRoom));
          }
        }

        break;

      case 'chooseRoom':
        client.roomId = clientData.id;

        let messageChooseRoom;

        try {
          messageChooseRoom = {
            action: 'messages',
            messages: await dbService.getMessages(clientData.id),
            room: await dbService.getOneRoom(clientData.id),
          };
        } catch (error) {
          const message = `Can't load room`;

          emitter.emit('isError', {
            client, message, error,
          });
        }

        client.send(JSON.stringify(messageChooseRoom));

        break;

      case 'askRoomsList':
        let roomsList;

        try {
          roomsList = {
            action: 'roomsList',
            rooms: await dbService.getAllRooms(),
          };
        } catch (error) {
          const message = `Can't recieve rooms list `;

          emitter.emit('isError', {
            client, message, error,
          });
        }

        client.send(JSON.stringify(roomsList));

        break;

      case 'deleteRoom':
        try {
          await dbService.deleteRoom(clientData.roomId);
        } catch (error) {
          const message = `Server can't delete room`;

          emitter.emit('isError', {
            client, message, error,
          });
        }

        for (const cli of wss.clients) {
          if (cli.roomId === clientData.roomId) {
            cli.send(JSON.stringify({
              action: 'messages',
              messages: [],
              room: null,
            }));

            cli.roomId = null;
          }
        }

        emitter.emit('sendUpdatedRoomsList');
        break;

      case 'newMessage':
        const { author, text, date, roomId } = clientData;

        try {
          await dbService.createMessage(author, text, date, roomId);
        } catch (error) {
          const message = `Server can't add new message`;

          emitter.emit('isError', {
            client, message, error,
          });
        }

        const newMessage = {
          action: 'newMessage',
          message: {
            author,
            text,
            date,
          },
        };

        for (const cli of wss.clients) {
          if (cli.roomId === roomId) {
            cli.send(JSON.stringify(newMessage));
          }
        }

        break;

      default:
    }
  });
});

emitter.on('sendUpdatedRoomsList', async() => {
  let roomsList;

  try {
    roomsList = {
      action: 'roomsList',
      rooms: await dbService.getAllRooms(),
    };
  } catch (error) {
    console.log(error);

    roomsList = {
      action: 'error',
      message: `Can't load new rooms list after update`,
      error,
    };
  }

  for (const client of wss.clients) {
    client.send(JSON.stringify(roomsList));
  }
});

emitter.on('isError', ({ client, message, error }) => {
  console.log(error);

  const err = {
    action: 'error',
    message,
    error,
  };

  client.send(JSON.stringify(err));
});

wss.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
});


// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3001;

// app.get("/", (req, res) => res.type('html').send(html));

// const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// server.keepAliveTimeout = 120 * 1000;
// server.headersTimeout = 120 * 1000;

// const html = `
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Hello from Render!</title>
//     <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
//     <script>
//       setTimeout(() => {
//         confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 },
//           disableForReducedMotion: true
//         });
//       }, 500);
//     </script>
//     <style>
//       @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
//       @font-face {
//         font-family: "neo-sans";
//         src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
//         font-style: normal;
//         font-weight: 700;
//       }
//       html {
//         font-family: neo-sans;
//         font-weight: 700;
//         font-size: calc(62rem / 16);
//       }
//       body {
//         background: white;
//       }
//       section {
//         border-radius: 1em;
//         padding: 1em;
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         margin-right: -50%;
//         transform: translate(-50%, -50%);
//       }
//     </style>
//   </head>
//   <body>
//     <section>
//       Hello from Render!
//     </section>
//   </body>
// </html>
// `
