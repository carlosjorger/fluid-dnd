<script lang="ts">
    import useDragAndDrop from "../../../../src/svelte/useDragAndDrop";
    import InnerDroppable from "./innerDroppable.svelte";

    const droppables = $state(['A', 'B']);
    const [ dragAndDrop, insertAt ] = useDragAndDrop<string>(droppables as any, {
        direction: "horizontal",
    });
    const nestedList={
        'A':[],
        'B':[11, 12, 13]
    } as 
    {
        [key: string]: number[]
    };
    function addDroppable(){
        const lasValue = [...Object.keys(nestedList)].pop()
        const ansiCode = lasValue?.charCodeAt(0)??0
        const newValueCode = ansiCode+1
        const newValue = String.fromCharCode(newValueCode)
        nestedList[newValue]=[]
        insertAt(droppables.length, newValue)
    }
</script>

<div use:dragAndDrop class="flex p-2.5">
    {#each droppables as value, index (value)}
        <div
            data-index={index}
            class="droppable-child p-1.5 text-start border-solid border-2 w-48 transition-opacity duration-500"
        >
            { value }
            <InnerDroppable elements={nestedList[value]} droppableGroup="nested-group" />
        </div>
    {/each}
</div>
<button onclick={addDroppable}>Add droppable</button>

<style>
    :global(.droppable-child.from-inserting){
        opacity: 0;
    }
</style>