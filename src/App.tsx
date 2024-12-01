import "./App.css";
import {ConfigProvider, theme} from "antd";
import { HomePage, LoginPage, TeamsPage, MatchesPage } from "./pages";
import {Footer, NavBar} from "./components";
import { Route, Routes } from "react-router";

function getCssVariableValue(variableName: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

function App() {
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
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/matches" element={<MatchesPage />} />
      </Routes>
      <Footer />
    </ConfigProvider>
  );
}

export default App;
