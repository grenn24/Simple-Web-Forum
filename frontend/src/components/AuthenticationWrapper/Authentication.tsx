import { useEffect } from "react";
import { get } from "../../utilities/apiClient";
import { Outlet, useNavigate } from "react-router-dom";

// A wrapper for making jwt validation request to api server
const Authentication = () => {
	const navigate = useNavigate();
	useEffect(() => {
		get(
			"/authentication/validate-jwt-token",
			() => {},
			(err) => {
				// Check for errors caused by missing or invalid jwt tokens (jwt token automatically refreshed by api server if it is expired)
				const errBody = err.response.data;
				if (errBody.error_code === "INVALID_TOKEN" || "MISSING_TOKENS") {
					navigate("../Welcome");
				} else {
					navigate("../Error");
				}
			}
		);
	}, []);
	return <Outlet />;
};

export default Authentication;
