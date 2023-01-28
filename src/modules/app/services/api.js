import { api } from 'src/boot/axios';

export default {
  getManagerProfileByEmail: (email) =>
    api.get(`ProfileStatus/${email}/GetManagerProfileByEmail`),
  updateManagerProfileStatusByEmail: (profileId, status) =>
    api.post(
      `ProfileStatus/${profileId}/UpdateManagerProfileStatusByEmail?status=${status}`
    ),
  updateGetProfileStatusFromExchange: (profileId, toggleValue) =>
    api.post(
      `${profileId}/UpdateGetProfileStatusFromExchange?GetProfileStatusFromExchange=${toggleValue}`
    ),
};
