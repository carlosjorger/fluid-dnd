<script lang="ts">
	import useDragAndDrop from "../../../../src/svelte/useDragAndDrop";
    import NestedTask from './NestedTask.svelte';
    type NesteTask = {
        name: string;
        tasks: NesteTask[];
    }

    const tasks = [
        {
            name: 'Task 1',
            tasks: [
                {
                    name: 'Task 1.1',
                },
                {
                    name: 'Task 1.2',
                },
                {
                    name: 'Task 1.3',
                },

            ]
        },
        {
            name: 'Task 2',
        },
        {
            name: 'Task 3',
        },
        {
            name: 'Task 4',
        },
        {
            name: 'Task 5',
        }
    ] as NesteTask[];
    let tasksState = $state(tasks);
    const [dragAnDrop] = useDragAndDrop(tasksState,{
        droppableGroup: 'nested-group'
   });
</script>
<div class="w-64">
    <h3>Tasks</h3>
    <NestedTask tasks={tasks}/>
</div>