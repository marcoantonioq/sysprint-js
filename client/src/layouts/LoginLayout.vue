<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page>
        <OffLineComponent />
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import OffLineComponent from 'src/components/OffLineComponent.vue';
</script>
