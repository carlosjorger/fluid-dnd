<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
const numbers = ref([
  1,
  2,
  3,
]);
const sampleCategories = ref([
    { id: 1, name: 'Sales & Marketing', description: 'Forms for lead generation and customer outreach' },
    { id: 2, name: 'Feedback & Surveys', description: 'Collect customer opinions and feedback' },
    { id: 3, name: 'Human Resources', description: 'Employee-related forms and processes' },
]);

const [parentRef] = useDragAndDrop(sampleCategories, {
    delayBeforeTouchMoveEvent: 25
});
const { id } = defineProps<{
  id: string;
}>();
const [ parent ] = useDragAndDrop<number>(numbers as any);
</script>
<template>
  <Dialog :id="id">
    <DialogTrigger as-child>
      <Button variant="outline">
        Share
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md border-8 border-red-900">
        <div>
            <ul ref="parent" class="vertical-list">
                <li
                    v-for="(element, index) in numbers"
                    :index="index"
                    :key="element"
                    >
                        {{ element }}
                </li>
            </ul>
        </div>
    </DialogContent>
  </Dialog>
  <div class="fixed  bottom-0  left-0 parent-container">
    <div
      ref="parentRef"
      class="px-5"
    >
        <div
          v-for="(category, index) in sampleCategories"
          :key="category.id"
          :index="index"
          :value="category.id.toString()"
          class="relative mb-2 flex flex-row bg-primary space-x-1 border-1 rounded-xl shadow-xs border-secondary pl-3 px-1 py-1 min-w-0 items-center"
        >
            <p class="text-secondary text-sm font-medium truncate ml-1.5"> {{ category.name }} </p>
        </div>
    </div>
  </div>
</template>
<style scoped>
.vertical-list {
  display: block;
  padding-inline: 20px;
  padding-block: 15px;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
.parent-container {
    will-change: transform;
}
</style>
