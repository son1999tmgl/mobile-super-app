import React from 'react';

export interface EBhxhProps {
  token: string;
  userInfo: any;
  environment: 'dev' | 'uat' | 'prod';
  onExit?: () => void;
  onSessionExpired?: () => void;
}

export const EBhxhNavigator: React.ComponentType<EBhxhProps>;
export class EBhxhErrorBoundary extends React.Component<any, any> {}
