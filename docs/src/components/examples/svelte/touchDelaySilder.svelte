<script lang="ts">
    interface Props {
		changeDelay:(newDelay:number)=>void
	}
    let { changeDelay } = $props();
    function handleInput(event:Event) {
        const target = event.target as HTMLInputElement;
        changeDelay(parseFloat(target.value));
    }
</script>

<div class="flex flex-col gap-8 items-center delay-menu">
		<h3>Delay before touch move event</h3>
		<div class="w-full max-w-xs">
			<input
				type="range"
				min="150"
				max="750"
				value="150"
				class="range w-full"
				step="150"
				on:input={handleInput}
			/>
			<div class="flex justify-between px-2.5 mt-2 text-xs">
				<span>|</span>
				<span>|</span>
				<span>|</span>
				<span>|</span>
				<span>|</span>
			</div>
			<div class="flex justify-between mt-2 text-xs">
				<span>150</span>
				<span>300</span>
				<span>450</span>
				<span>600</span>
				<span>750</span>
			</div>
		</div>
	</div>
    <style>
        .delay-menu {
            margin-top: 3rem !important;
        }
    </style>