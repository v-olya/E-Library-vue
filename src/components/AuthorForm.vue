<script setup>
import { ref, computed } from 'vue';
import { dateRegEx, nameRegEx } from '../helpers/constants.js';
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
      typeof item.first_name === 'string' &&
      typeof item.last_name === 'string' &&
      typeof item.birth_date === 'string'
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
  submitting.value = true;
  const form = e.target;
  const { data, error: requestError, info } = await handleC_UDrequest(
    form.id,
    method.value,
    form.elements["ID"].value,
    new FormData(form),
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
  submitting.value = false;
};
</script>
<template>
  <div class="modal-background">
    <form id="author" name="author" class="modal" @submit.prevent="handleSubmit">
      <h3 class="txt-c">
        {{ props.index >= 0 ? `Editing the author with DB id=${record.value.id}` : "Add an author" }}
      </h3>
      <h4 :class="[error ? 'danger' : 'ok', 'txt-c']">
        {{ submitting && message }}&nbsp;
      </h4>
      <b id="hideModal" class="close" @click="$emit('hide-modal')">
        &#10006;
      </b>
      <div class="field">
        <label for="first_name" class="required">First name:</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          required
          autoComplete="given-name"
          :pattern="nameRegEx"
          placeholder=" "
          :defaultValue="record.value.first_name"
          @input="() => (submitting.value = false)"
        />
      </div>
      <div class="field">
        <label for="last_name" class="required">Last name:</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          required
          autoComplete="family-name"
          :pattern="nameRegEx"
          placeholder=" "
          :defaultValue="record.value.last_name"
          @input="() => (submitting.value = false)"
        />
      </div>
      <div class="field">
        <label for="birth_date" class="required">Birth Date:</label>
        <input
          id="birth_date"
          type="text"
          name="birth_date"
          required
          :pattern="dateRegEx"
          placeholder="YYYY-MM-DD"
          :defaultValue="record.value.birth_date"
          @input="() => (submitting.value = false)"
        />
        <input type="hidden" name="ID" readonly :value="record.value.id" />
      </div>
      <button type="submit" :disabled="submitting.value">Submit</button>
    </form>
  </div>
</template>