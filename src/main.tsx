import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';

import './index.css';
import { createRoot } from 'react-dom/client';

import './locales/i18n';
import App from './App.tsx';

// oxlint-disable-next-line typescript/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
