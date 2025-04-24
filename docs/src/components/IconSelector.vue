<template>
    <div class="relative font-sans">
      <button 
        class="selector-input flex min-w-28 px-2.5 py-1.5 pr-3 relative items-center justify-between rounded-lg cursor-pointer transition-all duration-200 ease-in-out bg-[#FFFFFF] hover:bg-[#f7fafc] hover:border-gray-900 border-[1px] border-solid border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-900 dark:hover:border-gray-200 dark:hover:bg-gray-800/50"
        @click="(()=>toggleDropdown())"
        v-clickOutside="clickOutside"
      >
        <div class="flex items-center gap-2">
          <IconComponent :option="selectedOption"/>
          <component 
            :is="arrowDown" 
            class="w-4 h-4 flex-shrink-0 right-2"
          />
        </div>
      </button>
  
      <div v-if="isOpen" class="absolute top-full left-0 right-0 z-50 mt-1 bg-[#FFFFFF] rounded-lg shadow-lg dark:bg-gray-900 dark:shadow-accent-200/50 overflow-hidden">
        <div
          v-for="option in options"
          :key="option.value"
          class="flex items-center px-4 py-2 gap-2 cursor-pointer transition-[opacity,background-color] duration-200 ease hover:bg-[#f7fafc] dark:text-gray-300 dark:hover:bg-gray-800/50"
          @click="selectOption(option)"
        >
          <IconComponent :option/>
        </div>
      </div>
    </div>
  </template>
  
<script  setup lang="ts">
  import { ref} from 'vue';
  import IconComponent from './icons/IconComponent.vue';
  import arrowDown from './icons/arrowDown.vue';
  import { vClickOutside } from '@/directives/clickOutside';
  interface SelectOption {
    value: string | number;
    label: string;
    icon?: any; // Vue component
  }
  const model = defineModel({ type: String })

  const props = defineProps({
    options: {
      type: Array as () => SelectOption[],
      required: true,
      validator: (options: SelectOption[]) => 
        options.every(opt => opt.value !== undefined && opt.label)
    }
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
  }>()

  const isOpen = ref(false);
    
  const selectedOption = ref<SelectOption>(
    props.options.find(opt => opt.value === model.value) || props.options[0]
  );
  const clickOutside = () =>  {
    isOpen.value = false;
  }
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const selectOption = (option: SelectOption) => {
    selectedOption.value = option;
    emit('update:modelValue', option.value);
    isOpen.value = false;
  };
</script>