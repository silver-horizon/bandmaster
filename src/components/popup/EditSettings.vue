<template>
    <label class="block" for="allowEdit">Allow my groups to change my details</label>
    <InputSwitch input-id="allowEdit" v-model="modelValue.allowEdit" @change="update"></InputSwitch>
</template>

<script setup lang="ts">
import type {IPreferences} from "../../../../bandmaster-common/type/Users";

import InputSwitch from 'primevue/inputswitch';

const { modelValue } = defineProps<{
    modelValue: IPreferences
}>();
const emit = defineEmits(['update:modelValue']);

function update(){
    emit('update:modelValue', modelValue);
}
</script>