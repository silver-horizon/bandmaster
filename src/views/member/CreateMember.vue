<template>
    <h2>Add Member</h2>
    <Message severity="info" v-if="store.groups.length > 1">You are adding this member to <strong>{{ store.currentGroup?.name }}</strong></Message>
    <Message severity="error" :closable="false" v-if="alreadyExists">This member already exists within {{ store.currentGroup?.name }}!</Message>

    <Form @submit="createMember" button-title="Create" :disabled="!canSubmit">
        <div class="p-float-label" :class="{'p-input-icon-right': loading}">
            <i class="pi pi-spin pi-spinner" v-if="loading"></i>
            <InputText type="email" class="w-full" id="email" required v-model="email" @keydown="checkEmail"></InputText>
            <label for="email">Email</label>
        </div>

        <div class="row" v-if="newMember != null">
            <div class="col-12 col-lg-6">
                <div class="p-float-label">
                    <InputText class="w-full" id="first-name" required v-model="fname" :disabled="!newMember"></InputText>
                    <label for="first-name">First Name</label>
                </div>
            </div>

            <div class="col-12 col-lg-6">
                <div class="p-float-label">
                    <InputText class="w-full" id="last-name" required v-model="lname" :disabled="!newMember"></InputText>
                    <label for="last-name">Last Name</label>
                </div>
            </div>
        </div>

        <div class="p-float-label mb-3">
            <Dropdown class="w-full" :options="store.currentGroup?.sections" option-label="name" v-model="section" :class="{'p-invalid': needsSection}"></Dropdown>
            <label>Section</label>
        </div>

    </Form>
</template>

<script setup lang="ts">
import type { ISection } from '../../../../bandmaster-common/type/Groups';
import type { Ref } from 'vue';

import { useSessionStore } from '@/stores/SessionStore';
import { useRouter } from 'vue-router';

import {debounce} from '../../utils';
import UserService from "../../service/UserService";
import GroupService from "../../service/GroupService";

import { ref } from 'vue';
import Swal from 'sweetalert2';

import Form from '@/components/Form.vue';
import Message from 'primevue/message';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

const store = useSessionStore();
const router = useRouter();

const fname = ref("");
const lname = ref("");
const email = ref("");
const section: Ref<ISection | null> = ref(null);
const canSubmit = ref(false);
const newMember: Ref<boolean | null> = ref(null);
const loading = ref(false);
const needsSection = ref(false);
const alreadyExists = ref(false);

const checkEmail = debounce((e: Event) => {
    newMember.value = null;
    const target: HTMLInputElement = e.target as HTMLInputElement;
    if(!target.checkValidity()){
        target.classList.add("p-invalid");
        return;
    } 

    target.classList.remove("p-invalid");
    loading.value = true;

    const match = store.currentGroup?.sections.flatMap(s => s.members).find(m => m.email == email.value);
    if(match){
        loading.value = false;
        alreadyExists.value = true;
        return;
    }

    alreadyExists.value = false;

    UserService.findByEmail(email.value).then(res => {
        loading.value = false;
        if(!res.email){
            newMember.value = true;
        } else {
            newMember.value = false;
            email.value = res.email;
            fname.value = res.firstName;
            lname.value = res.lastName;
        }

        canSubmit.value = true;
    });
}, 700);

async function createMember(){
    if(!store.currentGroup){
        return;
    }

    if(!section.value){
        needsSection.value = true;
        return;
    }

    needsSection.value = false; 
    const res = await GroupService.addMemberToGroup(store.currentGroup.id, email.value, fname.value, lname.value, section.value.id);

    if(res.success === false){
        await Swal.fire({
            title: "Failed to Add Member",
            text: res.errors.join(", "),
            icon: "error"
        });
        return;
    }

    await Swal.fire({
       title: "Created Member",
       text: `Member ${fname.value} ${lname.value} has been successfully added to group ${store.currentGroup?.name}`,
       icon: "success" 
    });

    router.push({name: 'memberList'});
}
</script>