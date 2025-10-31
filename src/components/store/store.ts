import { writable } from 'svelte/store';

export const screenColorHex = writable(0x000000);
export const inUserMode = writable(false);
export const romLoaded = writable(false);