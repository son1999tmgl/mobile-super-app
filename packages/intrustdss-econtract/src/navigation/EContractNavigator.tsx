import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EContractErrorBoundary } from '../components/EContractErrorBoundary';
import { EContractHomeScreen } from '../screens/EContractHomeScreen';

const Stack = createStackNavigator();

export interface EContractProps {
  token: string;
  userInfo: any;
  environment: 'dev' | 'uat' | 'prod';
  onExit?: () => void;
  onSessionExpired?: () => void;
}

export const EContractNavigator: React.FC<EContractProps> = (props) => {
  return (
    <EContractErrorBoundary onExit={props.onExit}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EContractHome">
          {() => <EContractHomeScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </EContractErrorBoundary>
  );
};
