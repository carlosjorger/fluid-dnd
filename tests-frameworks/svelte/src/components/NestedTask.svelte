<script lang="ts">
	import useDragAndDrop from "../../../../src/svelte/useDragAndDrop";
    import NestedTask from './NestedTask.svelte';
    type Props = {
        tasks: NesteTask[];
    }
    type NesteTask = {
        name: string;
        tasks: NesteTask[];
    }
    const { tasks }:Props = $props();

    let tasksState = $state(tasks);
    const [dragAnDrop] = useDragAndDrop(tasksState,{
        droppableGroup: 'nested-group'
   });
</script>
<ul use:dragAnDrop>
    {#each tasksState as task, index (task.name)}
        <li data-index={index} class="border-2 border-slate-200 rounded-md m-2">
            <span class="bg-slate-400" >{task.name}</span>
            <div class="p-2 bg-slate-700 min-h-16">
                <NestedTask tasks={task.tasks}/>
            </div>
        </li>
    {/each}

</ul>