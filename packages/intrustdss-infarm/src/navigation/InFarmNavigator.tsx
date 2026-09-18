import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InFarmErrorBoundary } from '../components/InFarmErrorBoundary';
import { InFarmHomeScreen } from '../screens/InFarmHomeScreen';

const Stack = createStackNavigator();

export interface InFarmProps {
  token: string;
  userInfo: any;
  environment: 'dev' | 'uat' | 'prod';
  onExit?: () => void;
  onSessionExpired?: () => void;
}

export const InFarmNavigator: React.FC<InFarmProps> = (props) => {
  return (
    <InFarmErrorBoundary onExit={props.onExit}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InFarmHome">
          {() => <InFarmHomeScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </InFarmErrorBoundary>
  );
};
