import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import runebase from 'runebasejs-lib';
import abi from 'ethjs-abi';
import { SET_ACCOUNT } from './actions/types';
import { DELEGATIONS_ABI, DELEGATION_CONTRACT_ADDRESS } from './constants';

function RunebaseListener({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    window.postMessage({ message: { type: 'CONNECT_RUNEBASECHROME' } }, '*');
    const listenRunebaseChrome = (event) => {
      const { data: { message, target } } = event;
      if (message) {
        const { payload, type } = message;
        if (message && payload && payload.error) {
          console.log(payload.error)
        } else {
          if (type === 'CONNECT_RUNEBASECHROME') console.log('CONNECT_RUNEBASECHROME_RESOLVED');
          if (type === 'RUNEBASECHROME_ACCOUNT_CHANGED') dispatch({ type: SET_ACCOUNT, payload: payload.account });
          if (type === 'RUNEBASECHROME_INSTALLED_OR_UPDATED') {
            window.location.reload()
          }
        }
      }

      // inPage events
      if (target === 'runebasechrome-inpage') {
        const { payload: { result, error }, type } = event.data.message;
        if (error) {
          if (error === 'Not logged in. Please log in to RunebaseChrome first.') {
            console.log(error);
          } else {
            console.log(error);
          }
        } else if (type === 'SIGN_POD_RESPONSE') {
          if (result && result.podMessage) {
            const hexAddress = runebase.address.fromBase58Check(result.superStakerAddress).hash.toString('hex');
            const params = [`0x${hexAddress}`, 10, result.podMessage];

            const encodedData = abi.encodeMethod({
              name: 'addDelegation',
              inputs: [
                { name: 'staker', type: 'address' },
                { name: 'fee', type: 'uint8' },
                { name: 'PoD', type: 'bytes' },
              ],
            }, params).substr(2);

            const txFee = 0; // optional. defaults to 0.
            const gasLimit = 20000000; // optional. defaults to 200000.
            const gasPrice = 0.00000040; // optional. defaults to 40 (satoshi).
            window.runebasechrome.rpcProvider.rawCall(
              'sendtocontract',
              [
                DELEGATION_CONTRACT_ADDRESS,
                encodedData,
                txFee,
                gasLimit,
                gasPrice,
              ],
            );
          }
        }
      }
    }
    window.addEventListener('message', listenRunebaseChrome, false);
    return () => {
      window.removeEventListener('message', listenRunebaseChrome, false);
    }
  }, []);

  return children;
}

export default RunebaseListener;
