import reducer from './reducer';

export function createStore(reducer) {
  let state;
  let subscribers = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    notifySubscribers();
  }

  function subscribe(func) {
    function unsubscribe() {
      const index = subscribers.indexOf(func);
      subscribers = [
        ...subscribers.slice(0, index),
        ...subscribers.slice(index + 1),
      ];
    }

    subscribers.push(func);
    return unsubscribe;
  }

  function notifySubscribers() {
    subscribers.forEach(fn => fn());
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default createStore(reducer);
