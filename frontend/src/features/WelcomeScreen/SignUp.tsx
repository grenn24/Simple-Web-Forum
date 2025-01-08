import {
	Box,
	TextField,
	InputAdornment,
	Card,
	CardContent,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../../utilities/apiClient";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

interface Prop {
	opacity: number;
	visibility: string;
	setFormStatus: (status: string) => void;
}
const SignUp = ({ opacity, visibility, setFormStatus }: Prop) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = useForm();
	const navigate = useNavigate();
	const [retypedPasswordIsCorrect, setRetypedPasswordIsCorrect] =
		useState(false);
	const handleFormSubmit = handleSubmit((data) =>
		retypedPasswordIsCorrect && postJSON(
			"/authentication/sign-up",
			{
				name: data.name,
				username: data.username,
				email: data.email,
				password: data.password,
			},
			() => {
				navigate("..");
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
		)
	);

	useEffect(
		() =>
			setRetypedPasswordIsCorrect(
				watch("password") === watch("retypedPassword") &&
					watch("password") !== ""
			),
		[watch("password"), watch("retypedPassword")]
	);

	return (
		<Box
			position="absolute"
			top="50%"
			left="50%"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			sx={{
				transform: "translate(-50%, -50%)",
				opacity: opacity,
				visibility: visibility,
				transition: "all 1.0s ease-in-out",
			}}
		>
			<Box width="100%" display="flex" justifyContent="flex-start">
				<Button
					buttonIcon={<ArrowBackRoundedIcon />}
					color="primary.dark"
					handleButtonClick={() => setFormStatus("none")}
				/>
			</Box>

			<Card elevation={4} sx={{ width: 300 }}>
				<form onSubmit={handleFormSubmit}>
					<CardContent>
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
										/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
											x
										) || "Invalid Email",
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
						<br />
						<br />
						<TextField
							label="Re-type Password"
							type="password"
							variant="outlined"
							{...register("retypedPassword")}
							disabled={watch("password") === ""}
							error={!retypedPasswordIsCorrect && watch("retypedPassword") !== ""}
							helperText={
								!retypedPasswordIsCorrect &&
								watch("retypedPassword") !== "" &&
								"The re-typed password does not match"
							}
							fullWidth
						/>
						<Button type="submit" buttonStyle={{ display: "none" }}>
							Submit
						</Button>
						<br />
						<br />
						<Box display="flex" justifyContent="center">
							<Button
								type="submit"
								variant="outlined"
								buttonIcon={<ArrowForwardIosRoundedIcon />}
								iconPosition="end"
								color="primary.dark"
							>
								Sign Up
							</Button>
						</Box>
					</CardContent>
				</form>
			</Card>
		</Box>
	);
};

export default SignUp;
