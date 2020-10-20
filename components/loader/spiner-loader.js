import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export function LoaderSpinner(){
    return(
        <>
            <View style={{flex:1, backgroundColor: '#fff', justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        </>
    );
}
