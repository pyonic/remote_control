import * as http from 'http';
import { Readable } from 'stream';
import ws, { createWebSocketStream } from 'ws';

import { ServerCommand } from './controller/Control';
import { ICommand } from './interfaces/Commands';
import { parseCommand } from './utils';
import { WS_COMMANDS_ENUM } from './constants';

const PORT: number = parseInt(process.env.PORT!) || 8080;
const server: http.Server = http.createServer();

const websocket: ws.Server = new ws.WebSocket.Server({ server });

websocket.on('connection', (ws) => {
    process.stdout.write('\nClient connected to WS server\n')
    ws.on('message', async (message) => {
        const commandData: ICommand = parseCommand(message.toString());

        process.stdout.write(`\nCommand came to server ${JSON.stringify(commandData)}\n`)
        
        const response: any = await ServerCommand(commandData);
       
        if ( response.data === WS_COMMANDS_ENUM.MOUSE_POSITION ) {
            const wsStream = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });
            const dataStream = new Readable({ read: () => {} });
            dataStream.push(`${response.data} ${response.position.x},${response.position.y}`)
            dataStream.on('data', (chunk) => {
                wsStream.write(chunk.toString());
            })
        } else if (response.data === WS_COMMANDS_ENUM.CAPTURE) {
            const wsStream = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });

            let dta = `${WS_COMMANDS_ENUM.PRNT_SCRN} ${response.image}`;

            wsStream.write(dta);
        }
    })
    ws.on('close', () => {
        process.stdout.write('\nClient disconnected from server\n')
    })
})

server.listen(PORT, () => {
    process.stdout.write(`WebSocket server started at host ws://127.0.0.1:${PORT} \n`)
})