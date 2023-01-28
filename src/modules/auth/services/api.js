import { api } from 'src/boot/axios';

export default {
  login: (email, password) =>
    api.get(`Account/ValidatewithAD?email=${email}&password=${password}`),
};
