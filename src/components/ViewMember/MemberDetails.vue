<template>
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

    <div v-if="group">
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

<script setup lang="ts">
import type { IUser } from '../../../../bandmaster-common/type/Users';
import type { IGroupUser } from '../../../../bandmaster-common/type/Groups';

import {useSessionStore} from "../../stores/SessionStore";

import ImmediateUpdate from "../ImmediateUpdate.vue"
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import InputSwitch from 'primevue/inputswitch';

import { computed } from "vue";

const props = defineProps<{
    modelValue: IUser | IGroupUser,
    canEdit?: boolean,
    groupId?: string
}>();

const emit = defineEmits(['update:modelValue']);
const user = computed({
    get() {
        return props.modelValue
    },

    set(v) {
        emit("update:modelValue", v);
    }
});

const store = useSessionStore();
const group = store.groups.find(x => x.id == props.groupId);
</script>