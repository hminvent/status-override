<template>
  <main class="row justify-center items-center window-height">
    <div class="col col-xs-12 col-sm-6 col-md-4">
      <div class="row q-mb-xl">
        <q-img
          class="col-xs-4 col-sm-6 col-md-12"
          src="/status-override/images/ndf-logo.png"
        />
      </div>
      <q-form class="q-px-xs-sm q-px-sm-none">
        <div class="q-mb-md">
          <span class="text-h5">welcome back</span>
        </div>
        <div class="q-mb-lg">
          <span class="text-h4 text-primary text-uppercase">Login</span>
        </div>
        <div>
          <q-input
            outlined
            v-model="loginForm.email"
            type="email"
            label-slot
            class="q-mb-lg"
          >
            <template #label>
              <span class="text-caption">Email</span>
            </template>
          </q-input>
        </div>
        <div class="q-mb-md">
          <q-input
            outlined
            v-model="loginForm.password"
            :type="isPwd ? 'password' : 'text'"
            label-slot
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
        </div>
        <div>
          <q-btn
            no-caps
            class="full-width"
            color="primary"
            label="Login"
            @click="submit"
          />
        </div>
      </q-form>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../store';
import { NDF_SSO_URL, MERSVO_SSO_URL } from 'src/services/static-lookups';

const authStore = useAuthStore();
const { getToken /*ssoLogin*/ } = authStore;

const loginForm = reactive({
  email: '',
  password: '',
});

const isPwd = ref(true);

const submit = async () => {
  const { email, password } = loginForm;
  if (email && password) {
    await getToken({ email, password });
  }
  // window.location.href = NDF_SSO_URL;
};
</script>
<style lang="scss">
@import 'src/css/login.scss';
</style>
