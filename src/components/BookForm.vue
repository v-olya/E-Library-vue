<script setup>
import { ref, computed } from 'vue';
import { dateRegEx, titleRegEx } from '../helpers/constants.js';
import { handleC_UDrequest } from '../helpers/functions.js';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  list: {
    type: Array,
    required: true,
    validator: value => value.every(item => 
      typeof item.id === 'number' &&
      typeof item.title === 'string' &&
      typeof item.isbn === 'string' &&
      typeof item.birth_date === 'string' &&
      Array.isArray(item.authors) &&
      item.authors.id && typeof (+item.authors.id) === 'number'
    )
  }
});

const emit = defineEmits(['hide-modal', 'update-list']);

const method = computed(() => (props.index >= 0 ? "PUT" : "POST"));
const record = computed(() => (props.index >= 0 ? props.list[props.index] : {}));
const submitting = ref(false);
const message = ref('');
const error = ref(false);

const handleSubmit = async (e) => {
  if (!confirm("Please make sure that the authors' ids exist in the DB")) {
    return;
  }
  submitting.value = true;
  const form = e.target;
  const requestBody = {};
  for (const [key, val] of new FormData(form).entries()) {
    requestBody[key] = key === "author_ids" ? val.split(",").map(x => +x) : val;
  }
  const { data, error: requestError, info } = await handleC_UDrequest(
    form.id,
    method.value,
    form.elements["ID"].value,
    requestBody,
  );
  if (!requestError && data) {
    document.getElementById("hideModal").addEventListener("click", () => {
      emit('update-list',
        method.value === "POST"
          ? [data, ...props.list]
          : [...props.list.slice(0, props.index), data, ...props.list.slice(props.index + 1)],
      );
    });
  }
  error.value = requestError;
  message.value = info;
};

const author_ids = computed(() => record.value.authors
  ? record.value.authors.map(a => a.id).filter(x => x).join(",")
  : "");
</script>
<template>
  <div class="modal-background">
    <form id="book" name="book" class="modal" @submit.prevent="handleSubmit">
      <h3 class="txt-c">
        {{ index >= 0 ? `Editing the book with DB id=${record.id}` : "Add a new book" }}
      </h3>
      <h4 :class="[error ? 'danger' : 'ok', 'txt-c']">
        {{ submitting && message }}&nbsp;
      </h4>
      <b id="hideModal" class="close" @click="$emit('hide-modal')">
        &#10006;
      </b>
      <div class="field">
        <label for="title" class="required">Title:</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          minlength="2"
          :pattern="titleRegEx"
          placeholder=" "
          :defaultValue="record.title"
          @input="() => submitting = false"
        />
      </div>
      <div class="field">
        <label for="isbn" class="required">ISBN:</label>
        <input
          id="isbn"
          type="text"
          name="isbn"
          required
          pattern="^\d{1,13}$"
          placeholder="Up to 13 digits"
          :defaultValue="record.isbn"
          @input="() => submitting = false"
        />
      </div>
      <div class="field">
        <label for="publication_date" class="required">Publication Date:</label>
        <input
          id="publication_date"
          type="text"
          name="publication_date"
          required
          :pattern="dateRegEx"
          placeholder="YYYY-MM-DD"
          :defaultValue="record.publication_date"
          @input="() => submitting = false"
        />
      </div>
      <div class="field">
        <label for="authors" class="required">Authors' IDs:</label>
        <input
          id="author_ids"
          type="text"
          name="author_ids"
          required
          pattern="^[1-9](\d*)(,[1-9](\d*))*$"
          placeholder="1 or 1,2,3"
          :defaultValue="author_ids"
          @input="() => submitting = false"
        />
        <input type="hidden" name="ID" readonly :value="record.id" />
      </div>
      <button type="submit" :disabled="submitting">Submit</button>
    </form>
  </div>
</template>
