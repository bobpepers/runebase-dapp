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
} from '@mui/material';
import Runebase from '../assets/images/runebaseloop.gif';
import { withRouter } from '../hooks/withRouter';
import { fetchSuperStakersAction } from '../actions/superStakers';
import SuperStakerCard from '../components/SuperStakerCard';

const Home = function (props) {
  const {
    superstakers,
    account,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => { document.title = t`Staking - Home`; }, []);
  useEffect(() => { dispatch(fetchSuperStakersAction()); }, []);
  useEffect(() => {}, [superstakers, account]);

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
        { account && account.data && account.data.loggedIn ? (
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
                {account.address}
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
                {account.balance}
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
        )}
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
    }),
  }).isRequired,
  superstakers: PropTypes.shape({
    data: PropTypes.shape([]),
  }).isRequired,
};

const mapStateToProps = (state) => ({
  botInfo: state.botInfo,
  superstakers: state.superstakers,
})

export default withRouter(connect(mapStateToProps, null)(Home));
