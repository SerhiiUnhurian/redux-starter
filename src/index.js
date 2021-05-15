import configureStore from './store/configureStore';
import { projectAdded } from './store/projects';
import {
  bugAdded,
  bugRemoved,
  bugResolved,
  getUnresolvedBugs,
} from './store/bugs';

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  console.log('Store changed', store.getState());
});

store.dispatch(projectAdded({ name: 'Project 1' }));

store.dispatch(bugAdded({ description: 'Bug 1' }));
store.dispatch(bugAdded({ description: 'Bug 2' }));
store.dispatch(bugAdded({ description: 'Bug 3' }));
store.dispatch(bugResolved({ id: 1 }));
store.dispatch(bugRemoved({ id: 3 }));

const x = getUnresolvedBugs(store.getState());
const y = getUnresolvedBugs(store.getState());

console.log(x === y); // Get the same array
