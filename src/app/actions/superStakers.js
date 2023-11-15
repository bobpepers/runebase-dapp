import axios from '../axios';
import { apiUrl } from '../constants';
import {
  FETCH_SUPERSTAKERS_BEGIN,
  FETCH_SUPERSTAKERS_SUCCESS,
  FETCH_SUPERSTAKERS_FAIL,
  FETCH_SUPERSTAKERS_IDLE,
} from './types/index';

export function fetchSuperStakersAction(
  tipbotInfo,
) {
  return function (dispatch) {
    dispatch({
      type: FETCH_SUPERSTAKERS_BEGIN,
    });
    axios.get(`${apiUrl}/super-stakers`, { withCredentials: true })
      .then((response) => {
        if (response.data.result === 'NO_SUPERSTAKERS_FOUND') {
          dispatch({
            type: FETCH_SUPERSTAKERS_IDLE,
          });
        } else if (response.data.result) {
          dispatch({
            type: FETCH_SUPERSTAKERS_SUCCESS,
            payload: response.data.result,
            tipbotInfo,
          });
        }
      }).catch((error) => {
        dispatch({
          type: FETCH_SUPERSTAKERS_FAIL,
          payload: error.code,
        });
      });
  }
}
