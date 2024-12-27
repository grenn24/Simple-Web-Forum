import { Box, TextField, InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
//import Cookies from "js-cookie";
import axios from "axios";

interface Prop {
	opacity: number;
	visibility: string;
}
const SignUp = ({ opacity, visibility }: Prop) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const handleFormSubmit = handleSubmit((data) => {
		axios
			.post(
				"http://localhost:8080/authors",
				{
					name: data.name,
					username: data.username,
					email: data.email,
					password: data.password,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => console.log(res))
			.catch((err) => console.log(err));
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
			{...register("email")}
		>
			<form onSubmit={handleFormSubmit}>
				<TextField
					label="Name"
					variant="outlined"
					{...register("name", {
						required: true,
					})}
					error={!!errors.username}
					helperText={errors.username ? "The name field is required" : null}
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
						required: true,
					})}
					error={!!errors.username}
					helperText={errors.username ? "The username field is required" : null}
				/>
				<br />
				<br />
				<TextField
					label="Email"
					variant="outlined"
					{...register("email", {
						required: true,
						validate: {
							validEmail: (x) =>
								/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(x),
						},
					})}
					error={!!errors.email}
					helperText={
						errors.email
							? errors.email?.type === "required"
								? "The email field is required"
								: "Invalid Email"
							: null
					}
				/>
				<br />
				<br />
				<TextField
					label="Password"
					type="password"
					variant="outlined"
					{...register("password", {
						required: true,
						validate: {
							validPassword: (x) =>
								/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(x),
						},
					})}
					error={!!errors.password}
					helperText={
						errors.password
							? errors.password?.type === "required"
								? "The password field is required"
								: "Invalid Password (8-16 characters, 1 special)"
							: null
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
