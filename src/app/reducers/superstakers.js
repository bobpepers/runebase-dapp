import {
  FETCH_SUPERSTAKERS_BEGIN,
  FETCH_SUPERSTAKERS_SUCCESS,
  FETCH_SUPERSTAKERS_FAIL,
  FETCH_SUPERSTAKERS_IDLE,
} from '../actions/types/index';

const initialState = {
  isFetching: false, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case FETCH_SUPERSTAKERS_BEGIN:
    return {
      ...state,
      isFetching: true,
      error: null,
    };
  case FETCH_SUPERSTAKERS_SUCCESS:
    return {
      ...state,
      data: action.payload,
      isFetching: false,
    };
  case FETCH_SUPERSTAKERS_FAIL:
    return {
      ...state,
      error: action.error,
      isFetching: false,
    };
  default:
    return state;
  }
};
