<script lang="ts">
	import type { Coordinate } from "fluid-dnd";
    import { useDragAndDrop } from "fluid-dnd/svelte";
    type Props = {
        lockAxis: boolean;
        gridTranslate: boolean;
    }
    const { lockAxis, gridTranslate }:Props = $props();
    const mappers = [
        (coordinate: Coordinate) => {
            return coordinate;
        }
    ];
    if (lockAxis) {
        mappers.push((coordinate: Coordinate) => {
            return {
                x: 0,
                y: coordinate.y
            };
        });
    }
    if (gridTranslate) {
        mappers.push(({ x, y }: Coordinate) => {
            const gridSize = 25.78;
            return {
                x: Math.ceil(x / gridSize) * gridSize,
                y: Math.ceil(y / gridSize) * gridSize
            };
        });
    }
    const list = $state([...Array(20).keys()]);
    const [ parent ] = useDragAndDrop(list,{
	    draggingClass: "dragging",
        coordinateTransform: mappers
    });
</script>
<ul use:parent class="block px-2 overflow-y-auto number-list pl-7 w-4/5">
    {#each list as element, index }
        <li class="solid mt-1 border-2 py-2 px-3" data-index = {index}>
            { element }
        </li>
    {/each }
</ul>
<style>
    .number-list {
	    height: 257px;
    }
    :global(.temp-child){
      margin-top: 0 !important;
    }
    :global(.dragging) {
        transition:
            background-color color 150ms ease-in,
            color 150ms ease-in;
        background-color: var(--sl-color-gray-1);
        color: black;
    }
</style>