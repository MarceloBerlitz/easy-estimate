import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import { Container } from "../../components/Container/Container";
import { RoutesEnum } from "../../enums/routes.enum";

import { Home } from "../Home/Home";
import { Room } from "../Room/Room";

const App: React.FC = () => {
  return (
    <Container>
      <Routes>
        <Route path={RoutesEnum.HOME} element={<Home />} />
        <Route path={RoutesEnum.ROOM} element={<Room />} />
        <Route path="*" element={<Navigate to={RoutesEnum.HOME} />} />
      </Routes>
    </Container>
  );
};

export default App;
