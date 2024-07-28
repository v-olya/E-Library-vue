<script setup>
import { inject } from 'vue';
//import { AuthSymbol } from '../helpers/constants.js';
import { useRouter, RouterView } from 'vue-router';
import ErrorBoundary from '../components/ErrorBoundary.vue';

const { token } = inject('auth');
const router = useRouter();

if (!token.value) {
  router.push('/login');
}
</script>

<template>
  <ErrorBoundary fallback="We are sorry, the data wasn't properly handled">
    <RouterView />
  </ErrorBoundary>
</template>
