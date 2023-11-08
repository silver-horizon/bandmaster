import type { IGroup } from '../type/Groups';
import type { Ref } from 'vue';
import {ref} from 'vue'

import { defineStore } from 'pinia'

export const useMockStore = defineStore('mock', () => {
  const groups: Ref<IGroup[]> = ref([{
    id: "revolution",
    name: "Revolution",
    sections: [{
      name: "Brass",
      members: []
    }, {
      name: "Drums",
      members: []
    }]
  }]);

  return { groups }
})
