<template>
    <div class="mb-5">
        <label class="block mb-3" for="allowEdit">Allow my groups to change my details</label>
        <InputSwitch input-id="allowEdit" v-model="modelValue.allowEdit" @change="update"></InputSwitch>
    </div>

    <div>
        <label class="block mb-3" for="allowCreate">Allow groups to add new users to my account</label>
        <InputSwitch input-id="allowCreate" v-model="modelValue.allowCreate" @change="update"></InputSwitch>
    </div>
</template>

<script setup lang="ts">
import type { IPreferences } from "../../../../bandmaster-common/type/Users";

import InputSwitch from 'primevue/inputswitch';

const { modelValue } = defineProps<{
    modelValue: IPreferences
}>();
const emit = defineEmits(['update:modelValue']);

function update() {
    emit('update:modelValue', modelValue);
}
</script>