<script>
export default {
  name: 'ErrorBoundary',
  props: {
    fallback: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasError: false,
      error: null,
    };
  },
  errorCaptured(err, vm) {
    this.hasError = true;
    this.error = err;
    console.error(err);
    console.error('VM:', vm);
    return false;
  },
};
</script>

<template>
  <div>
    <slot v-if="!hasError"></slot>
    <div v-else>{{ fallback }}</div>
  </div>
</template>
