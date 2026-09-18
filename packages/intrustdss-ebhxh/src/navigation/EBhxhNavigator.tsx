import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EBhxhErrorBoundary } from '../components/EBhxhErrorBoundary';
import { EBhxhHomeScreen } from '../screens/EBhxhHomeScreen';

const Stack = createStackNavigator();

export interface EBhxhProps {
  token: string;
  userInfo: any;
  environment: 'dev' | 'uat' | 'prod';
  onExit?: () => void;
  onSessionExpired?: () => void;
}

export const EBhxhNavigator: React.FC<EBhxhProps> = (props) => {
  return (
    <EBhxhErrorBoundary onExit={props.onExit}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EBhxhHome">
          {() => <EBhxhHomeScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </EBhxhErrorBoundary>
  );
};
