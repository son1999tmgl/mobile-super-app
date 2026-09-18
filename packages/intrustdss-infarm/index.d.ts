import React from 'react';

export interface InFarmProps {
  token: string;
  userInfo: any;
  environment: 'dev' | 'uat' | 'prod';
  onExit?: () => void;
  onSessionExpired?: () => void;
}

export const InFarmNavigator: React.ComponentType<InFarmProps>;
export class InFarmErrorBoundary extends React.Component<any, any> {}
