import { useEffect, useState } from "react";
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
import AssistantsList from "./views/assistants/AssistantsList";
import AssistantsDetail from "./views/assistants/AssistantsDetails";
import TransactionsList from "./views/Transaction/TransactionList";
import Blogs from "./views/Blog/Blogs";
import BlogsDetail from "./views/Blog/BlogsDetail";
import JobsHome from "./views/assistants/JobsHome";
import Jobs from "./views/assistants/Jobs";
import ProfileSettings from "./views/profile/ProfileSettings";
import PasswordReset from "./views/auth/PasswordReset";
import ForgotPassword from "./views/auth/ForgotPassword";
import ChangePassword from "./views/auth/ChangePassword";
import ClientList from "./views/assistants/ClientList";
import FeedBack from "./views/feedback/FeedBack";
import ChatLayout from "./views/chat/ChatLayout";
import BoddyCon from "./views/chat/BoddyCon";
import { useSelector } from "react-redux";

function App() {
  const [count, setCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    console.log();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <AssistantsList
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
                <FeedBack collapsed={collapsed} setCollapsed={setCollapsed} />
              </Dashboard>
            }
            path="/feedbacks"
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
                <AssistantsList
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/assistants"
          />

          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <ClientList collapsed={collapsed} setCollapsed={setCollapsed} />
              </Dashboard>
            }
            path="/clients"
          />

          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <Blogs collapsed={collapsed} setCollapsed={setCollapsed} />
              </Dashboard>
            }
            path="/blog"
          />
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <BlogsDetail
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/blog/:id"
          />

          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <TransactionsList
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/transactions"
          />
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <JobsHome collapsed={collapsed} setCollapsed={setCollapsed} />
              </Dashboard>
            }
            path="/assistants/jobs/:id"
          />
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <Jobs collapsed={collapsed} setCollapsed={setCollapsed} />
              </Dashboard>
            }
            path="/jobs/:id/:clientId"
          />
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <AssistantsDetail
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/assistants/:id"
          />
          <Route
            path="/chat"
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <ChatLayout userId={user?.id} collapsed={collapsed} />
              </Dashboard>
            }
          >
            <Route element={<BoddyCon />} path=":id/:to" />
            <Route

            // element={ }
            />
          </Route>
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
                <ProfileSettings
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/profilesettings"
          />
          <Route
            element={
              <Dashboard collapsed={collapsed} setCollapsed={setCollapsed}>
                <ChangePassword
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </Dashboard>
            }
            path="/change-password"
          />
        </Route>

        <Route element={<Login />} path="/login" />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<PasswordReset />} />

        {/* <Route element={<Login />} path="/" /> */}
      </Routes>
    </>
  );
}

export default App;
