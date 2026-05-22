// App.js
import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import FormScreen from './src/screens/FormScreen';

export default function App() {
  return (
    <ThemeProvider>
      <FormScreen />
    </ThemeProvider>
  );
}
