<template>
    <h3>Consent</h3>
    <p>I give consent for <strong>{{ props.groupName }}</strong> to take photos and videos:</p>
    <div class="mb-3 ml-3">
        <label for="physicalMedia" class="block">For use in physical media (e.g. programmes, press/news articles, merchandise)</label>
        <ImmediateUpdate field-name="physicalMediaConsent" v-model="consent.physicalMedia" :component="InputSwitch" :no-stretch="true" id="physicalMedia"></ImmediateUpdate>
    </div>
    <div class="ml-3">
        <label for="digitalMedia" class="block">For use in digital media (e.g. social media, websites, online advertising)</label>
        <ImmediateUpdate field-name="digitalMediaConsent" v-model="consent.digitalMedia" :component="InputSwitch" :no-stretch="true" id="digitalMedia"></ImmediateUpdate>
    </div>
</template>

<script setup lang="ts">
import type {IConsent} from "../../../../bandmaster-common/type/Groups";

import { computed } from "vue";

import ImmediateUpdate from '../ImmediateUpdate.vue';
import InputSwitch from 'primevue/inputswitch';

const props = defineProps<{
    modelValue: IConsent,
    groupName: string
}>();

const emit = defineEmits(['update:modelValue']);
const consent = computed({
    get() {
        return props.modelValue
    },

    set(v) {
        emit("update:modelValue", v);
    }
});
</script>