<template>
  <q-layout class="app-layout" view="lhh LpR lff">
    <q-card flat class="profile-card">
      <q-img
        width="462px"
        height="539px"
        src="https://cdn.quasar.dev/img/mountains.jpg"
      />
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>
      <q-card-section>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </q-card-section>
    </q-card>
    <!-- <header class="profile-header">
      <q-toolbar class="header-toolbar flex justify-between q-ml-sm">
        <img
          class="q-mt-md"
          src="/status-override/images/ndf-logo.png"
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
    </header> -->
    <q-page-container>
      <q-page class="min-height-auto">
        <q-card flat class="status-card">
          <q-card-section class="row items-center q-pa-none q-mb-xl">
            <q-toggle size="90px" class="toggle-status" v-model="toggleValue" />
            <span class="status-primary-text text-weight-medium"
              >تغيير الحالة يدوياً</span
            >
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-tabs
              v-model="currentStatus"
              indicator-color="transparent"
              :active-bg-color="activeColor"
              active-class="status-active"
              class="status-tabs text-black"
            >
              <q-tab
                v-for="status in AllStatus"
                :key="status.id"
                :name="status.id"
                :disable="!toggleValue"
                @click="handleStatusChange"
                no-caps
              >
                <q-icon size="56px" :name="statusIcon(status.id)" />
                <span class="q-tab__label">{{ status.name_Ar }}</span>
              </q-tab>
            </q-tabs>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {
  colorNames,
  // shadowValues,
  iconNames,
} from 'src/services/static-lookups';
// import { getCssVar } from 'quasar';
import { useAppStore } from '../store';
import { storeToRefs } from 'pinia';
import { notify } from 'src/boot/plugins/notify';
import { useI18n } from 'vue-i18n';
import storage from 'src/services/storage';

const { t } = useI18n();

const appStore = useAppStore();
const {
  getManagerProfileByEmail,
  updateManagerProfileStatusByEmail,
  updateGetProfileStatusFromExchange,
} = appStore;

const profileId = ref(null);
const fullName = ref(null);
const title = ref(null);
const profilePicture = ref(null);
const currentStatus = ref(null);
const toggleValue = ref(null);
const AllStatus = ref(null);

const statusIds = computed(() => AllStatus.value?.map((status) => status.id));

const activeColor = computed(() => {
  const statusColors = statusIds.value?.reduce((colors, id, index) => {
    // Assign color name based on index, or empty string if index exceeds available color names
    colors[id] = colorNames[index] || '';
    return colors;
  }, {});

  return statusColors?.[currentStatus.value];
});

const statusIcon = (statusId) => {
  const statusIconMapping = statusIds.value?.reduce((result, id, index) => {
    // Assign file name based on index, or empty string if index exceeds available icon names
    result[id] = iconNames[index] || '';
    return result;
  }, {});

  return `img:/status-override/images/icons/${statusIconMapping[statusId]}`;
};

const handleStatusChange = () => {
  updateManagerProfileStatusByEmail(profileId.value, currentStatus.value);
};

watch(
  () => toggleValue.value,
  () => {
    updateGetProfileStatusFromExchange(profileId.value, toggleValue.value);
  }
);

const setProfileValues = () => {
  const email = storage.getProfile().email;
  getManagerProfileByEmail(email).then((response) => {
    if (response) {
      const { employee, statusObject, employeeCurrentStatus } = response;
      profileId.value = employee?.id;
      fullName.value = employee?.fullName;
      title.value = employee?.title;
      profilePicture.value = employee?.attachment?.filePath;
      toggleValue.value = employee?.getProfileStatusFromExchange;
      currentStatus.value = employeeCurrentStatus?.id;
      AllStatus.value = statusObject.filter((status) => !status.dimmed);
    }
  });
};

onMounted(() => {
  setProfileValues();
});
</script>

<style lang="scss">
@import 'src/css/profile.scss';
</style>
