import React from "react";

//components
import Layout from "../Layout/Layout";
import ArticleList from "../components/articles/ArticleList";

// interfaces
import { TArticlesListScreen } from "../interface/navigation.interface";
import { View } from "react-native";

const ArticlesListScreen = ({ route }: TArticlesListScreen) => {
	if (!route.params.business_id || !route.params.business_name) {
		return <View></View>;
	}
	return (
		<Layout>
			<ArticleList
				business_id={route.params.business_id}
				business_name={route.params.business_name}
			/>
		</Layout>
	);
};

export default ArticlesListScreen;
