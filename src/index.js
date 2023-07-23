import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

import routes from "./routes";
import Loader from "./components/Loader";

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider
      router={routes}
      fallbackElement={<Loader />}
    />
  // </React.StrictMode>
)
