import { api } from 'src/boot/axios';

export default {
  getManagerProfileByEmail: (email) =>
    api.get(`ProfileStatus/${email}/GetManagerProfileByEmail`),
};
