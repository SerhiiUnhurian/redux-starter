// import store from './customeStore';
import store from './store';
import * as actions from './actions';

const unsubscribe = store.subscribe(() => {
  console.log('Store changed', store.getState());
});

store.dispatch(actions.bugAdded('Bug 1'));
store.dispatch(actions.bugAdded('Bug 2'));
store.dispatch(actions.bugAdded('Bug 3'));
store.dispatch(actions.bugResolved(1));
unsubscribe();

store.dispatch(actions.bugRemoved(3));
