<script lang="ts">
	import * as THREE from "three";
	import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
	import { CrtShader } from "../../threed/crtShader";
	import { browser } from "$app/environment";
	import Emulator from "../Emulator.svelte";
	import { onDestroy, onMount } from "svelte";
	import Loader from "../loader/Loader.svelte";
	import { screenColorHex, romLoaded, inUserMode } from "../store/store";
	import { darkModeConfig, lightModeConfig } from "./config";
	import { animateValue } from "$lib/utils";

	let screenColor: number;
	let darkMode = true;
	let inUserModeTime: number;
	let animateSpotlight = false;
	let animateAmbientLight = false;

	screenColorHex.subscribe((value) => {
		screenColor = value;
	});

	inUserMode.subscribe((value) => {
		darkMode = !value;
		if (value) {
			setTimeout(() => {
				inUserModeTime = Date.now();
				animateSpotlight = true;
				animateAmbientLight = true;
			}, 500);
		}
	});

	let emuCanvas: HTMLCanvasElement;
	let canvas: HTMLCanvasElement;
	let y: number;
	let canvasPosition = "fixed";
	let top = 0;
	let opacity = 1;
	let blur = 0;
	let emulator: any;

	let animationFrame: number;

	let modelLoaded = false;

	let romLoading = false;

	romLoaded.subscribe((value) => {
		romLoading = value;
	});

	if (browser) {
		emuCanvas = document.createElement("canvas");
	}

	export const inputKey = (key: string) => {
		if (emulator) {
			emulator.inputChar(key);
		}
	};

	const onScroll = () => {
		canvasPosition = "fixed";
		top = 0;
		if (y > canvas.clientHeight) {
			const scaleFactor = window.innerWidth > 768 ? 1.2 : 2;
			opacity =
				1 -
				((y - canvas.clientHeight) * scaleFactor) / canvas.clientHeight;
			blur =
				((y - canvas.clientHeight) * scaleFactor * 8) /
				canvas.clientHeight;
			if (opacity < 0.3) opacity = 0.3;
			if (blur > 5) blur = 5;
		} else {
			blur = 0;
			opacity = 1;
		}
	};

	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(animationFrame);
		}
	});

	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;

	const onResize = () => {
		camera.aspect = window.innerWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, canvas.clientHeight);
	};

	onMount(() => {
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

		//Load EMUc Screen into texture
		const texture = new THREE.CanvasTexture(emuCanvas);
		texture.flipY = false;
		const geo = new THREE.BoxGeometry(0.0038, 0.0065, 0.008);
		const material = new THREE.ShaderMaterial({
			vertexShader: CrtShader.vertexShader,
			fragmentShader: CrtShader.fragmentShader,
			uniforms: {
				tDiffuse: { value: texture },
				iResolution: {
					type: "vec2",
					value: new THREE.Vector2(6000, 3000),
				},
				shadowMask: { value: window.innerWidth > 1200 ? 3 : 0 },
			},
		});

		material.onBeforeCompile(CrtShader, renderer);

		//Setup basic scene
		const scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
			0.2,
			window.innerWidth / canvas.clientHeight,
			0.1,
			100,
		);

		const light = new THREE.AmbientLight(
			0x303030,
			darkModeConfig.ambientLightIntensity,
		); // soft white light
		scene.add(light);

		//Spotlight
		const spotLight = new THREE.SpotLight(
			0xffffff,
			darkModeConfig.spotlightIntensity,
		);
		spotLight.position.set(0, 1, 0);
		spotLight.angle = 0.05;
		spotLight.penumbra = 0;
		spotLight.decay = 2;
		spotLight.distance = 0;

		scene.add(spotLight);

		//Spotlight
		const screenSpot = new THREE.SpotLight(0xffffff, 1);
		screenSpot.position.set(-0.012, 0.0025, 0);
		screenSpot.angle = 0.5;
		screenSpot.penumbra = 1;
		screenSpot.decay = 2;
		screenSpot.distance = 0.023;
		screenSpot.map = texture;

		const screenGlow = new THREE.PointLight(screenColor, 0.004, 0.007);
		screenGlow.position.set(0.0025, 0.0025, 0);

		// Load the Model
		const dloader = new DRACOLoader();

		dloader.setDecoderPath(
			"https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
		);

		dloader.preload();
		const loader = new GLTFLoader();
		loader.setDRACOLoader(dloader);

		loader.load("/retro_computer_compressed.glb", (gltf) => {
			//Assign the emu screen material
			gltf.scene.children[2].material = material;
			const model = gltf.scene;
			model.add(screenSpot);
			model.add(screenGlow);
			scene.add(model);
			screenSpot.target.position.set(0.0025, 0.0025, 0);
			model.add(screenSpot.target);
			animate(model);
			modelLoaded = true;
			onScroll();
		});
		renderer.setSize(window.innerWidth, canvas.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		camera.position.y = 0.00235;

		function animate(gltf) {
			animationFrame = requestAnimationFrame(() => animate(gltf));
			if (typeof texture.needsUpdate !== undefined) {
				//@ts-ignore
				texture.needsUpdate = true;
			}

			screenGlow.color.set(screenColor);
			screenSpot.color.set(screenColor);

			const boundedScrollY =
				y > canvas.clientHeight ? canvas.clientHeight : y;
			let baseZ: number, zscale: number, baseY: number;

			if (animateSpotlight) {
				const animationValue = animateValue(
					inUserModeTime,
					darkModeConfig.spotlightIntensity,
					lightModeConfig.spotlightIntensity,
					2000, //Animate over 2 seconds
				);
				spotLight.intensity = animationValue.value;
				if (!animationValue.isAnimating) {
					animateSpotlight = false;
				}
			}
			if (animateAmbientLight) {
				const animationValue = animateValue(
					inUserModeTime,
					darkModeConfig.ambientLightIntensity,
					lightModeConfig.ambientLightIntensity,
					2000, //Animate over 2 seconds
				);
				light.intensity = animationValue.value;
				if (!animationValue.isAnimating) {
					animateAmbientLight = false;
				}
			}

			if (window.innerWidth > 1200) {
				baseZ = 2;
				zscale = 4;
				baseY = 0.00235;
			} else if (window.innerWidth > 768) {
				baseZ = 4;
				zscale = 5.5;
				baseY = 0;
			} else {
				baseZ = 6;
				zscale = 6;
				baseY = 0;
			}

			const scrollPos = boundedScrollY / canvas.clientHeight;

			camera.position.z = baseZ + scrollPos * zscale;
			camera.position.y = baseY - scrollPos / 500;

			gltf.rotation.y = 4.7 - scrollPos;

			renderer.render(scene, camera);
		}
	});
	$: if (modelLoaded && romLoading) {
		emulator.init();
		document.getElementById("emuScreen")?.appendChild(emuCanvas);
	}
</script>

{#if !modelLoaded || !romLoading}
	<div
		class="fixed z-20 top-0 left-0 bottom-0 right-0 bg-black flex justify-center items-center"
	>
		<Loader />
	</div>
{/if}

<Emulator bind:emulator canvas={emuCanvas} />
<svelte:window on:resize={onResize} bind:scrollY={y} on:scroll={onScroll} />
<div
	style="position: {canvasPosition}; top:{top}px; opacity:{opacity}; filter:blur({blur}px)"
>
	<canvas class="h-lvh!" bind:this={canvas}></canvas>
</div>
<div class="md:h-[170vh] h-[130vh]"></div>
