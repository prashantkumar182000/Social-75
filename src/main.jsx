// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './redux/store';
import { auth } from './firebase';
import { loginSuccess } from './redux/authSlice';
import '@fontsource/space-mono/700.css';
import App from './App';

// Light/Dark theme configuration
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#7C4DFF' : '#1976d2'
    },
    secondary: {
      main: mode === 'dark' ? '#FF4081' : '#d81b60'
    }
  }
});

const Root = () => {
  const [themeMode, setThemeMode] = React.useState('dark');
  
  // Firebase auth state listener
  auth.onAuthStateChanged((user) => {
    if (user) {
      store.dispatch(loginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
    }
  });

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <BrowserRouter>
        <App themeMode={themeMode} setThemeMode={setThemeMode} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);