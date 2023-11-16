<template>
    <div class="p-float-label" :class="{ 'p-input-icon-right': saving || updated, 'invalid': error, 'success': updated }">
        <i class="pi pi-spin pi-spinner" v-if="saving"></i>
        <i class="pi pi-check text-green-300" v-if="updated && !saving"></i>
        <component :is="component" class="w-full" id="dr" v-model="inputValue" @keydown="save"></component>
        <small class="p-error">{{ error }}</small>
        <label for="dr">{{ label }}</label>
    </div>
</template>

<script setup lang="ts">
import type {ILooseObject} from "../../../bandmaster-common/type/Util";

import { debounce } from '@/utils';
import { computed, ref, inject } from 'vue';

import InputText from 'primevue/inputtext';

const props = defineProps<{
    modelValue: string | undefined,
    label: string,
    component?: any,
    fieldName: string,
    timeout?: number
}>();
const emit = defineEmits(['update:modelValue']);
const callback = inject<(v: ILooseObject) => Promise<boolean>>('callback')!;

const saving = ref(false);
const updated = ref(false);
const error = ref(null);
const component = props.component ?? InputText;

let originalValue = props.modelValue;

const inputValue = computed({
    get(){
        return props.modelValue
    },

    set(v){
        emit("update:modelValue", v);
    }
});

const save = debounce(() => {
    if(originalValue == inputValue.value){
        return;
    }

    error.value = null;
    originalValue = inputValue.value;
    saving.value = true;

    const payload: ILooseObject = {};
    payload[props.fieldName] = inputValue.value;

    callback(payload).then(() => {
        updated.value = true;
        setTimeout(() => updated.value = false, props.timeout ?? 5000);
    }).catch(x => {
        error.value = x.message;
    }).finally(() => {
        saving.value = false;
    })

}, 1000);
</script>