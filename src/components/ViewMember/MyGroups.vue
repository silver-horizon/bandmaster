<template>
    <h3 class="mb-6">My Groups</h3>

    <Card class="list-item" v-for="group in groups">
        <template #content>
            <a href="#" @click.prevent="editMembership(group)">{{ group.name }}</a>
        </template>
    </Card>

    <Dialog modal v-model:visible="showModal" :header="`Settings for ${selectedGroup?.name}`">
        <Consent :group-name="selectedGroup?.name" :model-value="groupUser?.consent" :can-edit="true"></Consent>
    </Dialog>
</template>

<script setup lang="ts">
import type { IGroupSummary, IGroupUser } from '../../../../bandmaster-common/type/Groups';
import type { ILooseObject } from '../../../../bandmaster-common/type/Util';
import type { IUpdateGroupUserDto } from '../../../../bandmaster-common/type/Dto';

import { ref, provide } from 'vue';

import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Consent from './Consent.vue';
import type { Ref } from 'vue';
import GroupService from '@/service/GroupService';

provide("callback", async (params: ILooseObject) => {
    if(!selectedGroup.value){
        throw new Error("Cannot update without a selected group!");
    }

    return await GroupService.updateUserInGroup(userId, selectedGroup.value.id, params as IUpdateGroupUserDto);
});

const showModal = ref(false);
const selectedGroup: Ref<IGroupSummary | null> = ref(null);
const groupUser: Ref<IGroupUser | null> = ref(null);

async function editMembership(group: IGroupSummary){
    groupUser.value = await GroupService.getUserInGroupById(group.id, userId);

    selectedGroup.value = group;
    showModal.value = true;
}

const { groups, userId } = defineProps<{
    groups: IGroupSummary[],
    userId: string
}>();
</script>