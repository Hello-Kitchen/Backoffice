import {React} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from './Dashboard';

/**
 * @function PosRouter
 * @description Main router component that sets up the application routing using React Router.
 * It defines routes for the login and dashboard components.
 * @returns {JSX.Element} The router component containing application routes.
 */
function Router() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
