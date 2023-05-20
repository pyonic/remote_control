import Jimp from 'jimp';
import { mouse, left, right, up, down, Point, Button, screen, Region, EasingFunction, FileType } from '@nut-tree/nut-js';
import { WS_COMMANDS_ENUM } from '../constants';
import { ICommand } from '../interfaces/Commands';


const COMMAND = {
    'mouse_down': down,
    'mouse_up': up,
    'mouse_left': left,
    'mouse_right': right
}

const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
}

const pressBtn = async (x: number, y: number) => {
    await mouse.setPosition(new Point(x, y));
    await mouse.pressButton(Button.LEFT);
    await mouse.releaseButton(Button.LEFT);
}

const pressAndMove = async (x: number, y: number) => {
    await mouse.setPosition(new Point(x, y));
    await mouse.pressButton(Button.LEFT);
    await mouse.releaseButton(Button.LEFT);
}

const moveTo = async (x: number, direction: string | any) => {
    await mouse.pressButton(Button.LEFT);
    // @ts-ignore
    console.log(direction, COMMAND[direction]);
    
    // @ts-ignore
    await mouse.move(COMMAND[direction](x));
    await mouse.releaseButton(Button.LEFT);
}

const moveToPoints = async (points: Array<Point>) => {
    const initPos: Point = points[0];
    await mouse.setPosition(initPos); 
    await mouse.pressButton(Button.LEFT);
    await mouse.move(points)
    await mouse.releaseButton(Button.LEFT);
}

const ServerCommand = async (data: ICommand): Promise<any> => {
    const { command, metadata } = data;
    const { x, y } = metadata;

    if (Object.keys(COMMAND).includes(command!)) {
        const { x } = metadata;
        // @ts-ignore
        if (x) mouse.move(COMMAND[command](parseInt(x)))
    }

    switch (command) {
        case WS_COMMANDS_ENUM.MOUSE_POSITION:
            const position: Point = await mouse.getPosition();
            return {data: 'mouse_position', position};
        case WS_COMMANDS_ENUM.DRAW_RECTANGLE:
            if (x && y) {
                await moveTo(x, 'mouse_up');
                await moveTo(y, 'mouse_right');
                await moveTo(x, 'mouse_down');
                await moveTo(y, 'mouse_left');
            }
            break;
        case WS_COMMANDS_ENUM.DRAW_SQUARE:
            if (x) {
                await moveTo(x, 'mouse_up');
                await moveTo(x, 'mouse_right');
                await moveTo(x, 'mouse_down');
                await moveTo(x, 'mouse_left');
            }
            break;
        case WS_COMMANDS_ENUM.DRAW_CIRCLE:
            if (x) {
                const position: Point = await mouse.getPosition();
                const detailedDrawing: boolean = x < 40;

                const quarters: any = {one: [], two: [], three: [], four: []};
                for (let i = 1; i <= x; i++) {
                    const z: number = Math.sqrt(x*x - Math.pow(i, 2));
                    const pX: number = position.x + x - z;

                    if (detailedDrawing) {
                        await pressBtn(pX, position.y - i);
                        await pressBtn(pX + z*2, position.y - i);
                        await pressBtn(pX, position.y + i);
                        await pressBtn(pX + z*2, position.y + i);
                    } else {
                        quarters.one.push(new Point(pX, position.y - i))
                        quarters.two.push(new Point(pX + z*2, position.y - i))
                        quarters.three.push(new Point(pX, position.y + i))
                        quarters.four.push(new Point(pX + z*2, position.y + i))
                    }
                }
                
                if (!detailedDrawing) {
                    await moveToPoints(quarters.one);
                    await moveToPoints(quarters.two.reverse());
                    await moveToPoints(quarters.four);
                    await moveToPoints(quarters.three.reverse());
                }

            }
            break;
        case WS_COMMANDS_ENUM.PRNT_SCRN:
            try {
                const mouse_position = await mouse.getPosition();
                
                const region = await new Region(mouse_position.x - 100, mouse_position.y - 100, 200, 200)
                const img = await (await screen.grabRegion(region)).toRGB()
                console.log("HERE ", img);
                
                const jimp = await Jimp.read(await new Jimp(img))
                const buffer = await jimp.getBase64Async(jimp.getMIME())
                return { data: 'capture', image: buffer.split('data:image/png;base64,').join('') };
            } catch (error) {
                console.log('Coordinated out of scope', error);
            }
    }

    return {};
}

export { ServerCommand }