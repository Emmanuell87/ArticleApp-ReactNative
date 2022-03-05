import {
	FlatList,
	Image,
	ListRenderItem,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { IArticle } from "../../interface/api.interface";
import { useIsFocused } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import QRCode from "react-native-qrcode-svg";
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";

// import QRCode from 'react-native-qrcode-image';

// components
import ArticleItem from "./ArticleItem";
import { AppContext } from "../../context/AppContext";

import { createQRcode } from "../../Tools/generateHtmlQrCode";

// api
import { getArticles, deleteArticle } from "../../api/ArticlesApi";

// interfaces
interface IProps {
	business_id: number;
	business_name: string;
}

interface IDataForQr {
	id: number;
	name: string;
}

const ArticleList = ({ business_id }: IProps) => {
	console.log(business_id);
	const { getToken } = useContext(AppContext);

	const [articles, setAticles] = useState([] as IArticle[]);
	const [refreshing, setRefreshing] = useState(false);
	const [allSelectedArticles, setAllSelectedArticles] = useState(
		[] as IDataForQr[]
	);
	const [isAllSelect, setIsAllSelect] = useState(false);

	const isFocused = useIsFocused();

	const loadArticles = () => {
		// const data: IArticle[] = await getArticles();
		const token = getToken() as string;
		getArticles(business_id, token)
			.then((response) => {
				setAticles(response.data);
			})
			.catch((error) => {
				// console.log(error);
				alert(error.response?.data.message);
			});
	};

	useEffect(() => {
		if (isFocused) {
			loadArticles();
		}
	}, [isFocused]);

	const handleDelete = async (id: number) => {
		const token = getToken() as string;
		deleteArticle(id, business_id, token)
			.then(() => {
				loadArticles();
			})
			.catch((error) => {
				console.log(error.response?.data.message);
			});
	};

	const selectedArticles = (id?: number, name?: string) => {
		if (id && name) {
			console.log(
				allSelectedArticles.filter((item) => item.id === id).length ===
					0
			);
			if (
				allSelectedArticles.filter((item) => item.id === id).length ===
				0
			) {
				console.log("Aaaa");
				setAllSelectedArticles([
					...allSelectedArticles,
					{ id: id, name: name },
				]);
				if (allSelectedArticles.length === articles.length - 1) {
					setIsAllSelect(true);
				}
			} else {
				setAllSelectedArticles(
					allSelectedArticles.filter((item) => item.id !== id)
				);
				setIsAllSelect(false);
			}
		} else {
			setIsAllSelect(!isAllSelect);
			if (isAllSelect) {
				setAllSelectedArticles([]);
			} else {
				let ids: IDataForQr[] = [];

				for (let i = 0; i < articles.length; i++) {
					ids.push({
						id: articles[i].id as number,
						name: articles[i].name,
					});
				}
				setAllSelectedArticles(ids);
			}
		}
	};

	const createQr = async () => {
		const html = await createQRcode(allSelectedArticles);
		if (typeof html === "string") {
			const { uri } = await Print.printToFileAsync({
				html,
			});

			console.log(uri);
			// setUriPdf(uri);
			await shareAsync(uri, {
				UTI: ".pdf",
				mimeType: "application/pdf",
			});
		} else {
			alert("ocurrio un error");
		}
	};

	const renderItem: ListRenderItem<IArticle> = ({ item }) => {
		return (
			<ArticleItem
				article={item}
				handleDelete={handleDelete}
				isSelectedArticle={
					allSelectedArticles.filter((data) => data.id === item.id)
						.length > 0
				}
				isSomeArticleSelected={allSelectedArticles.length > 0}
				selectedArticles={selectedArticles}
			/>
		);
	};

	const onRefresh = React.useCallback(async () => {
		setRefreshing(true);
		loadArticles();
		setRefreshing(false);
	}, []);

	const qrRef = (ref: any) => {
		ref.toDataURL((data: any) => {
			console.log(data);
		});
	};

	useEffect(() => {
		// RNQRGenerator.generate({
		// 	value: "https://github.com/gevgasparyan/rn-qr-generator",
		// 	height: 100,
		// 	width: 100,
		// 	correctionLevel: "H",
		// });
	}, []);

	// const refData = React.useCallback((dataURL: any) => {
	// 	console.log(dataURL);
	// }, []);
	console.log("aaaaaaa");
	return (
		<View style={{ width: "100%", flex: 1 }}>
			{allSelectedArticles.length > 0 ? (
				<TouchableOpacity
					style={{
						flex: 0.1,
						paddingLeft: 20,
						flexDirection: "row",
						alignItems: "center",
					}}
					onPress={() => selectedArticles()}
				>
					<Checkbox
						style={{ margin: 8 }}
						value={isAllSelect}
						onValueChange={() => selectedArticles()}
						color={isAllSelect ? "#4630EB" : undefined}
					/>
					<Text
						style={{
							color: "#007aff",
							textAlign: "center",
						}}
					>
						Select All
					</Text>
				</TouchableOpacity>
			) : undefined}
			<FlatList<IArticle>
				style={{ width: "100%", flex: 0.85 }}
				data={articles}
				keyExtractor={(item) => item.id + ""}
				renderItem={renderItem}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={["#78e08f"]}
						progressBackgroundColor="#0a3d62"
					/>
				}
			/>

			{allSelectedArticles.length > 0 ? (
				<>
					<View
						style={{
							flex: 0.05,
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<TouchableOpacity
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "100%",
								backgroundColor: "#007aff",
							}}
							onPress={createQr}
						>
							<Text
								style={{
									color: "#ffffff",
									textAlign: "center",
								}}
							>
								Crear QR
							</Text>
						</TouchableOpacity>
						{/* <TouchableOpacity
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "50%",
								backgroundColor: "red",
							}}
						>
							<Text
								style={{
									color: "#ffffff",
									textAlign: "center",
								}}
							>
								Eliminar Artículos
							</Text>
						</TouchableOpacity> */}
					</View>
				</>
			) : null}
		</View>
	);
};

export default ArticleList;
