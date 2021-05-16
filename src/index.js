import configureStore from './store/configureStore';

const store = configureStore();

store.dispatch({
  type: 'apiRequestBegan',
  payload: {
    url: '/bugs',
    onSuccess: 'bugsReceived',
    onError: 'apiRequestFailed',
  },
});
