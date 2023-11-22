<template>
    <h3>Consent</h3>
    <p>I give consent for <strong>{{ props.groupName }}</strong> to take photos and videos:</p>
    <div class="mb-3 ml-3">
        <label for="physicalMedia" class="block">For use in physical media (e.g. programmes, press/news articles, merchandise)</label>
        <ImmediateUpdate field-name="physicalMediaConsent" v-model="consent.physicalMedia" :component="InputSwitch" :no-stretch="true" id="physicalMedia" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
    </div>
    <div class="ml-3">
        <label for="digitalMedia" class="block">For use in digital media (e.g. social media, websites, online advertising)</label>
        <ImmediateUpdate field-name="digitalMediaConsent" v-model="consent.digitalMedia" :component="InputSwitch" :no-stretch="true" id="digitalMedia" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
    </div>

    <p>I give consent for <strong>{{ props.groupName }}</strong> to administer appropriate minor First Aid treatment / precautions:</p>
    <div class="ml-3">
        <label for="plasters" class="block">Apply plasters</label>
        <ImmediateUpdate field-name="applyPlasters" v-model="consent.applyPlasters" :component="InputSwitch" :no-stretch="true" id="plasters" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
    </div>
    <div class="ml-3">
        <label for="wipes" class="block">Use antiseptic wipes</label>
        <ImmediateUpdate field-name="useWipes" v-model="consent.useWipes" :component="InputSwitch" :no-stretch="true" id="wipes" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
    </div>
    <div class="ml-3">
        <label for="painkillers" class="block">Administer painkillers</label>
        <ImmediateUpdate field-name="administerPainkillers" v-model="consent.administerPainkillers" :component="InputSwitch" :no-stretch="true" id="painkillers" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
    </div>
    <div class="ml-3">
        <label for="antihistamines" class="block">Administer antihistamines</label>
        <ImmediateUpdate field-name="administerAntihistamines" v-model="consent.administerAntihistamines" :component="InputSwitch" :no-stretch="true" id="antihistamines" :props="{ disabled: !props.canEdit }"></ImmediateUpdate>
    </div>
</template>

<script setup lang="ts">
import type {IConsent} from "../../../../bandmaster-common/type/Groups";

import { computed } from "vue";

import ImmediateUpdate from '../ImmediateUpdate.vue';
import InputSwitch from 'primevue/inputswitch';

const props = defineProps<{
    modelValue: IConsent,
    groupName: string,
    canEdit?: boolean
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