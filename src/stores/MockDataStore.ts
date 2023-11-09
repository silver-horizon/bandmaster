import type { IGroup } from '../../../bandmaster-common/type/Groups';
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
      members: [{
        name: "Luke Taylor",
        sectionName: "Drums" //ignore this duplication, it won't be a problem when it comes from the server
      }]
    }]
  }]);

  return { groups }
})
