import React from 'react';

export interface InTraceProps {
  token: string;
  userInfo: any;
  environment: 'dev' | 'uat' | 'prod';
  onExit?: () => void;
  onSessionExpired?: () => void;
}

export const InTraceNavigator: React.ComponentType<InTraceProps>;
export class InTraceErrorBoundary extends React.Component<any, any> {}
