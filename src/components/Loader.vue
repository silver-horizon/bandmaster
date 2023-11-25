<style scoped>
.top-screen-loader{
    position: fixed;
    top: 0;
    height: 3px;
    left: 0;
    right: 0;
    background-color: var(--primary-100);
    z-index: 5000;
}

.top-screen-loader::after{
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: v-bind(progress);
    background-color: var(--primary-700);
    z-index: 5001;
    transition: width .1s;
}
</style>

<template>
    <div v-if="store.backgroundLoader.visible" class="top-screen-loader"></div>

    <Dialog class="text-center" :visible="store.foregroundLoader.visible" :closable="false" modal>
        <div class="lds-dual-ring"></div>
        <h3>Loading...</h3>
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSessionStore } from '@/stores/SessionStore';

import Dialog from 'primevue/dialog';

const store = useSessionStore();

const progress = computed(() => `${store.backgroundLoader.progress * 100}%`);
</script>