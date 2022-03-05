import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

// interfaces
import { IArticle } from "../../interface/api.interface";
import { AntDesign } from "@expo/vector-icons";

interface IProps {
	article: IArticle;
	handleDelete: (id: number) => Promise<void>;
	isSelectedArticle: boolean;
	isSomeArticleSelected: boolean;
	selectedArticles: (id: number, name: string) => void;
}

const ArticleItem = ({
	article,
	handleDelete,
	isSelectedArticle,
	isSomeArticleSelected,
	selectedArticles,
}: IProps) => {
	console.log("aaaaaaaa");
	const navigation = useNavigation();
	const [isChecked, setChecked] = useState(false);
	useEffect(() => {
		// console.log("is selected", isSelectedArticles);
		if (isSelectedArticle) {
			setChecked(true);
		} else {
			setChecked(false);
		}
		// if (allSelectedArticles.includes(article.id as number)) {
		// 	setChecked(true);
		// }
	}, [isSelectedArticle, isSomeArticleSelected]);

	const deleteArticle = () => {
		if (article.id && article.business_id) {
			handleDelete(article.id);
		}
	};

	const selectedArticle = () => {
		setChecked(!isChecked);
		selectedArticles(article.id as number, article.name);
	};

	const editArticle = () => {
		if (article.id && article.business_id) {
			navigation.navigate("ArticleFormScreen", {
				article_id: article.id,
				business_id: article.business_id,
			});
		}
	};

	return (
		<TouchableOpacity
			onPress={selectedArticle}
			style={styles.itemContainer}
		>
			{/* <TouchableOpacity
				onPress={() => {
					console.log(article);
					if (article.id) {
						navigation.navigate("ArticleFormScreen", {
							id: article.id,
						});
					}
				}}
				style={{
					flexDirection: "row",
				}}
			> */}

			<View style={styles.viewItems}>
				{isSomeArticleSelected ? (
					<Checkbox
						style={styles.checkbox}
						value={isChecked}
						onValueChange={selectedArticle}
						color={isChecked ? "#4630EB" : undefined}
					/>
				) : undefined}

				{article.image_url ? (
					<Image
						style={{
							width: 50,
							height: 50,
							marginRight: 10,
							borderRadius: 50,
						}}
						source={{ uri: article.image_url }}
					/>
				) : null}
				<View>
					<Text style={styles.itemName}>{article.name}</Text>
					<Text style={styles.itemName}>{article.description}</Text>
					<Text style={styles.itemName}>{article.quantity}</Text>
				</View>
			</View>
			{/* </TouchableOpacity> */}

			<View style={styles.viewItems}>
				<TouchableOpacity
					style={{
						padding: 7,
						borderRadius: 5,
						marginRight: 5,
					}}
					onPress={editArticle}
				>
					<AntDesign name="edit" size={24} color="yellow" />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						padding: 7,
						borderRadius: 5,
					}}
					onPress={deleteArticle}
				>
					<AntDesign name="delete" size={24} color="red" />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		backgroundColor: "#333333",
		padding: 20,
		marginVertical: 8,
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	viewItems: {
		flexDirection: "row",
		display: "flex",
		alignItems: "center",
	},
	itemName: {
		color: "#ffffff",
	},
	checkbox: {
		margin: 8,
	},
});

export default ArticleItem;
