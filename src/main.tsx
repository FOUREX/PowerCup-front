import { createRoot } from 'react-dom/client'
import './index.css'

import {createBrowserRouter, RouterProvider} from "react-router";

import RootPage from "./pages/root/RootPage.tsx";
import LoginPage from "./pages/login/LoginPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
