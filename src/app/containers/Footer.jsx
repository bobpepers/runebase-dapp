import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Grid,
  Badge,
  Typography,
} from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThemeToggle from '../components/ThemeToggle';
import toggleTheme from '../theme/toggleTheme';

function Footer(props) {
  const {
    i18n,
    theme,
  } = props;
  const LANGUAGE_KEY = 'language';
  const [language, setLanguage] = useState('');
  const [anchorElLang, setAnchorElLang] = useState(null);
  useEffect(() => {
    toggleTheme(theme);
  }, [
    theme,
  ]);

  const changeLanguage = (lng) => {
    i18n.activate(lng);
    localStorage.setItem(LANGUAGE_KEY, lng);
    setLanguage(lng);
  };

  useEffect(() => {
    const persistedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (persistedLanguage === 'null') {
      changeLanguage('en');
    }
    if (!persistedLanguage) {
      changeLanguage('en');
    }
    if (language !== persistedLanguage && persistedLanguage !== 'null') {
      changeLanguage(persistedLanguage);
    }
  }, []);

  useEffect(() => { }, [language]);

  const countryCode = (country) => {
    if (country === 'en') {
      return 'us';
    }
    if (country === 'nl') {
      return 'nl';
    }
    if (country === 'fr') {
      return 'fr';
    }
    return 'us';
  }

  const handleClickLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  return (
    <div className="footer">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="baseline"
      >
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          align="center"
        >
          <Typography
            variant="body1"
            align="center"
          >
            v
            {process.env.APP_VERSION}
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          align="center"
        >
          <ThemeToggle />
        </Grid>
        <Grid
          container
          item
          xs={4}
          sm={4}
          md={4}
          alignItems="center"
          justifyContent="center"
          style={{
            marginBottom: 'auto',
          }}
        >
          <Button
            onClick={handleClickLangMenu}
            className="langPadding toggleLangWrapper"
            id="user-nav-dropdown"
            style={{
              color: '#bdbdbd',
            }}
          >
            <Badge
              color="secondary"
            >
              <span>
                <ReactCountryFlag
                  countryCode={countryCode(language)}
                  svg
                />
                {' '}
                {`${language}`}
              </span>
            </Badge>

            {' '}
            <ArrowDropDownIcon />
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorElLang}
            keepMounted
            open={Boolean(anchorElLang)}
            onClose={handleCloseLangMenu}
            className="langPadding toggleLangWrapper"
          >
            <MenuItem
              onClick={() => {
                handleCloseLangMenu();
                changeLanguage('en');
              }}
            >
              <div>
                <ReactCountryFlag countryCode="us" svg />
                {' '}
                EN
              </div>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseLangMenu();
                changeLanguage('fr')
              }}
            >
              <div>
                <ReactCountryFlag
                  countryCode="fr"
                  svg
                />
                {' '}
                FR
              </div>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseLangMenu();
                changeLanguage('nl')
              }}
            >
              <div>
                <ReactCountryFlag
                  countryCode="nl"
                  svg
                />
                {' '}
                NL
              </div>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </div>
  );
}

Footer.propTypes = {
  i18n: PropTypes.shape({
    activate: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    theme: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  theme: state.theme,
})

export default connect(mapStateToProps, null)(Footer);
