<template>
    <h2>Members</h2>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        <div v-if="members == null" class="mb-3">
            <Card class="h-full">
                <template #content>
                    <Skeleton class="mb-3"></Skeleton>
                    <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
                </template>
            </Card>
        </div>

        <div v-for="member in members" class="hover mb-3">
            <Card class="h-full text-center">
                <template #content>
                    <p>{{ member.name }}</p>
                    <p class="font-italic"><small>{{ member.sectionName }}</small></p>
                    <Button>
                        <RouterLink to="/" class="stretched-link">View</RouterLink>
                    </Button>
                </template>
            </Card>
        </div>

        <div class="hover mb-3">
            <Card class="h-full">
                <template #content>
                    <Button size="large">
                        <RouterLink class="stretched-link" :to="{ name: 'createMember'}">+ Add</RouterLink>
                    </Button>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { IMember } from '../../../../bandmaster-common/type/Groups';

import { ref } from 'vue';
import GroupService from '@/service/GroupService';
import { useSessionStore } from '@/stores/SessionStore';

import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';

const store = useSessionStore();
store.$subscribe(() => {
    updateMembers();
});

function updateMembers() {
    if (!store.currentGroup) {
        members.value = [];
        return;
    }

    members.value = null;
    GroupService.getMembersInGroup(store.currentGroup.id).then(m => members.value = m);
}

const members: Ref<IMember[] | null> = ref(null);
if (store.currentGroup) {
    updateMembers();
}
</script>