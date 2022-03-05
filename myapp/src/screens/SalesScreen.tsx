import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

interface SalesScreenProps {}

const SalesScreen = ({}: SalesScreenProps) => {
	return (
		<View style={styles.container}>
			<Text>SalesScreen</Text>
		</View>
	);
};

export default SalesScreen;

const styles = StyleSheet.create({
	container: {},
});
