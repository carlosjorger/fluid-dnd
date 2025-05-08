<script lang="ts">
    import type { DragEndEventData } from "../../../../src/core";
	import useDragAndDrop from "../../../../src/svelte/useDragAndDrop";

    type Props = {
        droppableGroup: string,
        elements: number[],
        onDragEnd?: (data: DragEndEventData<number>) => void,
        onDragStart?: (data: DragEndEventData<number>) => void
    }
    const { droppableGroup, elements ,onDragEnd = () => {}, onDragStart = () => {} }:Props = $props();
    const list = $state(elements)
    const [ parent ] = useDragAndDrop(list,
        {
            droppableGroup,
            onDragEnd,
            onDragStart
        }
    );

</script>
<ul use:parent class="block px-2.5 min-h-48 border-4 border-solid transition-[border-color] duration-500">
    {#each list as value, index (value)}
        <li
            data-index={index}
            class="pl-1 text-start border-solid border-4 m-1"
        >
            <div>{ value }</div>
        </li>
    {/each}
</ul>