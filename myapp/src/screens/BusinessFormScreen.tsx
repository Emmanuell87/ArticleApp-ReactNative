import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { getBusiness, saveBusiness, updateBusiness } from "../api/BusinessApi";
import Layout from "../Layout/Layout";
import { AppContext } from "../context/AppContext";
import { TBusinessFormNavigation } from "../interface/navigation.interface";

const initialBusiness = {
	name: "",
};

const BusinessFormScreen = ({ navigation, route }: TBusinessFormNavigation) => {
	const { getToken } = useContext(AppContext);

	const [business, setBusiness] = useState(initialBusiness);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		if (route.params && route.params.id) {
			setEditing(true);
			navigation.setOptions({
				headerTitle: "Actualizar Business",
			});
			getBusinessForm(route.params.id);
		}
		if (business.name) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, []);

	const handleChange = (name: string, value: string | number) => {
		setBusiness({ ...business, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const token = getToken() as string;
			if (!editing) {
				await saveBusiness(business, token)
					.then(() => navigation.navigate("HomeScreen"))
					.catch((error) => {
						alert(error.response?.data.message);
					});
			} else {
				if (route.params && route.params.id) {
					updateBusiness(route.params.id, business, token)
						.then(() => {
							navigation.navigate("HomeScreen");
						})
						.catch((error) => {
							alert(error.response?.data.message);
						});
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getBusinessForm = (id: number) => {
		const token = getToken() as string;
		getBusiness(id, token)
			.then((response) => {
				const business = response.data;
				setBusiness({ name: business.name });
			})
			.catch((error) => {
				alert("error");
			});
	};

	return (
		<Layout>
			<TextInput
				style={styles.input}
				placeholder="Escribe un nombre"
				placeholderTextColor="#546574"
				onChangeText={(text) => handleChange("name", text)}
				value={business.name}
			/>
			{!editing ? (
				<TouchableOpacity
					style={styles.buttonSave}
					disabled={buttonDisabled}
					onPress={() => handleSubmit()}
				>
					<Text style={styles.buttonText}>Save Article</Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={styles.buttonUpdate}
					disabled={buttonDisabled}
					onPress={() => handleSubmit()}
				>
					<Text style={styles.buttonText}>Update Article</Text>
				</TouchableOpacity>
			)}
		</Layout>
	);
};

const styles = StyleSheet.create({
	input: {
		width: "90%",
		marginBottom: 7,
		fontSize: 14,
		borderWidth: 1,
		borderColor: "#10ac84",
		height: 35,
		color: "#ffffff",
		textAlign: "center",
		padding: 4,
		borderRadius: 5,
	},
	buttonSave: {
		paddingVertical: 10,
		borderRadius: 5,
		marginBottom: 10,
		backgroundColor: "#10ac84",
		width: "90%",
	},
	buttonUpdate: {
		padding: 10,
		paddingBottom: 10,
		borderRadius: 5,
		marginBottom: 3,
		backgroundColor: "#e58e26",
		width: "90%",
	},
	buttonText: {
		color: "#ffffff",
		textAlign: "center",
	},
});

export default BusinessFormScreen;
