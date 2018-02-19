import React from 'react';
import TopNav from '../TopNav/TopNav';

import { Container } from '../../framework/ui';

export default function Shell({ children }) {
  return (
    <div>
      <TopNav />
      <Container>
        {children}
      </Container>
    </div>
  );
}
