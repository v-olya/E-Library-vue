import { ref, watchEffect } from 'vue';
import { getURL } from '../helpers/functions.js';

export function useFetchToGETdata(token, url, cacheable, order, query) {
  const data = ref([]);
  const error = ref(null);
  const loaded = ref(false);

  const fetchData = async (token, url, cacheable, order, query, signal) => {
    let res = { status: 'Error' };
    try {
      res = await fetch(getURL(url, order, query), {
        signal,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (res && !res.ok) {
        throw new Error(res.statusText);
      }
      const json = await res.json();
      if (json && !Array.isArray(json)) {
        throw new Error('Server has not returned the list of items');
      }
      data.value = json;
      if (cacheable) {
        sessionStorage.setItem(url, JSON.stringify(json));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('Request aborted');
      } else {
        error.value = { ...err, message: `Status ${res.status}: ${err.message}` };
      }
    } finally {
      loaded.value = true;
    }
  };

  watchEffect((onCleanup) => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (cacheable) {
      const cache = sessionStorage.getItem(url);
      if (cache) {
        data.value = JSON.parse(cache);
        loaded.value = true;
      } else {
        fetchData(token, url, cacheable, order, query, signal);
      }
    } else {
      if (new URL(url).pathname === '/api/books/') {
        sessionStorage.removeItem(url);
      }
      fetchData(token, url, cacheable, order, query, signal);
    }

    onCleanup(() => {
      controller.abort();
      error.value = null;
      loaded.value = false;
      data.value = [];
    });
  });

  return { data, error, loaded };
}