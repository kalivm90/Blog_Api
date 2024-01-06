import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// context hooks
import { AuthProvider } from './context/AuthContext.jsx';

import "@styles/index.scss"
// quill component style that could appear in a lot of different places inside the app
import "react-quill/dist/quill.snow.css";

import authRouter from './pages/auth/_index';
import indexRouter from "./pages/index/_index";
import blogRouter from './pages/blog/_index.jsx';
import profileRouter from './pages/profile/_index.jsx';

const router = createBrowserRouter([
    ...indexRouter,
    ...authRouter,
    ...blogRouter,
    ...profileRouter,
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // comment out React.StrictMode before Prod.
  // <React.StrictMode>
    <AuthProvider>
        <RouterProvider router={router}/>
    </AuthProvider>
)
