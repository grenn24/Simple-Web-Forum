import { useEffect } from "react";
import { get } from "../../utilities/api";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// A wrapper for making jwt validation request to api server (for protected routes)
const Authentication = () => {
	const navigate = useNavigate();
	const location = useLocation();
	// Trigger authentication logic whenever there is a change in route
	useEffect(() => {
		get(
			"/authentication/validate-jwt-token",
			() => {},
			(err) => {
				// Check for erros due to expired refresh tokens or missing both tokens
				// If refresh token is valid and jwt token is expired, the api server will automatically return a new jwt token
				const responseBody = err.response.data;
				if (responseBody.error_code === "INVALID_TOKEN" || "MISSING_TOKENS") {
					navigate("../Welcome");
				}
			}
		);
	}, [location]);
	return <Outlet />;
};

export default Authentication;
