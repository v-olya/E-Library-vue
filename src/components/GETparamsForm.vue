<script setup>
import { ref, computed, inject } from 'vue';
import DataFetcher from './DataFetcher.vue';
import { CollectionSymbol, titleRegEx, nameRegEx } from '../helpers/constants.js';

const tableType = inject(CollectionSymbol).value;

const orderBy = ref('id');
const query = ref('');

const tableA = computed(() => tableType === 'authors');

const orderOptions = computed(() =>
  tableA.value ? ['first_name', 'last_name', 'birth_date'] : ['title', 'isbn', 'publication_date']
);

const handleInput = (e) => {
  if (!e.target.value) {
    query.value = '';
  }
};

const handleSearch = (e) => {
  query.value = e.target.query.value;
};
</script>

<template>
  <div>
    <form id="search" name="search" class="txt-c" @submit.prevent="handleSearch">
      <input
        id="query"
        type="search"
        name="query"
        :title="tableA ? 'Cannot contain spaces and special characters except { \' }' : 'Can contain letters, numbers, spaces and special characters from the list & , . - — ; : ! \' '"
        :placeholder="tableA ? 'Name or surname' : 'Title or ISBN'"
        :pattern="tableA ? nameRegEx : titleRegEx"
        @input="handleInput"
      />
      <button id="searchButton" type="submit">
        Search by fragment
      </button>
      <label htmlFor="order">
        Order by &nbsp;&nbsp;&nbsp;
        <select
          id="order"
          name="order"
          v-model="orderBy"
        >
          <option value="id" key="0">default</option>
          <option v-for="(opt, i) in orderOptions" :key="i + 1" :value="opt">{{ opt }}</option>
        </select>
      </label>
    </form>
<Suspense>
    <DataFetcher :orderBy="orderBy" :query="query" />
</Suspense>
  </div>
</template>

