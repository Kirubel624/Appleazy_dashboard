import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./views/dashboard/Dashboard";
import Home from "./views/home/Home";
import Login from "./views/auth/Login";
import PrivateRoutes from "./utils/ProtectedRoutes";
import Profile from "./views/profile/Profile";
import TrainingList from "./views/training/TrainingList";
import ExerciseList from "./views/exercise/ExerciseList";

function App() {
  const [count, setCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <TrainingList
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />{" "}
              </Dashboard>
            }
            path="/"
          />

          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <TrainingList
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/training"
          />

          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <ExerciseList
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/exercise"
          />
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <Home />
              </Dashboard>
            }
            path="/information"
          />
          <Route
            element={
              <Dashboard>
                <Home />
              </Dashboard>
            }
            path="/metrics"
          />
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <Profile collapsed={collapsed} setCollapsed={setCollapsed} />
              </Dashboard>
            }
            path="/profile"
          />
        </Route>

        <Route element={<Login />} path="/login" />
        {/* <Route element={<Login />} path="/" /> */}
      </Routes>
    </>
  );
}

export default App;
