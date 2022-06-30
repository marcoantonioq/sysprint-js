<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <NuxtLink to="/">Inicial</NuxtLink>
          <NuxtLink to="/charts">Charts</NuxtLink>
          <NuxtLink to="/auth/login">Perfil</NuxtLink>
        </v-row>
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
