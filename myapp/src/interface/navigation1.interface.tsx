import {
	createNativeStackNavigator,
	NativeStackScreenProps,
	NativeStackNavigationProp,
} from "@react-navigation/native-stack";

type RootStackParamList = {
	HomeScreen: undefined;
	AuthScreen: undefined;
	SignUpScreen: undefined;
	SignInScreen: undefined;
	BusinessFormScreen: { id: number } | undefined;
	ArticleFormScreen: { id: number | undefined; business_id: number };
	ArticlesListScreen: { id: number };
	ScannerQrScreen: undefined;
};

// types for props in case you need navigation
export type THomeNavigation = NativeStackScreenProps<
	RootStackParamList,
	"HomeScreen"
>;

export type TAuthNavigation = NativeStackScreenProps<
	RootStackParamList,
	"AuthScreen"
>;

export type TSignUpNavigation = NativeStackScreenProps<
	RootStackParamList,
	"SignUpScreen"
>;

export type TSignInNavigation = NativeStackScreenProps<
	RootStackParamList,
	"SignInScreen"
>;

export type TBusinessFormNavigation = NativeStackScreenProps<
	RootStackParamList,
	"BusinessFormScreen"
>;

export type TArticlesListScreen = NativeStackScreenProps<
	RootStackParamList,
	"ArticlesListScreen"
>;

export type TArticleFormNavigation = NativeStackScreenProps<
	RootStackParamList,
	"ArticleFormScreen"
>;

export type TScannerQrScreen = NativeStackScreenProps<
	RootStackParamList,
	"ScannerQrScreen"
>;

// for useNavigation
// export type HomeUseNavigation = NativeStackNavigationProp<
// 	RootStackParamList,
// 	"HomeScreen"
// >;

// export type ArticleFormUseNavigation = NativeStackNavigationProp<
// 	RootStackParamList,
// 	"ArticleFormScreen"
// >;

// export interface INavigation {
// 	navigation: NativeStackScreenProps<RootStackParamList, "HomeScreen">;
// }

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export const Stack = createNativeStackNavigator<RootStackParamList>();
