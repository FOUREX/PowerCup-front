import "./App.css";
import NavBarSeparator from "./components/NavBar/NavBarSeparator.tsx";
import { HomePage, LoginPage } from "./pages";
import { NavBar } from "./components";
import { Route, Routes } from "react-router";
import {TeamsPage} from "./pages/teams/TeamsPage.tsx";

function App() {
  return (
    <>
      <NavBar />
      <NavBarSeparator />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teams" element={<TeamsPage />} />
      </Routes>
    </>
  );
}

export default App;
