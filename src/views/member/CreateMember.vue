<template>
    <h2>Add Member</h2>
    <Message severity="info" v-if="store.groups.length > 1">You are adding this member to <strong>{{ store.currentGroup?.name }}</strong></Message>

    <Form @submit="createMember" button-title="Create" :disabled="!canSubmit">
        <div class="p-float-label mb-3" :class="{ 'p-input-icon-right': loading }">
            <i class="pi pi-spin pi-spinner" v-if="loading"></i>
            <InputText type="email" class="w-full" id="email" required v-model="user.email" @keydown="checkEmail"></InputText>
            <label for="email">Email</label>
        </div>

        <div v-if="matchedUsers.length > 0">
            <Message severity="info">We found <strong>{{ matchedUsers.length }}</strong> users matching that email address! Please select the correct user from those below</Message>
            <Message severity="error">This user has disabled adding new users to their email address. If no matching user can be found then please ask them to add their details</Message>
            <div class="scroll-x">
                <Card v-for="user in matchedUsers" class="hover center">
                    <template #content>
                        <p>{{ user.firstName }} {{ user.lastName }}</p>
                        <p>{{ user.dob.toLocaleDateString(window.navigator.language) }}</p>
                        <p><a href="#" class="stretched-link" @click.prevent="selectUser(user)">Choose</a></p>
                    </template>
                </Card>
                <Card class="hover center" v-if="canCreate">
                    <template #content>
                        <p>None of these</p>
                        <p><a href="#" class="stretched-link" @click.prevent="addNewUser">Add New User</a></p>
                    </template>
                </Card>
            </div>
        </div>

        <Card v-if="newMember != null">
            <template #title>Member Details</template>
            <template #content>
                <Message severity="info" v-if="newMember && matchedUsers.length == 0" :closable="false">No user found with email {{ user.email }}. Please tell us a bit about them</Message>
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
                    <CreateEmergencyContact v-model="user.contact"></CreateEmergencyContact>
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
import type { IEmergencyContact, IUser } from '../../../../bandmaster-common/type/Users';

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
import CreateEmergencyContact from "@/components/popup/CreateEmergencyContact.vue";

const store = useSessionStore();
const router = useRouter();

interface IUserDetails {
    id?: string | null,
    fname: string,
    lname: string,
    email: string,
    dob: Date | null,
    contact: IEmergencyContact | null
}

const user: Ref<IUserDetails> = ref({
    id: null,
    fname: "",
    lname: "",
    email: "",
    dob: null,
    contact: {
        firstName: "",
        lastName: "",
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
const matchedUsers: Ref<IUser[]> = ref([]);
const newMember: Ref<boolean | null> = ref(null);
const loading = ref(false);
const alreadyExists = ref(false);
const canCreate = ref(false);

function selectUser(selectedUser: IUser) {
    const match = store.currentGroup?.sections.some(x => x.members.some(m => m.id === selectedUser.id));
    if(match){
        Swal.fire({
            title: "Already Exists",
            text: `${selectedUser.firstName} ${selectedUser.lastName} is already a member of ${store.currentGroup?.name}`,
            icon: "error"
        });
        return;
    }

    newMember.value = false;
    user.value = {
        id: selectedUser.id,
        email: selectedUser.email,
        fname: selectedUser.firstName,
        lname: selectedUser.lastName,
        dob: new Date(selectedUser.dob),
        contact: null
    }

    canSubmit.value = true;
}

function addNewUser(){
    newMember.value = true;
    canSubmit.value = true;
}

const checkEmail = debounce((e: Event) => {
    canSubmit.value = false;
    newMember.value = null;

    const target: HTMLInputElement = e.target as HTMLInputElement;
    if (!target.checkValidity()) {
        matchedUsers.value = [];
        target.classList.add("p-invalid");
        return;
    }

    target.classList.remove("p-invalid");
    loading.value = true;
    alreadyExists.value = false;

    UserService.findByEmail(user.value.email).then(res => {
        console.log(res);
        matchedUsers.value = res.users;
        canCreate.value = res.preferences.allowCreate;
    }).catch((e) => {
        console.error(e);
        matchedUsers.value = [];
        newMember.value = true;
        canSubmit.value = true;
    }).finally(() => {
        loading.value = false;
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

    if (age.value >= 18) {
        user.value.contact = null;
    }

    const { fname: firstName, lname: lastName, email, dob, contact, id } = user.value;
    let res;
    try {
        res = await GroupService.addMemberToGroup(store.currentGroup.id, section.value.id, {
            firstName,
            lastName,
            email,
            dob,
            contact
        }, id); 
    } catch (ex: any) {
        await Swal.fire({
            title: "Failed to Add Member",
            text: ex.message,
            icon: "error"
        });
        return;
    }

    await Swal.fire({
        title: "Created Member",
        text: `Member ${firstName} ${lastName} has been successfully added to group ${store.currentGroup?.name}`,
        icon: "success"
    });

    router.push({ name: 'viewMember', params: {
        id: res.id
    } });
}

const age = computed(() => {
    if (!user.value.dob) {
        return 100;
    }

    return getAge(user.value.dob);
});
</script>