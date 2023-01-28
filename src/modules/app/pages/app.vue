<template>
  <q-layout class="profile-layout" view="lhh LpR lff">
    <header class="profile-header">
      <q-toolbar class="flex justify-between q-ml-sm q-mb-md">
        <img
          class="q-mt-md"
          src="/images/mersvo-logo.png"
          width="91"
          height="40"
          alt="logo"
        />
        <q-toggle class="toggle-status" v-model="toggleStatus" />
      </q-toolbar>
      <div class="profile-container">
        <div class="profile-img-wrapper flex flex-center">
          <img
            :style="imageStyle"
            :src="managerProfilePicture"
            alt="profile-image"
          />
        </div>
        <div class="text-center q-mt-md flex column">
          <span class="text-black text-h5 q-mt-sm">
            {{ managerFullName }}
          </span>
          <span class="profile-work text-body1 q-mt-sm">
            {{ managerTitle }}
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
                v-model="mangerActiveStatus"
                indicator-color="transparent"
                :active-bg-color="activeColor"
                class="status-tabs text-black q-px-md"
              >
                <q-tab
                  v-for="status in managerStatus"
                  :key="status.id"
                  :name="status.id"
                  :icon="statusIcon(status.id)"
                  :label="status.name"
                  :disable="toggleStatus"
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
              :disable="toggleStatus"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getCssVar } from 'quasar';
import { useAppStore } from '../store';
import { storeToRefs } from 'pinia';
import { notify } from 'src/boot/plugins/notify';

const appStore = useAppStore();
const {
  managerProfileId,
  managerFullName,
  managerTitle,
  managerProfilePicture,
  mangerActiveStatus,
  managerStatus,
} = storeToRefs(appStore);
const {
  getManagerProfileByEmail,
  updateManagerProfileStatusByEmail,
  updateGetProfileStatusFromExchange,
} = appStore;

const toggleStatus = ref(false);

const colors = {
  1: 'primary',
  2: 'accent',
  3: 'secondary',
  4: 'dark',
};

const imageShadows = {
  1: 'rgba(97, 244, 170, 0.2)',
  2: 'rgba(227, 84, 84, 0.2)',
  3: 'rgba(246, 196, 77, 0.2)',
  4: 'rgba(109, 109, 109, 0.2)',
};

const imageStyle = computed(() => {
  const activePrimaryShadow = getCssVar(colors[mangerActiveStatus.value ?? 4]);
  const activeSecondaryShadow =
    imageShadows[mangerActiveStatus.value] ?? 'transparent';

  return {
    borderRadius: '50%',
    width: '50%',
    boxShadow: `0 0 0 4px ${activePrimaryShadow}, 0 0 0 15px ${activeSecondaryShadow}`,
  };
});

const activeColor = computed(() => {
  return colors[mangerActiveStatus.value];
});

const statusIcon = (statusId) => {
  const obj = {
    1: 'fluent_door-arrow-left.svg',
    2: 'loading.svg',
    3: 'businessmen.svg',
    4: 'sun-umbrella.svg',
  };

  return `img:/images/icons/${obj[statusId]}`;
};

const handleChange = () => {
  if (mangerActiveStatus.value) {
    updateManagerProfileStatusByEmail(
      managerProfileId.value,
      mangerActiveStatus.value
    );
  } else {
    notify('error', 'please choose a status first');
  }
};

watch(
  () => toggleStatus.value,
  (val) => {
    if (val) {
      mangerActiveStatus.value = null;
    }
    updateGetProfileStatusFromExchange(
      managerProfileId.value,
      toggleStatus.value
    );
  }
);

onMounted(() => {
  getManagerProfileByEmail('asherif@mersvo.com');
});
</script>

<style lang="scss">
@import 'src/css/profile.scss';
</style>
