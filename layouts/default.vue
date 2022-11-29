<template>
  <v-app>
    <section class="grid">
      <div>
        <v-main>
          <v-container>
            <Nuxt />
          </v-container>
        </v-main>
      </div>
      <div>
        <v-bottom-navigation v-model="value" app :background-color="color" dark>
          <NuxtLink to="/printers">
            <v-btn value="Inicial" height="100%" :color="color">
              <span>Inicial</span>
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </NuxtLink>

          <!-- <NuxtLink to="/reports">
            <v-btn value="Relatórios" height="100%" :color="color">
              <span>Relatórios</span>
              <v-icon>mdi-chart-bar</v-icon>
            </v-btn>
          </NuxtLink>

          <NuxtLink to="/auth/login">
            <v-btn value="Perfil" height="100%" :color="color">
              <span>Perfil</span>
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </NuxtLink> -->
        </v-bottom-navigation>
      </div>
    </section>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    value: '',
    color: 'green',
  }),
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>

    <style>
body,
html {
  height: 100vh;
  overflow: hidden;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/* Grid */
.grid {
  display: grid;
  grid-template-rows: auto 56px;
  height: 100vh;
}

.grid > div:first-child {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100vw;
}
.grid > div:last-child {
  overflow: hidden;
}

a.nuxt-link-active {
  font-weight: bold;
}
/* exact link will show the primary color for only the exact matching link */
a.nuxt-link-exact-active {
  color: #ffffff;
}
.v-bottom-navigation a,
.v-bottom-navigation a:visited {
  text-decoration: none;
  color: inherit;
}

a:hover {
  color: #ffffff;
}

@media (max-width: 1200px) {
  body {
    font-size: 1em;
  }
}
@media (max-width: 468px) {
  body {
    font-size: 0.9em;
  }
}
</style>