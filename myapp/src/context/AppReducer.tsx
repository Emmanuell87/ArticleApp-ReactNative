import * as SecureStore from "expo-secure-store";

// interface IState {
// 	userToken: string;
// }

// const initialState = null;

type IState = string | null;

type ActionType =
	| { type: "RESTORE-TOKEN"; token: string }
	| { type: "SIGN_IN"; token: string }
	| { type: "SIGN_OUT"; token: null };

const AppReducer = (state: IState, { type, token }: ActionType): IState => {
	switch (type) {
		case "RESTORE-TOKEN":
			return token as string;
		case "SIGN_IN":
			return token as string;
		case "SIGN_OUT":
			return token;

		default:
			return state;
	}
};

export default AppReducer;
