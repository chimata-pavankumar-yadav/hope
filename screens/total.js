import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TextInput, Button, ScrollView, Alert, ToastAndroid, Keyboard, FlatList, Modal, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Formik } from 'formik';
import { BlurView } from 'expo-blur';
import * as yup from 'yup';
import * as SQLite from 'expo-sqlite';
import { MaterialIcons } from '@expo/vector-icons';



function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];

}

function Finalamount({ detai, twoprice, fourprice }) {
  const [mnny, setMnny] = useState(0);
  const [num, setNum] = useState(0);

  if (detai[num]) {
    if ((detai[num].wheeler) === '2') {

      setMnny(mnny + (detai[num].hour * (twoprice * 60)) + (detai[num].minutes * twoprice));
      setNum(num + 1);
    } else {
      setMnny(mnny + (detai[num].hour * (fourprice * 60)) + (detai[num].minutes * fourprice));
      setNum(num + 1);
    }
  }

  return (
    <View>
      <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', color: 'yellowgreen' }}>TOTAL AMOUNT :   {mnny}</Text>
    </View>
  )
}



export default function Tabletab({ personname, onPressItem, }) {
  const db = SQLite.openDatabase("detailss.db");
  const [nid, setNid] = useState(null);
  const [newdetai, setNewdetai] = useState();
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [modeltime, setModeltime] = useState(false);
  const [twowheelprice, setTwowheelprice] = useState(null);
  const [fourwheelprice, setFourwheelprice] = useState(null);



  const errorhandler = yup.object({

    hour: yup.string().required(),
    minutes: yup.string().required(),

  })

  const errorhandlertwo = yup.object({

    twowheel: yup.string().required(),
    fourwheel: yup.string().required(),

  })


  useEffect(() => {


    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists wheeldeta (id integer primary key not null, twowheel int, fourwheel int);"
      );
      tx.executeSql("insert into wheeldeta (twowheel,fourwheel) values (?, ?)",
        [30, 40]);
      tx.executeSql(
        `select * from ` + `` + personname + `` + ` ;`,
        [],
        (_, { rows: { _array } }) => setNewdetai(_array),
      );
      tx.executeSql(
        `select * from wheeldeta where id = 1;`, [],
        (_, { rows: { _array } }) => setTwowheelprice(_array[0].twowheel),
      );
      tx.executeSql(
        `select * from wheeldeta where id = 1;`, [],
        (_, { rows: { _array } }) => setFourwheelprice(_array[0].fourwheel),
      );


    });
  }, []);



  const timedata = (data) => {

    db.transaction(
      tx => {
        tx.executeSql('UPDATE ' + '' + personname + '' + ' set hour=?, minutes=?  where id=?',
          [data.hour, data.minutes, nid]);

        tx.executeSql(
          `select * from ` + `` + personname + `` + ` ;`,
          [],
          (_, { rows: { _array } }) => setNewdetai(_array),
        );

      },

      console.log('data added'),
      forceUpdate

    );
    onPressItem && onPressItem(0)
  }


  const [indivimodel, setIndivimodel] = useState(false);

  const wheeldata = (data) => {
    db.transaction(
      tx => {
        tx.executeSql('UPDATE wheeldeta set twowheel=?, fourwheel=?  where id=?',
          [data.twowheel, data.fourwheel, 1]);

        tx.executeSql(
          `select * from wheeldeta where id = 1 ;`,
          [],
          (_, { rows: { _array } }) => setTwowheelprice(_array[0].twowheel),
        );

        tx.executeSql(
          `select * from wheeldeta where id = 1 ;`,
          [],
          (_, { rows: { _array } }) => setFourwheelprice(_array[0].fourwheel),
        );

      },

      console.log('data added'),
      forceUpdate

    );
    setIndivimodel(!indivimodel);
    onPressItem && onPressItem(0)
  }

  if (fourwheelprice === null) {
    return false;
  }



  return (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 20, height: 30 }}>
        <View style={{ flex: 1.5, marginLeft: 15, }}>

          <Finalamount detai={newdetai} twoprice={twowheelprice} fourprice={fourwheelprice} />

        </View>
        <View style={{ flex: 1 }}></View>

      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
        <View style={{ padding: 10, flex: 1.5, marginRight: 20, borderWidth: 1, borderColor: 'white', borderRadius: 7, alignItems: 'center', backgroundColor: 'black' }}>
          <Text style={{ color: 'white' }}>Two Wheeler cost/minute    -  <Text style={{ color: 'yellowgreen', fontWeight: 'bold', fontSize: 18 }}>{twowheelprice}</Text> </Text>
          <Text style={{ color: 'white' }}>Four Wheeler cost/minute   -  <Text style={{ color: 'yellowgreen', fontWeight: 'bold', fontSize: 18 }}>{fourwheelprice}</Text></Text>
        </View>

        <TouchableOpacity onPress={() => setIndivimodel(true)} style={{
          flex: 1, height: 30, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderRadius: 7, backgroundColor: 'black',
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            change price
          </Text>
        </TouchableOpacity>

      </View>

      <View style={{ flexDirection: 'row', backgroundColor: 'yellowgreen', borderRadius: 7, borderBottomLeftRadius: 0, borderBottomEndRadius: 0, height: 38, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1.3, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Date</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Advance</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Wheels</Text>
        </View>
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Time</Text>
        </View >

        <View style={{ flex: 1, }}>
          <Text style={{ fontWeight: 'bold' }}>Amount</Text>
        </View>
      </View>
      <View >
        <FlatList
          data={newdetai}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flex: 1.3, justifyContent: 'center', marginLeft: 2 }}>
                <Text style={{ color: 'white', fontSize: 13, }}>{item.choosedate}</Text>
              </View>
              <View style={{ flex: .7, justifyContent: 'center', }}>
                <Text style={{ color: 'white', fontSize: 15, }}>{item.advance}</Text>
              </View>
              <View style={{ flex: .7, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 15, }}>{item.wheeler}</Text>
              </View>
              <View style={{ flex: .9, justifyContent: 'center', alignItems: 'center' }}>
                {item.hour === '0' && item.minutes === '0'
                  ? <TouchableOpacity onPress={() => [setModeltime(true), setNid(item.id)]}>
                    <Ionicons name="md-add" size={28} color="yellowgreen" />
                  </TouchableOpacity>
                  : <Text style={{ color: 'white', fontSize: 15, }}>{item.hour}h:{item.minutes}m</Text>}

              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>

                <View style={{ flex: 2 }}>
                  {((item.wheeler) === '2') ? <Text style={{ padding: 8, color: 'white', fontSize: 13, }}>{(item.hour * (twowheelprice * 60) + item.minutes * twowheelprice) - item.advance}</Text> : <Text style={{ padding: 8, color: 'white', fontSize: 13 }}>{(item.hour * (fourwheelprice * 60) + item.minutes * fourwheelprice) - item.advance}</Text>}
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity
                    key={item.id}

                    onPress={() =>
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
                  >


                    <MaterialIcons name="delete" size={20} color="white" />

                  </TouchableOpacity>

                </View>
              </View >
            </View>
          )}
          keyExtractor={(item) => (item.id).toString()}
        />


        <Modal visible={indivimodel} transparent={true} animationType={'slide'}>
          <BlurView intensity={200} tint='dark' style={[StyleSheet.absoluteFill, { height: 300, marginTop: 150, marginBottom: 200, marginLeft: 20, marginRight: 20, borderRadius: 10 }]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 4 }}>

              </View>
              <View style={{ flex: .5 }}>
                <TouchableHighlight onPress={() => setIndivimodel(!indivimodel)} style={{ alignItems: 'flex-end' }}>
                  <Entypo name="cross" size={40} color="red" />
                </TouchableHighlight>
              </View>
            </View>

            <View>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 28 }}>Enter New Price / minute</Text>
              <Formik
                initialValues={{ twowheel: '', fourwheel: '' }}
                validationSchema={errorhandlertwo}
                onSubmit={(values, actions) => {
                  wheeldata(values);
                  actions.resetForm();
                }}
              >
                {(props) => (
                  <View style={{ paddingLeft: 28, paddingRight: 28 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10, height: 50, }}>
                      <View style={{ flex: 1, }}>
                        <TextInput
                          style={[styles.textinput, { alignItems: 'center', color: 'white', backgroundColor: '#191919', marginRight: 5, textAlign: 'center', borderRadius: 7, }]}
                          placeholder={' 2-wheeler'}
                          onChangeText={props.handleChange('twowheel')}
                          value={props.values.twowheel}
                          keyboardType='numeric'
                        />
                      </View>


                      <View style={{ flex: 1 }}>
                        <TextInput
                          style={[styles.textinput, { marginBottom: 30, marginLeft: 5, color: 'white', backgroundColor: '#191919', textAlign: 'center' }]}
                          placeholder={'4-Wheeler'}
                          onChangeText={props.handleChange('fourwheel')}
                          value={props.values.fourwheel}
                          keyboardType='numeric'
                        />
                      </View>

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.twowheel && props.errors.twowheel}</Text>
                      </View>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: 'white' }}>{props.touched.fourwheel && props.errors.fourwheel}</Text>
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




        <Modal visible={modeltime} transparent={true} animationType={'slide'}>
          <BlurView intensity={200} tint='dark' style={[StyleSheet.absoluteFill, { height: 300, marginTop: 150, marginBottom: 200, marginLeft: 20, marginRight: 20, borderRadius: 10 }]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 4 }}>

              </View>
              <View style={{ flex: .5 }}>
                <TouchableHighlight onPress={() => setModeltime(!modeltime)} style={{ alignItems: 'flex-end' }}>
                  <Entypo name="cross" size={40} color="red" />
                </TouchableHighlight>
              </View>
            </View>

            <View>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 28 }}>Enter Time Details</Text>
              <Formik
                initialValues={{ hour: '', minutes: '', }}
                validationSchema={errorhandler}
                onSubmit={(values, actions) => {
                  timedata(values);
                  actions.resetForm();
                }}
              >
                {(props) => (
                  <View style={{ paddingLeft: 28, paddingRight: 28 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 0, height: 40, }}>
                      <View style={{ flex: 1 }}>
                        <TextInput

                          style={[styles.textinput, { alignItems: 'center', color: 'white', marginRight: 5, textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderRadius: 7, borderColor: '#191919', borderBottomColor: 'white' }]}
                          placeholder='Hour'
                          onChangeText={props.handleChange('hour')}
                          value={props.values.hour}

                          keyboardType='numeric'
                        />

                      </View>

                      <View style={{ flex: 1 }}>
                        <TextInput
                          style={[styles.textinput, { marginBottom: 0, marginLeft: 5, color: 'white', textAlign: 'center', backgroundColor: '#191919', borderWidth: 1, borderColor: '#191919', borderBottomColor: 'white', borderRadius: 7 }]}
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

                    <View style={{ marginTop: 30 }}>
                      <Button title="Submit" color='yellowgreen' onPress={props.handleSubmit} />
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </BlurView>
        </Modal>
      </View>
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