import React, { useContext, useEffect, useReducer, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  MaterialIcons,
  Ionicons,
  Entypo,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import AppReducer from './context/AppReducer';
import { AppContext } from './context/AppContext';

// screens
import HomeScreen from './screens/HomeScreen';
import ArticleFormScreen from './screens/ArticleFormScreen';
import AuthScreen from './screens/AuthScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import BusinessFormScreen from './screens/BusinessFormScreen';
import ArticlesListScreen from './screens/ArticlesListScreen';

// interfaces
import {
  THomeNavigation,
  Stack,
  TArticlesListScreen,
} from './interface/navigation.interface';
import { IMessage, IUser } from './interface/api.interface';
// import AppProvider from "./context/AppProvider";

// API
import { signInApi, signUpApi } from './api/AuthApi';
import ScannerQrScreen from './screens/ScannerQrScreen';
import SalesScreen from './screens/SalesScreen';

const initialToken = null;
const App = () => {
  const [token, dispatchToken] = useReducer(AppReducer, initialToken);

  useEffect(() => {
    const getTokenStore = async () => {
      const userToken = await SecureStore.getItemAsync('secure_token');
      // console.log(userToken);
      if (userToken) {
        dispatchToken({ type: 'RESTORE-TOKEN', token: userToken });
      }
    };
    getTokenStore();
  }, []);

  const authContext = React.useMemo(
    () => ({
      getToken: (): string | null => {
        return token;
      },
      signIn: async (user: IUser): Promise<void | IMessage> => {
        const result = await signInApi(user);
        if (typeof result === 'string') {
          dispatchToken({ type: 'SIGN_IN', token: result });
        } else {
          return result;
        }
      },
      signOut: () => dispatchToken({ type: 'SIGN_OUT', token: null }),
      signUp: async (user: IUser): Promise<boolean | IMessage> => {
        const result = await signUpApi(user);
        return result;
      },
    }),
    [token]
  );

  return (
    <NavigationContainer>
      <AppContext.Provider value={authContext}>
        <Stack.Navigator>
          {token == null ? (
            <>
              <Stack.Screen
                name="AuthScreen"
                component={AuthScreen}
                options={() => ({
                  title: 'Article App',
                  headerStyle: { backgroundColor: '#222f3e' },
                  headerTitleStyle: { color: '#ffffff' },
                  tabBarStyle: { display: 'none' },
                })}
              ></Stack.Screen>
              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={() => ({
                  title: 'Registrate',
                  headerStyle: { backgroundColor: '#222f3e' },
                  headerTitleStyle: { color: '#ffffff' },
                  headerTintColor: '#ffffff',
                  tabBarStyle: { display: 'none' },
                })}
              ></Stack.Screen>
              <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={() => ({
                  title: 'Inicia sesión',
                  headerStyle: { backgroundColor: '#222f3e' },
                  headerTitleStyle: { color: '#ffffff' },
                  headerTintColor: '#ffffff',
                  tabBarStyle: { display: 'none' },
                })}
              ></Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={({ navigation }: THomeNavigation) => ({
                  title: 'Article App',
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#007aff' },
                  tabBarIcon: (props: {
                    focused: boolean;
                    color: string;
                    size: number;
                  }) => {
                    if (props.focused) {
                      return <Entypo name="home" size={24} color="black" />;
                    } else {
                      return <AntDesign name="home" size={24} color="black" />;
                    }
                  },
                  headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('ScannerQrScreen')}
                        style={{ marginRight: 5 }}
                      >
                        <MaterialIcons
                          name="qr-code-scanner"
                          size={24}
                          color="#007aff"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('BusinessFormScreen')
                        }
                      >
                        <Ionicons name="add" size={24} color="#007aff" />
                      </TouchableOpacity>
                    </View>
                  ),
                })}
              />
              <Stack.Screen
                name="SalesScreen"
                component={SalesScreen}
                options={{
                  title: 'Ventas',
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#007aff' },
                  tabBarIcon: (props: {
                    focused: boolean;
                    color: string;
                    size: number;
                  }) => {
                    if (props.focused) {
                      return (
                        <MaterialCommunityIcons
                          name="finance"
                          size={24}
                          color="black"
                        />
                      );
                    } else {
                      return (
                        <MaterialCommunityIcons
                          name="finance"
                          size={24}
                          color="#808080"
                        />
                      );
                    }
                  },
                }}
              />
              <Stack.Screen
                name="BusinessFormScreen"
                component={BusinessFormScreen}
                options={{
                  title: 'Crear business',
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#007aff' },
                  headerTintColor: '#ffffff',
                  tabBarItemStyle: { display: 'none' },
                }}
              />
              <Stack.Screen
                name="ArticlesListScreen"
                component={ArticlesListScreen}
                options={({ navigation }: TArticlesListScreen) => ({
                  title: 'Artículos',
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#007aff' },
                  headerTintColor: '#ffffff',
                  tabBarItemStyle: { display: 'none' },
                  headerRight: () => (
                    <>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('ScannerQrScreen')}
                        style={{ marginRight: 5 }}
                      >
                        <MaterialIcons
                          name="qr-code-scanner"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ArticleFormScreen', {
                            article_id: undefined,
                            business_id: 2,
                          })
                        }
                      >
                        <Ionicons name="add" size={24} color="white" />
                      </TouchableOpacity>
                    </>
                  ),
                })}
              />
              <Stack.Screen
                name="ArticleFormScreen"
                component={ArticleFormScreen}
                options={{
                  title: 'Crear Artículo',
                  headerStyle: { backgroundColor: '#fff' },
                  headerTitleStyle: { color: '#007aff' },
                  headerTintColor: '#ffffff',
                  tabBarItemStyle: { display: 'none' },
                }}
              />
              <Stack.Screen
                name="ScannerQrScreen"
                component={ScannerQrScreen}
                options={{
                  headerShown: false,
                  tabBarItemStyle: { display: 'none' },
                  tabBarStyle: { display: 'none' },
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </AppContext.Provider>
    </NavigationContainer>
  );
};

export default App;

// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// export default function App() {
// 	return (
// 		<View style={styles.container}>
// 			<Text>Hello World</Text>
// 			<StatusBar style="auto" />
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// });
