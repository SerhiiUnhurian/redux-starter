import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

let lastId = 0;

const slice = createSlice({
  name: 'bugs',
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    // maps action -> action handlers
    bugAdded: (bugs, action) => {
      bugs.list.push({
        id: ++lastId,
        description: action.payload.description,
        resolved: false,
      });
    },
    bugRemoved: (bugs, action) => {
      const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
      bugs.list.splice(index, 1);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex(bug => bug.id === action.payload.id);
      bugs[index].resolved = true;
    },
    bugAssignedToUser: (bugs, action) => {
      const { bugId, userId } = action.payload;
      const bug = bugs.list.find(bug => bug.id === bugId);
      bug.userId = userId;
    },
  },
});

export const { bugAdded, bugRemoved, bugResolved, bugAssignedToUser } =
  slice.actions;
export default slice.reducer;

// Memoized Selector
export const getUnresolvedBugs = createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter(bug => !bug.resolved)
);

// Currying
export const getBugsByUser = userId =>
  createSelector(
    state => state.entities.bugs,
    bugs => bugs.list.filter(bug => bug.userId === userId)
  );
