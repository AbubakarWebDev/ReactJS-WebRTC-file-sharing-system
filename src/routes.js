import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import Home from "./pages/Home";
import Room from "./pages/Room";
import Error404 from "./pages/Error404";

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "/",
                Component: Home,
            },
            {
                path: "/room/:roomID",
                Component: Room,
            },
            {
                path: "*",
                Component: Error404,
            },
        ],
    },
]);

export default router;