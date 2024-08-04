<script setup>
import { ref, computed } from 'vue';
import { dateRegEx, nameRegEx } from '../helpers/constants.js';
import { handleC_UDrequest } from '../helpers/functions.js';

const { list, index } = defineProps({
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

const method = computed(() => (index >= 0 ? "PUT" : "POST"));
const record = computed(() => (index >= 0 ? list[index] : {}));
const submitting = ref(undefined);
const message = ref('');
const error = ref(null);
const item = ref({});

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
    item.value = data;
  }
  error.value = requestError;
  message.value = info;
};

const handleClose = ()=> {
  emit('hide-modal');
  if (!Object.keys(item.value).length) { return }
  emit('update-list',
    method.value === "POST"
      ? [...list, item.value]
      : [...list.slice(0, index), item.value, ...list.slice(index + 1)],
  );
}

</script>

<template>
  <div class="modal-background">
    <form id="author" name="author" class="modal" @submit.prevent="handleSubmit">
      <h3 class="txt-c">
        {{ index >= 0 ? `Editing the author with id = ${record.id}` : "Add an author" }}
      </h3>
      <h4 :class="[error ? 'danger' : 'ok', 'txt-c']">
        &nbsp;<span v-if="message">{{ message }}</span>
      </h4>
      <b id="hideModal" class="close" @click="handleClose">
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
          :defaultValue="record.first_name"
          @input="() => submitting = false"
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
          :defaultValue="record.last_name"
          @input="() => submitting = false"
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
          :defaultValue="record.birth_date"
          @input="() => submitting = false"
        />
        <input type="hidden" name="ID" readonly :value="record.id" />
      </div>
      <button type="submit" :disabled="submitting">Submit</button>
    </form>
  </div>
</template>