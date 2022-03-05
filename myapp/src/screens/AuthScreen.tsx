import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import SignUp from "../components/Auth/SignUpAuth";
import Layout from "../Layout/Layout";
import { TAuthNavigation } from "../interface/navigation.interface";

const AuthScreen = ({ navigation }: TAuthNavigation) => {
	const signIn = () => {
		navigation.navigate("SignInScreen");
	};

	const signUp = () => {
		navigation.navigate("SignUpScreen");
	};

	return (
		<Layout>
			<View style={styles.container}>
				<Text
					style={{
						color: "#000000",
						marginRight: 20,
						fontSize: 15,
					}}
				>
					Welcome to my app
				</Text>

				<View style={styles.viewButtons}>
					<TouchableOpacity
						style={styles.buttonEnter}
						onPress={signIn}
					>
						<Text style={styles.buttonText}>Ingresar</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.buttonBegin}
						onPress={() => signUp()}
					>
						<Text style={styles.buttonText}>Comenzar</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
	},

	viewButtons: {
		display: "flex",
		justifyContent: "flex-end",
		flexDirection: "row",
		width: "100%",
	},

	buttonEnter: {
		padding: 10,
		paddingBottom: 10,
		borderRadius: 5,
		marginBottom: 3,
		width: "25%",
	},

	buttonBegin: {
		padding: 10,
		paddingBottom: 10,
		borderRadius: 5,
		marginBottom: 3,
		backgroundColor: "#333333",
		width: "25%",
	},
	buttonText: {
		color: "#007aff",
		textAlign: "center",
	},
});

export default AuthScreen;
