<script setup>

import { ref, provide } from 'vue';
import { useRouter, RouterView } from 'vue-router';// useRoute, 
import { getCookies, setCookies, eraseCookies } from './helpers/functions.js';
import { URL, AuthSymbol } from './helpers/constants.js';

const [tokenInUse, currentUser] = getCookies();
const token = ref(tokenInUse);
const user_id = ref(+currentUser);
const error = ref(null);
const router = useRouter();

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token.value) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.path ==='/login' && token.value) {
    next({
        path: from?.path ?? '/',
      })
  } else {
    next()
  }
});


const logInAs = async (data) => {
  try {
    const response = await fetch(`${URL}/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (response.ok) {
      setCookies(json);
      token.value = json.token;
      user_id.value = json.user_id;
      router.push('/');
      return;
    }
    throw new Error(
      json.non_field_errors?.join('\n') ||
      'Authentication request failed: ' + response.statusText,
    );
  } catch (err) {
    error.value = err;
  }
};

const logOut = () => {
  eraseCookies();
  user_id.value = 0;
  token.value = '';
  router.push('/login');
};

provide(AuthSymbol, {token, user_id, logInAs, logOut, error});

</script>

<template>
  <RouterView />
</template>
