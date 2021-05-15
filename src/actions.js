import { actionTypes } from './actionTypes';

export const bugAdded = description => ({
  type: actionTypes.BUG_ADDED,
  payload: {
    description,
  },
});

export const bugRemoved = id => ({
  type: actionTypes.BUG_REMOVED,
  payload: {
    id,
  },
});

export const bugResolved = id => ({
  type: actionTypes.BUG_RESOLVED,
  payload: {
    id,
  },
});
