<template>
    <h2>Your Groups</h2>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        <div v-if="groups == null" class="mb-3">
            <Card class="h-full">
                <template #content>
                    <Skeleton class="mb-3"></Skeleton>
                    <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
                </template>
            </Card>
        </div>

        <div v-for="group in groups" class="mb-3 hover">
            <Card class="text-center h-full">
                <template #content>
                    <p class="text-lg">{{ group.name }}</p>
                    <Button class="stretched-link">Select</Button>
                </template>
            </Card>
        </div>

        <div class="mb-3 hover">
            <Card class="text-center h-full">
                <template #content>
                    <Button>
                        <RouterLink :to="{ name: 'addGroup' }" class="stretched-link">Add New Group</RouterLink>
                    </Button>
                </template>
            </Card>
        </div>
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
import { RouterLink } from "vue-router";

const groups: Ref<IGroup[] | null> = ref(null);
GroupService.getGroups().then((g: IGroup[]) => groups.value = g);
</script>