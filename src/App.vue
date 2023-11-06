<style scoped>
header {
  background: var(--primary-color);
}

a {
  color: var(--primary-color-text);
  text-decoration: none;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  display: inline-block;
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

.navbar{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-height: 100%;
}

@media screen and (min-width: 992px) {
  header {
    width: 300px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
  }

  main {
    margin-left: 300px;
  }

  .container.navbar {
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>

<template>
  <header>
    <div class="container navbar">
      <div>
        <h1 class="mb-0 inline-block">
          <RouterLink to="/">Bandmaster</RouterLink>
        </h1>

        <hr class="my-3 opacity-40 hidden md:block" />

      <nav class="mt-5">
        <RouterLink to="/" class="large">Home</RouterLink>
      </nav>
    </div>

      <div class="py-5">
        <hr class="my-3 opacity-40 hidden md:block" />

        <RouterLink to="/" class="large">Sign Out</RouterLink>        
      </div>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>