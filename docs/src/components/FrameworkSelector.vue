<script  setup lang="ts">
    import { FRAMEWORKS_TYPES, type FRAMEWORKS_TYPE } from '@/types';
    import { ref, watch, type Component } from 'vue';
    import svelteLogo from './icons/logos/svelte.vue';
    import vueLogo from './icons/logos/vue.vue';
    import reactLogo from './icons/logos/react.vue';
    import IconSelector from './IconSelector.vue';
    import { getFrameworkFromUrl } from '@/utils/frameworkConfig';


    const props = defineProps({
        url: {
            type: String,
            required: true,
        }
    })
    const frameworkOptions = ref<{value: FRAMEWORKS_TYPE,label: string; icon: Component}[]>([
        {
            value: FRAMEWORKS_TYPES.vue,
            label: 'Vue',
            icon: vueLogo
        },
        {
            value: FRAMEWORKS_TYPES.react,
            label: 'React',
            icon: reactLogo
        },
        {
            value: FRAMEWORKS_TYPES.svelte,
            label: 'Svelte',
            icon: svelteLogo
        }
    ])

    const initialFramework = getFrameworkFromUrl(props.url)
    const currentFramework = ref<FRAMEWORKS_TYPE>(initialFramework)
    watch(
        currentFramework,
        (newValue, oldValue)=>{
            const newUrl = location.pathname.replace(oldValue, newValue)
            location.replace(newUrl);
        }
    )
</script>

<template>
    <IconSelector 
      v-model="currentFramework" 
      :options="frameworkOptions" 
    />
</template>