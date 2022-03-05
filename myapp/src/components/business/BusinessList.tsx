import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
	FlatList,
	ListRenderItem,
	RefreshControl,
	Text,
	View,
} from "react-native";
import { IBusiness } from "../../interface/api.interface";
import { getAllBusiness, deleteBusiness } from "../../api/BusinessApi";
import BusinessItem from "./BusinessItem";
import { AppContext } from "../../context/AppContext";

const BusinessList = () => {
	const { getToken } = useContext(AppContext);

	const [business, setBusiness] = useState([] as IBusiness[]);
	const [refreshing, setRefreshing] = useState(false);

	const isFocused = useIsFocused(); //si estas en la pantalla que usa este componente sera true

	const loadBusiness = async () => {
		// console.log("call to load");
		// console.log(state);
		const token = getToken() as string;
		const data = await getAllBusiness(token);
		if (Array.isArray(data)) {
			setBusiness(data);
		} else {
			alert("ocurrio un error");
		}
	};

	useEffect(() => {
		loadBusiness();
	}, [isFocused]);

	const handleDelete = async (id: number) => {
		const token = getToken() as string;
		// console.log(token);
		const result = await deleteBusiness(id, token);
		if (typeof result === "boolean") {
			await loadBusiness();
		} else {
			alert(result.message);
		}
	};

	const renderItem: ListRenderItem<IBusiness> = ({ item }) => {
		return <BusinessItem business={item} handleDelete={handleDelete} />;
	};

	const onRefresh = React.useCallback(async () => {
		setRefreshing(true);
		await loadBusiness();
		setRefreshing(false);
	}, []);

	return (
		<FlatList<IBusiness>
			style={{ width: "100%" }}
			data={business}
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
	);
};

export default BusinessList;
