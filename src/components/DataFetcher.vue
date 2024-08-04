<script setup>
import { inject, ref, onUnmounted } from 'vue';
import { computedAsync } from '@vueuse/core';
import { fetchData } from '../helpers/functions.js';
import CollectionA from './Collection_A.vue';
import CollectionB from './Collection_B.vue';
import { AuthSymbol, CollectionSymbol, URL } from '../helpers/constants.js';

const props = defineProps({
  orderBy: {
    type: String,
    default: 'id'
  },
  query: {
    type: String,
    default: ''
  }
});
const token = inject(AuthSymbol).token?.value;
const tableType = inject(CollectionSymbol);

const evaluating = ref(true);
const result = computedAsync(async (onCancel) => {
  const controller = new AbortController();
  const signal = controller.signal;
  onCancel(() => controller.abort());

  if (!token) {return}
  return await fetchData(token, `${URL}/api/${tableType.value}/`, false, props.orderBy, props.query, signal);
}, {data: [], error: null}, evaluating);

// Clear books cache when switching collections.
onUnmounted(()=> {sessionStorage.removeItem(`${URL}/api/books/`)});

const updateData = (newData) => {
  result.value = {...result.value, data: newData};
};
</script>
 
<template>
  <div v-if="result.error" class="txt-c danger">
    <h3>{{ result.error.message ?? result.error}}</h3>
  </div>
  <div v-else-if="!evaluating && !result.data.length" class="txt-c danger"> 
    <h3>Sorry, nothing found...</h3>
  </div>
  <div v-else-if="!evaluating" class="table-wrapper">
    <CollectionA v-if="tableType === 'authors'" :list="result.data" @update-list="updateData" :key="tableType"/>
    <CollectionB v-if="tableType === 'books'" :list="result.data" @update-list="updateData" :key="tableType"/>
  </div>
</template>
