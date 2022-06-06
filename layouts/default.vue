<template>
  <v-app>
    <v-main>
      <v-container>
        <NuxtLink to="/">Inicial</NuxtLink>
        <NuxtLink to="/inspire">Inspire</NuxtLink>
        <NuxtLink to="/auth/login">Perfil</NuxtLink>
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
