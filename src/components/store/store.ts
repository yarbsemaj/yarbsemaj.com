import { writable } from 'svelte/store';

export const screenColorHex = writable(0x000000);
export const romLoaded = writable(false);