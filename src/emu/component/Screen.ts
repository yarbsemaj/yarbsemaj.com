import { screenColorHex } from "../../components/store/store";
import welcome from "./screen-images/welcome.png"
import about1 from "./screen-images/about1.png"
import about2 from "./screen-images/about2.png"
import about3 from "./screen-images/about3.jpeg"
import about4 from "./screen-images/about4.png"

const roms = ['puc', 'minesweeper', 'snake', 'image', 'banner', 'connect4', 'life', 'threed', 'zpaint']

export type AboutSlide = {
    image: HTMLImageElement
    lightColor: number
}

const CHAR_WIDTH = 10
const CHAR_HEIGHT = 16

export class Screen {
    static black = "#000000";
    static red = "#800000";
    static green = "#008000";
    static yellow = "#808000";
    static blue = "#000080";
    static magenta = "#800080";
    static cyan = "#008080";
    static white = "#c0c0c0";

    static bright_black = "#808080";
    static bright_red = "#ff0000";
    static bright_green = "#00ff00";
    static bright_yellow = "#ffff00";
    static bright_blue = "#0000ff";
    static bright_magenta = "#ff00ff";
    static bright_cyan = "#00ffff";
    static bright_white = "#ffffff";

    static default = "#00aa00"

    static colourMap = {
        30: Screen.black,
        31: Screen.red,
        32: Screen.green,
        33: Screen.yellow,
        34: Screen.blue,
        35: Screen.magenta,
        36: Screen.cyan,
        37: Screen.white,
        90: Screen.bright_black,
        91: Screen.bright_red,
        92: Screen.bright_green,
        93: Screen.bright_yellow,
        94: Screen.bright_blue,
        95: Screen.bright_magenta,
        96: Screen.bright_cyan,
        97: Screen.bright_white
    }

    static defaultConsoleColour = { fg: this.default, bg: Screen.black };
    static defaultChar = { txt: undefined, colour: { fg: this.default, bg: Screen.black } };

    canvasElement: HTMLCanvasElement
    screenBuffer: Array<Array<{ txt: undefined | string, colour: { fg: string, bg: string } } | undefined>>
    width: number
    height: number
    canvas: CanvasRenderingContext2D
    cursor: { x: number, y: number }
    colour: { fg: string, bg: string }
    escapeSequenceBuilder: string
    showCursor: boolean
    welcome: HTMLImageElement
    about: AboutSlide[]
    aboutSlide: number
    displayWelcome: boolean
    commandBuffer: string
    loadRom: (romName: string) => void
    commandParsed = false

    constructor(width: number, height: number, element: HTMLCanvasElement, loadRom: (romName: string) => void) {
        this.welcome = new Image();
        this.welcome.src = welcome;

        const about1Image = new Image()
        about1Image.src = about1

        const about2Image = new Image()
        about2Image.src = about2

        const about3Image = new Image()
        about3Image.src = about3

        const about4Image = new Image()
        about4Image.src = about4

        this.about = [
            {
                image: about1Image,
                lightColor: 0x00aa00
            },
            {
                image: about2Image,
                lightColor: 0x00aa00
            },
            {
                image: about3Image,
                lightColor: 0x75757b
            },
            {
                image: about4Image,
                lightColor: 0x00aa00
            }
        ]


        this.displayWelcome = false
        this.aboutSlide = 0

        this.loadRom = loadRom
        const scale = 1
        this.canvasElement = element;
        const widthPx = 709
        const heightPx = 530
        const ctx = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;
        this.canvasElement.style.width = 100 + "vw";
        this.canvasElement.width = Math.floor(widthPx * scale);
        this.canvasElement.height = Math.floor(heightPx * scale);
        ctx.scale(scale, scale)
        this.screenBuffer = [];
        this.width = width;
        this.height = height;
        this.canvas = ctx;
        this.cursor = { x: 0, y: 0 };
        this.colour = { ...Screen.defaultConsoleColour };
        this.escapeSequenceBuilder = "";
        this.showCursor = true;
        this.clear()
    }

    clear() {
        this.cursor = { x: 0, y: 0 };
        this.screenBuffer = Array.from(Array(this.height), () => new Array(this.width));
    }

    showWelcome() {
        this.displayWelcome = true

        const line1 = 'type "help" to see a list of program loading commands'
        this.cursor.y++;
        this.cursor.x = 0;
        line1.split('').forEach((char) => this.putChar(char))
        this.cursor.y++;
        this.cursor.x = 0;
    }

    private putChar(char: string) {
        this.screenBuffer[this.cursor.y][this.cursor.x] = { txt: char, colour: { ...this.colour } };
        this.cursor.x++;
    }

    private parseCommand(command: string) {
        if (command === 'ls') {
            const message = `\npuc         :- A maze chase game
minesweeper :- An explosive puzzle
snake       :- Party like it's 1999
connect4    :- Fun for 2
zpaint      :- A art program\n`
            message.split('').forEach((char) => this.newChar(char))
            return true
        }

        if (command === 'help') {
            const message = `\nls           :- List programs to load
load <name>  :- Load a program by "name"
about        :- About the computer \n
type E 0100 to return to return to basic after exiting a program\n`
            message.split('').forEach((char) => this.newChar(char))
            return true
        }

        if(command === 'about'){
            this.aboutSlide = 1
            //add keyboard listener
            const aboutKeyboardListener = (event: KeyboardEvent)=>{
                event.preventDefault()
                this.aboutSlide ++
                if(this.aboutSlide-1 === this.about.length){
                    this.aboutSlide = 0
                    window.removeEventListener('keydown', aboutKeyboardListener)
                }

            }
            window.addEventListener('keydown', aboutKeyboardListener)
            return true
        }

        const loadCMD = /^load ([a-z1-9]*)$/
        const load = command.match(loadCMD)
        if (load?.length === 2) {
            const game = load[1]
            if (roms.includes(game)) {
                this.loadRom(game)
            } else {
                const message = `\nrom ${game} not found\n`
                message.split('').forEach((char) => this.newChar(char))
            }
            return true
        }

        return false
    }

    excapeHandeler(escape: string) {
        //Remove the E
        escape = escape.substring(1);

        //Handel the firm cases
        switch (escape) {
            case '[H':
                this.cursor = { x: 0, y: 0 };
                return
            case '[0m':
                this.colour = { fg: Screen.bright_white, bg: Screen.black };
                return
            case '[2J':
                this.clear();
                return
            case '[?25l':
                this.showCursor = false;
                return
            case '[?25h':
                this.showCursor = true;
                return;
        }

        //Cursor Pos
        const cursorPosRegx = /\[([0-9]+)\;([0-9]+)f/;
        const cursorPos = escape.match(cursorPosRegx);
        if (cursorPos) {
            const x = parseInt(cursorPos[2]) == 0 ? 0 : parseInt(cursorPos[2]) - 1;
            const y = parseInt(cursorPos[1]) == 0 ? 0 : parseInt(cursorPos[1]) - 1;
            this.cursor = { y: y, x: x }
            return;
        }
        //Colour
        const colourRegx = /\[([0-9]+)m/;
        const colour = escape.match(colourRegx);
        if (colour) {
            this.setColour(parseInt(colour[1]), this);
            return;
        }
        const colourRegxMuti = /\[([0-9]+)\;([0-9]+)m/;
        const colourRegxMatch = escape.match(colourRegxMuti);
        if (colourRegxMatch) {
            this.setColour(parseInt(colourRegxMatch[1]), this);
            this.setColour(parseInt(colourRegxMatch[2]), this);
            return;
        }
    }

    parseColour(colourCode: number) {
        return Screen.colourMap[colourCode];
    }

    setColour(colourCode: number, screnOBJ: Screen) {
        if ((colourCode >= 30 && colourCode <= 37) || (colourCode >= 90 && colourCode <= 97)) {
            ;
            screnOBJ.colour.fg = screnOBJ.parseColour(colourCode);
        } else {
            screnOBJ.colour.bg = screnOBJ.parseColour(colourCode - 10);
        }
    }

    newChar(char: string) {
        if (this.displayWelcome) {
            this.displayWelcome = false
            return
        }

        if (!this.commandBuffer) {
            this.commandBuffer = ""
        }

        if (this.escapeSequenceBuilder != "") {
            this.escapeSequenceBuilder += char;
            if (char == 'f' || char == 'm' || char == 'H' || char == 'J' || char == 'l' || char == 'h') {
                this.excapeHandeler(this.escapeSequenceBuilder);
                this.escapeSequenceBuilder = "";
            }
        } else {
            switch (char) {
                case '\r':
                    break;
                case '\n':
                    //Newline
                    this.cursor.y++;
                    this.cursor.x = 0;
                    this.commandParsed = false
                    break;
                case '\b':
                    //backspace
                    this.cursor.x--;
                    this.screenBuffer[this.cursor.y][this.cursor.x] = undefined;
                    this.commandBuffer = this.commandBuffer.replace(/.$/, "");
                    break;
                case String.fromCharCode(27):
                    //escape
                    this.escapeSequenceBuilder += "E";
                    this.commandBuffer = ""
                    break;
                default:
                    if (!this.commandParsed) {
                        this.commandBuffer += char
                        this.screenBuffer[this.cursor.y][this.cursor.x] = { txt: char, colour: { ...this.colour } };
                        this.cursor.x++;
                    }
                    break;
            }
            if (this.cursor.x == this.width) {
                this.cursor.x = 0
                this.cursor.y++;
            }
            if (this.cursor.y == this.height) {
                this.cursor.y--;
                this.screenBuffer.shift();
                this.screenBuffer.push(new Array(this.width))
            }

            if (char === '\n') {
                const command = this.commandBuffer
                this.commandBuffer = ""
                this.commandParsed = this.parseCommand(command)
            }
        }
    }

    draw() {
        this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvas.fillStyle = Screen.black;
        this.canvas.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        this.canvas.font = "16px Windows Command Prompt, monospace";

        const screenColour = { r: 0, g: 0, b: 0 }

        const offset = 1;
        if (this.displayWelcome) {
            this.canvas.drawImage(this.welcome, offset, offset)
            screenColorHex.set(0x00aa00)
            return
        }


        if (this.aboutSlide) {
            const slide = this.about[this.aboutSlide-1]
            this.canvas.drawImage(slide.image, offset, offset)
            screenColorHex.set(slide.lightColor)
            return
        }

        const now = new Date();
        //First draw the background, we have to spit this out so we don't get overdraw
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const char = this.screenBuffer[row][col] || Screen.defaultChar;
                this.canvas.fillStyle = char.colour.bg
                this.canvas.fillRect(((col + 1) * CHAR_WIDTH - CHAR_WIDTH) + offset, (row * CHAR_HEIGHT) + offset, CHAR_WIDTH, CHAR_HEIGHT);
            }
        }
        //Now the foreground and cursor
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const char = this.screenBuffer[row][col] || Screen.defaultChar;
                this.canvas.fillStyle = char.colour.fg
                if (this.cursor.y == row && this.cursor.x == col && this.showCursor && Math.round(now.getTime() / 1000) % 2) {
                    this.canvas.fillRect(((col + 1) * CHAR_WIDTH - CHAR_WIDTH) + offset, (row * CHAR_HEIGHT) + offset, CHAR_WIDTH, CHAR_HEIGHT);
                }
                if (char.txt) {
                    const rgb = hexToRgb(char.colour.fg)
                    screenColour.r += rgb.r
                    screenColour.b += rgb.b
                    screenColour.g += rgb.g

                    this.canvas.fillStyle = char.colour.fg
                    this.canvas.fillText(char.txt, (col * CHAR_WIDTH) + offset + 1, (((row + 1) * CHAR_HEIGHT) - 3) + offset);
                }
            }
        }

        const screenSize = this.height * this.width
        screenColorHex.set(rgbToHex(screenColour.r / screenSize, screenColour.g / screenSize, screenColour.b / screenSize))
    }
}

function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
    const c = (v: number) => {
        const hex = Math.floor(v).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    return parseInt(c(r) + c(g) + c(b), 16);
}