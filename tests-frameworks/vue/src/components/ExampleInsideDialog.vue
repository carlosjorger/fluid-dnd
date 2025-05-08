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
</style>
