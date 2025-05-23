import * as React from 'react';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { StatusBar } from 'expo-status-bar';
import '@expo/metro-runtime';
import './global.css';

export default function App() {
  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}
