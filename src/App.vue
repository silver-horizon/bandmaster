<style scoped>
header {
  background: var(--primary-color);
  color: var(--primary-color-text);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

a {
  color: var(--primary-color-text);
  text-decoration: none;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.navbar {
  max-height: 63px;
  overflow: hidden;
  transition: max-height .5s ease-in-out;
  height: 100vh;
}

.open .navbar {
  max-height: 100vh;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

#burger {
  --width: 20px;
  --height: 15px;

  width: var(--width);
  height: var(--height);
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;
}

#burger span {
  display: block;
  position: absolute;
  height: calc(var(--height) / 5);
  width: 100%;
  background: var(--primary-color-text);
  border-radius: calc(var(--height) / 5);
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: .25s ease-in-out;
}

#burger span:nth-child(1) {
  top: 0px;
  transform-origin: left center;
}

#burger span:nth-child(2) {
  top: calc(var(--height) * 0.4);
  transform-origin: left center;
}

#burger span:nth-child(3) {
  top: calc(var(--height) * 0.8);
  transform-origin: left center;
}

.open #burger span:nth-child(1) {
  transform: rotate(45deg);
  top: calc(var(--height) * -0.06666);
  left: calc(var(--width) * 0.133333);
}

.open #burger span:nth-child(2) {
  width: 0%;
  opacity: 0;
}

.open #burger span:nth-child(3) {
  transform: rotate(-45deg);
  top: calc(var(--height) * 0.8666);
  left: calc(var(--width) * 0.133333);
}

ul {
  list-style-type: none;
  padding-left: 0;
}

hr {
  min-width: 100%;
  min-height: 2px;
}

@media screen and (min-width: 768px) {
  header {
    width: 300px;
    bottom: 0;
  }

  main {
    padding-left: 300px;
  }

  nav {
    display: flex;
    flex-direction: column;
    height: calc(100% - 100px);
    overflow: auto;
  }

  .navbar {
    max-width: 80%;
    max-height: none;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 1rem;
  }

  a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.1em;
    background-color: var(--primary-color-text);
    transition: opacity 300ms, transform 300ms;
    transform: translate3d(-100%, 0, 0);
  }

  a:hover::after {
    transform: translate3d(0, 0, 0);
  }
}

@media screen and (max-width: 767px) {
  main {
    margin-top: 75px;
  }
}
</style>

<template>
  <header :class="{ open: isNavOpen }">
    <div class="container navbar">
      <div class="title">
        <h1 class="m-0 inline-block">
          <RouterLink :to="{ name: 'home' }">Bandmaster</RouterLink>
        </h1>
        <div id="burger" @click="toggleNav()" class="md:hidden">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <hr class="my-3 opacity-40 hidden md:block" />

      <nav>
        <div class="p-float-label mb-5">
          <Dropdown class="w-full" :options="availableGroups" option-label="name" v-model="store.currentGroup" :loading="loadingGroups" :disabled="loadingGroups" @change="changeGroup" @focus="prevSelection = store.currentGroup"></Dropdown>
          <label>Group</label>
        </div>
        <ul class="mb-auto">
          <li>
            <RouterLink :to="{ name: 'memberList' }" class="large" @click="toggleNav(false)">Members</RouterLink>
          </li>
        </ul>

        <hr class="my-3 opacity-40 hidden md:block" />

        <ul>
          <li>
            <RouterLink to="/" class="large">Sign Out</RouterLink>
          </li>
        </ul>
      </nav>

    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import type { IGroup } from '../../bandmaster-common/type/Groups';

import { RouterLink, RouterView, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useSessionStore } from './stores/SessionStore';
import GroupService from './service/GroupService';

import Dropdown from 'primevue/dropdown';

const router = useRouter();
const store = useSessionStore();
const loadingGroups = ref(true);
let prevSelection: null | IGroup = null;

const availableGroups = computed(() => {
  return store.groups.concat([{
    id: "ADD",
    name: "+ Add",
    sections: []
  }])
});

GroupService.getGroups().then(g => {
  store.groups = g;
  if (!store.currentGroup) {
    store.currentGroup = g[0];
  }

  loadingGroups.value = false;
});

const isNavOpen = ref(false);

function toggleNav(forceValue: boolean | null = null) {
  if (forceValue === null) {
    forceValue = !isNavOpen.value;
  }

  isNavOpen.value = forceValue;

  if (!forceValue) {
    document.body.classList.remove("nav-open");
  } else {
    document.body.classList.add("nav-open");
  }
}

function changeGroup() {
  if (store.currentGroup?.id !== "ADD") {
    return;
  }

  store.currentGroup = prevSelection;
  router.push({ name: "addGroup" });
  toggleNav(false);
}
</script>