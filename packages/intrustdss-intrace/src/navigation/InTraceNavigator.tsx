import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InTraceStackParamList } from './types';
import { InTraceProps } from '../types';
import { InTraceErrorBoundary } from '../components/InTraceErrorBoundary';
import { InTraceDashboardScreen } from '../screens/InTraceDashboardScreen';
import { CartonListScreen } from '../screens/CartonListScreen';
import { CartonFormScreen } from '../screens/CartonFormScreen';
import { ContainerListScreen } from '../screens/ContainerListScreen';
import { ContainerFormScreen } from '../screens/ContainerFormScreen';

const Stack = createStackNavigator<InTraceStackParamList>();

export const InTraceNavigator: React.FC<InTraceProps> = (props) => {
  return (
    <InTraceErrorBoundary onExit={props.onExit}>
      <Stack.Navigator
        initialRouteName="InTraceDashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="InTraceDashboard"
          options={{ headerShown: false }}
        >
          {(navProps) => <InTraceDashboardScreen {...navProps} {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="CartonList"
          component={CartonListScreen}
          options={{ title: 'Quản lý Thùng (Carton)' }}
        />

        <Stack.Screen
          name="CartonForm"
          component={CartonFormScreen}
          options={{ title: 'Thùng Hàng' }}
        />

        <Stack.Screen
          name="ContainerList"
          component={ContainerListScreen}
          options={{ title: 'Quản lý Công (Container)' }}
        />

        <Stack.Screen
          name="ContainerForm"
          component={ContainerFormScreen}
          options={{ title: 'Container' }}
        />
      </Stack.Navigator>
    </InTraceErrorBoundary>
  );
};
