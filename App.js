/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {LoaderSpinner} from './components/loader/spiner-loader';
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
import {Provider} from 'react-redux';
import Store from './redux/index';
import {createStackNavigator} from '@react-navigation/stack';
import UserReducer, {initialData} from './redux/model/usuarios';
import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ParteDiario from './screens/parteDiario';
import FechaContextProvider from './components/context/fecha';

const RootStack = createStackNavigator();

const App = () => {
  const [isDarkTheme] = useState(false);

  const [loginState] = React.useReducer(UserReducer, initialData);

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

  if (loginState.loading) {
    return <LoaderSpinner />;
  }

  return (
    <Provider store={Store()}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <FechaContextProvider>
            <RootStack.Navigator headerMode="none">
              <RootStack.Screen name="SplashScreen" component={SplashScreen} />
              <RootStack.Screen name="SignInScreen" component={SignInScreen} />
              <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
              <RootStack.Screen name="ParteDiario" component={ParteDiario} />
            </RootStack.Navigator>
          </FechaContextProvider>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
