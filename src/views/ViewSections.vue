<template>
    <h2>Sections</h2>

    <div class="row row-cols-1 row-cols-lg-2">
        <div v-for="section in store.currentGroup?.sections" class="mb-3">
            <Panel toggleable>
                <template #header>
                    <strong>{{ section.name }} <Badge :value="section.members.length"></Badge></strong>
                </template>

                <draggable v-model="section.members" item-key="id" group="sections" @change="changeSection($event, section.id)" handle=".handle">
                    <template #item="{element: member}">
                        <Card class="list-item">
                            <template #content>
                                <i class="pi pi-bars mr-3 handle"></i>
                                <RouterLink :to="{name: 'viewMember', params: {id: member.id}}">{{ member.firstName }} {{ member.lastName }}</RouterLink>
                            </template>
                        </Card>
                    </template>
                </draggable>
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
import { RouterLink } from 'vue-router';

import draggable from 'vuedraggable';

type AddedEvent = {added: {newIndex: number, element: any}};

async function changeSection(e: AddedEvent, sectionId: string){
    if(!e.added || !store.currentGroup){
        return;
    }

    await GroupService.moveMemberToSection(store.currentGroup.id, e.added.element.id, sectionId);
}

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