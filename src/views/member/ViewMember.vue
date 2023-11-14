<template>
    <h2 v-if="!user">Loading...</h2>

    <div v-if="user">
        <h2>{{ user.firstName }} {{ user.lastName }}</h2>

        <Form button-title="Update" :disabled="disabled">
            <div class="p-float-label mb-3">
                <InputText type="email" class="w-full" id="email" required v-model="user.email" :disabled="disabled"></InputText>
                <label for="email">Email</label>
            </div>

            <div class="row">
                <div class="col-12 col-lg-6">
                    <div class="p-float-label">
                        <InputText class="w-full" id="first-name" required v-model="user.firstName" :disabled="disabled"></InputText>
                        <label for="first-name">First Name</label>
                    </div>
                </div>

                <div class="col-12 col-lg-6">
                    <div class="p-float-label">
                        <InputText class="w-full" id="last-name" required v-model="user.lastName" :disabled="disabled"></InputText>
                        <label for="last-name">Last Name</label>
                    </div>
                </div>
            </div>

            <div class="p-float-label">
                <Calendar class="w-full" id="dob" required v-model="user.dob" :max-date="new Date()" :disabled="true"></Calendar>
                <label for="dob">Date of Birth</label>
            </div>

            <div class="mt-5" v-if="user.contact && age < 18">
                <hr />
                <h3>Emergency Contact Details</h3>
                <div class="row">
                    <div class="col-12 col-lg-6">
                        <div class="p-float-label">
                            <InputText class="w-full" id="fcirst-name" required v-model="user.contact.firstName" :disabled="disabled"></InputText>
                            <label for="cfirst-name">First Name</label>
                        </div>
                    </div>

                    <div class="col-12 col-lg-6">
                        <div class="p-float-label">
                            <InputText class="w-full" id="clast-name" required v-model="user.contact.lastName" :disabled="disabled"></InputText>
                            <label for="clast-name">Last Name</label>
                        </div>
                    </div>
                </div>

                <div class="p-float-label mb-3">
                    <InputText type="email" class="w-full" id="cemail" v-model="user.contact.email" required :disabled="disabled"></InputText>
                    <label for="cemail">Email</label>
                </div>

                <div class="p-float-label mb-3">
                    <InputText class="w-full" id="phone" v-model="user.contact.phone" maxlength="15" required :disabled="disabled"></InputText>
                    <label for="phone">Phone</label>
                </div>
            </div>

        </Form>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { IMember } from '../../../../bandmaster-common/type/Groups';

import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import GroupService from '@/service/GroupService';
import { useSessionStore } from '@/stores/SessionStore';
import { getAge } from "@/utils"

import Form from '@/components/Form.vue';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';

const route = useRoute();
const store = useSessionStore();
const user: Ref<IMember | null> = ref(null);
const disabled = ref(true);

GroupService.getUserInGroupById(store.currentGroup?.id ?? '', route.params.id as string).then(m => {
    user.value = m;
    disabled.value = m.userId != store.currentUser.id;
});

const age = computed(() => {
    if (!user.value?.dob) {
        return 100;
    }

    return getAge(user.value.dob);
});
</script>