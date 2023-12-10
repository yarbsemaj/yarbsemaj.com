<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { Screen } from '../emu/component/Screen';
	import { HAL, type ROM } from '../emu/component/HAL';

	import root from '../roms/root.cim';

	import puc from '../roms/puc.cim';
	import minesweper from '../roms/minesweeper.cim';
	import snake from '../roms/snake.cim';
	import image from '../roms/image.cim';
	import banner from '../roms/banner.cim';
	import connect4 from '../roms/connect4.cim';
	import life from '../roms/life.cim';
	import { romLoaded } from './store/store';

	let theComputer: HAL;
	let screen: Screen;
	export let canvas: HTMLCanvasElement;
	let keyboardActive = false;
	let loop: NodeJS.Timer;

	let roms = [
		{ name: 'PUC', start: 0x9000, uri: puc },
		{ name: 'Minesweeper', start: 0x9000, uri: minesweper },
		{ name: 'Snake', start: 0x9000, uri: snake },
		{ name: 'Image', start: 0x9000, uri: image },
		{ name: 'Banner', start: 0x9000, uri: banner },
		{ name: 'Connect4', start: 0x9000, uri: connect4 },
		{ name: 'Life', start: 0x9000, uri: life }
	];

	export const emulator = {
		reset() {
			theComputer.cpu.reset();
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
					theComputer.addToKeyboardBuffer(char);
					await timer(Math.floor(Math.random() * 300));
				}

				await timer(100);

				screen.showWelcome();
				keyboardActive = true;
			}, 600);
		},
		loadRom(rom: ROM) {
			theComputer.memory.addROM( rom.start, rom.uri).then(()=>{
				theComputer.cpu.reset();
				//Give time for the CPU to reset
				setTimeout(() => {
					theComputer.addToKeyboardBuffer('E9000\n');
					keyboardActive = true;
				}, 50);
			});
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
		theComputer.addToKeyboardBuffer(character);
		if (character.charCodeAt(0) == 10) {
			theComputer.addToKeyboardBuffer('\r');
		}
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
			theComputer.cpu.reset();
		}
	}


	onDestroy(() => {
		clearInterval(loop);
	});

	onMount(async () => {
		screen = new Screen(70, 33, canvas, emulator.loadRomByName);
		let emuConfig = {
			updateInterval: 1, // ms tick interval
			numCyclesPerTick: 7372 * 3.5, // clock cycles per interval we have to multiply this by 3.5 to match speed for some reason
			roms: [{ name: '8k ROM 0', start: 0x0000, uri: root }],
			sendOutput: (text: string) => screen.newChar(text)
		};

		screen.clear();
		loop = setInterval(() => screen.draw(), 67);
		theComputer = new HAL(emuConfig);
		await theComputer.setupMemory();
		screen.clear();
		theComputer.cpu.reset();
		theComputer.go();
		romLoaded.set(true)
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
