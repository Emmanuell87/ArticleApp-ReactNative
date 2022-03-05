// import React, { useEffect, useReducer } from "react";
// import { IMessage, IUser } from "../interface/api.interface";
// import { AppContext } from "./AppContext";
// import AppReducer from "./AppReducer";
// import * as SecureStore from "expo-secure-store";
// import { signInApi, signUpApi } from "../api/AuthApi";

// interface IProps {
// 	children: React.ReactChild | React.ReactChild[];
// }

// const token = null;

// const AppProvider = ({ children }: IProps) => {
// 	const [state, dispatchState] = useReducer(AppReducer, token);

// 	useEffect(() => {
// 		const getTokenStore = async () => {
// 			const userToken = await SecureStore.getItemAsync("secure_token");
// 			// console.log(userToken);
// 			console.log("getToken", state);
// 			if (userToken) {
// 				dispatchState({ type: "RESTORE-TOKEN", token: userToken });
// 				console.log("getToken", state);
// 			}
// 		};
// 		getTokenStore();
// 	}, []);

// 	const authContext = React.useMemo(
// 		() => ({
// 			getToken: (): string | null => {
// 				console.log("memo", state);
// 				return state;
// 			},
// 			signIn: async (user: IUser): Promise<void | IMessage> => {
// 				const result = await signInApi(user);
// 				if (typeof result === "string") {
// 					dispatchState({ type: "SIGN_IN", token: result });
// 				} else {
// 					return result;
// 				}
// 			},
// 			signOut: () => dispatchState({ type: "SIGN_OUT", token: null }),
// 			signUp: async (user: IUser): Promise<boolean | IMessage> => {
// 				// const result = await signUpApi(user);
// 				// return result;
// 				return true;
// 			},
// 		}),
// 		[state]
// 	);

// 	console.log("constext", state);

// 	return (
// 		<AppContext.Provider value={authContext}>
// 			{children}
// 		</AppContext.Provider>
// 	);
// };

// export default AppProvider;
