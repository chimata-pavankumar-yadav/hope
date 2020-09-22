import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Members from './screens/members';
import Home from './screens/home';
import IndividualsInfo from './screens/individual';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'black' }, headerTintColor: 'yellowgreen', headerTitleStyle: { marginRight: 15, textAlign: 'center', fontWeight: 'bold' } }} >
        <Stack.Screen name="Home" component={Home} options={{
          title: 'Home',
          headerShown: false,
        }} />
        <Stack.Screen name="Member" component={Members} options={{ title: 'Member', headerShown: false }} />
        <Stack.Screen name="IndividualsInfo" component={IndividualsInfo} options={{ title: 'IndividualsInfo', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}



