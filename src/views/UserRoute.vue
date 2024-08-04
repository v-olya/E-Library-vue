<script setup>
import { RouterView } from 'vue-router';
import ErrorBoundary from '../components/ErrorBoundary.vue';

</script>

<template>
  <ErrorBoundary fallback="We are sorry, the data wasn't properly handled">
    <RouterView />
  </ErrorBoundary>
</template>
