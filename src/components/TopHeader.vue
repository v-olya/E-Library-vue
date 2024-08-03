<script setup>
import { inject } from 'vue';
import { AuthSymbol } from '../helpers/constants.js';
import UserAvatar from './UserAvatar.vue';

const { token, user_id, logOut } = inject(AuthSymbol);

</script>

<template>
  <div>
    <ul v-if="token" role="navigation" class="flex space-between align-c">
      <li class="flex align-c">
        <UserAvatar /> <b>User ID &nbsp;&#10150;&nbsp; {{ user_id }}</b>
      </li>
      <li>
        <button id="logout" @click="logOut">Log out</button>
      </li>
    </ul>
    <h1 class="txt-c">Welcome to our digital library</h1>
  </div>
</template>