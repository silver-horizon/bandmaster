import type { IGroup } from '../type/Groups';
import type { Ref } from 'vue';
import {ref} from 'vue'

import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', () => {
  const groups: Ref<IGroup[]> = ref([]);
  const currentGroup: Ref<IGroup | null> = ref(null);

  return {groups, currentGroup};
});