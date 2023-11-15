import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Trans,
  t,
} from '@lingui/macro';
import {
  connect,
  useDispatch,
} from 'react-redux';
import {
  Grid,
  Divider,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import abi from 'ethjs-abi';
import runebase from 'runebasejs-lib';
import Runebase from '../assets/images/runebaseloop.gif';
import { withRouter } from '../hooks/withRouter';
import { fetchSuperStakersAction } from '../actions/superStakers';
import { DELEGATIONS_ABI, DELEGATION_CONTRACT_ADDRESS } from '../constants';

window.postMessage({ message: { type: 'CONNECT_RUNEBASECHROME' } }, '*');

const Home = function (props) {
  const {
    botInfo,
    superstakers,
  } = props;
  const dispatch = useDispatch();
  const [runebaseChromeAccount, setRunebaseChromeAccount] = useState(null);
  useEffect(() => { document.title = t`Staking - Home`; }, []);
  useEffect(() => { dispatch(fetchSuperStakersAction()); }, []);
  useEffect(() => {}, [botInfo, superstakers, runebaseChromeAccount]);
  useEffect(() => { }, [window.runebasechrome, window.runebasechrome && window.runebasechrome.account]);

  useEffect(() => {
    const handleMessage = async (message) => {
      if (message.data.target === 'runebasechrome-inpage') {
        const { result, error } = message.data.message.payload;
        if (message.data.message.type === 'SIGN_POD_RESPONSE') {
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
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    }
  }, []);

  // Listen For Runebase Chrome Installs or Updates
  useEffect(() => {
    const handleRunebaseChromeInstalledOrUpdated = (event) => {
      if (event.data.message && event.data.message.type === 'RUNEBASECHROME_INSTALLED_OR_UPDATED') {
        window.location.reload()
      }
    }
    window.addEventListener('message', handleRunebaseChromeInstalledOrUpdated, false);
    return () => {
      window.removeEventListener('message', handleRunebaseChromeInstalledOrUpdated, false);
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    const handleRunebaseChromeAcctChanged = (event) => {
      if (event.data.message) console.log(event.data.message.type);
      if (event.data.message && event.data.message.type === 'RUNEBASECHROME_ACCOUNT_CHANGED') {
        if (event.data.message.payload.error) {
          console.log(event.data.message.payload.error);
        }
        console.log('account:', event.data.message.payload.account);
        console.log(event.data.message.payload);
        setRunebaseChromeAccount(event.data.message.payload.account);
      }
    }
    window.addEventListener('message', handleRunebaseChromeAcctChanged, false);
    return () => {
      window.removeEventListener('message', handleRunebaseChromeAcctChanged, false);
    }
  }, []);

  // Signed in test
  useEffect(
    () => {
      if (
        runebaseChromeAccount
        && window.runebasechrome
        && window.runebasechrome.rpcProvider
        && window.runebasechrome.utils
        && window.runebasechrome.account
      ) {
        console.log('Signed in');
      }
    },
    [
      runebaseChromeAccount,
    ],
  );

  const addDelegation = async (
    superStakerAddress,
    fee = 10,
  ) => {
    if (runebaseChromeAccount) {
      window.runebasechrome.utils.signPod(
        superStakerAddress,
      );
    }
  }

  const removeDelegation = async () => {
    if (runebaseChromeAccount) {
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

  return (
    <div className="content">
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          lg={3}
          xl={3}
        >
          <img
            src={Runebase}
            alt="Runebase Logo"
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
      >
        <Divider
          style={{
            width: '100%',
          }}
        />
        <Grid
          item
          xs={12}
        >
          <Typography
            variant="h3"
            align="center"
          >
            <Trans>
              Runebase Delegation
            </Trans>
          </Typography>
        </Grid>
        <Divider
          style={{
            width: '100%',
            marginBottom: '2rem',
          }}
        />
        {
          !window.runebasechrome
          && (
            <Grid
              item
              xs={12}
            >
              <Typography
                variant="h3"
                align="center"
              >
                Please Install Runebase Chrome to use this website
              </Typography>
            </Grid>
          )
        }
        {
          runebaseChromeAccount && runebaseChromeAccount.loggedIn ? (
            <Grid
              container
              item
              xs={12}
            >
              <Grid
                item
                xs={4}
              >
                <Typography
                  variant="body2"
                  align="center"
                >
                  Your Connected Address
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                >
                  {runebaseChromeAccount.address}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
              >
                <Typography
                  variant="body2"
                  align="center"
                  fullWidth
                  gutterBottom
                >
                  RUNES Balance
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  gutterBottom
                  fullWidth
                >
                  {runebaseChromeAccount.balance}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
            >
              <Typography
                variant="h6"
                align="center"
              >
                Please login into Runebase Chrome
              </Typography>
            </Grid>
          )
        }
        {
          superstakers
          && superstakers.data
          && superstakers.data.length > 0
          && (
            <Grid
              container
              item
              xs={12}
            >
              {superstakers.data.map((superStaker) => (
                <Grid
                  item
                  xs={4}
                  style={{
                    margin: '20px',
                  }}
                >
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {superStaker.address}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        cycles:
                        {' '}
                        {superStaker.cycles}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        firstRegisteredOn:
                        {' '}
                        {superStaker.firstRegisteredOn}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        lastProducedBlock:
                        {' '}
                        {superStaker.lastProducedBlock}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        totalBlocksProduced:
                        {' '}
                        {superStaker.totalBlocksProduced}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        score:
                        {' '}
                        {superStaker.score}
                      </Typography>
                      <Typography variant="body2">
                        {superStaker.note}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {runebaseChromeAccount && runebaseChromeAccount.loggedIn ? (
                        <>
                          <Button
                            variant="contained"
                            onClick={(e) => {
                              console.log(e)
                              addDelegation(
                                superStaker.address,
                              )
                            }}
                          >
                            Delegate
                          </Button>
                          <Button
                            variant="contained"
                            onClick={(e) => {
                              console.log(e)
                              removeDelegation(
                                superStaker.address,
                              )
                            }}
                          >
                            Undelegate
                          </Button>
                        </>

                      ) : (
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            console.log(e)
                          }}
                        >
                          Log in
                        </Button>
                      )}

                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        }
      </Grid>
    </div>
  );
}

Home.propTypes = {
  botInfo: PropTypes.shape({
    data: PropTypes.shape({
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  botInfo: state.botInfo,
  superstakers: state.superstakers,
})

export default withRouter(connect(mapStateToProps, null)(Home));
