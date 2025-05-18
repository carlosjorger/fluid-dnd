<template>
    <div class="flex flex-col gap-8 delay-menu">
        <h2>Delay before touchmove event</h2>
        <div class="w-full max-w-xs">
            <input type="range" min="150" max="750" value="150" class="range w-full" step="150" @change="changeDelay" />
            <div class="flex justify-between px-2.5 mt-2 text-xs">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
            </div>
            <div class="flex justify-between  mt-2 text-xs">
                <span>150</span>
                <span>300</span>
                <span>450</span>
                <span>600</span>
                <span>750</span>
            </div>
        </div>
    </div>
</template>

<script  setup lang="ts">
    const model = defineModel({ type: Number })
    const emit = defineEmits<{
        (e: 'update:modelValue', value: Number | number): void
    }>();
    const changeDelay = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = parseFloat(target.value); // Convert string to number
        emit('update:modelValue', value);
    }
</script>
<style scoped>
.delay-menu {
    margin-top: 3rem !important;    
}
</style>