<script setup>
import TopHeader from '../components/TopHeader.vue';
import LoginPage from '../components/LoginPage.vue';
import CollectionSwitcher from '../components/CollectionSwitcher.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['Login', 'Home'].includes(value),
  },
});

const layouts = {
  Login: LoginPage,
  Home: CollectionSwitcher,
};
</script>

<template>
  <TopHeader />
  <main>
    <component :is="layouts[props.type]" />
  </main>
</template>
