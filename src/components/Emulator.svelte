<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { Screen } from '../emu/component/Screen';
	import { type ROM } from '../emu/component/HAL';
	import EmulatorWorker from '../workers/emulator?worker'
	import puc from '../roms/puc.cim';
	import minesweper from '../roms/minesweeper.cim';
	import snake from '../roms/snake.cim';
	import image from '../roms/image.cim';
	import banner from '../roms/banner.cim';
	import connect4 from '../roms/connect4.cim';
	import life from '../roms/life.cim';
	import threed from '../roms/threed.cim';
	import { romLoaded } from './store/store';
	import { RXType, TXType, type TXMessage } from '../workers/emulator';

	let screen: Screen;
	export let canvas: HTMLCanvasElement;
	let keyboardActive = false;
	let loop: NodeJS.Timer;

	let worker : Worker

	let roms = [
		{ name: 'PUC', start: 0x9000, uri: puc },
		{ name: 'Minesweeper', start: 0x9000, uri: minesweper },
		{ name: 'Snake', start: 0x9000, uri: snake },
		{ name: 'Image', start: 0x9000, uri: image },
		{ name: 'Banner', start: 0x9000, uri: banner },
		{ name: 'Connect4', start: 0x9000, uri: connect4 },
		{ name: 'Life', start: 0x9000, uri: life },
		{ name: 'threed', start: 0x9000, uri: threed }
	];

	export const emulator = {
		reset() {
			worker.postMessage({action: RXType.RESET})
		},
		async init() {
			setTimeout(async () => {
				//Get Rom from hash
				const romName = window.location.hash?.substring(1);
				let rom = roms.find((rom) => romName.toLocaleLowerCase() == rom.name.toLocaleLowerCase());
				if (rom) {
					emulator.loadRom(rom);
					return;
				}

				const command = 'E0100#run\r';
				for (let char of command) {
					if (char === '#') {
						await timer(1000);
						continue;
					}
					addToKeyboardBuffer(char);
					await timer(Math.floor(Math.random() * 300));
				}

				await timer(100);

				screen.showWelcome();
				keyboardActive = true;
			}, 600);
		},
		loadRom(rom: ROM) {
			worker.postMessage({action: RXType.LOAD_ROM, data: rom})
		},
		loadRomByName(name: string){
			let rom = roms.find((rom) => name.toLocaleLowerCase() == rom.name.toLocaleLowerCase());
			if (rom) {
				emulator.loadRom(rom);
				return;
			}
		}
	};

	function inputCharacter(character: string) {
		if (!keyboardActive) {
			return;
		}
		addToKeyboardBuffer(character);
		if (character.charCodeAt(0) == 10) {
			addToKeyboardBuffer('\r');
		}
	}

	function addToKeyboardBuffer(char: string){
		worker.postMessage({action: RXType.SEND_CHAR, data: char})
	}
	function onkeypress(event: KeyboardEvent) {
		event.preventDefault();
		if (event.which == 9 || event.which == 13 || event.which == 16) {
			event.preventDefault();
			if (event.which == 13) {
				//EnternonScroll
				inputCharacter('\n');
			}
		} else {
			let key = String.fromCharCode(event.which);
			inputCharacter(key);
		}
	}

	function onkeyup(event: KeyboardEvent) {
		//Backspace
		if (event.which == 8) {
			inputCharacter('\b');
		}
		//Break
		if (event.code == 'KeyC' && event.ctrlKey) {
			inputCharacter(String.fromCharCode(3));
		}
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.code == 'KeyR' && event.ctrlKey) {
			event.preventDefault()

			screen.colour = { ...Screen.defaultConsoleColour };
        	screen.showCursor = true;
			screen.clear();
			emulator.reset();
		}
	}


	onDestroy(() => {
		clearInterval(loop);
		worker?.terminate()
	});

	onMount(async () => {
		worker = new EmulatorWorker;
		worker.onmessage = async (e: MessageEvent<TXMessage>) =>{
			switch(e.data.action){
				case TXType.OUTPUT_CHAR:
					screen.newChar(e.data.data)
					break;
				case TXType.INIT:
					screen.clear();
					romLoaded.set(true);
				break;	
				case TXType.ROM_LOADED:
					//Give time for the CPU to reset
					emulator.reset()
					screen.clear();
					setTimeout(() => {
						addToKeyboardBuffer('E9000\n');
						keyboardActive = true;
				}, 50);
			}
		}
		screen = new Screen(70, 33, canvas, emulator.loadRomByName);
		loop = setInterval(() => screen.draw(), 67);

		worker.postMessage({action: RXType.INIT})
	});

	const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
</script>

<svelte:window on:keyup={onkeyup} on:keypress={onkeypress} on:keydown={onkeydown} />

<style>
	@font-face {
		font-family: 'Windows Command Prompt';
		src: url('/fonts/Windows-Command-Prompt.woff2') format('woff2'),
			url('/fonts/Windows-Command-Prompt.woff') format('woff');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}
</style>
