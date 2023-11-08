import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },

    //groups
    {
      path: '/groups/add',
      name: 'addGroup',
      component: () => import("../views/AddGroup.vue")
    },

    {
      path: '/members',
      name: 'memberList',
      component: () => import("../views/MemberList.vue")
    }
  ]
});

export default router;
