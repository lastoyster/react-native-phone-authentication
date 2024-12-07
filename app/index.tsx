import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import { Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { usePathname, useRouter } from 'expo-router';

const index = () => {
  const pathname = usePathname();
  const router = useRouter();
  console.log('auth', auth().currentUser)
  useEffect(() => {
    console.log('auth', auth().currentUser)
  }, [])

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (pathname == "/firebaseauth/link") router.back();
  }, [pathname]);

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    console.log('phoneNumber', phoneNumber);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log('confirmation', confirmation);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (initializing) return null;

  if (!user) {
    if (!confirm) {
      return (
        <SafeAreaView style={{marginBottom: 30}}>
          <TouchableOpacity
            onPress={() => signInWithPhoneNumber('+1 805-434-7229')}
            style={{ borderColor: 'red', borderWidth: 1, marginTop: 100}}
          >
            <Text>Sign In</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView>
        <TextInput value={code} onChangeText={text => setCode(text)} style={{ borderColor: 'red', borderWidth: 1 }} />
        <Button title="Confirm Code" onPress={() => confirmCode()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text>Welcome {user.email}</Text>
      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </SafeAreaView>
  );
}

export default index