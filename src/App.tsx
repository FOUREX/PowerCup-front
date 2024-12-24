import "./App.css";
import {ConfigProvider, theme} from "antd";
import {useEffect, useRef} from "react";
import {HomePage, LoginPage, TeamsPage, MatchesPage, admin, RegisterPage} from "./pages";
import { Footer, NavBar } from "./components";
import {Route, Routes, useNavigate} from "react-router";
import {getMe} from "api";
import {TournamentsPage} from "./pages/tournaments/TournamentsPage.tsx";
import {CurrentUser} from "./utils";

function getCssVariableValue(variableName: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

function App() {
  const userFetched = useRef<boolean>(false)
  const navigate = useNavigate()

  const checkAuth = async () => {
    if (!CurrentUser.get() || userFetched.current) {
      return
    }

    userFetched.current = true

    try {
      await getMe()
    } catch {
      CurrentUser.del()
      navigate("/")
    }
  }

  useEffect(() => {
    checkAuth().then()
  })

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: getCssVariableValue("--color-primary"),
        },
      }}
    >
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/admin/login" element={<admin.LoginAdminPage />} />
        <Route path="/admin/dashboard" element={<admin.Dashboard />} />
      </Routes>
      <Footer />
    </ConfigProvider>
  );
}

export default App;
