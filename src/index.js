import configureStore from './store/configureStore';
import { loadBugs, addBug } from './store/bugs';

const store = configureStore();

store.dispatch(addBug({ description: 'New bug' }));
store.dispatch(loadBugs());

setTimeout(() => store.dispatch(loadBugs()), 2000);
