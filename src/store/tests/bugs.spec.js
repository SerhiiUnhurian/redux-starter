import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  addBug,
  assignBugToUser,
  getBugsByUser,
  getUnresolvedBugs,
  loadBugs,
  resolveBug,
} from '../bugs';
import configureStore from '../configureStore';

describe('bugsSlice', () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  describe('actions', () => {
    describe('addBug action', () => {
      it('should add bug to the store if it is saved to the server', async () => {
        // Arrange
        const bug = { description: 'a' };
        const savedBug = { ...bug, id: 1 };
        fakeAxios.onPost('/bugs').reply(200, savedBug);

        // Act
        await store.dispatch(addBug(bug));

        // Assert
        expect(bugsSlice().list).toContainEqual(savedBug);
      });

      it('should not add bug to the store if it is not saved to the server', async () => {
        const bug = { description: 'a' };
        fakeAxios.onPost('/bugs').reply(500);

        await store.dispatch(addBug(bug));

        expect(bugsSlice().list).toHaveLength(0);
      });
    });

    describe('resolveBug action', () => {
      it('should mark bug as resolved when it is saved to the server', async () => {
        fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, resolved: true });
        fakeAxios.onPost('/bugs').reply(200, { id: 1 });

        await store.dispatch(addBug(1));
        await store.dispatch(resolveBug(1));

        expect(bugsSlice().list[0].resolved).toBe(true);
      });

      it('should not mark bug as resolved when it is not saved to the server', async () => {
        fakeAxios.onPatch('/bugs/1').reply(500);
        fakeAxios.onPost('/bugs').reply(200, { id: 1 });

        await store.dispatch(addBug(1));
        await store.dispatch(resolveBug(1));

        expect(bugsSlice().list[0].resolved).not.toBe(true);
      });
    });

    describe('loadBugs action', () => {
      describe('the bug exists in the cache', () => {
        it('should not fetch bugs from the server', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());
          await store.dispatch(loadBugs());

          expect(fakeAxios.history.get).toHaveLength(1);
        });
      });

      describe('the bug does not exists in the cache', () => {
        it('should save fetched bugs to the store', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().list).toHaveLength(1);
        });

        describe('loading state', () => {
          it('loading state should be true while fetching the bugs', () => {
            fakeAxios.onGet('/bugs').reply(() => {
              expect(bugSlice().loading).toBe(true);
              return [200, [{ id: 1 }]];
            });

            store.dispatch(loadBugs());
          });

          it('loading state should be false after the bugs are fetched', async () => {
            fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }]);

            await store.dispatch(loadBugs());

            expect(bugsSlice().loading).toBe(false);
          });

          it('loading state should be false if the server returns an error', async () => {
            fakeAxios.onGet('/bugs').reply(500);

            await store.dispatch(loadBugs());

            expect(bugsSlice().loading).toBe(false);
          });
        });
      });
    });

    describe('assignBugToUser action', () => {
      it('should assign the bug to the user', async () => {
        fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, userId: 1 });
        fakeAxios.onPost('/bugs').reply(200, { id: 1 });

        await store.dispatch(addBug(1));
        await store.dispatch(assignBugToUser(1, 1));

        expect(bugsSlice().list[0].userId).toBe(1);
      });

      it('should not assign to the user if the server return an error', async () => {
        fakeAxios.onPatch('/bugs/1').reply(500);
        fakeAxios.onPost('/bugs').reply(200, { id: 1 });

        await store.dispatch(addBug(1));
        await store.dispatch(assignBugToUser(1, 1));

        expect(bugsSlice().list[0].userId).toBe(undefined);
      });
    });
  });

  describe('selectors', () => {
    describe('getUnresolvedBugs selector', () => {
      it('should return an array of unresolved bugs', () => {
        const storeState = createState();
        storeState.entities.bugs.list = [
          { id: 1, resolved: true },
          { id: 2 },
          { id: 3 },
        ];

        const result = getUnresolvedBugs(storeState);

        expect(result).toHaveLength(2);
      });
    });

    describe('getBugsByUser', () => {
      it('should return bugs assigned to user', () => {
        const storeState = createState();
        storeState.entities.bugs.list = [
          { id: 1, userId: 1 },
          { id: 2, userId: 1 },
          { id: 3 },
        ];

        const result = getBugsByUser(1)(storeState);

        expect(result).toHaveLength(2);
      });
    });
  });
});
