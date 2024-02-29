import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ConfigProvider, Layout, theme } from 'antd';

import { Container } from '../../components/Container/Container';
import { RoutesEnum } from '../../enums/routes.enum';

import { Home } from '../Home/Home';
import { Room } from '../Room/Room';
import { SocketProvider } from '../../hooks/Socket/useSocket';
import { RoomProvider } from '../../hooks/Room/useRoom';

const { defaultAlgorithm, darkAlgorithm } = theme;

const App: React.FC = () => {
  const [isDarkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem('dark-mode') ?? 'true')
  );

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode === 'true' ? darkAlgorithm : defaultAlgorithm,
        token: {
          borderRadius: 3,
        },
      }}
    >
      <RoomProvider>
        <SocketProvider>
          <Layout>
            <Container>
              <Routes>
                <Route path={RoutesEnum.HOME} element={<Home />} />
                <Route
                  path={RoutesEnum.ROOM}
                  element={
                    <Room isDarkMode={isDarkMode === 'true'} onDarkModeChange={setDarkMode} />
                  }
                />
                <Route path="*" element={<Navigate to={RoutesEnum.HOME} />} />
              </Routes>
            </Container>
          </Layout>
        </SocketProvider>
      </RoomProvider>
    </ConfigProvider>
  );
};

export default App;
