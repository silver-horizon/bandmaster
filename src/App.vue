<style scoped>
:deep(.p-accordion-content){
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255,255,255,0.1);
  padding: 0.5rem;
}

:deep(.p-accordion-header-link){
  transition: border-color .5s, background-color .5s;
  background-color: transparent;
  border-color: transparent;
  color: var(--primary-color-text);
  padding-left: 0.25rem;
}

:deep(.p-accordion-header.p-highlight .p-accordion-header-link){
  background-color: rgba(0,0,0,0.15);
  border-bottom: solid 1px rgba(255,255,255,0.5);
}

:deep(.p-accordion-tab){
  border: 1px solid;
  border-radius: var(--border-radius);
  border-color: transparent;
  transition: border-color .5s;
}

:deep(.p-accordion-tab-active){
  border-color: rgba(255,255,255,0.5);
}

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
    padding-right: 1rem;
  }

  .navbar {
    max-width: 90%;
    max-height: none;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 1rem;
  }

  a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -1px;
    width: 100%;
    height: 0.1rem;
    background-color: var(--primary-color-text);
    transition: transform .3s;
    transform: translate3d(-100%, 0, 0);
  }

  a:hover::after {
    left: 0px;
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
  <Loader></Loader>

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

      <hr class="hidden md:block" />

      <nav>
        <div class="p-float-label mb-5">
          <Dropdown class="w-full" :options="availableGroups" option-label="name" option-value="id" v-model="id" @change="changeGroup"></Dropdown>
          <label>Group</label>
        </div>

        <Accordion :multiple="true" class="large">
          <AccordionTab v-for="item in navMenu" :header="item.name">
            <ul class="ml-3">
              <li v-for="page in item.pages"><RouterLink :to="{name: page.link}">{{ page.title }}</RouterLink></li>
            </ul>
          </AccordionTab>
        </Accordion>

        <hr class="hidden md:block" />

        <ul>
          <li>
            <RouterLink :to="{ name: 'myProfile' }" class="large">My Details</RouterLink>
          </li>
          <li>
            <RouterLink to="/" class="large">Sign Out</RouterLink>
          </li>
        </ul>
      </nav>

    </div>
  </header>

  <main class="container">
    <RouterView :key="route.fullPath" />
  </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { useSessionStore } from './stores/SessionStore';

import Dropdown from 'primevue/dropdown';
import Loader from '@/components/Loader.vue';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const router = useRouter();
const route = useRoute();
const store = useSessionStore();
const id = ref(store.currentGroup?.id);

watch(() => store.currentGroup, () => {
  id.value = store.currentGroup?.id;
});

const availableGroups = computed(() => {
  return store.groups.concat([{
    id: "ADD",
    name: "+ Add",
    sections: []
  }])
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
  if (id.value !== "ADD") {
    const match = store.groups.find(x => x.id === id.value);
    if (match) {
      store.currentGroup = match;
    }

    return;
  }

  id.value = store.currentGroup?.id;

  router.push({ name: "addGroup" });
  toggleNav(false);
}

const navMenu = [{
  name: "Members",
  pages: [{
    title: "Personal Details",
    link: "memberList"
  }, {
    title: "Sections",
    link: "listSections"
  }]
}];
</script>