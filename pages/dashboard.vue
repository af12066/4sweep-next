<template>
  <div>
    <h1>Login Completed!</h1>
    <p>{{ $auth.$storage.getLocalStorage('_token.social') }}</p>
  </div>
</template>

<script>
import * as type from '../store/action-types';

export default {
  created() {
    this.$store.dispatch(type.FETCH_SELF_USER_DATA);
  },
};
</script>

