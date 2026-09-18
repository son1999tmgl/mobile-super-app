import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { SuperAppHomeScreen } from '../screens/SuperAppHomeScreen';
import { MiniAppHostScreen } from '../screens/MiniAppHostScreen';
import { SuperAppEnvironmentConfig } from '../config/types';
import { UserInfo } from '../types/auth';

const Stack = createStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  appConfig: SuperAppEnvironmentConfig;
  authToken: string;
  currentUser: UserInfo;
  onLogout: () => void;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({
  appConfig,
  authToken,
  currentUser,
  onLogout,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SuperAppHome"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Trang chủ Super App */}
        <Stack.Screen name="SuperAppHome">
          {({ navigation }) => (
            <SuperAppHomeScreen
              config={appConfig}
              userInfo={currentUser}
              onOpenMiniApp={(appId) => {
                navigation.navigate('MiniAppHost', {
                  appId,
                  title: appId.toUpperCase(),
                });
              }}
              onLogout={onLogout}
            />
          )}
        </Stack.Screen>

        {/* Màn hình Host nhúng Mini App */}
        <Stack.Screen name="MiniAppHost">
          {({ route, navigation }) => (
            <MiniAppHostScreen
              appId={route.params.appId}
              token={authToken}
              userInfo={currentUser}
              environment={appConfig.envName}
              onExitToHost={() => navigation.navigate('SuperAppHome')}
              onSessionExpired={onLogout}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
