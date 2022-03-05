import { View, StyleSheet, StatusBar } from "react-native";
import React from "react";

interface IProps {
	children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#ffffff" barStyle={"dark-content"} />
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		padding: 20,
		flex: 1,
		alignItems: "center",
	},
});

export default Layout;
