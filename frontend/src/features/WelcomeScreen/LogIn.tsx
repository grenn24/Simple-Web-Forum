import { Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { postJSON } from "../../utilities/apiClient";

interface Prop {
	opacity: number;
	visibility: string;
}
const LogIn = ({ opacity, visibility }: Prop) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm();
	const navigate = useNavigate();
	const handleFormSubmit = handleSubmit((data) =>
		postJSON(
			"https://simple-web-forum-backend-61723a55a3b5.herokuapp.com/authentication/log-in",
			{
				email: data.email,
				password: data.password,
			},
			(res) => {
				const responseHeaders = res.headers;
				const jwtToken = responseHeaders["authorization"].split(" ")[1];
				Cookies.set("jwtToken", jwtToken);
				navigate("../Following");
			},
			(err) => {
				const responseBody = err.data;
				if (responseBody.errorCode === "UNAUTHORISED") {
					setError("email", {
						type: "custom",
						message: responseBody.message,
					});
					setError("password", {
						type: "custom",
						message: responseBody.message,
					});
				}
			}
		)
	);

	return (
		<Box
			position="absolute"
			top="50%"
			sx={{
				transform: "translateY(-50%) translateX(50%)",
				opacity: opacity,
				visibility: visibility,
				transition: "all 1.0s ease-in-out",
			}}
			{...register("email", { required: true })}
		>
			<form onSubmit={handleFormSubmit}>
				<TextField
					label="Email"
					variant="outlined"
					{...register("email", { required: "The email field is required" })}
					error={!!errors.email}
					helperText={errors.email ? (errors.email.message as String) : null}
				/>
				<br />
				<br />
				<TextField
					label="Password"
					type="password"
					variant="outlined"
					{...register("password", {
						required: "The password field is required",
					})}
					error={!!errors.password}
					helperText={
						errors.password ? (errors.password.message as String) : null
					}
				/>
				<Button type="submit" buttonStyle={{ display: "none" }}>
					Submit
				</Button>
			</form>
		</Box>
	);
};

export default LogIn;
