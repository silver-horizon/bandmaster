import type { IGroup } from '../../../bandmaster-common/type/Groups';
import type { Ref } from 'vue';
import {ref} from 'vue'

import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', () => {
  const groups: Ref<IGroup[]> = ref([]);
  const currentGroup: Ref<IGroup | null> = ref(null);
  const currentUser = ref({
    id: import.meta.env.VITE_USER_ID
  });

  const backgroundLoader = {
    visible: ref(false),
    progress: ref(0)
  };

  const foregroundLoader = {
    visible: ref(false)
  };

  return {groups, currentGroup, currentUser, backgroundLoader, foregroundLoader};
});