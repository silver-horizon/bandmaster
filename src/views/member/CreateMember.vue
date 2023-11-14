<template>
    <h2>Add Member</h2>
    <Message severity="info" v-if="store.groups.length > 1">You are adding this member to <strong>{{ store.currentGroup?.name }}</strong></Message>
    <Message severity="error" :closable="false" v-if="alreadyExists">This member already exists within {{ store.currentGroup?.name }}!</Message>

    <Form @submit="createMember" button-title="Create" :disabled="!canSubmit">
        <div class="p-float-label mb-3" :class="{ 'p-input-icon-right': loading }">
            <i class="pi pi-spin pi-spinner" v-if="loading"></i>
            <InputText type="email" class="w-full" id="email" required v-model="user.email" @keydown="checkEmail"></InputText>
            <label for="email">Email</label>
        </div>

        <Card v-if="newMember != null">
            <template #title>Member Details</template>
            <template #content>
                <Message severity="info" v-if="newMember" :closable="false">No user found with email {{ user.email }}. Please tell us a bit about them</Message>
                <div class="row">
                    <div class="col-12 col-lg-6">
                        <div class="p-float-label">
                            <InputText class="w-full" id="first-name" required v-model="user.fname" :disabled="!newMember"></InputText>
                            <label for="first-name">First Name</label>
                        </div>
                    </div>

                    <div class="col-12 col-lg-6">
                        <div class="p-float-label">
                            <InputText class="w-full" id="last-name" required v-model="user.lname" :disabled="!newMember"></InputText>
                            <label for="last-name">Last Name</label>
                        </div>
                    </div>
                </div>

                <div class="p-float-label">
                    <Calendar class="w-full" id="dob" required v-model="user.dob" :disabled="!newMember" :class="{ 'p-invalid': showError.dob }" :max-date="new Date()"></Calendar>
                    <label for="dob">Date of Birth</label>
                </div>
                <small>We collect this so we can determine whether to collect emergency contact details</small>

                <div class="mt-5" v-if="user.contact && age < 18">
                    <hr />
                    <h3>Emergency Contact Details</h3>
                    <div class="row">
                        <div class="col-12 col-lg-6">
                            <div class="p-float-label">
                                <InputText class="w-full" id="fcirst-name" required v-model="user.contact.fname"></InputText>
                                <label for="cfirst-name">First Name</label>
                            </div>
                        </div>

                        <div class="col-12 col-lg-6">
                            <div class="p-float-label">
                                <InputText class="w-full" id="clast-name" required v-model="user.contact.lname"></InputText>
                                <label for="clast-name">Last Name</label>
                            </div>
                        </div>
                    </div>

                    <div class="p-float-label mb-3">
                        <InputText type="email" class="w-full" id="cemail" v-model="user.contact.email" required></InputText>
                        <label for="cemail">Email</label>
                    </div>

                    <div class="p-float-label mb-3">
                        <InputText class="w-full" id="phone" v-model="user.contact.phone" maxlength="15" required></InputText>
                        <label for="phone">Phone</label>
                    </div>
                </div>

            </template>
        </Card>

        <div class="p-float-label mb-3">
            <Dropdown class="w-full" :options="store.currentGroup?.sections" option-label="name" v-model="section" :class="{ 'p-invalid': showError.section }"></Dropdown>
            <label>Section</label>
        </div>

    </Form>
</template>

<script setup lang="ts">
import type { ISection } from '../../../../bandmaster-common/type/Groups';
import type { Ref } from 'vue';

import { useSessionStore } from '@/stores/SessionStore';
import { useRouter } from 'vue-router';

import { debounce, getAge } from '../../utils';
import UserService from "../../service/UserService";
import GroupService from "../../service/GroupService";

import { ref, computed } from 'vue';
import Swal from 'sweetalert2';

import Form from '@/components/Form.vue';
import Message from 'primevue/message';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';

const store = useSessionStore();
const router = useRouter();

interface IContactDetails {
    fname: string,
    lname: string,
    email: string,
    phone: string
}

interface IUserDetails{
    fname: string,
    lname: string,
    email: string,
    dob: Date | null,
    contact: IContactDetails | null
}

const user: Ref<IUserDetails> = ref({
    fname: "",
    lname: "",
    email: "",
    dob: null,
    contact: {
        fname: "",
        lname: "",
        email: "",
        phone: ""
    }
});

const showError = ref({
    section: false,
    dob: false
});

const section: Ref<ISection | null> = ref(null);
const canSubmit = ref(false);
const newMember: Ref<boolean | null> = ref(null);
const loading = ref(false);
const alreadyExists = ref(false);

const checkEmail = debounce((e: Event) => {
    newMember.value = null;
    const target: HTMLInputElement = e.target as HTMLInputElement;
    if (!target.checkValidity()) {
        target.classList.add("p-invalid");
        return;
    }

    target.classList.remove("p-invalid");
    loading.value = true;

    const match = store.currentGroup?.sections.flatMap(s => s.members).find(m => m.email == user.value.email);
    if (match) {
        loading.value = false;
        alreadyExists.value = true;
        return;
    }

    alreadyExists.value = false;

    UserService.findByEmail(user.value.email).then(res => {
        loading.value = false;
        if (!res.email) {
            newMember.value = true;
        } else {
            newMember.value = false;
            user.value = {
                email: res.email,
                fname: res.firstName,
                lname: res.lastName,
                dob: null,
                contact: null
            }
        }

        canSubmit.value = true;
    });
}, 700);

async function createMember() {
    if (!store.currentGroup) {
        return;
    }

    showError.value.dob = !user.value.dob;
    showError.value.section = !section.value?.id;

    if (!user.value.dob || !section.value?.id) {
        return;
    }

    showError.value.section = false;
    showError.value.dob = false;

    if(age.value >= 18){
        user.value.contact = null;
    }

    const { fname, lname, email, dob, contact } = user.value;
    const res = await GroupService.addMemberToGroup(store.currentGroup.id, email, fname, lname, dob, section.value.id, 
        contact?.fname, contact?.lname, contact?.email, contact?.phone);

    if (res.success === false) {
        await Swal.fire({
            title: "Failed to Add Member",
            text: res.errors.join(", "),
            icon: "error"
        });
        return;
    }

    await Swal.fire({
        title: "Created Member",
        text: `Member ${fname} ${lname} has been successfully added to group ${store.currentGroup?.name}`,
        icon: "success"
    });

    router.push({ name: 'memberList' });
}

const age = computed(() => {
    if(!user.value.dob){
        return 100;
    }

    return getAge(user.value.dob);
});
</script>