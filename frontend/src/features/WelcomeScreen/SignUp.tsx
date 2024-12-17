import { Box, TextField, InputAdornment } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";

interface Prop {
	opacity: number;
	visibility: string;
}
const SignUp = ({ opacity, visibility }: Prop) => {
	const { register, handleSubmit, formState: { errors} } = useForm();
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
			<form onSubmit={handleSubmit((data) => console.log(data))}>
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
						errors.email ? (errors.email?.type === "required"
							? "The email field is required"
							: "Invalid Email") : null
					}
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
						validate: {
							validPassword: (x) =>
								/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(x),
						},
					})}
					error={!!errors.username}
					helperText={errors.username ? "The username field is required" : null}
				/>
				<br />
				<br />
				<TextField
					label="Password"
					type="password"
					variant="outlined"
					{...register("password", { required: true })}
					error={!!errors.password}
					helperText={
						errors.password ? (errors.password?.type === "required"
							? "The password field is required"
							: "Invalid Password") : null
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
