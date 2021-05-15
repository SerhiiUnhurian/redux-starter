import configureStore from './store/configureStore';

const store = configureStore();

store.dispatch({
  type: 'error',
  payload: {
    message: 'An error occurred',
  },
});

store.dispatch((dispatch, getState) => {
  // Call an API if the data is abscent in the store
  // When the promise is resolved -> dispatch(...)
  dispatch({ type: 'bugReceived', bugs: [1, 2, 3] });
  // If the promise rejected -> dispatch(...)
});
