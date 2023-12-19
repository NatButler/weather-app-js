import axios from 'axios';

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const responseBody = (repsonse) => repsonse.data;

const requests = {
  get: (url) => apiClient.get(url).then(responseBody),
};

const agent = {
  requests,
};

export default agent;
