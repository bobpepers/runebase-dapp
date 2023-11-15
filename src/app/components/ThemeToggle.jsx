import React from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import { withStyles } from 'tss-react/mui';
import {
  Switch,
} from '@mui/material';
import {
  Brightness3,
  WbSunny,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { changeTheme } from '../actions';

const ThemeSwitch = withStyles(Switch, (_theme, _params, classes) => ({
  switchBase: {
    color: '#FE6B8B',
    [`&.${classes.checked}`]: {
      color: '#FE6B8B',
    },
    [`&.${classes.checked} + .${classes.track}`]: {
      backgroundColor: '#FE6B8B',
    },
  },
  checked: {},
  track: {},
}));

function ThemeToggle(props) {
  const {
    theme: {
      theme,
    },
  } = props;

  const dispatch = useDispatch();

  const handleChangeCurrentStyleMode = (value) => {
    dispatch(changeTheme(value));
  };

  return (
    <div>
      <WbSunny />
      <ThemeSwitch
        checked={theme !== 'light'}
        onChange={() => handleChangeCurrentStyleMode(theme === 'light' ? 'dark' : 'light')}
      />
      <Brightness3 />
    </div>
  );
}

ThemeToggle.propTypes = {
  theme: PropTypes.shape({
    theme: PropTypes.string.isRequired,
  }).isRequired,

};

const mapStateToProps = (state) => ({
  theme: state.theme,
})

const mapDispatchToProps = (dispatch) => ({
  changeTheme: (payload) => dispatch(changeTheme(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeToggle);
