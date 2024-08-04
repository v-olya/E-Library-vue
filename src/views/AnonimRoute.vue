<script setup>
import { RouterView } from 'vue-router';
import ErrorBoundary from '../components/ErrorBoundary.vue';

</script>

<template>
  <ErrorBoundary fallback="We are sorry, login failed">
    <RouterView />
  </ErrorBoundary>
</template>
