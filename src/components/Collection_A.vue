<script setup>
import { ref, inject, defineAsyncComponent, watch } from 'vue';
import Add from './actions/AddButton.vue';
import Edit from './actions/EditButton.vue';
import Delete from './actions/DeleteButton.vue';
import { fetchData, handleC_UDrequest } from '../helpers/functions.js';
import { AuthSymbol, CollectionSymbol, URL } from '../helpers/constants.js';

const props = defineProps({
  list: {
    type: Array,
    required: true,
    validator: value => value.every(item =>
      typeof item.id === 'number' &&
      typeof item.first_name === 'string' &&
      typeof item.last_name === 'string' &&
      !isNaN(new Date(item.birth_date))
    )
  }
});
const emit = defineEmits(['update-list']);

const token = inject(AuthSymbol).token?.value;

// State
const showForm = ref(false);
const indexToEdit = ref(-1);
const booksOf = ref({});

// Lazy load AuthorForm
const AuthorForm = defineAsyncComponent(() => import('./AuthorForm.vue'));

// Books are needed to provide details on author:  booksOf[author_id]
const finished = ref(false);
let tempBooksOf = {};
const tableType = inject(CollectionSymbol);

// Fetch data: 
// when the "tableType" will be switched from Books to Authors, we need to refetch books, because the collection may be updated.

watch(tableType, async ()=>{
  const {data: allBooks, loaded} = await fetchData(token, `${URL}/api/books/`, true);
  if (allBooks.length) {
    allBooks.forEach((book) => {
      book.authors.forEach((author) => {
        tempBooksOf[author.id] = tempBooksOf[author.id] ?? [];
        tempBooksOf[author.id].push({
          published: book.publication_date,
          title: book.title,
        });
      });
    });
    booksOf.value = tempBooksOf;
    finished.value = loaded;
  }
});

// Methods
const addAuthor = () => {
  indexToEdit.value = -1;
  showForm.value = true;
};

const editAuthor = (index) => {
  indexToEdit.value = index;
  showForm.value = true;
};
const deleteRecord = async (index) => {
  const record = props.list[index];
  if (!confirm(`Are you sure to delete the “${record.first_name} ${record.last_name}” record? ${booksOf.value[record.id] ? "\n\nWe have books by that author!" : ""}`)) {return}
  const { error, info } = await handleC_UDrequest("author", "DELETE", record.id);
  if (!error) {
    emit('update-list', [...props.list.slice(0, index), ...props.list.slice(index + 1)]);
  }
  alert(info);
};
</script>

<template>
  <div>
    <table class="txt-c">
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Date of birth</th>
          <th>Details (not editable)</th>
          <th width="40">db id</th>
          <th width="108">
            <Add @click="addAuthor"/>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(author, index) in list" :key="author.id">
          <td>{{ author.first_name }}</td>
          <td>{{ author.last_name }}</td>
          <td>{{ new Date(author.birth_date).toLocaleDateString() }}</td>
          <td>
            <details :disabled="finished && !booksOf[author.id] ? true : null">
              <summary>Books</summary>
              <div v-if="finished && booksOf[author.id]">
                {{ booksOf[author.id].map(book => `${book.title} (${book.published})`).join(",\n") }}
              </div>
            </details>
          </td>
          <td>{{ author.id }}</td>
          <td class="no-wrap">
            <Edit @click="editAuthor(index)"/>
            <Delete @click="() => deleteRecord(index)"/>
          </td>
        </tr>
      </tbody>
    </table>

    <Suspense v-if="showForm" fallback="">
      <AuthorForm v-if="showForm" :index="indexToEdit" @hide-modal="() => showForm.value = false" :list="list" @update-list="ls=> $emit('update-list', ls)"/>
    </Suspense>
  </div>
</template>
