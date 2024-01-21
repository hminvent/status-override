<template>
  <q-layout class="login-layout" view="lhh LpR lff">
    <q-header reveal class="login-header">
      <q-toolbar class="q-mt-lg q-mb-md">
        <img class="q-ml-auto" src="/status-override/images/ndf-logo.png" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="login-card-wrapper min-height-auto">
        <q-card flat class="login-card q-py-xl">
          <q-form>
            <q-card-section>
              <div class="text-h6">welcome back</div>
              <div class="text-login text-h5 text-uppercase text-weight-bold">
                Login
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                outlined
                v-model="loginForm.email"
                type="email"
                :label-slot="true"
                class="q-mb-lg"
              >
                <template #label>
                  <span class="text-caption">Email</span>
                </template>
              </q-input>
              <q-input
                outlined
                v-model="loginForm.password"
                :type="isPwd ? 'password' : 'text'"
                :label-slot="true"
              >
                <template #label>
                  <span class="text-caption">Password</span>
                </template>
                <template v-slot:append>
                  <q-icon
                    size="xs"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section>
              <span>forget Password?</span>
            </q-card-section>
            <q-card-section>
              <q-btn
                rounded
                class="full-width submit-btn"
                color="primary"
                label="Login"
                @click="submit"
              />
            </q-card-section>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../store';

const authStore = useAuthStore();
const { ssoLogin } = authStore;

const loginForm = reactive({
  email: '',
  password: '',
});

const isPwd = ref(true);

const submit = async () => {
  const { email, password } = loginForm;

  if (email && password) {
    await ssoLogin({ email, password });
  }
};
</script>
<style lang="scss">
@import 'src/css/login.scss';
</style>
