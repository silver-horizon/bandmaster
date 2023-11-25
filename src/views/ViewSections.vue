<template>
    <h2>Sections</h2>

    <div class="row row-cols-1 row-cols-lg-2">
        <div v-for="section in store.currentGroup?.sections" class="mb-3">
            <Panel toggleable>
                <template #header>
                    <strong><a href="#" @click.prevent="editSection(section)">{{ section.name }}</a>
                        <Badge :value="section.members.length" class="ml-2"></Badge>
                    </strong>
                </template>

                <draggable v-model="section.members" item-key="id" group="sections" @change="changeSection($event, section.id)" handle=".handle">
                    <template #item="{ element: member }">
                        <Card class="list-item">
                            <template #content>
                                <i class="pi pi-bars mr-3 handle"></i>
                                <RouterLink :to="{ name: 'viewMember', params: { id: member.id } }">{{ member.firstName }} {{ member.lastName }}</RouterLink>
                            </template>
                        </Card>
                    </template>
                </draggable>
            </Panel>
        </div>
    </div>

    <Dialog v-if="selectedSection" v-model:visible="showEditSection" modal :header='`Edit Section "${selectedSection?.name}"`'>
        <div class="p-float-label mb-3">
            <InputText class="w-full" id="name" required v-model="selectedSection.name"></InputText>
            <label for="name">Name</label>
        </div>

        <Button severity="danger">Delete Section</Button>

        <div class="border-1 border-round surface-border mt-3 p-3">
            <p>Are you sure you wish to delete this section? This action <strong>cannot be undone</strong>.</p>
            <div class="my-3">
                <label>Please select the section to move all of the existing members to:</label>
                <Dropdown class="w-full"></Dropdown>
            </div>
            <Button severity="danger">Confirm Deletion</Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import type { ISection } from '../../../bandmaster-common/type/Groups';
import type { Ref } from 'vue';

import GroupService from '@/service/GroupService';
import { useSessionStore } from '@/stores/SessionStore';
import { ref } from 'vue';

import { RouterLink } from 'vue-router';
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

import draggable from 'vuedraggable';
import { setTitle } from '@/utils';

type AddedEvent = { added: { newIndex: number, element: any } };

async function changeSection(e: AddedEvent, sectionId: string) {
    if (!e.added || !store.currentGroup) {
        return;
    }

    await GroupService.moveMemberToSection(store.currentGroup.id, e.added.element.id, { id: sectionId });
}

const showEditSection = ref(false);
const selectedSection: Ref<ISection | null> = ref(null);

const store = useSessionStore();
let prevGroup: string | undefined = undefined;
store.$subscribe(() => {
    if (store.currentGroup?.id != prevGroup) {
        updateMembers();
        prevGroup = store.currentGroup?.id;

        setTitle(`Sections of ${store.currentGroup!.name}`);
    }
}, { immediate: true });

function updateMembers() {
    if (!store.currentGroup) {
        return;
    }

    GroupService.getGroup(store.currentGroup.id).then(g => store.currentGroup = g);
}

function editSection(section: ISection) {
    selectedSection.value = section;
    showEditSection.value = true;
}
</script>