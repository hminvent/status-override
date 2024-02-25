<template>
  <main class="profile-main">
    <header class="profile-header">
      <q-toolbar class="flex justify-between">
        <img src="/status-override/images/ndf-logo.png" alt="logo" />
      </q-toolbar>
    </header>

    <q-card class="profile-card relative-position q-py-lg q-px-md">
      <q-card-section
        class="profile-section absolute-top flex column q-pa-none"
      >
        <div
          v-if="profilePicture"
          class="profile-image-wrapper flex flex-center"
        >
          <q-img
            :style="imageStyle"
            :src="profilePicture"
            alt="profile-image"
          />
        </div>
        <div class="profile-desc q-mt-md flex column flex-center">
          <span class="text-h5 text-black q-mt-sm">
            {{ fullName }}
          </span>
          <span class="text-body1 q-mt-sm">
            {{ title }}
          </span>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-none absolute-right">
        <q-toggle class="toggle-status" v-model="toggleValue" />
      </q-card-section>

      <q-card-section class="status-card q-pa-none">
        <p class="q-ma-none q-mb-md">My Status</p>

        <q-tabs
          v-model="currentStatus"
          indicator-color="transparent"
          :active-bg-color="activeColor"
          class="status-tabs text-black"
        >
          <q-tab
            v-for="status in AllStatus"
            :key="status.id"
            :name="status.id"
            :icon="statusIcon(status.id)"
            :label="$t(`app.${status.name}`)"
            :disable="toggleValue"
            no-caps
          />
        </q-tabs>
      </q-card-section>

      <q-card-actions vertical align="center">
        <q-btn
          class="change-btn text-white bg-primary text-h5"
          @click="handleChange"
          label="Change"
          :disable="toggleValue"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </main>
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
import { useAuthStore } from 'src/modules/auth/store';
import { storeToRefs } from 'pinia';
import { notify } from 'src/boot/plugins/notify';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import storage from 'src/services/storage';

const router = useRouter();
const { t } = useI18n();

const authStore = useAuthStore();
const { signIn, getProfile } = authStore;

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
    width: '227px',
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

  return `img:/status-override/images/icons/${statusIconMapping[statusId]}`;
};

const handleChange = () => {
  if (currentStatus.value) {
    updateManagerProfileStatusByEmail(profileId.value, currentStatus.value);
  } else {
    notify('error', t('app.choose'));
  }
};

const handleAutoLogin = async () => {
  const { query } = router.currentRoute.value;

  if (Object.keys(query).length > 0) {
    const { code, state } = query;
    if (code && state) {
      const signInResponse = await signIn({ code, state });
      if (signInResponse) {
        const profileResponse = await getProfile();
        if (profileResponse) {
          const email = storage.getProfile().email;
          await getManagerProfileByEmail(email);
        }
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  } else {
    const email = storage.getProfile().email;
    await getManagerProfileByEmail(email);
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
  handleAutoLogin();
});
</script>

<style lang="scss">
@import 'src/css/profile.scss';
</style>
