import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, Keyboard, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Formik } from 'formik';
import { RadioButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as yup from 'yup';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

function Separator() {
    return <View style={styles.separator} />;
}


function CustomHeader({ navigation, header }) {

    const db = SQLite.openDatabase("detailss.db");
    const [forceUpdate, forceUpdateId] = useForceUpdate()
    const [modelwheel, setModelwheel] = useState(false);
    const [twowheeldetails, setTwowheeldetails] = useState(null);
    const [fourwheeldetails, setFourwheeldetails] = useState(null);


    return (
        <View style={{ flexDirection: 'row', height: 60, borderWidth: 1, borderColor: '#101010' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ fontSize: 21, fontWeight: 'bold', color: 'red' }}>{header}</Text>
            </View>
        </View >
    )
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];

}


function Fun({ onPressItem, navigation, details }) {



    return (

        <View style={{ height: 210, }}>

            <FlatList
                data={details}
                renderItem={({ item }) => (
                    <ScrollView >
                        <TouchableOpacity
                            key={item.id}

                            onLongPress={() =>
                                Alert.alert(
                                    "DELETE PERSON",
                                    ("delete "),
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "OK", onPress: () =>
                                                onPressItem && onPressItem(item.id)
                                        }

                                    ],
                                    { cancelable: false }
                                )


                            }
                            onPress={() => navigation.navigate('IndividualsInfo', item)}
                            style={styles.textt}
                        >

                            <View style={{ flex: 1, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>{item.name}</Text>

                            </View>

                        </TouchableOpacity>
                    </ScrollView>
                )}

                keyExtractor={(item) => (item.id).toString()}

            />

        </View>

    )

}






export default function Home({ navigation }) {

    const db = SQLite.openDatabase("detailss.db");
    const [forceUpdate, forceUpdateId] = useForceUpdate()
    const [datevisiblity, setDatevisibility] = useState(false);
    const [choosedate, setChoosedate] = useState('DD-MM-YYYY');


    const datecancel = () => {
        setDatevisibility(false);
    }
    const dateconfirm = (date) => {

        const data = moment(date).format('MMMM, Do')
        setChoosedate(data.toString());
        datecancel();
    }

    const touchshow = () => {
        setDatevisibility(true);
    }
    const [checked, setChecked] = useState('2');

    const [details, setDetails] = useState(null);
    useEffect(() => {
        db.transaction(tx => {

            tx.executeSql(
                "create table if not exists itemson (id integer primary key not null, name text, place text,advance text,hour text,minutes text,choosedate text,wheeler text);"
            );
            tx.executeSql(
                `select * from itemson;`,
                [],
                (_, { rows: { _array } }) =>
                    setDetails(_array)
            );
        });
    }, []);

    const nData = (data) => {

        db.transaction(
            tx => {
                tx.executeSql("insert into itemson (name, place, advance,hour,minutes,choosedate,wheeler) values (?, ?,?, ?, ?, ?, ?)", [data.name, data.place, data.advance, data.hour, data.minutes, (choosedate).toString(), checked]);
                tx.executeSql(
                    `select * from itemson ;`,
                    [],
                    (_, { rows: { _array } }) =>
                        setDetails(_array)
                );
                tx.executeSql(
                    "create table if not exists " + "" + data.name + "" + " (id integer primary key not null, advance text, hour text,minutes text,choosedate text,wheeler text);"
                );
                tx.executeSql("insert into " + "" + data.name + "" + " (advance,hour,minutes,choosedate,wheeler) values (?,?,?,?,?)", [data.advance, data.hour, data.minutes, choosedate, checked]);
            },
            console.log('data added'),
            forceUpdate

        );
    }



    const errorhandler = yup.object({

        name: yup.string().required().min(3),
        place: yup.string().required().min(3),
        advance: yup.string().required().min(1),
        hour: yup.string().required().min(1),
        minutes: yup.string().required().min(1),
    })

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: '#101010' }}>
                <View style={{ marginTop: Constants.statusBarHeight, marginBottom: 0 }}>
                    <CustomHeader navigation={navigation} header={'HOME'} style={{ marginTop: Constants.statusBarHeight }} />
                    <Text style={{ color: 'white', fontSize: 23, fontWeight: "bold", textAlign: 'center', marginVertical: 10 }}>Enter Details</Text>


                    <Formik
                        initialValues={{ name: '', place: '', advance: '', hour: '', minutes: '', choosedate: { choosedate }['choosedate'], checked: { checked }['checked'] }}
                        validationSchema={errorhandler}
                        onSubmit={(values, actions) => {
                            nData(values);
                            actions.resetForm();
                        }}
                    >
                        {(props) => (
                            <View style={{ padding: 38, paddingBottom: 10, paddingTop: 0 }}>
                                <TextInput
                                    style={styles.textinput, { borderWidth: 1, height: 40, color: 'white', backgroundColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}
                                    placeholder='Enter Name'
                                    onChangeText={props.handleChange('name')}
                                    value={props.values.name}
                                />
                                <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.name && props.errors.name}</Text>
                                <TextInput
                                    style={styles.textinput, { borderWidth: 1, height: 40, color: 'white', backgroundColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}

                                    placeholder='Enter place'
                                    onChangeText={props.handleChange('place')}
                                    value={props.values.place}

                                />
                                <Text style={{ fontSize: 10, color: 'white', marginBottom: 10 }}>{props.touched.place && props.errors.place}</Text>
                                <TextInput
                                    style={styles.textinput, { borderWidth: 1, height: 40, color: 'white', backgroundColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}
                                    placeholder='Enter advance amount'
                                    onChangeText={props.handleChange('advance')}
                                    value={props.values.advance}
                                    keyboardType='numeric'
                                />
                                <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.advance && props.errors.advance}</Text>
                                <View style={{ flexDirection: 'row', marginBottom: 0, height: 40, }}>
                                    <View style={{ flex: 1 }}>
                                        <TextInput

                                            style={[styles.textinput, { alignItems: 'center', color: 'white', marginRight: 5, textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderRadius: 7, borderColor: '#191919', borderBottomColor: 'white' }]}
                                            placeholder='Hour'
                                            onChangeText={props.handleChange('hour')}
                                            value={props.values.hour}
                                            defaultValue='0'
                                            keyboardType='numeric'
                                        />

                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={[styles.textinput, { marginBottom: 0, marginLeft: 5, color: 'white', textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }]}
                                            placeholder='Minutes'
                                            onChangeText={props.handleChange('minutes')}

                                            value={props.values.minutes}
                                            defaultValue='0'
                                            keyboardType='numeric'
                                        />

                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.hour && props.errors.hour}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.minutes && props.errors.minutes}</Text>
                                    </View>
                                </View>


                                <DateTimePickerModal
                                    isVisible={datevisiblity}
                                    onConfirm={dateconfirm}
                                    onCancel={datecancel}
                                    mode={'date'}
                                    datePickerModeAndroid={'spinner'}
                                />
                                <View style={{ flexDirection: 'row', height: 40, marginBottom: 15, backgroundColor: '#191919', borderWidth: 1, borderBottomColor: 'white', borderRadius: 7 }}>
                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={touchshow}><Text style={{ fontSize: 20, color: 'white' }}>Tap For Date :</Text></TouchableOpacity>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{choosedate}</Text></View>
                                </View>


                                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginRight: 9 }}>
                                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white' }}>
                                            <Text style={{ color: 'white' }}>2 Wheeler</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#191919', borderWidth: 1, borderBottomColor: 'white', borderColor: '#191919', alignItems: 'center' }}>
                                            <RadioButton
                                                value="2"
                                                status={checked === '2' ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked('2')}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}>
                                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white' }}>
                                            <Text style={{ color: 'white' }}>4 Wheeler</Text>
                                        </View>
                                        <View style={{
                                            flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white'
                                        }}>
                                            <RadioButton
                                                value="4"
                                                status={checked === '4' ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked('4')}
                                            />
                                        </View>
                                    </View>
                                </View>


                                <Button title="Submit" color='red' onPress={props.handleSubmit} />

                            </View>
                        )}
                    </Formik>

                </View>

                <View style={{ height: 237 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Tap for full Details</Text>

                    <Fun navigation={navigation} details={details} key={`forceupdate-todo-${forceUpdateId}`} onPressItem={id =>
                        db.transaction(
                            tx => {
                                tx.executeSql(`delete from itemson where id = ?;`, [id]);
                                tx.executeSql(
                                    `select * from itemson;`,
                                    [],
                                    (_, { rows: { _array } }) =>
                                        setDetails(_array)
                                );
                            },

                            null,
                            forceUpdate
                        )

                    } />

                </View>
                <Button title='See All' color='#333945' onPress={() => navigation.navigate('Member', details)} />
            </View>
        </TouchableWithoutFeedback >

    );
}

const styles = StyleSheet.create({
    separator: {
        marginTop: 10,
        marginHorizontal: 0,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },

    textinput: {
        borderBottomWidth: 2,
        borderColor: 'white',
        height: 40,
        marginBottom: 0,
        color: 'white',

    },
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
    textt: {
        marginTop: 5,
        borderBottomColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
        alignItems: 'center',
        paddingTop: 7,
        paddingBottom: 7,
        backgroundColor: 'black',
        borderRadius: 20,
        shadowColor: 'white',
        shadowOffset: {
            width: 1, height: 7
        },
        shadowOpacity: 0.1,
        shadowRadius: 1
    },

    latest: {
        marginTop: 10,
        borderColor: 'white',
        borderWidth: 0,
        alignItems: 'center',
        paddingLeft: 100,
        paddingRight: 100,
        paddingTop: 7,
        paddingBottom: 7,
        backgroundColor: 'yellowgreen',
        borderRadius: 10,
        shadowColor: 'white',
        shadowOffset: {
            width: 1, height: 7
        },
        shadowOpacity: 0.1,
        shadowRadius: 1
    },
    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',

    },
});