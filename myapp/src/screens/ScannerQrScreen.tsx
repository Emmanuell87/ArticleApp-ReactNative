import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";

const ScannerQrScreen = () => {
	const [hasPermission, setHasPermission] = useState<null | boolean>(null);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
		setScanned(true);
		alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	if (hasPermission === null) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>Requesting for camera permission</Text>
			</View>
		);
	}
	if (hasPermission === false) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>No access to camera</Text>
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
				style={StyleSheet.absoluteFillObject}
			/>
			{scanned && (
				<Button
					title={"Tap to Scan Again"}
					onPress={() => setScanned(false)}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	flexCenter: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	camDisplay: {
		flex: 1,
	},
});

export default ScannerQrScreen;
