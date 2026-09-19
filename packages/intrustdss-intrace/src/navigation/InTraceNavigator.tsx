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

import { ProductSelectScreen } from '../screens/ProductSelect/ProductSelectScreen';
import { InTraceStorageService } from '../services/intraceStorage';

const Stack = createStackNavigator<InTraceStackParamList>();

export const InTraceNavigator: React.FC<InTraceProps> = (props) => {
  React.useEffect(() => {
    InTraceStorageService.setAuth(
      props.token,
      props.environment,
      props.apiBaseUrl,
      props.userInfo?.tax_code,
      props.userInfo?.accountId || props.userInfo?.id
    );
  }, [props.token, props.environment, props.apiBaseUrl, props.userInfo]);

  return (
    <InTraceErrorBoundary onExit={props.onExit}>
      <Stack.Navigator
        initialRouteName="ProductSelect"
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
          name="ProductSelect"
          options={{ title: 'Chọn Sản phẩm' }}
        >
          {(navProps) => <ProductSelectScreen {...navProps} {...props} />}
        </Stack.Screen>

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
