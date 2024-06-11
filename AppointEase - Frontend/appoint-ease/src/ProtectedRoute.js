import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ path, element, isLoggedIn, redirectPath = '/login' }) => {
  return isLoggedIn ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to={redirectPath} replace={true} />
  );
};

export default ProtectedRoute;
