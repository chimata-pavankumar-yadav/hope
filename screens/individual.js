import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Formik } from 'formik';
import { RadioButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { BlurView } from 'expo-blur';
import * as yup from 'yup';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';
import Tabletab from './total';



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




function Customindividual({ navigation, header }) {
    return (
        <View style={{ flexDirection: 'row', height: 60, }}>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
                <Ionicons name="md-arrow-round-back" size={28} color="yellowgreen" />
            </TouchableOpacity>

            <View style={{ flex: 7, alignItems: 'center', marginRight: 15, marginTop: 5 }}><Text style={{ fontSize: 21, fontWeight: 'bold', color: 'red' }}>{header}</Text></View>

        </View>
    )
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];

}



export default function IndividualsInfo({ route, navigation }) {
    const db = SQLite.openDatabase("detailss.db");
    const details = route.params;
    const [datevisiblity, setDatevisibility] = useState(false);
    const [choosedate, setChoosedate] = useState('DD-MM-YYYY');

    const [detai, setDetai] = useState([{ id: 0, advance: details.advance, hour: details.hour, minutes: details.minutes, choosedate: details.choosedate, wheeler: details.wheeler }]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists " + "" + details.name + "" + " (id integer primary key not null, advance text, hour text,minutes text,choosedate text,wheeler text);"
            );
            tx.executeSql(
                `select * from ` + `` + details.name + `` + ` ;`,
                [],
                (_, { rows: { _array } }) => setDetai(_array),
            );

        });
    }, []);

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

    const [model, setModel] = useState(false);


    const [forceUpdate, forceUpdateId] = useForceUpdate()

    const nData = (data) => {

        db.transaction(
            tx => {
                if (data) {
                    tx.executeSql("insert into " + "" + details.name + "" + " (advance,hour,minutes,choosedate,wheeler) values (?,?,?,?,?)", [data.advance, data.hour, data.minutes, choosedate, checked]);
                    tx.executeSql(
                        `select * from ` + `` + details.name + `` + ` ;`,
                        [],
                        (_, { rows: { _array } }) => setDetai(_array),
                    );
                } else {
                    tx.executeSql(
                        `select * from ` + `` + details.name + `` + ` ;`,
                        [],
                        (_, { rows: { _array } }) => setDetai(_array),
                    );
                }

            },
            console.log('data added'),
            forceUpdate

        );
    }
    const errorhandler = yup.object({
        advance: yup.string().required(),
        hour: yup.string().required(),
        minutes: yup.string().required(),

    })

    return (
        <View style={{ flex: 1, backgroundColor: '#101010' }}>
            <View style={{ marginTop: Constants.statusBarHeight, flex: 1, marginBottom: 100 }}>
                <Customindividual navigation={navigation} header={'IndividualsInfo'} />

                <TouchableOpacity onPress={() => setModel(true)} style={{ alignItems: 'flex-end', paddingRight: 15 }}><Ionicons name="md-add" size={35} color="yellowgreen" /></TouchableOpacity>

                <View >
                    <View style={{ margin: 15 }}>
                        <Text style={{ color: 'white', fontSize: 15 }}>NAME : {details.name}</Text>
                    </View>
                    <View style={{ margin: 15, marginTop: 0, marginBottom: 0 }}>

                        <Text style={{ color: 'white', fontSize: 15 }}>PLACE : {details.place}</Text>

                    </View>

                </View>
                <View style={{ marginTop: 15 }}>



                    <Tabletab tabletabname={detai} personname={details.name} key={`forceupdate-todo-${forceUpdateId}`} onPressItem={id =>
                        db.transaction(
                            tx => {
                                {
                                    (id > 0) ?
                                        (tx.executeSql(`delete from ` + `` + details.name + `` + ` where id = ?;`, [id]),
                                            tx.executeSql(
                                                `select * from ` + `` + details.name + `` + ` ;`,
                                                [],
                                                (_, { rows: { _array } }) => setDetai(_array),
                                            ))
                                        :
                                        (
                                            tx.executeSql(
                                                `select * from ` + `` + details.name + `` + ` ;`,
                                                [],
                                                (_, { rows: { _array } }) => setDetai(_array),
                                            )
                                        )
                                }
                            },
                            null,
                            forceUpdate
                        )
                    } />
                </View>

            </View>

            <Modal visible={model} transparent={true} animationType={'slide'}>
                <BlurView intensity={180} tint='dark' style={[StyleSheet.absoluteFill, { height: 400, marginTop: 150, marginBottom: 200, marginLeft: 20, marginRight: 20, borderRadius: 10 }]}>
                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 10 }}>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Enter Details</Text>
                        </View>
                        <View style={{ flex: .5 }}>
                            <TouchableHighlight onPress={() => setModel(!model)} style={{ alignItems: 'flex-end' }}>
                                <Entypo name="cross" size={40} color="red" />
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View>

                        <Formik
                            initialValues={{ advance: '', hour: '', minutes: '', choosedate: { choosedate }['choosedate'], checked: { checked }['checked'] }}
                            validationSchema={errorhandler}
                            onSubmit={(values, actions) => {
                                nData(values);
                                actions.resetForm();
                            }}
                        >
                            {(props) => (
                                <View style={{ paddingLeft: 28, paddingRight: 28 }}>
                                    <View style={{ marginBottom: 10, height: 38, flexDirection: 'row' }}>

                                        <View style={{ flex: 1, }}>
                                            <TextInput
                                                style={[styles.textinput, { alignItems: 'center', color: 'white', backgroundColor: '#191919', marginRight: 5, textAlign: 'center', borderRadius: 7, }]}
                                                placeholder='Hour'
                                                onChangeText={props.handleChange('hour')}
                                                value={props.values.hour}

                                                keyboardType='numeric'
                                            />

                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <TextInput
                                                style={[styles.textinput, { marginBottom: 30, marginLeft: 5, color: 'white', backgroundColor: '#191919', textAlign: 'center' }]}
                                                placeholder='Minutes'
                                                onChangeText={props.handleChange('minutes')}
                                                value={props.values.minutes}

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

                                    <TextInput
                                        style={[styles.textinput, { alignItems: 'center', color: 'white', backgroundColor: '#191919', marginRight: 5, textAlign: 'center', borderRadius: 7, }]}
                                        placeholder='advance amount'
                                        onChangeText={props.handleChange('advance')}
                                        value={props.values.advance}
                                        keyboardType='numeric'
                                    />

                                    <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.advance && props.errors.advance}</Text>
                                    <DateTimePickerModal
                                        isVisible={datevisiblity}
                                        onConfirm={dateconfirm}
                                        onCancel={datecancel}
                                        mode={'date'}
                                        datePickerModeAndroid={'spinner'}
                                    />
                                    <View style={{ flexDirection: 'row', height: 40, marginBottom: 15, borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}>
                                        <TouchableNativeFeedback style={{ flex: 1, }} onPress={touchshow}><Text style={{ color: 'white', marginTop: 8, fontSize: 15, fontWeight: 'bold' }}>Tap For Date :</Text></TouchableNativeFeedback>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingLeft: 8, flex: 1, marginBottom: 15 }}><Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{choosedate}</Text></View>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginBottom: 20, }}>
                                        <View style={{ flex: 1, flexDirection: 'row', marginRight: 9, borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}>
                                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>2 Wheeler</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <RadioButton
                                                    value="2"
                                                    status={checked === '2' ? 'checked' : 'unchecked'}
                                                    onPress={() => setChecked('2')}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }}>
                                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>4 Wheeler</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                                <RadioButton
                                                    value='4'
                                                    status={checked === '4' ? 'checked' : 'unchecked'}
                                                    onPress={() => setChecked('4')}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 30 }}>
                                        <Button title="Submit" color='yellowgreen' onPress={props.handleSubmit} />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </BlurView>
            </Modal>

        </View >
    )
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