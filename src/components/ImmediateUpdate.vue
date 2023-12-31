<template>
    <div :class="{ 'p-input-icon-right': saving || updated, 'invalid': error, 'success': updated && !error, 'p-float-label': label }">
        <i class="pi pi-spin pi-spinner" v-if="saving"></i>
        <i class="pi pi-check text-green-300" v-if="updated && !saving"></i>
        <component :is="component" :class="{'w-full': !noStretch}" :id="inputId" v-model="inputValue" @change="save" @keydown="save" v-bind="props.props" :required="!allowEmpty"></component>
        <label :for="inputId" v-if="label">{{ label }}</label>
    </div>
    <small class="error">{{ error }}</small>
</template>

<script setup lang="ts">
import type {ILooseObject} from "../../../bandmaster-common/type/Util";
import type { Ref } from "vue";

import { debounce } from '@/utils';
import { computed, ref, inject } from 'vue';

import InputText from 'primevue/inputtext';

interface ICheckable{
    reportValidity: () => boolean
};

const props = defineProps<{
    modelValue: string | boolean | undefined,
    label?: string,
    component?: any,
    fieldName: string,
    timeout?: number,
    props?: any,
    allowEmpty?: boolean,
    noStretch?: boolean,
    id?: string
}>();
const emit = defineEmits(['update:modelValue']);
const callback = inject<(v: ILooseObject) => Promise<boolean>>('callback')!;

const saving = ref(false);
const updated = ref(false);
const error: Ref<string | null> = ref(null);
const component = props.component ?? InputText;
const inputId = props.id ?? crypto.randomUUID();

let originalValue = props.modelValue;

const inputValue = computed({
    get(){
        return props.modelValue
    },

    set(v){
        emit("update:modelValue", v);
    }
});

function getElement(): ICheckable | null{
    const el = document.getElementById(inputId)!;

    if(el.hasOwnProperty("reportValidity")){
        return el as unknown as ICheckable;
    }

    const elements = el.querySelectorAll("input, select");
    for(const element of elements){
        if(element.hasOwnProperty("reportValidity")){
            return element as unknown as ICheckable;
        }
    }

    return null;
}

let timeout: number | null = null;
const save = debounce(() => {
    if(timeout){
        clearTimeout(timeout);
        timeout = null;
    }

    if(originalValue == inputValue.value){
        return;
    }

    updated.value = false;

    const el = getElement();
    if(el && !el.reportValidity()){
        error.value = " ";
        return;
    }

    error.value = null;
    originalValue = inputValue.value;
    saving.value = true;

    const payload: ILooseObject = {[props.fieldName]: inputValue.value};

    callback(payload).then(() => {
        updated.value = true;
        timeout = setTimeout(() => {
            updated.value = false;
            timeout = null;
        }, props.timeout ?? 5000);
    }).catch(ex => {
        error.value = ex.message;
    }).finally(() => {
        saving.value = false;
    })

}, 1000);
</script>