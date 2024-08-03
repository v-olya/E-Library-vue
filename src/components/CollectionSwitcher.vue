<script setup>
import { provide, ref, computed } from 'vue';
import { CollectionSymbol } from '../helpers/constants.js';
import GETparamsForm from './GETparamsForm.vue';

const tableType = ref('authors');
provide(CollectionSymbol, computed(() => tableType));

const switchTo= (string) => {
  tableType.value = string;
}

</script>

<template>
  <div>
    <label for="selectedTable" class="txt-c">
      Exploring&nbsp;&nbsp;&nbsp;
      <select
        id="selectedTable"
        name="selectedTable"
        v-model.trim="tableType"
        @change="switchTo($event.target.value)"
      >
        <option value="authors">authors</option>
        <option value="books">books</option>
      </select>
    </label>
    <GETparamsForm :key="tableType" />
  </div>
</template>
