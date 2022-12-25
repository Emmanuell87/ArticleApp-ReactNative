import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AppContext } from '../../context/AppContext';
import { Entypo } from '@expo/vector-icons';

// api

const defaultUserCredentials = {
  email: '',
  password: '',
};

const SignInAuth = () => {
  const navigation = useNavigation();

  const [userCredentials, setUserCredentials] = useState(
    defaultUserCredentials
  );
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useContext(AppContext);

  const handleChange = (name: string, value: string) => {
    value = value.trim();
    setUserCredentials({
      ...userCredentials,
      [name]: value,
    });
  };

  const signUp = () => {
    navigation.navigate('SignUpScreen');
  };

  const following = async () => {
    // const result = await signInApi(userCredentials);
    signIn(userCredentials);

    // console.log(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewInputs}>
        <TextInput
          style={styles.input}
          placeholder="correo"
          placeholderTextColor="#546574"
          onChangeText={(text) => handleChange('email', text)}
          value={userCredentials.email}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="contraseña"
          placeholderTextColor="#546574"
          onChangeText={(text) => handleChange('password', text)}
          value={userCredentials.password}
        />

        <Entypo name="eye-with-line" size={24} color="black" />
      </View>
      <View style={styles.viewButtons}>
        <TouchableOpacity style={styles.buttonSignUp} onPress={() => signUp()}>
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonFollowing}
          onPress={() => following()}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewInputs: {
    width: '100%',
    flex: 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 5,
    // heigth: "50%",
  },

  input: {
    width: '90%',
    marginBottom: 30,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#10ac84',
    height: 35,
    color: '#333333',
    textAlign: 'center',
    padding: 4,
    borderRadius: 5,
  },

  viewButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    flex: 0.1,
    // borderWidth: 5,
  },

  buttonSignUp: {
    padding: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginBottom: 3,
    width: '35%',
  },

  buttonFollowing: {
    padding: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginBottom: 3,
    backgroundColor: '#333333',
    width: '25%',
  },

  buttonText: {
    color: '#007aff',
    textAlign: 'center',
  },
});

export default SignInAuth;
