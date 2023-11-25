<template>
    <h3>Emergency Contact Details</h3>
    <div v-if="contact">
        <div class="row row-cols-1 row-cols-lg-2">
            <div>
                <ImmediateUpdate label="First Name" field-name="contactFirstName" v-model="contact.firstName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
            </div>

            <div>
                <ImmediateUpdate label="Last Name" field-name="contactLastName" v-model="contact.lastName" :props="{ disabled: !canEdit }"></ImmediateUpdate>
            </div>
        </div>

        <ImmediateUpdate label="Email" field-name="contactEmail" v-model="contact.email" :props="{ disabled: !canEdit, type: 'email' }"></ImmediateUpdate>
        <ImmediateUpdate label="Phone" field-name="contactPhone" v-model="contact.phone" :props="{ disabled: !canEdit, maxLength: 15 }"></ImmediateUpdate>
    </div>

    <div v-else class="text-center">
        <p>None recorded.</p>
        <Button v-if="canEdit" @click="showCreateContact = true">+ Add</Button>

        <Dialog v-model:visible="showCreateContact" modal header="Add Emergency Contact">
            <Form :unstyled="true" @submit="addContact" :loading="loading">
                <CreateEmergencyContact v-model="newContact"></CreateEmergencyContact>
            </Form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { IEmergencyContact } from "../../../../bandmaster-common/type/Users";

import { computed, ref, watch } from "vue";

import CreateEmergencyContact from '@/components/popup/CreateEmergencyContact.vue';

import ImmediateUpdate from "../ImmediateUpdate.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Form from "@/components/Form.vue";

const props = defineProps<{
    modelValue?: IEmergencyContact | null,
    canEdit?: boolean,
    loading?: boolean
}>();

const emit = defineEmits(['update:modelValue', 'createContact']);
const contact = computed({
    get() {
        return props.modelValue
    },

    set(v) {
        emit("update:modelValue", v);
    }
});

const showCreateContact = ref(false);
const newContact: Ref<IEmergencyContact> = ref({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
});

async function addContact() {
    emit("createContact", newContact.value);
}

watch(props, () => {
    if(!props.loading){
        showCreateContact.value = false;
    }
});
</script>