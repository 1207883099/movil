import React, { useReducer } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserReducer, { initialData } from '../redux/model/usuarios';

export function PrivateRoute({ navigation, mane, component, ...rest }) {
    const [loginState] = useReducer(UserReducer, initialData);
    const RootStack = createStackNavigator();

    if (loginState.MyUser[0].token === undefined) {
      return navigation.navigate('SplashScreen');;
    }

    return <RootStack.Screen name={mane} component={component} {...rest}/>;
}
