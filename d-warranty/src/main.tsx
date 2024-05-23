import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout";
import Brand from "./components/Brand/Brand";
import Customer from "./components/Customer/Customer";
import Home from "./components/Home/Home.tsx";
import LandingPage from "./components/LandingPage/LanadingPage.tsx";
import FormCompo from "./components/Forms/Form.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="/brand" element={<Brand />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/form" element={<FormCompo />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
