<template>
  <v-app>
    <v-main>
      <v-container>
        <NuxtLink to="/">Inicial</NuxtLink>
        <NuxtLink to="/login">Login</NuxtLink>
        <NuxtLink to="/secure">Perfil</NuxtLink>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'Sysprint',
    };
  },
};
</script>
