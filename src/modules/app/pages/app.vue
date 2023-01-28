<template>
  <q-layout class="profile-layout" view="lhh LpR lff">
    <q-header reveal class="profile-header">
      <q-toolbar class="q-mt-lg q-ml-lg q-mb-md">
        <img src="/images/mersvo-logo.png" />
      </q-toolbar>
      <div class="profile-container">
        <div class="profile-img-wrapper flex flex-center">
          <img :src="managerProfile.attachment.filePath" alt="" />
        </div>
      </div>
    </q-header>

    <q-page-container>
      <q-page class="login-card-wrapper min-height-auto">
        <q-card flat class="status-card">
          <q-btn-toggle
            v-model="tab"
            toggle-color="primary"
            :options="[
              { label: 'One', value: 1 },
              { label: 'Two', value: 2 },
              { label: 'Three', value: 3 },
            ]"
          />
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '../store';
import { storeToRefs } from 'pinia';

const tab = ref(1);

const appStore = useAppStore();
const { managerProfile, managerStatus } = storeToRefs(appStore);
const { getManagerProfileByEmail } = appStore;

onMounted(() => {
  getManagerProfileByEmail('asherif@mersvo.com');
});
</script>

<style lang="scss">
@import 'src/css/profile.scss';
</style>
