<template>
    <div class="row">
        <div class="col-12 col-lg-6">
            <div class="p-float-label">
                <InputText class="w-full" id="cfirst-name" required v-model="modelValue.firstName" @change="update"></InputText>
                <label for="cfirst-name">First Name</label>
            </div>
        </div>

        <div class="col-12 col-lg-6">
            <div class="p-float-label">
                <InputText class="w-full" id="clast-name" required v-model="modelValue.lastName" @change="update"></InputText>
                <label for="clast-name">Last Name</label>
            </div>
        </div>
    </div>

    <div class="p-float-label mb-3">
        <InputText type="email" class="w-full" id="cemail" v-model="modelValue.email" required @change="update"></InputText>
        <label for="cemail">Email</label>
    </div>

    <div class="p-float-label mb-3">
        <InputText class="w-full" id="phone" v-model="modelValue.phone" maxlength="15" required @change="update"></InputText>
        <label for="phone">Phone</label>
    </div>
</template>

<script setup lang="ts">
import type { IEmergencyContact } from "../../../../bandmaster-common/type/Users";

import InputText from "primevue/inputtext";

const { modelValue } = defineProps<{
    modelValue: IEmergencyContact
}>();
const emit = defineEmits(['update:modelValue']);

function update(){
    emit('update:modelValue', modelValue);
}
</script>