/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ParteDiario from './screens/parteDiario';
import Configuracion from './screens/configuracion';
import FechaContextProvider from './components/context/fecha';
import MyUserContextProvider from './components/context/MyUser';

const RootStack = createStackNavigator();

const App = () => {
  const [isDarkTheme] = useState(false);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <MyUserContextProvider>
          <FechaContextProvider>
            <RootStack.Navigator headerMode="none">
              <RootStack.Screen name="SplashScreen" component={SplashScreen} />
              <RootStack.Screen name="SignInScreen" component={SignInScreen} />
              <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
              <RootStack.Screen name="ParteDiario" component={ParteDiario} />
              <RootStack.Screen
                name="Configuracion"
                component={Configuracion}
              />
            </RootStack.Navigator>
          </FechaContextProvider>
        </MyUserContextProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
