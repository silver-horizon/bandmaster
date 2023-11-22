<template>
    <h3>Medical Details</h3>
    <div class="flex flex-column">
        <ImmediateUpdate v-model="medical.doctor" label="Doctor's Name" field-name="doctorName" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
        <ImmediateUpdate v-model="medical.doctorAddress" label="Doctor's Address" field-name="doctorAddress" :component="Textarea" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
        <ImmediateUpdate v-model="medical.allergies" label="Allergies" field-name="allergies" :component="Textarea" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
        <ImmediateUpdate v-model="medical.medicalDetails" label="Other Medical Details" field-name="medicalDetails" :component="Textarea" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
    </div>
</template>

<script setup lang="ts">
import type { IMedicalDetails } from "../../../../bandmaster-common/type/Users";

import {computed} from "vue";

import ImmediateUpdate from "../ImmediateUpdate.vue";
import Textarea from "primevue/textarea";

const props = defineProps<{
    modelValue: IMedicalDetails,
    canEdit?: boolean
}>();

const emit = defineEmits(['update:modelValue']);
const medical = computed({
    get(){
        return props.modelValue
    },

    set(v){
        emit("update:modelValue", v);
    }
});
</script>