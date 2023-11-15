import { configureStore } from '@reduxjs/toolkit'
import theme from './changeTheme';
import alert from './alert';
import superstakers from './superstakers';
import account from './account';

const store = configureStore({
  reducer: {
    theme,
    alert,
    superstakers,
    account,
  },
})

export default store;
