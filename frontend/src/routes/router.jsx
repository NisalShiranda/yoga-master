import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import Mainlayout from "../layout/Mainlayout";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Mainlayout/>,
      children: [
        {
            path: "/",
            element: <Home/>
        }

      ]
    },
  ]);