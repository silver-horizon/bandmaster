<template>
    <h2>Add Member</h2>
    <Fieldset legend="Note" v-if="store.groups.length > 1">
        <p>You are adding this member to the <strong>{{ store.currentGroup?.name }}</strong> group</p>
    </Fieldset>

    <Form @submit="createMember">
        <div class="row">
            <div class="col-12 col-lg-6">
                <div class="p-float-label">
                    <InputText class="w-full" id="first-name" required v-model="fname"></InputText>
                    <label for="first-name">First Name</label>
                </div>
            </div>

            <div class="col-12 col-lg-6">
                <div class="p-float-label">
                    <InputText class="w-full" id="last-name" required v-model="lname"></InputText>
                    <label for="last-name">Last Name</label>
                </div>
            </div>
        </div>

        <div class="p-float-label">
            <InputText type="email" class="w-full" id="email" required v-model="email"></InputText>
            <label for="email">Email</label>
        </div>
    </Form>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/SessionStore';
import { useMockStore } from '@/stores/MockDataStore';
import { useRouter } from 'vue-router';

import { ref } from 'vue';
import Swal from 'sweetalert2';

import Form from '@/components/Form.vue';
import Fieldset from 'primevue/fieldset';
import InputText from 'primevue/inputtext';

const store = useSessionStore();
const mockStore = useMockStore();
const router = useRouter();

const fname = ref("");
const lname = ref("");
const email = ref("");

async function createMember(){
    mockStore.groups.find(x => x.id == store.currentGroup.id)?.sections[0].members.push({
        name: `${fname.value} ${lname.value}`,
        sectionName: email.value
    });

    await Swal.fire({
       title: "Created Member",
       text: `Member ${fname.value} ${lname.value} has been successfully added to group ${store.currentGroup.name}`,
       icon: "success" 
    });

    router.push({name: 'memberList'});
}
</script>