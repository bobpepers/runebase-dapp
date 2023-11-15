import { configureStore } from '@reduxjs/toolkit'
import theme from './changeTheme';
import alert from './alert';
import superstakers from './superstakers';

const store = configureStore({
  reducer: {
    theme,
    alert,
    superstakers,
  },
})

export default store;
