<template>
  <q-layout class="profile-layout" view="lhh LpR lff">
    <header class="profile-header">
      <q-toolbar class="header-toolbar flex justify-between q-ml-sm">
        <img
          class="q-mt-md"
          src="/statusOverride/images/ndf-logo.png"
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
import {
  colorNames,
  shadowValues,
  iconNames,
} from 'src/services/static-lookups';
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

const statusIds = computed(() => AllStatus.value?.map((status) => status.id));

const imageStyle = computed(() => {
  const statusColors = statusIds.value?.reduce((colors, id, index) => {
    colors[id] = colorNames[index] || ''; // Assign color name based on index, or empty string if index exceeds available color names
    return colors;
  }, {});

  const imageShadows = statusIds.value?.reduce((shadows, id, index) => {
    shadows[id] = shadowValues[index] || ''; // Assign shadow value based on index, or empty string if index exceeds available shadow values
    return shadows;
  }, {});

  const activePrimaryShadow = getCssVar(
    statusColors?.[currentStatus.value] ?? 'dark'
  );

  const activeSecondaryShadow =
    imageShadows?.[currentStatus.value] ?? 'transparent';

  return {
    borderRadius: '50%',
    width: '50%',
    aspectRatio: '1',
    objectFit: 'cover',
    boxShadow: `0 0 0 4px ${activePrimaryShadow}, 0 0 0 15px ${activeSecondaryShadow}`,
  };
});

const activeColor = computed(() => {
  const statusColors = statusIds.value?.reduce((colors, id, index) => {
    colors[id] = colorNames[index] || ''; // Assign color name based on index, or empty string if index exceeds available color names
    return colors;
  }, {});

  return statusColors?.[currentStatus.value];
});

const statusIcon = (statusId) => {
  const statusIconMapping = statusIds.value?.reduce((result, id, index) => {
    result[id] = iconNames[index] || ''; // Assign file name based on index, or empty string if index exceeds available icon names
    return result;
  }, {});

  return `img:/statusOverride/images/icons/${statusIconMapping[statusId]}`;
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
