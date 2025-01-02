import { Box, TextField, InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../../utilities/apiClient";

interface Prop {
	opacity: number;
	visibility: string;
}
const SignUp = ({ opacity, visibility }: Prop) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm();
	const navigate = useNavigate();
	const handleFormSubmit = handleSubmit((data) => {
		postJSON(
			"/authentication/sign-up",
			{
				name: data.name,
				username: data.username,
				email: data.email,
				password: data.password,
			},
			() => {
				navigate("../Following");
			},
			(err) => {
				console.log(err);
				const errBody = err.data;
				if (errBody.error_code === "EMAIL_ALREADY_EXISTS") {
					setError("email", {
						type: "custom",
						message: errBody.message,
					});
				}
				if (errBody.error_code === "NAME_ALREADY_EXISTS") {
					setError("name", {
						type: "custom",
						message: errBody.message,
					});
				}
				if (errBody.error_code === "USERNAME_ALREADY_EXISTS") {
					setError("username", {
						type: "custom",
						message: errBody.message,
					});
				}
			}
		);
	});

	return (
		<Box
			position="absolute"
			top="50%"
			left="50%"
			sx={{
				transform: "translateY(-50%) translateX(50%)",
				opacity: opacity,
				visibility: visibility,
				transition: "all 1.0s ease-in-out",
			}}
			textAlign="center"
		>
			<form onSubmit={handleFormSubmit}>
				<TextField
					label="Name"
					variant="outlined"
					{...register("name", {
						required: "The name field is required",
					})}
					error={!!errors.name}
					helperText={errors.name?.message as string}
					fullWidth
				/>
				<br />
				<br />
				<TextField
					label="Username"
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">@</InputAdornment>
							),
						},
					}}
					variant="outlined"
					{...register("username", {
						required: "The username field is required",
					})}
					error={!!errors.username}
					helperText={errors.username?.message as string}
					fullWidth
				/>
				<br />
				<br />
				<TextField
					label="Email"
					variant="outlined"
					{...register("email", {
						required: "The email field is required",
						validate: {
							validEmail: (x) =>
								/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(x) ||
								"Invalid Email",
						},
					})}
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
						validate: {
							validPassword: (x) =>
								/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(x) ||
								"Invalid Password (8-16 characters, 1 special)",
						},
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

export default SignUp;
