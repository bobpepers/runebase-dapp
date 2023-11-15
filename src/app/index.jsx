import React, {
  Suspense,
  lazy,
  createRef,
} from 'react';
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Button from '@mui/material/Button';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import store from './reducers';
import { messages as enMessages } from './locales/en/messages';
import { messages as nlMessages } from './locales/nl/messages';
import { messages as frMessages } from './locales/fr/messages';
import LoadingContainer from './containers/Loading';
import ScrollToTop from './handle/ScrollToTop';
import './theme/style.scss';

const Particles = lazy(() => import('./components/Particles'));
const Header = lazy(() => import('./containers/Header'));
const Notifier = lazy(() => import('./containers/Alert'));
const Footer = lazy(() => import('./containers/Footer'));
const Routes = lazy(() => import('./routes'));

const theme = createTheme({
  palette: {
    discord: {
      main: '#5865F2',
      contrastText: '#fff',
    },
  },
  typography: {
    whiteSpace: 'break-spaces',
    fontFamily: [
      'TeXGyreHeros-Regular',
      'TeXGyreHeros-Bold',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: '0px',
          marginBottom: '0px',
        },
      },
    },
  },
});

const notistackRef = createRef();

const styles = {
  snack: {
    position: 'absolute',
    height: 50,
    bottom: 70,
    left: 10,
    backgroundColor: 'red',
    zIndex: 8000,
  },
};

i18n.load({
  en: enMessages,
  nl: nlMessages,
  fr: frMessages,
});

i18n.loadLocaleData({
  en: {
    plurals: enMessages,
  },
  nl: {
    plurals: nlMessages,
  },
  fr: {
    plurals: frMessages,
  },
})

i18n.activate('en');

const persistedLanguage = localStorage.getItem('language');

if (!persistedLanguage) {
  localStorage.setItem(
    'language',
    'en',
  );
}

function DismissAction({ id }) {
  return (
    <Button
      onClick={() => notistackRef.current.closeSnackbar(id)}
    >
      Dismiss
    </Button>
  )
}

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <I18nProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <SnackbarProvider
              ref={notistackRef}
              classes={{
                root: styles.snack,
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              action={(key) => <DismissAction id={key} />}
            >
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<LoadingContainer />}>
                  <Notifier />
                  <Particles />
                  <Header />
                  <Routes />
                  <Footer
                    i18n={i18n}
                  />
                </Suspense>
              </BrowserRouter>
            </SnackbarProvider>
          </Provider>
        </ThemeProvider>
      </I18nProvider>
    </StyledEngineProvider>
  );
}

createRoot(
  document.getElementById('root'),
).render(
  <App />,
);
