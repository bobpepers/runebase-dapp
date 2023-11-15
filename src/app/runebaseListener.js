import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import runebase from 'runebasejs-lib';
import abi from 'ethjs-abi';
import { SET_ACCOUNT } from './actions/types';
import { DELEGATIONS_ABI, DELEGATION_CONTRACT_ADDRESS } from './constants';

window.postMessage({ message: { type: 'CONNECT_RUNEBASECHROME' } }, '*');

function RunebaseListener({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const listenRunebaseChrome = (event) => {
      if (event.data.message) console.log(event.data.message.type);
      if (event.data.message) {
        if (event.data.message.type === 'RUNEBASECHROME_ACCOUNT_CHANGED') {
          if (event.data.message.payload.error) console.log(event.data.message.payload.error);
          dispatch({
            type: SET_ACCOUNT,
            payload: event.data.message.payload.account,
          });
        }
        if (event.data.message.type === 'RUNEBASECHROME_INSTALLED_OR_UPDATED') {
          window.location.reload()
        }
      }

      // inPage events
      if (event.data.target === 'runebasechrome-inpage') {
        const { result, error } = event.data.message.payload;
        if (event.data.message.type === 'SIGN_POD_RESPONSE') {
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
        if (error) {
          if (error === 'Not logged in. Please log in to RunebaseChrome first.') {
            // Handle not logged in error
            console.log(error);
          } else {
            // Handle other errors
            console.log(error);
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
