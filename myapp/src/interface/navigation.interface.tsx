// import {
// 	createNativeStackNavigator,
// 	NativeStackScreenProps,
// } from "@react-navigation/native-stack";
import {
	createBottomTabNavigator,
	BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";

type RootStackParamList = {
	HomeScreen: undefined;
	SalesScreen: undefined;
	AuthScreen: undefined;
	SignUpScreen: undefined;
	SignInScreen: undefined;
	BusinessFormScreen: { id: number } | undefined;
	ArticlesListScreen: { business_id: number; business_name: string };
	ArticleFormScreen: { article_id: number | undefined; business_id: number };
	ScannerQrScreen: undefined;
};

// types for props in case you need navigation
export type THomeNavigation = BottomTabScreenProps<
	RootStackParamList,
	"HomeScreen"
>;

export type TAuthNavigation = BottomTabScreenProps<
	RootStackParamList,
	"AuthScreen"
>;

export type TSignUpNavigation = BottomTabScreenProps<
	RootStackParamList,
	"SignUpScreen"
>;

export type TSignInNavigation = BottomTabScreenProps<
	RootStackParamList,
	"SignInScreen"
>;

export type TBusinessFormNavigation = BottomTabScreenProps<
	RootStackParamList,
	"BusinessFormScreen"
>;

export type TArticlesListScreen = BottomTabScreenProps<
	RootStackParamList,
	"ArticlesListScreen"
>;

export type TArticleFormNavigation = BottomTabScreenProps<
	RootStackParamList,
	"ArticleFormScreen"
>;

export type TScannerQrScreen = BottomTabScreenProps<
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

export const Stack = createBottomTabNavigator<RootStackParamList>();
