<template>
    <h3>Member Details</h3>
    <div class="row row-cols-1 row-cols-lg-2">
        <div>
            <ImmediateUpdate label="First Name" field-name="firstName" v-model="user.firstName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
        </div>

        <div>
            <ImmediateUpdate label="Last Name" field-name="lastName" v-model="user.lastName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
        </div>
    </div>

    <ImmediateUpdate label="Phone Number" field-name="phone" v-model="user.phone" :props="{ disabled: !canEdit }"></ImmediateUpdate>
    
    <div class="p-float-label mb-3">
        <InputText type="email" class="w-full" id="email" v-model="user.email" :disabled="true"></InputText>
        <label for="email">Email</label>
    </div>

    <div class="p-float-label mb-3">
        <Calendar class="w-full" input-id="dob" v-model="user.dob" :max-date="new Date()" :disabled="true"></Calendar>
        <label for="dob">Date of Birth</label>
    </div>
</template>

<script setup lang="ts">
import type { IUser } from '../../../../bandmaster-common/type/Users';
import type { IGroupUser } from '../../../../bandmaster-common/type/Groups';

import ImmediateUpdate from "../ImmediateUpdate.vue"
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';

import { computed } from "vue";

const props = defineProps<{
    modelValue: IUser | IGroupUser,
    canEdit?: boolean
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
</script>