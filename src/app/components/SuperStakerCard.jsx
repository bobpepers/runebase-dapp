import React from 'react';
import PropTypes from 'prop-types';
import abi from 'ethjs-abi';
import {
  Trans,
  t,
} from '@lingui/macro';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { connect } from 'react-redux';
import { DELEGATION_CONTRACT_ADDRESS } from '../constants';
import { withRouter } from '../hooks/withRouter';

const SuperStakerCard = function (props) {
  const {
    superstaker,
    account,
  } = props;

  const addDelegation = async (
    superStakerAddress,
    fee = 10,
  ) => {
    if (account) {
      window.runebasechrome.utils.signPod(
        superStakerAddress,
      );
    }
  }

  const removeDelegation = async () => {
    if (account) {
      const txFee = 0; // optional. defaults to 0.
      const gasLimit = 20000000; // optional. defaults to 200000.
      const gasPrice = 0.00000040; // optional. defaults to 40 (satoshi).
      const encodedData = abi.encodeMethod({ name: 'removeDelegation', inputs: [] }, []).substr(2)
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

  // const login = async () => {
  //   if (window.runebasechrome) {
  //     window.runebasechrome.utils.openWallet();
  //   }
  // }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {superstaker.address}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          cycles:
          {' '}
          {superstaker.cycles}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          firstRegisteredOn:
          {' '}
          {superstaker.firstRegisteredOn}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          lastProducedBlock:
          {' '}
          {superstaker.lastProducedBlock}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          totalBlocksProduced:
          {' '}
          {superstaker.totalBlocksProduced}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          score:
          {' '}
          {superstaker.score}
        </Typography>
        <Typography variant="body2">
          {superstaker.note}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          disabled={!account || !account.data || !account.data.loggedIn}
          onClick={() => {
            addDelegation(
              superstaker.address,
            )
          }}
        >
          Delegate
        </Button>
        <Button
          variant="contained"
          disabled={!account || !account.data || !account.data.loggedIn}
          onClick={() => {
            removeDelegation(
              superstaker.address,
            )
          }}
        >
          Undelegate
        </Button>
      </CardActions>
    </Card>
  );
}

SuperStakerCard.propTypes = {
  superstaker: PropTypes.shape({
    address: PropTypes.string.isRequired,
    note: PropTypes.string,
    cycles: PropTypes.number,
    totalBlocksProduced: PropTypes.number,
    score: PropTypes.number,
    firstRegisteredOn: PropTypes.string,
    lastProducedBlock: PropTypes.string,
  }).isRequired,
  account: PropTypes.shape({
    data: PropTypes.shape({
      loggedIn: PropTypes.bool,
    }),
  }).isRequired,
};

const mapStateToProps = (state) => ({
  account: state.account,
})

export default withRouter(connect(mapStateToProps, null)(SuperStakerCard));
