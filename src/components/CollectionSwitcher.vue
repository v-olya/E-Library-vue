<script setup>
import { provide, ref } from 'vue';
import { CollectionSymbol } from '../helpers/constants.js';
import GETparamsForm from './GETparamsForm.vue';

const tableType = ref('authors');
provide(CollectionSymbol, tableType);

</script>

<template>
  <div>
    <label for="selectedTable" class="txt-c">
      Exploring&nbsp;&nbsp;&nbsp;
      <select
        id="selectedTable"
        name="selectedTable"
        v-model.trim="tableType"
      >
        <option value="authors">authors</option>
        <option value="books">books</option>
      </select>
    </label>
    <GETparamsForm :key="tableType" />
  </div>
</template>
