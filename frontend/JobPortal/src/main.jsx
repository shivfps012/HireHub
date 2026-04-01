import React from 'react'
import ReactDom from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
 import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './redux/store'
ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <Toaster/>
  </StrictMode>,
)
