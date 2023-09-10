<template>
  <div class="row flex-center window-height login-wrapper">
    <div class="col col-md-6 col-xs-12">
      <div>
        <q-img
          class="logo-img q-mb-xl"
          src="/images/mom-logo.svg"
          spinner-color="white"
        />
        <div class="text-h4 q-mb-xs">
          {{ $t('auth.welcome') }}
        </div>
        <div class="text-body1 text-grey-6 q-mb-xl">
          {{ $t('auth.loginMessage') }}
        </div>
        <q-form @submit.prevent="onSubmit">
          <q-input
            outlined
            v-model="loginForm.email"
            type="email"
            class="q-mb-sm"
            :label="$t('auth.email')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            outlined
            v-model="loginForm.password"
            :type="isPwd ? 'password' : 'text'"
            class="q-mb-sm"
            :label="$t('auth.password')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="row">
            <q-btn
              type="submit"
              class="full-width flex flex-center"
              color="primary"
              :label="$t('auth.login')"
            />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../store';

const authStore = useAuthStore();
const { login } = authStore;

const loginForm = reactive({
  email: '',
  password: '',
});

const isRemember = ref(false);
const isPwd = ref(true);

const onSubmit = async () => {
  const { email, password } = loginForm;
  await login({ email, password });
};
</script>
<style lang="scss">
@import 'src/css/login.scss';
</style>
