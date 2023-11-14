<template>
    <h2 v-if="!user">Loading...</h2>

    <div v-if="user">
        <h2>{{ user.firstName }} {{ user.lastName }}</h2>

        <Form button-title="Update" :disabled="!isUser" :unstyled="true">
            <Card>
                <template #content>
                    <div class="p-float-label mb-3">
                        <InputText type="email" class="w-full" id="email" required v-model="user.email" :disabled="!isUser"></InputText>
                        <label for="email">Email</label>
                    </div>

                    <div class="row">
                        <div class="col-12 col-lg-6">
                            <div class="p-float-label">
                                <InputText class="w-full" id="first-name" required v-model="user.firstName" :disabled="!isUser"></InputText>
                                <label for="first-name">First Name</label>
                            </div>
                        </div>

                        <div class="col-12 col-lg-6">
                            <div class="p-float-label">
                                <InputText class="w-full" id="last-name" required v-model="user.lastName" :disabled="!isUser"></InputText>
                                <label for="last-name">Last Name</label>
                            </div>
                        </div>
                    </div>

                    <div class="p-float-label">
                        <Calendar class="w-full" id="dob" required v-model="user.dob" :max-date="new Date()" :disabled="true"></Calendar>
                        <label for="dob">Date of Birth</label>
                    </div>
                </template>
            </Card>

            <div class="row row-cols-1 row-cols-lg-2">
                <div class="mt-5">
                    <Card class="h-full">
                        <template #content>
                            <h3 class="text-center">Emergency Contact Details</h3>
                            <div v-if="user.contact">
                                <div class="row">
                                    <div class="col-12 col-lg-6">
                                        <div class="p-float-label">
                                            <InputText class="w-full" id="cfirst-name" required v-model="user.contact.firstName" :disabled="!isUser"></InputText>
                                            <label for="cfirst-name">First Name</label>
                                        </div>
                                    </div>

                                    <div class="col-12 col-lg-6">
                                        <div class="p-float-label">
                                            <InputText class="w-full" id="clast-name" required v-model="user.contact.lastName" :disabled="!isUser"></InputText>
                                            <label for="clast-name">Last Name</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-float-label mb-3">
                                    <InputText type="email" class="w-full" id="cemail" v-model="user.contact.email" required :disabled="!isUser"></InputText>
                                    <label for="cemail">Email</label>
                                </div>

                                <div class="p-float-label mb-3">
                                    <InputText class="w-full" id="phone" v-model="user.contact.phone" maxlength="15" required :disabled="!isUser"></InputText>
                                    <label for="phone">Phone</label>
                                </div>
                            </div>

                            <div v-else class="text-center">
                                <p>None recorded.</p>
                                <Button v-if="isUser" @click="showCreateContact = true">+ Add</Button>

                                <Dialog v-model:visible="showCreateContact" modal header="Add Emergency Contact" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                                    <Form :unstyled="true" @submit="addContact">
                                        <CreateEmergencyContact v-model="newContact"></CreateEmergencyContact>
                                    </Form>
                                </Dialog>
                            </div>
                        </template>
                    </Card>
                </div>

                <div class="mt-5">
                    <Card class="h-full">
                        <template #content>
                            <h3 class="text-center">Medical Details</h3>
                            <div class="text-center">
                                <p>None recorded.</p>
                                <Button v-if="isUser">+ Add</Button>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </Form>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { IMember } from '../../../../bandmaster-common/type/Groups';

import { useRoute } from 'vue-router';
import { ref } from 'vue';
import GroupService from '@/service/GroupService';
import UserService from '@/service/UserService';
import { useSessionStore } from '@/stores/SessionStore';
import { getAge } from "@/utils"

import Form from '@/components/Form.vue';
import CreateEmergencyContact from '@/components/popup/CreateEmergencyContact.vue';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import type { IEmergencyContact } from '../../../../bandmaster-common/type/Users';

const route = useRoute();
const store = useSessionStore();

const user: Ref<IMember | null> = ref(null);
const isUser = ref(false);
const age = ref(100);
const numCols = ref(1);
const newContact: Ref<IEmergencyContact> = ref({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
});
const showCreateContact = ref(false);

GroupService.getUserInGroupById(store.currentGroup?.id ?? '', route.params.id as string).then(m => {
    user.value = m;
    age.value = getAge(user.value.dob);
    isUser.value = m.userId === store.currentUser.id;
    numCols.value = age.value < 18 ? 2 : 1;
});

async function addContact(){
    const result = await UserService.setContact(user.value!.userId, newContact.value.firstName, newContact.value.lastName, newContact.value.email, newContact.value.phone);
    user.value!.contact = result.contact;
}
</script>