import { Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
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
			"/authentication/log-in",
			{
				email: data.email,
				password: data.password,
			},
			() => {
				navigate("../Following");
			},
			(err) => {
				const responseBody = err.data;
				if (responseBody.error_code === "UNAUTHORISED") {
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
					helperText={errors.email?.message as string}
					fullWidth
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
					helperText={errors.password?.message as string}
					fullWidth
				/>
				<Button type="submit" buttonStyle={{ display: "none" }}>
					Submit
				</Button>
			</form>
		</Box>
	);
};

export default LogIn;
