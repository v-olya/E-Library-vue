<script setup>
  import TopHeader from '../components/TopHeader.vue';
  import { RouterLink } from 'vue-router';

</script>

<template>
  <TopHeader :without_h1="true" />
  <main class="txt-c">
    <h1 class="not-found danger">404 Not found</h1> 
      <div>
        <img src="/404.jpg" alt="I don't know emodji" />
        <br />
        <br />
      </div>
      <button class="router-link">
        <RouterLink :to="{ path: '/'}"> Bring me home </RouterLink>
      </button>
    <h2><br /> Sorry, the page you are looking for does not exist :(</h2>
  </main>
</template>