<template>
    <h2>Members</h2>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        <div v-for="member in members" class="hover mb-3">
            <Card class="h-full text-center">
                <template #content>
                    <p>{{ member.firstName }} {{ member.lastName }}</p>
                    <p class="font-italic"><small>{{ member.sectionName }}</small></p>
                    <Button>
                        <RouterLink :to="{name: 'viewMember', params: {id: member.id}}" class="stretched-link">View</RouterLink>
                    </Button>
                </template>
            </Card>
        </div>

        <div class="hover mb-3">
            <Card class="h-full">
                <template #content>
                    <Button size="large">
                        <RouterLink class="stretched-link" :to="{ name: 'createMember'}">+ Add</RouterLink>
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

import Card from 'primevue/card';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';

const members = computed(() => store.currentGroup?.sections.flatMap(s => s.members.map(m => ({
    ...m,
    sectionName: s.name
}))));

const store = useSessionStore();
const prevGroup = store.currentGroup?.id;
store.$subscribe(() => {
    if(store.currentGroup?.id != prevGroup){
        updateMembers();
    }
});

function updateMembers() {
    if (!store.currentGroup) {
        return;
    }

    GroupService.getGroup(store.currentGroup.id).then(g => store.currentGroup = g);
}

if (store.currentGroup) {
    updateMembers();
}
</script>