import React from 'react';
import { View, Text } from 'react-native';

export function MessageAlert({ background, content }){
    return(
        <>
            <View style={{ padding: 10, backgroundColor: background }}>
                <Text style={{ fontWeight: 'bold' }}>{content}</Text>
            </View>
        </>
    );
}
