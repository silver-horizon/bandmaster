<template>
    <h2>Sections</h2>

    <div class="row row-cols-1 row-cols-lg-2">
        <div v-for="section in store.currentGroup?.sections" class="mb-3">
            <Panel toggleable>
                <template #header>
                    <strong>{{ section.name }} <Badge :value="section.members.length"></Badge></strong>
                </template>
                <Card v-for="member in section.members" class="list-item">
                    <template #content>{{ member.firstName }} {{ member.lastName }}</template>
                </Card>
            </Panel>
        </div>
    </div>
</template>

<script setup lang="ts">
import GroupService from '@/service/GroupService';
import { useSessionStore } from '@/stores/SessionStore';

import Panel from 'primevue/panel';
import Card from 'primevue/card';
import Badge from 'primevue/badge';

const store = useSessionStore();
let prevGroup = store.currentGroup?.id;
store.$subscribe(() => {
    if(store.currentGroup?.id != prevGroup){
        updateMembers();
        prevGroup = store.currentGroup?.id;
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