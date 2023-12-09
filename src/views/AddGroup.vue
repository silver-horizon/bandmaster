<style>
.lined {
    position: relative;
}

.lined:before,
.lined:after {
    position: absolute;
    top: 51%;
    overflow: hidden;
    width: 40%;
    height: 1px;
    content: ' ';
    background-color: #000;
    opacity: 0.3;
}

.lined:before {
    margin-left: -42%;
    text-align: right;
}

.lined:after {
    margin-left: 2%;
}
</style>

<template>
    <h2>Add a New Group</h2>

    <Form button-title="Create" @submit="create" :loading="saving">
        <span class="p-float-label">
            <InputText id="group-name" class="w-full" v-model="name" required></InputText>
            <label for="group-name">Group Name</label>
        </span>

        <span class="p-float-label mb-3">
            <Textarea class="w-full" id="sections" auto-resize v-model="rawSections" required></Textarea>
            <label for="sections">Sections (one per row)</label>
        </span>

        <h3 class="text-left mt-6 mb-0">Subs</h3>
        <p class="mt-0"><small>If you enter both values, you will be able to select how you wish for members to pay. Otherwise, members will only be able to pay with the method you have entered</small></p>

        <div class="row">
            <div class="col-12 col-lg-5 mb-3">
                <InputGroup>
                    <InputGroupAddon>£</InputGroupAddon>
                    <InputNumber placeholder="Monthly Subs" class="w-full" id="monthlySubs" auto-resize v-model="monthlySubs" :min-fraction-digits="2" :max-fraction-digits="2" :min="0.01"></InputNumber>
                </InputGroup>
            </div>

            <div class="col-12 col-lg-2 mb-3">
                <p class="large text-center lined">OR</p>
            </div>

            <div class="col-12 col-lg-5 mb-3">
                <InputGroup>
                    <InputGroupAddon>£</InputGroupAddon>
                    <InputNumber placeholder="Per Rehearsal Subs" class="w-full" id="perRehearsalSubs" auto-resize v-model="perRehearsalSubs" :min-fraction-digits="2" :max-fraction-digits="2" :min="0.01"></InputNumber>
                </InputGroup>
            </div>
        </div>

    </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';

import Form from '@/components/Form.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';


import { useRouter } from 'vue-router';
const router = useRouter();

import { useSessionStore } from '@/stores/SessionStore';
import GroupService from '@/service/GroupService';
const store = useSessionStore();

const name = ref("");
const rawSections = ref("");
const monthlySubs = ref(null);
const perRehearsalSubs = ref(null);
const saving = ref(false);

async function create() {
    saving.value = true;
    let group;
    try {
        group = await GroupService.createGroup({
            name: name.value,
            sections: rawSections.value,
            subs: {
                monthly: monthlySubs.value,
                perRehearsal: perRehearsalSubs.value
            }
        }).finally(() => saving.value = false);
    } catch (ex: any) {
        Swal.fire({
            title: "Group creation failed!",
            icon: "error",
            text: ex.message
        });

        return;
    }

    store.groups.push(group);
    store.currentGroup = group;

    await Swal.fire({
        title: 'Group Added Successfully',
        text: `${name.value} has been successfully created!`,
        icon: 'success'
    });

    router.push({ name: 'memberList' });
}
</script>