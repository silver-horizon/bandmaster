<template>
    <h2>Members</h2>

    <div class="mb-3">
        <RouterLink :to="{ name: 'createMember' }">
            <Button outlined>+ Add</Button>
        </RouterLink>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        <div v-for="member in members" class="hover mb-3">
            <Card class="h-full text-center">
                <template #content>
                    <p>{{ member.firstName }} {{ member.lastName }}</p>
                    <p class="font-italic"><small>{{ member.sectionName }}</small></p>
                    <Button>
                        <RouterLink :to="{ name: 'viewMember', params: { id: member.id } }" class="stretched-link">View</RouterLink>
                    </Button>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GroupService from '@/service/GroupService';
import { useSessionStore } from '@/stores/SessionStore';

import { setTitle } from '@/utils';

import Card from 'primevue/card';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';

const members = computed(() => store.currentGroup?.sections.flatMap(s => s.members.map(m => ({
    ...m,
    sectionName: s.name
}))));

const store = useSessionStore();
let prevGroup: string | undefined = undefined;
store.$subscribe(() => {
    setTitle(`${store.currentGroup!.name}'s Members`);
    if (store.currentGroup?.id != prevGroup) {
        updateMembers();
        prevGroup = store.currentGroup?.id;
    }
}, { immediate: true });

function updateMembers() {
    if (!store.currentGroup) {
        return;
    }

    GroupService.getGroup(store.currentGroup.id).then(g => store.currentGroup = g);
}
</script>