import type { IGroup } from '../../../bandmaster-common/type/Groups';
import type { Ref } from 'vue';
import {ref} from 'vue'

import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', () => {
  const groups: Ref<IGroup[]> = ref([]);
  const currentGroup: Ref<IGroup | null> = ref(null);
  const currentUser = ref({
    id: "672e920b-11aa-4fd0-b29e-ae8a0c65a92e"
  });

  return {groups, currentGroup, currentUser};
});