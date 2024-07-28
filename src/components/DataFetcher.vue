<script setup>
import { inject, ref } from 'vue';
import { computedAsync } from '@vueuse/core';
import { fetchData } from '../helpers/functions.js';
import CollectionA from './Collection_A.vue';
import CollectionB from './Collection_B.vue';
import { CollectionSymbol, URL } from '../helpers/constants.js';

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
const tableType = inject(CollectionSymbol).value;

const evaluating = ref(true);
const result = computedAsync(async (onCancel) => {
  const controller = new AbortController();
  const signal = controller.signal;
  onCancel(() => controller.abort());
  return await fetchData(inject('auth').token.value, `${URL}/api/${tableType}/`, false, props.orderBy, props.query, signal);
}, {data: [], error: null}, evaluating);
//     v-else-if="data.length"
const updateData = (newData) => {
  result.value = {...result.value, data: newData};
};
</script>
 
<template>
  <div v-if="result.error" class="txt-c danger">
    <h3>{{ error }}</h3>
  </div>
  <div v-else-if="!evaluating && !result.data.length" class="txt-c danger"> 
    <h3>Sorry, nothing found...</h3>
  </div>
  <div v-else-if="!evaluating" class="table-wrapper">
    <CollectionA v-if="tableType === 'authors'" :list="result.data" @update-list="updateData" />
    <CollectionB v-if="tableType === 'books'" :list="result.data" @update-list="updateData" />
  </div>
</template>
