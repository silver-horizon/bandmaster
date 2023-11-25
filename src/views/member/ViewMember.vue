<template>
    <h2 v-if="!user">Loading...</h2>

    <div v-if="user">
        <h2>{{ user.firstName }} {{ user.lastName }}</h2>

        <Message severity="info" v-if="!canEdit">This user has disabled editing by groups, so their profile is <strong>read-only</strong></Message>

        <div class="mb-3">
            <Button icon="pi pi-cog" outlined v-if="isUser" @click="showEditPreferences = true"></Button>
            <Dialog v-model:visible="showEditPreferences" modal header="Edit Settings">
                <Form :unstyled="true" @submit="savePreferences" v-if="preferences" :loading="savingPreferences">
                    <EditSettings v-model="preferences"></EditSettings>
                </Form>
            </Dialog>
        </div>

        <div class="row row-cols-1 row-cols-lg-2">
            <div class="mb-3">
                <Card class="h-full">
                    <template #content>
                        <MemberDetails v-model="user" :can-edit="canEdit"></MemberDetails>
                    </template>
                </Card>
            </div>

            <div class="mb-3">
                <Card class="h-full" :class="{ 'center': !user.contact }">
                    <template #content>
                        <EmergencyContact v-model="user.contact" :can-edit="canEdit" @createContact="addContact" :loading="savingContact"></EmergencyContact>
                    </template>
                </Card>
            </div>

            <div class="mb-3">
                <Card class="h-full">
                    <template #content>
                        <MedicalDetails v-model="user.medical" :can-edit="canEdit"></MedicalDetails>
                    </template>
                </Card>
            </div>

            <div class="mb-3">
                <Card class="h-full">
                    <template #content>
                        <Consent v-model="(user as IGroupUser).consent" :group-name="group.name" :can-edit="canEdit" v-if="group"></Consent>
                        <MyGroups :groups="userGroups" :user-id="user?.id" v-else></MyGroups>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { IUser, IPreferences, IEmergencyContact } from '../../../../bandmaster-common/type/Users';
import type { IGroupUser, IGroupSummary, IGroup } from '../../../../bandmaster-common/type/Groups';
import type { IUpdateUserDto, IUpdateGroupUserDto } from "../../../../bandmaster-common/type/Dto";
import type { ILooseObject } from '../../../../bandmaster-common/type/Util';

import { ref, provide } from 'vue';
import GroupService from '@/service/GroupService';
import UserService from '@/service/UserService';
import { useSessionStore } from '@/stores/SessionStore';
import { setTitle } from "@/utils";
import { setForegroundLoader } from '@/loader';

import MemberDetails from "../../components/ViewMember/MemberDetails.vue";
import EmergencyContact from "../../components/ViewMember/EmergencyContact.vue";
import MedicalDetails from "../../components/ViewMember/MedicalDetails.vue";
import Consent from '@/components/ViewMember/Consent.vue';
import MyGroups from "@/components/ViewMember/MyGroups.vue";
import EditSettings from "@/components/popup/EditSettings.vue";

import Form from '@/components/Form.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';

setForegroundLoader(true);

const props = defineProps<{
    id: string,
    groupId?: string
}>();

provide("callback", async (params: ILooseObject) => {
    if (!canEdit.value) {
        throw new Error("Editing is disabled");
    }

    if (groupUser) {
        return await GroupService.updateUserInGroup(user.value!.id, props.groupId, params as IUpdateGroupUserDto);
    }

    return await UserService.updateUser(user.value!.id, params as IUpdateUserDto);
});

const store = useSessionStore();

const user: Ref<IUser | IGroupUser | null> = ref(null);
const preferences: Ref<IPreferences | null> = ref(null);
const isUser = ref(false);
const canEdit = ref(false);
const groupUser = (props.groupId != null);
const group: Ref<IGroup | undefined> = ref(store.groups.find(x => x.id == props.groupId));
const userGroups: Ref<IGroupSummary[]> = ref([]);
const savingPreferences = ref(false);
const savingContact = ref(false);

const showEditPreferences = ref(false);

const toLoad = [];
if (groupUser) {
    toLoad.push(GroupService.getUserInGroupById(props.groupId, props.id), []);

    let prevGroup = store.currentGroup?.id;
    store.$subscribe(async () => {
        if (store.currentGroup?.id != prevGroup && store.currentGroup?.id != null) {
            user.value = await GroupService.getUserInGroupById(store.currentGroup.id, props.id);
            group.value = store.currentGroup;
            prevGroup = store.currentGroup.id;
        }
    });
} else {
    toLoad.push(UserService.getById(props.id), UserService.getGroups(props.id));
}

toLoad.push(UserService.getPreferences(props.id));

Promise.all(toLoad).then(([m, groups, pref]) => {
    if (groupUser) {
        user.value = m as IGroupUser;
    } else {
        user.value = m as IUser;
    }
    preferences.value = pref as IPreferences;

    isUser.value = user.value.id === store.currentUser.id;
    canEdit.value = isUser.value || preferences.value.allowEdit;

    userGroups.value = groups as IGroupSummary[];

    setTitle(`${user.value.firstName} ${user.value.lastName}'s Profile`);
    setForegroundLoader(false);
});

async function savePreferences() {
    savingPreferences.value = true;
    await UserService.setPreferences(user.value!.id, preferences.value!);
    showEditPreferences.value = false;
    savingPreferences.value = false;
}

async function addContact(newContact: IEmergencyContact) {
    savingContact.value = true;
    const result = await UserService.setContact(props.id, { ...newContact });
    user.value!.contact = result.contact;
    savingContact.value = false;
}
</script>