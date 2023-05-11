<template>
  <q-layout class="profile-layout" view="lhh LpR lff">
    <header class="profile-header">
      <q-toolbar class="header-toolbar flex justify-between q-ml-sm">
        <img
          class="q-mt-md"
          src="/nameplate/images/mersvo-logo.png"
          width="91"
          height="40"
          alt="logo"
        />
        <q-toggle class="toggle-status" v-model="toggleValue" />
      </q-toolbar>
      <div class="profile-container flex column">
        <div class="profile-img-wrapper flex flex-center">
          <img :style="imageStyle" :src="profilePicture" alt="profile-image" />
        </div>
        <div class="text-center q-mt-md flex column">
          <span class="text-black text-h5 q-mt-sm">
            {{ fullName }}
          </span>
          <span class="profile-work text-body1 q-mt-sm">
            {{ title }}
          </span>
        </div>
      </div>
    </header>
    <q-page-container>
      <q-page class="min-height-auto q-mt-xl">
        <q-card flat class="status-card q-py-lg">
          <q-card-section>
            <p class="q-ml-lg">My Status</p>
            <div>
              <q-tabs
                v-model="currentStatus"
                indicator-color="transparent"
                :active-bg-color="activeColor"
                class="status-tabs text-black q-px-md"
              >
                <q-tab
                  v-for="status in AllStatus"
                  :key="status.id"
                  :name="status.id"
                  :icon="statusIcon(status.id)"
                  :label="status.name"
                  :disable="toggleValue"
                  no-caps
                />
              </q-tabs>
            </div>
          </q-card-section>

          <q-card-actions vertical align="center">
            <q-btn
              rounded
              class="change-btn text-white"
              @click="handleChange"
              label="Change"
              :disable="toggleValue"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { colors, imageShadows } from 'src/services/static-lookups';
import { getCssVar } from 'quasar';
import { useAppStore } from '../store';
import { storeToRefs } from 'pinia';
import { notify } from 'src/boot/plugins/notify';
import { useI18n } from 'vue-i18n';
import storage from 'src/services/storage';

const { t } = useI18n();

const appStore = useAppStore();
const {
  profileId,
  fullName,
  title,
  profilePicture,
  currentStatus,
  toggleValue,
  AllStatus,
} = storeToRefs(appStore);
const {
  getManagerProfileByEmail,
  updateManagerProfileStatusByEmail,
  updateGetProfileStatusFromExchange,
} = appStore;

const imageStyle = computed(() => {
  const activePrimaryShadow = getCssVar(colors[currentStatus.value ?? 4]);
  const activeSecondaryShadow =
    imageShadows[currentStatus.value] ?? 'transparent';

  return {
    borderRadius: '50%',
    width: '50%',
    aspectRatio: '1',
    objectFit: 'cover',
    boxShadow: `0 0 0 4px ${activePrimaryShadow}, 0 0 0 15px ${activeSecondaryShadow}`,
  };
});

const activeColor = computed(() => {
  return colors[currentStatus.value];
});

const statusIcon = (statusId) => {
  const obj = {
    1: 'fluent_door-arrow-left.svg',
    2: 'loading.svg',
    3: 'businessmen.svg',
    4: 'sun-umbrella.svg',
  };

  return `img:/nameplate/images/icons/${obj[statusId]}`;
};

const handleChange = () => {
  if (currentStatus.value) {
    updateManagerProfileStatusByEmail(profileId.value, currentStatus.value);
  } else {
    notify('error', t('app.choose'));
  }
};

watch(
  () => toggleValue.value,
  (val) => {
    if (val) {
      currentStatus.value = null;
    }
    updateGetProfileStatusFromExchange(profileId.value, toggleValue.value);
  }
);

onMounted(() => {
  const email = storage.getProfile().email;
  getManagerProfileByEmail(email);
});
</script>

<style lang="scss">
@import 'src/css/profile.scss';
</style>
