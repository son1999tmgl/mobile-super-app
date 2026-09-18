import React from 'react';

export interface EContractProps {
  token: string;
  userInfo: any;
  environment: 'dev' | 'uat' | 'prod';
  onExit?: () => void;
  onSessionExpired?: () => void;
}

export const EContractNavigator: React.ComponentType<EContractProps>;
export class EContractErrorBoundary extends React.Component<any, any> {}
