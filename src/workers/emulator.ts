import { HAL, type ROM } from '../emu/component/HAL';
import root from '../roms/root.cim';
import { browser } from '$app/environment';

export enum TXType {
    INIT,
    ROM_LOADED,
    OUTPUT_CHAR
}



export enum RXType {
    INIT,
    RESET,
    LOAD_ROM,
    SEND_CHAR
}

export type RXMessage = {
    action: RXType,
    data?: string | ROM
}

export type TXMessage = {
    action: TXType,
    data?: string
}



if(browser){
let emuConfig = {
    updateInterval: 1, // ms tick interval
    numCyclesPerTick: 7372 * 3.5, // clock cycles per interval we have to multiply this by 3.5 to match speed for some reason
    roms: [{ name: '8k ROM 0', start: 0x0000, uri: root }],
    sendOutput: (char) => { self.postMessage({ action: TXType.OUTPUT_CHAR, data: char }) }
};

const theComputer = new HAL(emuConfig);


self.onmessage = async (e: MessageEvent<RXMessage>) => {
    switch (e.data.action) {
        case RXType.INIT:
            await theComputer.setupMemory();
            theComputer.cpu.reset();
            theComputer.go();
            self.postMessage({ action: TXType.INIT });
            break;
        case RXType.RESET:
            theComputer.cpu.reset();
            break;
        case RXType.SEND_CHAR:
            theComputer.addToKeyboardBuffer(e.data.data);
            break;
        case RXType.LOAD_ROM:
            await theComputer.memory.addROM( e.data.data.start, e.data.data.uri)
            self.postMessage({ action: TXType.ROM_LOADED });
    }
};
}