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
  Button,
} from '@mui/material';
import Runebase from '../assets/images/runebaseloop.gif';
import { withRouter } from '../hooks/withRouter';
import { fetchSuperStakersAction } from '../actions/superStakers';
import SuperStakerCard from '../components/SuperStakerCard';
import { RunebaseChromeDownloadLink } from '../constants';

const Home = function (props) {
  const {
    superstakers,
    account,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => { document.title = t`Staking - Home`; }, []);
  useEffect(() => { dispatch(fetchSuperStakersAction()); }, []);
  useEffect(() => {}, [superstakers, account]);
  useEffect(() => {}, [window.runebasechrome]);

  // Signed in test
  useEffect(
    () => {
      if (
        account
        && window.runebasechrome
        && window.runebasechrome.rpcProvider
        && window.runebasechrome.utils
        && window.runebasechrome.account
      ) {
        console.log('Signed in');
        console.log(account);
      }
    },
    [
      account,
    ],
  );

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
              textAlign="center"
            >
              <Button
                href={RunebaseChromeDownloadLink}
                target="_blank"
                variant="outlined"
                size="large"
              >
                Please Install Runebase Chrome to gain full functionality of this website
              </Button>
            </Grid>
          )
        }
        { window.runebasechrome
          && account
          && account.data
          && account.data.loggedIn && (
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
                {account.data.address}
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
                {account.data.balance}
              </Typography>
            </Grid>
          </Grid>
        )}
        {
          window.runebasechrome && (!account || !account.data.loggedIn) && (
            <Grid
              item
              xs={12}
            >
              <Typography
                variant="h6"
                align="center"
              >
                Please connect to Runebase Chrome to gain full functionality of this website.
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
              {superstakers.data.map((superstaker) => (
                <Grid
                  item
                  xs={4}
                  style={{
                    margin: '20px',
                  }}
                >
                  <SuperStakerCard
                    superstaker={superstaker}
                  />
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
  account: PropTypes.shape({
    data: PropTypes.shape({
      loggedIn: PropTypes.bool.isRequired,
      address: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
    }).isRequired,
  }),
  superstakers: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        address: PropTypes.string.isRequired,
        note: PropTypes.string,
        cycles: PropTypes.number,
        totalBlocksProduced: PropTypes.number,
        score: PropTypes.number,
        firstRegisteredOn: PropTypes.string,
        lastProducedBlock: PropTypes.string,
      }),
    ),
  }),
};

Home.defaultProps = {
  account: {
    data: {
      loggedIn: false,
      address: '',
      balance: 0,
      // Set default values for other properties as needed
    },
  },
  superstakers: {
    data: [],
  },
};

const mapStateToProps = (state) => ({
  account: state.account,
  superstakers: state.superstakers,
})

export default withRouter(connect(mapStateToProps, null)(Home));
