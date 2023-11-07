<template>
    <h2>Add a New Group</h2>

    <Card>
        <template #content>
            <span class="p-float-label">
                <InputText id="group-name" class="w-full" v-model="name" required></InputText>
                <label for="group-name">Group Name</label>
            </span>

            <span class="p-float-label mb-3">
                <Textarea class="w-full" id="sections" auto-resize v-model="rawSections" required></Textarea>
                <label for="sections">Sections (one per row)</label>
            </span>

            <div class="text-center">
                <Button @click="create">Create</Button>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Swal from 'sweetalert2';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useMockStore } from '../../stores/MockDataStore';
const store = useMockStore();

const name = ref("");
const rawSections = ref("");

async function create() {
    if (name.value.trim().length < 3 || rawSections.value.trim().length < 2) {
        Swal.fire({
            title: 'Error!',
            text: 'Please enter a group name and at least one section!',
            icon: 'error',
            confirmButtonText: 'OK'
        });

        return;
    }

    const sections = rawSections.value.split("\n");
    store.groups.push({
        id: name.value,
        name: name.value,
        sections: sections.map(v => ({
            name: v
        }))
    });

    await Swal.fire({
        title: 'Group Added Successfully',
        text: `${name.value} has been successfully created!`,
        icon: 'success'
    });

    router.push({name: 'groups'});
}
</script>