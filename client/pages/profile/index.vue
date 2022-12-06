<template>
  <div>
    <h1>Perfil</h1>
    <hr />
    Usuário: {{ _user.username }}
    <br />
    Data: {{ data }}
    <small style="word-break: break-all; white-space: pre-wrap">
      Token: {{ _token }}
    </small>
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
  methods: {},
};
</script>
