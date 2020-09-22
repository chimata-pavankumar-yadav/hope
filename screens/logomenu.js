import React from 'react';
import { View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function Menu({ navigation }) {
    const openD = () => {
        navigation.openDrawer();
    }
    return (
        <View>
            <Entypo name="menu" onPress={openD} size={35} color="yellowgreen" />
        </View>
    )
}