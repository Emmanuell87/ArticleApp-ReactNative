import {
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import {
// 	launchCamera,
// 	launchImageLibrary,
// 	CameraOptions,
// } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { openPicker } from "react-native-image-crop-picker";
import { AppContext } from "../context/AppContext";

// API
import { saveArticle, getArticle, updateArticle } from "../api/ArticlesApi";

// components
import Layout from "../Layout/Layout";

// interfaces
import { TArticleFormNavigation } from "../interface/navigation.interface";
import { IArticle } from "../interface/api.interface";

// initialStates
const initialArticle: IArticle = {
	name: "",
	description: "",
	quantity: 0,
};

const ArticleFormScreen = ({ navigation, route }: TArticleFormNavigation) => {
	const { getToken } = useContext(AppContext);

	const [article, setArticle] = useState(initialArticle);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [editing, setEditing] = useState(false);
	const [photoBase64, setPhotoBase64] = useState("");
	const [image, setImage] = useState<string>();

	// const [status, requestPermission] = ImagePicker.useCameraPermissions();

	// const getPermissionCamera = async

	useEffect(() => {
		// (async () => {
		// 	// console.log(requestPermission);
		// 	// console.log(status);
		// 	// console.log(requestPermission);
		// 	// console.log(await ImagePicker.getCameraPermissionsAsync());
		// })();

		if (route.params) {
			if (route.params.article_id && route.params.business_id) {
				setEditing(true);
				navigation.setOptions({
					headerTitle: "Actualizar artículo",
				});
				getArticleForm(
					route.params.article_id,
					route.params.business_id
				);
			} else if (route.params.business_id) {
				console.log(route.params.business_id);
				setArticle({
					...article,
					business_id: route.params.business_id,
				});
				console.log(article);
			}
		}
	}, []);

	useEffect(() => {
		if (article.name) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [article.name]);

	const handleChange = (name: string, value: string | number) => {
		if (name === "quantity") {
			value = parseInt(value as string, 10) || 0;
		}
		setArticle({ ...article, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const token = getToken() as string;
			if (!editing) {
				const articleFormData = createFormData();
				await saveArticle(articleFormData, token)
					.then(() => {
						navigation.goBack();
					})
					.catch((error) => {
						console.log(error.response?.data.message);
					});
			} else {
				if (route.params && route.params.article_id) {
					const articleFormData = createFormData();
					updateArticle(
						route.params.article_id,
						articleFormData,
						token
					)
						.then(() => {
							navigation.goBack();
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

	const createFormData = (): FormData => {
		const data = new FormData();
		if (image) {
			let localUri = image;
			let filename = localUri.split("/").pop() as string;

			//infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : `image`;

			filename = filename.replace("file://", "");
			const photo = {
				name: filename,
				type: type,
				uri: localUri,
			};

			data.append("photo", photo as any, photo.name);
			data.append("name", article.name);
			data.append("description", article.description || "");
			data.append("quantity", article.quantity.toString());
			if (article.business_id) {
				data.append("business_id", article.business_id.toString());
			}
		} else {
			data.append("name", article.name);
			data.append("description", article.description || "");
			data.append("quantity", article.quantity.toString());
			if (article.business_id) {
				data.append("business_id", article.business_id.toString());
			}
		}

		return data;
	};

	const getArticleForm = async (id: number, business_id: number) => {
		const token = getToken() as string;
		getArticle(id, business_id, token)
			.then((response) => {
				const Article = response.data;
				setArticle({
					name: Article.name,
					description: Article.description,
					quantity: Article.quantity,
					business_id: Article.business_id,
					public_id: Article.public_id,
					image_url: Article.image_url,
				});
			})
			.catch((error) => {
				alert(error.response?.data.message);
			});
	};

	const [uriPdf, setUriPdf] = useState<any>();

	const takePicture = async () => {
		// if (status?.status === "denied") {
		// 	alert("Se denegó el permiso para acceder a la cámara");
		// } else {
		let permissionResult =
			await ImagePicker.requestCameraPermissionsAsync();
		if (!permissionResult.granted) {
			alert("Permission to access camera is required");
			return;
		}

		try {
			let result = await ImagePicker.launchCameraAsync({
				// base64: true,
				allowsEditing: true,
				aspect: [3, 3],
				quality: 1,
				base64: true,
			});

			if (!result.cancelled) {
				// ImagePicker saves the taken photo to disk and returns a local URI to it

				setImage(result.uri);
				if (result.base64) {
					setPhotoBase64("data:image/jpeg;base64," + result.base64);

					// console.log(photoBase64);
				}
			}
		} catch (error) {
			console.log(error);
		}

		// }
	};

	return (
		<Layout>
			<TextInput
				style={styles.input}
				placeholder="Escribe un nombre"
				placeholderTextColor="#546574"
				onChangeText={(text) => handleChange("name", text)}
				value={article.name}
			/>
			<TextInput
				style={styles.input}
				placeholder="Escribe una descripción"
				placeholderTextColor="#546574"
				onChangeText={(text) => handleChange("description", text)}
				value={article.description}
			/>
			<TextInput
				style={styles.input}
				placeholderTextColor="#546574"
				onChangeText={(text) => handleChange("quantity", text)}
				value={article.quantity.toString()}
				keyboardType={"number-pad"}
			/>
			{photoBase64 || article.image_url ? (
				<View
					style={{
						marginVertical: 15,
					}}
				>
					<Image
						source={{
							uri: photoBase64 || article.image_url || "",
						}}
						style={{ width: 100, height: 100, borderRadius: 50 }}
					/>
					<TouchableOpacity
						style={styles.buttonDeleteImage}
						onPress={() => {
							setArticle({
								...article,
								image_url: "",
								public_id: "",
							});
							setPhotoBase64("");
						}}
					>
						<AntDesign name="delete" size={24} color="red" />
					</TouchableOpacity>
				</View>
			) : null}

			<TouchableOpacity style={styles.buttonImage} onPress={takePicture}>
				<AntDesign name="camera" size={24} color="black" />
			</TouchableOpacity>

			{/* <AntDesign name="camera" size={24} color="black" /> */}
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
			{/* {uriPdf ? (
				<View
					style={{
						flex: 1,
					}}
				>
					<WebView
						style={{
							flex: 1,
						}}
						source={{ uri: WebView. }}
						javaScriptEnabled={true}
						//For the Cache
						domStorageEnabled={true}
					/>
				</View>
			) : null} */}
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
	buttonImage: {
		paddingVertical: 10,
		borderRadius: 50,
		marginBottom: 10,
		backgroundColor: "#10ac84",
		width: "15%",
		aspectRatio: 1 / 1,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonDeleteImage: {
		borderRadius: 50,
		aspectRatio: 1 / 1,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: -5,
		right: -5,
	},
	buttonText: {
		color: "#ffffff",
		textAlign: "center",
	},
});

export default ArticleFormScreen;
