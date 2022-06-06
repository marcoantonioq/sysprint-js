<template>
  <div>
    <h1>Welcome to user profile</h1>
    <pre style="word-break: break-all; white-space: pre-wrap">
      Token: {{ _token }}
    </pre>
    <hr />
    <pre style="word-break: break-all; white-space: pre-wrap">
      User: {{ _user }}
      Data: {{ data }}
    </pre>
    <button @click="fetchSomething()">Update</button>
  </div>
</template>

<script>
export default {
  name: 'IndexProfiles',
  middleware: 'protected',
  data() {
    return {
      data: null,
    };
  },
  methods: {
    async fetchSomething() {
      const data = await this.$axios.$get('/api/users/user');
      const token = this.$cookies.get('token');

      // eslint-disable-next-line no-console
      console.log('token', token);
      // eslint-disable-next-line no-console
      console.log('dasta', data);
    },
  },
};
</script>
