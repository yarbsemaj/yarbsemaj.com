<script type="ts">
	import { onMount } from "svelte";
	import { hideAlert } from "../../stores/alerts";
	import Fa from "svelte-fa";
	import { faCheckCircle, faExclamationCircle, faInfoCircle, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

	export let index: string;
	export let text: string;
	export let type: string;
	let icon: IconDefinition;
	let title: string
	let colour: string;
	onMount(async () => {
		setTimeout(() => hideAlert(index), 4000);
	});

	switch(type){
		case 'success':
			icon = faCheckCircle;
			title = 'Success!';
			colour = 'lime';
		break;
		case 'danger':
			icon = faExclamationCircle;
			title = 'Oops, Something has gone wrong';
			colour = 'rose';
		break;
		default:
			icon = faInfoCircle;
			title = 'Information';
			colour = 'teal';
	}
</script>

<div class="bg-{colour}-100 border-t-4 border-{colour}-500 rounded-b text-{colour}-900 px-4 py-3 shadow-md mt-1" role="alert">
	<div class="flex">
	  <div class="py-1 fill-current h-6 w-6 text-{colour}-500 mr-4"><Fa icon={icon} /></div>
	  <div>
		<p class="font-bold">{title}</p>
		<p class="text-sm">{text}</p>
	  </div>
	</div>
  </div>
