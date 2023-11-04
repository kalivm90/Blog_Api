import React from "react"
import App from "./App"
import Dashboard from "../blog/Dashboard"
import Error from "./Error";

const indexRouter = [
    {
        path: "/",
        element: <App/> 
    }, 
    {
        path: "*", 
        element: <Error/>
    }
]

export default indexRouter;