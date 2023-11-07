import type { IGroup } from '../type/Groups';
import { defineStore } from 'pinia'

export const useMockStore = defineStore('mock', () => {
  const groups: IGroup[] = [];

  return { groups }
})
