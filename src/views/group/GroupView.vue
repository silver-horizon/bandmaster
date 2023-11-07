<template>
    <h2>Your Groups</h2>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        <Card v-if="groups == null">
            <template #content>
                <Skeleton></Skeleton>
            </template>
        </Card>

        <Card v-for="group in groups" class="text-center">
            <template #content>
                <h3>{{ group.name }}</h3>
            </template>
        </Card>

        <Card v-if="groups != null" class="text-center">
            <template #content>
                <Button>Add New Group</Button>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import type { IGroup } from "../../type/Groups";
import type { Ref } from "vue";

import { ref } from 'vue';
import GroupService from "../../service/GroupService";

import Skeleton from "primevue/skeleton";
import Card from "primevue/card";
import Button from "primevue/button";

const groups: Ref<IGroup[] | null> = ref(null);
GroupService.getGroups().then((g: IGroup[]) => groups.value = g);
</script>