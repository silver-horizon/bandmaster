import { createRouter, createWebHistory } from 'vue-router'

import {useSessionStore} from "../stores/SessionStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },

    //groups
    {
      path: '/groups/add',
      name: 'addGroup',
      component: () => import("@/views/AddGroup.vue")
    },

    //member
    {
      path: '/members',
      name: 'memberList',
      component: () => import("@/views/member/MemberList.vue")
    },
    {
      path: '/members/new',
      name: 'createMember',
      component: () => import("@/views/member/CreateMember.vue")
    },
    {
      path: '/members/me',
      name: 'myProfile',
      component: () => import("@/views/member/ViewMember.vue"),
      props: () => {
        const store = useSessionStore();
        return {
          id: store.currentUser.id
        };
      }
    },
    {
      path: '/members/:id',
      name: 'viewMember',
      component: () => import("@/views/member/ViewMember.vue"),
      props: (route) => {
        const store = useSessionStore();

        return {
        id: route.params.id,
        group: store.currentGroup!.id
      }
    }
    },

    //section
    {
      path: '/sections',
      name: 'listSections',
      component: () => import("@/views/ViewSections.vue")
    }
  ]
});

export default router;
