<template>
  <main class="app-layout">
    <q-card flat class="profile-card">
      <q-card-section
        :class="[$q.screen.gt.lg ? 'row' : 'row no-wrap']"
        class="items-center q-pa-none"
      >
        <q-card-section
          :class="[$q.screen.gt.lg ? '' : 'q-pr-lg']"
          class="q-pa-none profile-card-img-wrapper"
        >
          <q-img
            class="profile-card-img"
            src="/status-override/images/minister-photo.png"
          />
        </q-card-section>

        <q-card-section class="profile-card-description q-pa-none">
          <h1 class="profile-card-title text-weight-bold">
            سلمان بن يوسف الدوسري
          </h1>

          <p class="profile-card-subtitle text-weight-medium">وزير الإعلام</p>

          <q-badge class="profile-card-badge justify-center">
            <span
              :class="[$q.screen.gt.lg ? 'text-h4' : 'text-h5']"
              class="profile-card-badge-text text-black text-weight-medium"
              >مكتب : CS3
            </span>
          </q-badge>
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-card flat class="status-card">
      <q-card-section
        :class="[$q.screen.gt.lg ? 'q-mb-xl' : 'q-mb-sm']"
        class="row items-center q-pa-none"
      >
        <Toggle
          v-model="toggleValue"
          class="status-toggle q-mr-md"
          @change="handleToggleChange"
        />
        <h4 class="status-primary-text text-weight-medium">تغيير الحالة</h4>
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
            <q-icon
              :size="$q.screen.gt.lg ? '55px' : '40px'"
              :name="statusIcon(status.id)"
            />
            <span class="q-tab__label">{{ status.name_Ar }}</span>
          </q-tab>
        </q-tabs>
      </q-card-section>
    </q-card>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { colorNames, iconNames } from 'src/services/static-lookups';
import { useAppStore } from '../store';
import { useAuthStore } from 'src/modules/auth/store';
import { useRouter } from 'vue-router';
import Toggle from '@vueform/toggle';
import storage from 'src/services/storage';

const router = useRouter();

const authStore = useAuthStore();
const { login, getProfile } = authStore;

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
const toggleValue = ref(false);
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

const handleToggleChange = () => {
  if (profileId.value !== null) {
    updateGetProfileStatusFromExchange(profileId.value, toggleValue.value);
  }
};

const setProfileValues = async () => {
  const email = storage.getProfile().email;
  const managerProfile = await getManagerProfileByEmail(email);
  if (managerProfile) {
    const { employee, statusObject, employeeCurrentStatus } = managerProfile;
    profileId.value = employee?.id;
    fullName.value = employee?.fullName;
    title.value = employee?.title;
    profilePicture.value = employee?.attachment?.filePath;
    toggleValue.value = !employee?.getProfileStatusFromExchange;
    currentStatus.value = employeeCurrentStatus?.id;
    AllStatus.value = statusObject.filter((status) => !status.dimmed);
  }
};

const handleAutoLogin = async () => {
  const { query } = router.currentRoute.value;
  if (Object.keys(query).length > 0) {
    for (const key in query) {
      const decrypted = window.atob(key);
      const email = decrypted?.split('&')[0]?.slice(6);
      const password = decrypted?.split('&')[1]?.slice(9);
      if (email && password) {
        const loginResponse = await login({ email, password });
        if (loginResponse) {
          const profileResponse = await getProfile();
          if (profileResponse) {
            setProfileValues();
          }
        } else {
          router.push('/auth/login');
        }
      } else {
        router.push('/auth/login');
      }
    }
  } else {
    setProfileValues();
  }
};

onMounted(() => {
  handleAutoLogin();
});
</script>

<style lang="scss">
@import '@vueform/toggle/themes/default.css';
@import 'src/css/profile.scss';
</style>
