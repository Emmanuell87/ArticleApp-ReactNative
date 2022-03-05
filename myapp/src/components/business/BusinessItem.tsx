import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IBusiness } from "../../interface/api.interface";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface IProps {
	business: IBusiness;
	handleDelete: (id: number) => Promise<void>;
}

const BusinessItem = ({ business, handleDelete }: IProps) => {
	const navigation = useNavigation();

	const deleteBusiness = () => {
		if (business.id) {
			handleDelete(business.id);
		}
	};

	const editBusiness = () => {
		if (business.id) {
			navigation.navigate("BusinessFormScreen", { id: business.id });
		}
	};
	return (
		// <View style={styles.itemContainer}>
		<TouchableOpacity
			onPress={() => {
				if (business.id) {
					navigation.navigate("ArticlesListScreen", {
						business_id: business.id,
						business_name: business.name,
					});
				}
			}}
			style={styles.itemContainer}
		>
			<View>
				<Text style={styles.itemName}>{business.name}</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
				}}
			>
				<TouchableOpacity
					style={{
						padding: 7,
						borderRadius: 5,
						marginRight: 5,
					}}
					onPress={editBusiness}
				>
					<AntDesign name="edit" size={24} color="yellow" />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						padding: 7,
						borderRadius: 5,
					}}
					onPress={deleteBusiness}
				>
					<AntDesign name="delete" size={24} color="red" />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
		// </View>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		backgroundColor: "#333333",
		padding: 20,
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	itemName: {
		color: "#ffffff",
	},
	buttonText: {
		color: "#ffffff",
		textAlign: "center",
		display: "flex",
		justifyContent: "center",
	},
});

export default BusinessItem;
