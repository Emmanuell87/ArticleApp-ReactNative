import React, { useContext } from "react";
import SignUpAuth from "../components/Auth/SignUpAuth";
import Layout from "../Layout/Layout";
import { AppContext } from "../context/AppContext";

const SignUpScreen = () => {
	const { getToken } = useContext(AppContext);

	// console.log(getToken());

	return (
		<Layout>
			<SignUpAuth></SignUpAuth>
		</Layout>
	);
};

export default SignUpScreen;
