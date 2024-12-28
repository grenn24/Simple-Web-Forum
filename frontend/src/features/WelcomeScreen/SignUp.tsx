import { Box, TextField, InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Prop {
	opacity: number;
	visibility: string;
}
const SignUp = ({ opacity, visibility }: Prop) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm();
	const navigate = useNavigate();
	const handleFormSubmit = handleSubmit((data) => {
		axios
			.post(
				"https://simple-web-forum-backend-61723a55a3b5.herokuapp.com/authors",
				{
					name: data.name,
					username: data.username,
					email: data.email,
					password_hash: data.password,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				const response = res.data;
				Cookies.set("authorID", response.data.author_id);

				navigate("../Following");
			})
			.catch((err) => {
				const response = err.response.data;
				if (response.errorCode === "EMAIL_ALREADY_EXISTS") {
					setError("email", {
						type: "custom",
						message: response.message,
					});
				}
				if (response.errorCode === "NAME_ALREADY_EXISTS") {
					setError("name", {
						type: "custom",
						message: response.message,
					});
				}
				if (response.errorCode === "USERNAME_ALREADY_EXISTS") {
					setError("username", {
						type: "custom",
						message: response.message,
					});
				}
			});
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
					helperText={errors.name ? (errors.name.message as String) : null}
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
					helperText={
						errors.username ? (errors.username.message as String) : null
					}
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
						validate: {
							validPassword: (x) =>
								/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(x) ||
								"Invalid Password (8-16 characters, 1 special)",
						},
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

export default SignUp;
