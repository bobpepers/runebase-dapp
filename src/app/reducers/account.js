import {
  SET_ACCOUNT,
} from '../actions/types/index';

const initialState = {
  data: null, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_ACCOUNT:
    return {
      ...state,
      data: action.payload,
    };
  default:
    return state;
  }
};
