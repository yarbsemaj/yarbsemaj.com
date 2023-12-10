<script lang="ts">
	import * as THREE from 'three';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
	4;
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import { CrtShader } from '../threed/crtShader';
	import { browser } from '$app/environment';
	import Emulator from '../components/Emulator.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Loader from './loader/Loader.svelte';
	import { screenColorHex, romLoaded } from './store/store';

	let screenColor: number;

	screenColorHex.subscribe((value) => {
		screenColor = value;
	});

	let emuCanvas: HTMLCanvasElement;
	let canvas: HTMLCanvasElement;
	let y: number;
	let canvasPosition = 'fixed';
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
		emuCanvas = document.createElement('canvas');
	}

	const onScroll = () => {
		canvasPosition = 'fixed';
		top = 0;
		if (y > canvas.clientHeight) {
			const scaleFactor = window.innerWidth > 768 ? 1.2 : 2;
			opacity = 1 - ((y - canvas.clientHeight) * scaleFactor) / canvas.clientHeight;
			blur = ((y - canvas.clientHeight) * scaleFactor * 8) / canvas.clientHeight;
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
				iResolution: { type: 'vec2', value: new THREE.Vector2(6000, 3000) },
				shadowMask: { value: window.innerWidth > 1200 ? 3 : 0 }
			}
		});

		material.onBeforeCompile(CrtShader, renderer);

		const mesh = new THREE.Mesh(geo, material);

		//Setup basic scene
		const scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(0.2, window.innerWidth / canvas.clientHeight, 0.1, 100);

		const light = new THREE.AmbientLight(0x303030); // soft white light
		scene.add(light);

		//Spotlight
		const spotLight = new THREE.SpotLight(0xffffff, 100);
		spotLight.position.set(0, 5, 0);
		spotLight.angle = Math.PI / 6;
		spotLight.penumbra = 1;
		spotLight.decay = 3;
		spotLight.distance = 0;

		scene.add(spotLight);

		//Spotlight
		const screenSpot = new THREE.SpotLight(0xffffff, 1);
		screenSpot.position.set(-0.012, 0.0025, 0);
		screenSpot.angle = 0.5;
		screenSpot.penumbra = 1;
		screenSpot.decay = 0.6;
		screenSpot.distance = 0;

		const screenGlow = new THREE.PointLight(screenColor, 0.004, 0.007);
		screenGlow.position.set(0.0025, 0.0025, 0);
		2650;
		// Load the Model
		const dloader = new DRACOLoader();

		dloader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

		dloader.preload();
		const loader = new GLTFLoader();
		loader.setDRACOLoader(dloader);

		loader.load('/retro_computer_compressed.glb', (gltf) => {
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
		renderer.shadowMap.enabled = true;

		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		camera.position.y = 0.00235;

		function animate(gltf) {
			animationFrame = requestAnimationFrame(() => animate(gltf));
			if (typeof texture.needsUpdate !== undefined) {
				//@ts-ignore
				texture.needsUpdate = true;
			}

			screenGlow.color.set(screenColor);
			screenSpot.color.set(screenColor);

			const boundedScrollY = y > canvas.clientHeight ? canvas.clientHeight : y;
			let baseZ = window.innerWidth > 1200 ? 2 : 6;
			const zscale = window.innerWidth > 1200 ? 4 : 7;

			const baseY = window.innerWidth > 1200 ? 0.00235 : 0;

			camera.position.z = baseZ + (boundedScrollY / canvas.clientHeight) * zscale;
			camera.position.y = baseY - boundedScrollY / canvas.clientHeight / 500;

			gltf.rotation.y = 4.7 - boundedScrollY / canvas.clientHeight;

			renderer.render(scene, camera);
		}
	});
	$: if (modelLoaded && romLoading) {emulator.init();}
</script>

{#if !modelLoaded || !romLoading}
	<div class="fixed z-20 top-0 left-0 bottom-0 right-0 bg-black flex justify-center items-center">
		<Loader />
	</div>
{/if}

<Emulator bind:emulator canvas={emuCanvas} />
<svelte:window on:resize={onResize} bind:scrollY={y} on:scroll={onScroll} />
<div style="position: {canvasPosition}; top:{top}px; opacity:{opacity}; filter:blur({blur}px)">
	<canvas class="!h-full-screen" bind:this={canvas} />
</div>
<div class="md:h-[170vh] h-[130vh]" />
