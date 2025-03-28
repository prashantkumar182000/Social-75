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

// Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 20, 
          textAlign: 'center',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2>Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

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
  
  // Firebase auth state listener with cleanup
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Only store serializable user data
        store.dispatch(loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified || false
        }));
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

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
      <ErrorBoundary>
        <Root />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);