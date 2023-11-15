import React, {
  lazy,
} from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';

const Home = lazy(() => import('./views/Home'));

const RoutesX = function () {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
    </Routes>
  )
}

export default RoutesX;
