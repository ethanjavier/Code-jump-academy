import { ConfigProvider, theme as antdTheme } from 'antd'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { I18nProvider } from './i18n/I18nContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadiusLG: 18,
          fontFamily:
            "'Quicksand', ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <I18nProvider>
        <App />
      </I18nProvider>
    </ConfigProvider>
  </StrictMode>,
)
