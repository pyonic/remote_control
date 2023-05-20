const WS_COMMANDS: Array<string> = [
    'mouse_up',
    'mouse_down',
    'mouse_left' ,
    'mouse_right' ,
    'mouse_position',
    'draw_circle' ,
    'draw_rectangle' ,
    'draw_square' ,
    'prnt_scrn'
]

enum WS_COMMANDS_ENUM {
    MOUSE_UP = 'mouse_up',
    MOUSE_DOWN ='mouse_down',
    MOUSE_LEFT = 'mouse_left' ,
    MOUSE_RIGHT = 'mouse_right' ,
    MOUSE_POSITION = 'mouse_position',
    DRAW_CIRCLE = 'draw_circle',
    DRAW_RECTANGLE = 'draw_rectangle' ,
    DRAW_SQUARE = 'draw_square' ,
    PRNT_SCRN = 'prnt_scrn',
    CAPTURE = 'capture'
}


export { WS_COMMANDS, WS_COMMANDS_ENUM}