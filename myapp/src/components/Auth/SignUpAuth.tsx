import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { signUpApi } from "../../api/AuthApi";
import { AppContext } from "../../context/AppContext";

// interface
// import { SignUpNavigation } from "../../interface/navigation.interface";

const defaultUserCredentials = {
	username: "",
	email: "",
	password: "",
};

const SignUpAuth = () => {
	const navigation = useNavigation();

	const [userCredentials, setUserCredentials] = useState(
		defaultUserCredentials
	);

	const [confirmPassword, setConfirmPassword] = useState("");

	const { signUp } = useContext(AppContext);

	const handleChange = (name: string, value: string) => {
		value = value.trim();
		if (name === "confirmPassword") {
			setConfirmPassword(value);
		} else {
			setUserCredentials({
				...userCredentials,
				[name]: value,
			});
		}
	};

	const LogIn = () => {
		navigation.navigate("SignInScreen");
	};

	const following = () => {
		if (confirmPassword === userCredentials.password) {
			signUp(userCredentials);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.viewInputs}>
				<TextInput
					style={styles.input}
					placeholder="Ingrese un nombre de usuario"
					placeholderTextColor="#546574"
					onChangeText={(text) => handleChange("username", text)}
					value={userCredentials.username}
					autoCorrect={false}
				/>
				<TextInput
					style={styles.input}
					placeholder="Ingresa tu correo electrónico"
					placeholderTextColor="#546574"
					onChangeText={(text) => handleChange("email", text)}
					value={userCredentials.email}
				/>
				<TextInput
					style={styles.input}
					secureTextEntry={true}
					placeholder="Ingresa una contraseña"
					placeholderTextColor="#546574"
					onChangeText={(text) => handleChange("password", text)}
					value={userCredentials.password}
				/>
				<TextInput
					style={styles.input}
					secureTextEntry={true}
					placeholder="Confirma tu contraseña"
					placeholderTextColor="#546574"
					onChangeText={(text) =>
						handleChange("confirmPassword", text)
					}
					value={confirmPassword}
				/>
			</View>
			<View style={styles.viewButtons}>
				<TouchableOpacity
					style={styles.buttonLogIn}
					onPress={() => LogIn()}
				>
					<Text style={styles.buttonText}>Iniciar Sesión</Text>
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
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		// borderWidth: 5,
	},

	viewInputs: {
		width: "100%",
		flex: 0.9,

		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		// borderWidth: 5,
		// heigth: "50%",
	},

	input: {
		width: "90%",
		marginBottom: 30,
		fontSize: 14,
		borderWidth: 1,
		borderColor: "#10ac84",
		height: 35,
		color: "#333333",
		textAlign: "center",
		padding: 4,
		borderRadius: 5,
	},

	viewButtons: {
		display: "flex",
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		width: "100%",
		flex: 0.1,
		// borderWidth: 5,
	},

	buttonLogIn: {
		padding: 10,
		paddingBottom: 10,
		borderRadius: 5,
		marginBottom: 3,
		width: "35%",
	},

	buttonFollowing: {
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

export default SignUpAuth;
