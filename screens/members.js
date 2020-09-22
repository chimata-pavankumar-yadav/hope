import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ToastAndroid, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];

}

function CustomHead({ navigation, header }) {
    return (
        <View style={{ flexDirection: 'row', height: 60, borderWidth: 1, borderColor: '#101010' }}>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
                <Ionicons name="md-arrow-round-back" size={28} color="yellowgreen" />
            </TouchableOpacity>

            <View style={{ flex: 1.5, alignItems: 'center' }}><Text style={{ fontSize: 21, fontWeight: 'bold', color: 'red' }}>{header}</Text></View>
            <View style={{ flex: 1 }}></View>

        </View>
    )
}


export default function Members({ route, navigation }) {

    const db = SQLite.openDatabase("detailss.db");
    const detail = route.params;
    const [newdetail, setNewdetail] = useState(null);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from itemson ;`,
                [],
                (_, { rows: { _array } }) => setNewdetail(_array),
            );


        });
    }, []);

    const showToastNoData = () => {

        ToastAndroid.show("No Data To Refresh", ToastAndroid.SHORT);
    };
    const showToastError = () => {
        ToastAndroid.show("Data Error", ToastAndroid.SHORT);
    };
    const showToastRefreshed = () => {
        ToastAndroid.show("Data Refreshed", ToastAndroid.SHORT);
    };

    return (

        <View style={{ flex: 1, backgroundColor: '#101010' }}>
            <View style={{ marginTop: Constants.statusBarHeight, flex: 1, marginBottom: 30 }}>
                <CustomHead navigation={navigation} header={'Total Members'} />

                <FlatList
                    data={newdetail}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.text} onPress={() => navigation.navigate('IndividualsInfo', item)} >

                            <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold' }}>{item.name}</Text>

                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => (item.id).toString()}
                />
            </View>

        </View >

    );
}

const styles = StyleSheet.create({

    text: {
        marginTop: 5,
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
        alignItems: 'center',
        paddingTop: 7,
        paddingBottom: 7,
        backgroundColor: 'white',
        borderRadius: 7,
        shadowColor: 'white',
        shadowOffset: {
            width: 1, height: 7
        },
        shadowOpacity: 0.1,
        shadowRadius: 1
    },

});