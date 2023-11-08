<template>
    <h2>Add a New Group</h2>

    <Form button-title="Create" @submit="create">
        <span class="p-float-label">
            <InputText id="group-name" class="w-full" v-model="name" required></InputText>
            <label for="group-name">Group Name</label>
        </span>

        <span class="p-float-label mb-3">
            <Textarea class="w-full" id="sections" auto-resize v-model="rawSections" required></Textarea>
            <label for="sections">Sections (one per row)</label>
        </span>
    </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Form from '@/components/Form.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Swal from 'sweetalert2';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useMockStore } from '../stores/MockDataStore';
const mockStore = useMockStore();

import { useSessionStore } from '@/stores/SessionStore';
const store = useSessionStore();

const name = ref("");
const rawSections = ref("");

async function create() {
    const sections = rawSections.value.split("\n");

    const newGroup = {
        id: name.value,
        name: name.value,
        sections: sections.map(v => ({
            name: v,
            members: []
        }))
    };

    mockStore.groups.push(newGroup);
    store.currentGroup = newGroup;

    await Swal.fire({
        title: 'Group Added Successfully',
        text: `${name.value} has been successfully created!`,
        icon: 'success'
    });

    router.push({ name: 'memberList' });
}
</script>