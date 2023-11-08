<template>
    <h2>Add Member</h2>
    <Fieldset legend="Note" v-if="store.groups.length > 1">
        <p>You are adding this member to the <strong>{{ store.currentGroup?.name }}</strong> group</p>
    </Fieldset>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/SessionStore';

import Fieldset from 'primevue/fieldset';

const store = useSessionStore();
</script>