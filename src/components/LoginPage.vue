<script setup>
  import { reactive, computed, inject } from 'vue';
  import { passwordRegEx } from '../helpers/constants.js';//AuthSymbol,

  const user = inject('auth');

  const credentials = reactive({ username: '', password: '' });

  const handleInput = (e) => {
    const input = e.target;
    if (!input.validity.valid) {
      return;
    }
    credentials[input.name] = input.value;
  };

  const formValidity = computed(() => {
    const inputs = document.querySelectorAll('input');
    return ![...inputs].map((i) => i.validity.valid).includes(false);
  });

  const chars = 4;
</script>

<template>
  <form id="login" @submit.prevent="user.logInAs(credentials)">
    <div class="field">
      <label for="username" class="required">Username:</label>
      <input
        id="username"
        type="text"
        name="username"
        required
        aria-describedby="user-name"
        :minlength="chars"
        :maxlength="chars * 4"
        title="Must begin with a letter, may contain numbers"
        pattern="^[A-Za-z][A-Za-z0-9]+$"
        placeholder=" "
        @input="handleInput"
      />
    </div>
    <div class="field">
      <label for="password" class="required">Password:</label>
      <input
        id="password"
        type="password"
        name="password"
        required
        aria-describedby="user-password"
        :minlength="chars * 2"
        :maxlength="chars * 4"
        :pattern="passwordRegEx"
        title="At least one uppercase or lowercase letter, one number and one special character"
        placeholder=" "
        @input="handleInput"
      />
    </div>
    <button type="submit" :disabled="!formValidity">Submit</button>
  </form>
</template>