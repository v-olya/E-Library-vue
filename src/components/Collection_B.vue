<script setup>
import { ref, defineAsyncComponent } from 'vue';
import Add from './actions/AddButton.vue';
import Edit from './actions/EditButton.vue';
import Delete from './actions/DeleteButton.vue';
import { handleC_UDrequest } from '../helpers/functions.js';

const props = defineProps({
  list: {
    type: Array,
    required: true,
     validator: value => value.every(item =>
      typeof +item.id === 'number' &&
      typeof item.title === 'string' &&
      typeof item.isbn === 'string' &&
      !isNaN(new Date(item.publication_date)) &&
      Array.isArray(item.authors)
    )
  }
});
 
const emit = defineEmits(['update-list']);

// State
const showForm = ref(false);
const indexToEdit = ref(-1);

// Lazy load BookForm
const BookForm = defineAsyncComponent(() => import('./BookForm.vue'));

// Methods
const addBook = () => {
  indexToEdit.value = -1;
  showForm.value = true;
};

const editBook = (index) => {
  indexToEdit.value = index;
  showForm.value = true;
};

const deleteRecord = async (index) => {
  const record = props.list[index];
  if (!confirm(`Are you sure to delete the “${record.title}”?`)) {return}
  const { error, info } = await handleC_UDrequest("book", "DELETE", record.id);
  if (!error) {
      emit('update-list', [...props.list.slice(0, index), ...props.list.slice(index + 1)]);
    }
  alert(info);
};
</script>

<template>
  <table class="txt-c">
    <thead>
      <tr>
        <th>Title</th>
        <th>Published</th>
        <th>ISBN</th>
        <th>Author(s) ID</th>
        <th>Details (not editable)</th>
        <th width="108">
          <Add @click="addBook" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(book,index) in list" :key="book.id">
        <td>{{ book.title }}</td>
        <td>{{ new Date(book.publication_date).toLocaleDateString() }}</td>
        <td>{{ book.isbn }}</td>
        <td>{{ book.authors.map(a => a.id).join(',') }}</td>
        <td>
          <details>
            <summary>Author(s)</summary>
            <span v-for="author in book.authors" :key="author.id">{{ author.first_name }} {{ author.last_name }} ({{ author.birth_date }}){{"\n"}}</span>
          </details>
        </td>
        <td>
          <Edit @click="editBook(index)" />
          <Delete @click="deleteRecord(index)" />
        </td>
      </tr>
    </tbody>
  </table>
  <Suspense v-if="showForm" fallback="">
    <BookForm v-if="showForm" :index="indexToEdit" @hide-modal="() => showForm.value = false" :list="list" @update-list="ls=> $emit('update-list', ls)" />
  </Suspense>
</template>
