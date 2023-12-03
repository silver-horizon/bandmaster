<template>
    <h2>Sections</h2>

    <div class="mb-3">
        <Button outlined @click="openCreateSection">+ Add</Button>
        <Dialog v-model:visible="showAddSection" modal header="Add New Section">
            <Form button-title="Create" unstyled :loading="isAddingSection" @submit="createSection">
                <span class="p-float-label">
                    <InputText id="section-name" class="w-full" required v-model="newSection.name" :disabled="isAddingSection"></InputText>
                    <label for="section-name">Section Name</label>
                </span>
            </Form>
        </Dialog>
    </div>

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
        <ImmediateUpdate v-model="selectedSection.name" field-name="name" :props="{ class: 'my-3' }"></ImmediateUpdate>

        <Button severity="danger" @click="deleteSection" :disabled="notSelectedSections?.length == 0">Delete Section</Button>
        <small class="block" v-if="notSelectedSections?.length == 0">This is your only section so you may not delete it!</small>

        <div class="border-1 border-round surface-border mt-3 p-3" v-if="isDeleting">
            <p>Are you sure you wish to delete this section? This action <strong>cannot be undone</strong>.</p>
            <div class="my-3">
                <label>Please select the section to move all of the existing members to:</label>
                <Dropdown class="w-full" :options="notSelectedSections" option-label="name" option-value="id" v-model="sectionTransfer"></Dropdown>
            </div>
            <Button severity="danger" @click="selectReplacementSection">Confirm Deletion</Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import type { ILooseObject } from '../../../bandmaster-common/type/Util';
import type { ISection } from '../../../bandmaster-common/type/Groups';
import type { IUpdateSectionDto } from '../../../bandmaster-common/type/Dto';
import type { Ref } from 'vue';

import GroupService from '@/service/GroupService';
import { useSessionStore } from '@/stores/SessionStore';
import { ref, computed, provide } from 'vue';

import { RouterLink } from 'vue-router';
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import ImmediateUpdate from '@/components/ImmediateUpdate.vue';
import Form from '@/components/Form.vue';

import draggable from 'vuedraggable';
import { setTitle } from '@/utils';
import Swal from 'sweetalert2';

provide("callback", async (params: ILooseObject) => {
    if (!selectedSection.value) {
        throw new Error("Section must be selected in order for updates to take place");
    }

    return await GroupService.updateSection(store.currentGroup!.id, selectedSection.value.id, params as IUpdateSectionDto);
});

type AddedEvent = { added: { newIndex: number, element: any } };

async function changeSection(e: AddedEvent, sectionId: string) {
    if (!e.added || !store.currentGroup) {
        return;
    }

    await GroupService.moveMemberToSection(store.currentGroup.id, e.added.element.id, { id: sectionId });
}

const showEditSection = ref(false);
const selectedSection: Ref<ISection | null> = ref(null);
const sectionTransfer = ref(null);
const isDeleting = ref(false);
const showAddSection = ref(false);
const isAddingSection = ref(false);
const newSection = ref({
    name: ""
});

const store = useSessionStore();
let prevGroup: string | undefined = undefined;
store.$subscribe(async () => {
    if (store.currentGroup?.id != prevGroup) {
        await updateMembers();
        prevGroup = store.currentGroup?.id;

        setTitle(`Sections of ${store.currentGroup!.name}`);
    }
}, { immediate: true });

async function updateMembers() {
    if (!store.currentGroup) {
        return;
    }

    await GroupService.getGroup(store.currentGroup.id).then(g => store.currentGroup = g);
}

function editSection(section: ISection) {
    selectedSection.value = section;
    sectionTransfer.value = null;
    isDeleting.value = false;
    showEditSection.value = true;
}

async function deleteSection() {
    const numOptions = notSelectedSections.value!.length;
    if (numOptions == 0) {
        await Swal.fire({
            title: "Cannot Delete Section",
            text: "This is your only section so you may not delete it",
            icon: "error"
        });
    } else if (selectedSection.value!.members.length == 0) {
        await deleteAndMove();
    } else if (numOptions == 1) {
        await deleteAndMove(notSelectedSections.value![0].id);
    } else {
        isDeleting.value = true;
    }
}

async function deleteAndMove(newSection: string | null = null) {
    const replacement = await GroupService.removeSection(store.currentGroup!.id, selectedSection.value!.id, newSection);
    await updateMembers();

    let text = `${selectedSection.value!.name} has been successfully deleted`;
    if (replacement?.name) {
        text += `, and the existing members have been transferred to ${replacement.name}`;
    }

    await Swal.fire({
        title: 'Section Successfully Removed',
        icon: 'success',
        text
    });
    showEditSection.value = false;
}

async function selectReplacementSection() {
    if (!sectionTransfer.value) {
        await Swal.fire({
            title: "Missing Replacement Section",
            text: "You must choose a section to transfer members from the current section to, otherwise they will be orphaned and lost forever",
            icon: 'error'
        });
        return;
    }

    deleteAndMove(sectionTransfer.value);
}

async function createSection(){
    isAddingSection.value = true;
    await GroupService.createSection(store.currentGroup!.id, newSection.value);
    await updateMembers();
    isAddingSection.value = false;
    showAddSection.value = false;
}

function openCreateSection(){
    newSection.value.name = "";
    showAddSection.value = true;
}

const notSelectedSections = computed(() => store.currentGroup?.sections.filter(s => s.id != selectedSection.value?.id));
</script>