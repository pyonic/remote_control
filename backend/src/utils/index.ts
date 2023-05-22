import { WS_COMMANDS } from '../constants'
import { ICommand } from '../interfaces/Commands';

const parseCommand = (data: string): ICommand => {
    let command: string = '';
    const result: ICommand = {}

    for ( let i = 0; i <= WS_COMMANDS.length; i++) {
        if (data.includes(WS_COMMANDS[i])) {
            command = WS_COMMANDS[i];
            break;
        }
    }

    if (command) {
        const commandData = data.replace(command, '').replace(',', ' ').trim();
        const meta: Array<string> = commandData.split(' ');
        console.log(commandData, meta);
        const metadata: object = {
            x: meta[0].length > 0 ? parseInt(meta[0]) : null,
            y: meta.length > 0 ? parseInt(meta[1]) : null 
        };
        result.command = command;
        result.metadata = metadata;
    }

    return result;
}

export { parseCommand }