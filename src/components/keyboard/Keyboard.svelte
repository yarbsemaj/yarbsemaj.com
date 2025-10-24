<script lang="ts">
	import { onMount } from "svelte";
	import Keyboard from "simple-keyboard";
	import "simple-keyboard/build/css/index.css";

	let keyboardElement: HTMLDivElement;

	export let keyPress = (keypress: string) => {};

	const options = {
		theme: "hg-theme-default hg-theme-ios",
		layout: {
			default: [
				"q w e r t y u i o p {bksp}",
				"a s d f g h j k l {enter}",
				"{shift} z x c v b n m , . {shift}",
				"{alt} {space} {break}",
			],
			shift: [
				"Q W E R T Y U I O P {bksp}",
				"A S D F G H J K L {enter}",
				"{shiftactivated} Z X C V B N M , . {shiftactivated}",
				"{alt} {space} {break}",
			],
			alt: [
				"1 2 3 4 5 6 7 8 9 0 {bksp}",
				`@ # $ & * ( ) ' " {enter}`,
				"{shift} % - + = / ; : ! ? {shift}",
				"{default} {space} {break}",
			],
		},
		display: {
			"{alt}": ".?123",
			"{shift}": "⇧",
			"{break}": "⊖",
			"{shiftactivated}": "⇧",
			"{enter}": "return",
			"{bksp}": "⌫",
			"{altright}": ".?123",
			"{downkeyboard}": "🞃",
			"{space}": " ",
			"{default}": "ABC",
			"{back}": "⇦",
		},
	};

	const keyboardComands = [
		"{alt}",
		"{shift}",
		"{shiftactivated}",
		"{altright}",
		"{default}",
	];

	onMount(() => {
		const keyboard = new Keyboard(keyboardElement, {
			onKeyPress,
			...options,
		});

		function onKeyPress(button) {
			/**
			 * Handle toggles
			 */
			if (keyboardComands.includes(button)) {
				handleLayoutChange(button);
			} else {
				switch (button) {
					case "{bksp}":
						keyPress("\b");
						break;
					case "{enter}":
						console.log("SPACE");
						keyPress("\r");
						break;
					case "{space}":
						keyPress(" ");
						break;
					case "{break}":
						keyPress(String.fromCharCode(3));
						break;
					default:
						dispatchEvent(new KeyboardEvent("keydown"));
						keyPress(button);
						break;
				}
			}
		}

		function handleLayoutChange(button) {
			let currentLayout = keyboard.options.layoutName;
			let layoutName;

			switch (button) {
				case "{shift}":
				case "{shiftactivated}":
				case "{default}":
					layoutName =
						currentLayout === "default" ? "shift" : "default";
					break;

				case "{alt}":
				case "{altright}":
					layoutName = currentLayout === "alt" ? "default" : "alt";
					break;

				default:
					break;
			}

			if (layoutName) {
				keyboard.setOptions({
					layoutName: layoutName,
				});
			}
		}
	});
</script>

<div class="text-green-600">
	<div class="keyboard" bind:this={keyboardElement} />
</div>

<style global lang="css">
	/**
   * hg-theme-default theme
   */
	.hg-theme-default {
		background-color: #3c3d33 !important;
		border-radius: 5px 5px 0 0 !important;
	}
	.hg-button {
		background-color: rgb(0, 0, 0) !important;
	}

	.simple-keyboard.hg-theme-ios {
		width: 750px;
		margin: auto;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-row .hg-button {
		flex-grow: 1;
		cursor: pointer;
		max-width: initial;
	}
	.simple-keyboard.hg-theme-ios .hg-row {
		display: flex;
	}
	.simple-keyboard.hg-theme-ios .hg-row:not(:last-child) {
		margin-bottom: 5px;
	}
	.simple-keyboard.hg-theme-ios .hg-row .hg-button:not(:last-child) {
		margin-right: 5px;
	}
	.simple-keyboard.hg-theme-ios .hg-row:nth-child(2) {
		margin-left: 18px;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 5px;
		border-radius: 5px;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default.hg-layout-custom {
		background-color: black;
		padding: 5px;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button {
		border-radius: 5px;
		box-sizing: border-box;
		padding: 0;
		background: black;
		border-bottom: 1px solid #b5b5b5;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: none;
		font-weight: 400;
		font-size: 20px;
		max-width: 60px;
		min-width: 60px;
		height: 60px;
		min-height: 60px;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button:active,
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button:focus {
		background: #e4e4e4;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button.hg-functionBtn {
		background-color: #adb5bb;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button.hg-button-space,
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button.hg-button-shift,
	.simple-keyboard.hg-theme-ios.hg-theme-default
		.hg-button.hg-button-shiftactivated {
		background-color: #ffffff;
	}
	.hg-button-space {
		max-width: 448px;
		min-width: 250px;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button-enter {
		max-width: 110px;
		min-width: 110px;
	}
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button-altright,
	.simple-keyboard.hg-theme-ios.hg-theme-default .hg-button-back {
		min-width: 80px;
		max-width: 80px;
	}
</style>
