import configureStore from './store/configureStore';
import { assignBugToUser, loadBugs } from './store/bugs';

const store = configureStore();

store.dispatch(loadBugs());
store.addBug({ description: 'New Bug' });

setTimeout(() => store.dispatch(assignBugToUser(1, 1)), 2000);
