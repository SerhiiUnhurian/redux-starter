import configureStore from './store/configureStore';
import { userAdded } from './store/users';
import { projectAdded } from './store/projects';
import {
  bugAdded,
  bugRemoved,
  bugResolved,
  bugAssignedToUser,
  getUnresolvedBugs,
  getBugsByUser,
} from './store/bugs';

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  console.log('Store changed', store.getState());
});

store.dispatch(userAdded({ name: 'John' }));
store.dispatch(projectAdded({ name: 'Project 1' }));

store.dispatch(bugAdded({ description: 'Bug 1' }));
store.dispatch(bugAdded({ description: 'Bug 2' }));
store.dispatch(bugAdded({ description: 'Bug 3' }));
store.dispatch(bugAssignedToUser({ bugId: 1, userId: 1 }));
store.dispatch(bugAssignedToUser({ bugId: 2, userId: 1 }));
store.dispatch(bugResolved({ id: 1 }));
store.dispatch(bugRemoved({ id: 3 }));

const x = getUnresolvedBugs(store.getState());
const y = getUnresolvedBugs(store.getState());
console.log(x === y); // Get the same array

const bugs = getBugsByUser(1)(store.getState());
console.log(bugs);
