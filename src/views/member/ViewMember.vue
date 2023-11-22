<template>
    <h2 v-if="!user">Loading...</h2>

    <div v-if="user">
        <h2>{{ user.firstName }} {{ user.lastName }}</h2>

        <Message severity="info" v-if="!canEdit">This user has disabled editing by groups, so their profile is <strong>read-only</strong></Message>

        <div class="mb-3">
            <Button icon="pi pi-cog" outlined v-if="isUser" @click="showEditPreferences = true"></Button>
            <Dialog v-model:visible="showEditPreferences" modal header="Edit Settings">
                <Form :unstyled="true" @submit="savePreferences" v-if="preferences">
                    <EditSettings v-model="preferences"></EditSettings>
                </Form>
            </Dialog>
        </div>

        <div class="row row-cols-1 row-cols-lg-2">
            <div class="mb-3">
                <Card class="h-full">
                    <template #content>
                        <h3 class="text-center">Member Details</h3>
                        <div class="row row-cols-1 row-cols-lg-2">
                            <div>
                                <ImmediateUpdate label="First Name" field-name="firstName" v-model="user.firstName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                            </div>

                            <div>
                                <ImmediateUpdate label="Last Name" field-name="lastName" v-model="user.lastName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                            </div>
                        </div>

                        <div class="p-float-label mb-3">
                            <InputText type="email" class="w-full" id="email" v-model="user.email" :disabled="true"></InputText>
                            <label for="email">Email</label>
                        </div>

                        <div class="p-float-label mb-3">
                            <Calendar class="w-full" input-id="dob" v-model="user.dob" :max-date="new Date()" :disabled="true"></Calendar>
                            <label for="dob">Date of Birth</label>
                        </div>

                        <div v-if="groupUser && group">
                            <hr />
                            <p>I give consent for <strong>{{ group.name }}</strong> to take photos and videos:</p>
                            <div class="mb-3 ml-3">
                                <label for="physicalMedia" class="block">For use in physical media (e.g. programmes, press/news articles, merchandise)</label>
                                <ImmediateUpdate field-name="physicalMediaConsent" v-model="(user as IGroupUser).consent.physicalMedia" :component="InputSwitch" :no-stretch="true" id="physicalMedia"></ImmediateUpdate>
                            </div>
                            <div class="ml-3">
                                <label for="digitalMedia" class="block">For use in digital media (e.g. social media, websites, online advertising)</label>
                                <ImmediateUpdate field-name="digitalMediaConsent" v-model="(user as IGroupUser).consent.digitalMedia" :component="InputSwitch" :no-stretch="true" id="digitalMedia"></ImmediateUpdate>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <div class="mb-3">
                <Card class="h-full" :class="{ 'center': !user.contact }">
                    <template #content>
                        <h3 class="text-center">Emergency Contact Details</h3>
                        <div v-if="user.contact">
                            <div class="row row-cols-1 row-cols-lg-2">
                                <div>
                                    <ImmediateUpdate label="First Name" field-name="contactFirstName" v-model="user.contact.firstName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                                </div>

                                <div>
                                    <ImmediateUpdate label="Last Name" field-name="contactLastName" v-model="user.contact.lastName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                                </div>
                            </div>

                            <ImmediateUpdate label="Email" field-name="contactEmail" v-model="user.contact.email" :props="{ disabled: !canEdit, type: 'email' }"></ImmediateUpdate>
                            <ImmediateUpdate label="Phone" field-name="contactPhone" v-model="user.contact.phone" :props="{ disabled: !canEdit, maxLength: 15 }"></ImmediateUpdate>
                        </div>

                        <div v-else class="text-center">
                            <p>None recorded.</p>
                            <Button v-if="canEdit" @click="showCreateContact = true">+ Add</Button>

                            <Dialog v-model:visible="showCreateContact" modal header="Add Emergency Contact">
                                <Form :unstyled="true" @submit="addContact">
                                    <CreateEmergencyContact v-model="newContact"></CreateEmergencyContact>
                                </Form>
                            </Dialog>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <Card class="h-full">
            <template #content>
                <h3 class="text-center">Medical Details</h3>
                <div class="flex flex-column">
                    <ImmediateUpdate v-model="user.medical.doctor" label="Doctor's Name" field-name="doctorName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                    <ImmediateUpdate v-model="user.medical.doctorAddress" label="Doctor's Address" field-name="doctorAddress" :component="Textarea" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                    <ImmediateUpdate v-model="user.medical.allergies" label="Allergies" field-name="allergies" :component="Textarea" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                    <ImmediateUpdate v-model="user.medical.medicalDetails" label="Other Medical Details" field-name="medicalDetails" :component="Textarea" :props="{ disabled: !canEdit }"></ImmediateUpdate>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { IUser, IEmergencyContact, IPreferences } from '../../../../bandmaster-common/type/Users';
import type { IGroupUser } from '../../../../bandmaster-common/type/Groups';
import type { IUpdateUserDto } from "../../../../bandmaster-common/type/Dto";
import type { ILooseObject } from '../../../../bandmaster-common/type/Util';

import { ref, provide } from 'vue';
import GroupService from '@/service/GroupService';
import UserService from '@/service/UserService';
import { useSessionStore } from '@/stores/SessionStore';
import { getAge } from "@/utils"

import Form from '@/components/Form.vue';
import ImmediateUpdate from '@/components/ImmediateUpdate.vue';
import CreateEmergencyContact from '@/components/popup/CreateEmergencyContact.vue';
import EditSettings from "@/components/popup/EditSettings.vue";
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import InputSwitch from 'primevue/inputswitch';

const props = defineProps<{
    id: string,
    groupId?: string
}>();

provide("callback", async (params: ILooseObject) => {
    if (!canEdit.value) {
        throw new Error("Editing is disabled");
    }

    if(groupUser){
        return await GroupService.updateUserInGroup(user.value!.id, props.groupId, params as IUpdateUserDto);
    }

    return await UserService.updateUser(user.value!.id, params as IUpdateUserDto);
});

const store = useSessionStore();

const user: Ref<IUser | IGroupUser | null> = ref(null);
const preferences: Ref<IPreferences | null> = ref(null);
const isUser = ref(false);
const age = ref(100);
const canEdit = ref(false);
const groupUser = (props.groupId != null);
const group = store.groups.find(x => x.id == props.groupId);

const showCreateContact = ref(false);
const newContact: Ref<IEmergencyContact> = ref({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
});

const showEditPreferences = ref(false);

const toLoad = [];
if (groupUser) {
    toLoad.push(GroupService.getUserInGroupById(props.groupId, props.id));
} else {
    toLoad.push(UserService.getById(props.id));
}

toLoad.push(UserService.getPreferences(props.id))

Promise.all(toLoad).then(([m, pref]) => {
    if (groupUser) {
        user.value = m as IGroupUser;
    } else {
        user.value = m as IUser;
    }
    preferences.value = pref as IPreferences;

    age.value = getAge(user.value.dob);
    isUser.value = user.value.id === store.currentUser.id;
    canEdit.value = isUser.value || preferences.value.allowEdit;
});

async function addContact() {
    const result = await UserService.setContact(user.value!.id, { ...newContact.value });
    user.value!.contact = result.contact;
    showCreateContact.value = false;
}

async function savePreferences() {
    await UserService.setPreferences(user.value!.id, preferences.value!);
    showEditPreferences.value = false;
}
</script>