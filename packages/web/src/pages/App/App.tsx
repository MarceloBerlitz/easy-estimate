import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Container } from "../../components/Container/Container";
import { RoutesEnum } from "../../enums/routes.enum";

import { Home } from "../Home/Home";
import { Room } from "../Room/Room";
import { SocketProvider } from "../../hooks/Socket/useSocket";

const App: React.FC = () => {
  return (
    <SocketProvider>
      <Container>
        <Routes>
          <Route path={RoutesEnum.HOME} element={<Home />} />
          <Route path={RoutesEnum.ROOM} element={<Room />} />
          <Route path="*" element={<Navigate to={RoutesEnum.HOME} />} />
        </Routes>
      </Container>
    </SocketProvider>
  );
};

export default App;
