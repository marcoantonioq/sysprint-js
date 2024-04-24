<template>
  <q-page padding>
    <!-- content -->
    <div class="q-pa-md">
      <div class="text-h4">Login</div>

      <q-form @submit.prevent="handleSubmit">
        <q-input
          v-model="auth.username"
          label="Usuário"
          type="text"
          required
          autofocus
        />
        <q-input
          v-model="auth.password"
          label="Senha"
          type="password"
          required
        />

        <div class="q-mt-md">
          <q-checkbox v-model="rememberMe" label="Lembre de mim" />
        </div>
        <q-btn type="submit" label="Login" color="primary" />
      </q-form>

      <div class="text-center q-mt-md">
        <a href="#">Esqueceu sua senha?</a>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { login } from 'src/boot/socket';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = reactive({
  username: localStorage.getItem('username') || '',
  password: '',
});

const rememberMe = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  try {
    await login(auth);
    if (rememberMe.value) {
      localStorage.setItem('username', auth.username);
    } else {
      localStorage.removeItem('username');
    }
    router.push('/app');
  } catch (error) {
    console.log('Erro ao logar: ', error);
  }
};
</script>
