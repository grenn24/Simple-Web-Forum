import {
	Box,
	TextField,
	InputAdornment,
	Card,
	CardContent,
	Typography,
	Divider,
	Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import googleIcon from "../../assets/image/google-icon.svg";
import githubIcon from "../../assets/image/github-icon.svg";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../../utilities/api";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	ArrowForwardRounded as ArrowForwardRoundedIcon,
	ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utilities/reduxHooks";
import {
	incrementStage,
	reset,
	changeEmail,
	changePassword,
	changeName,
	changeUsername,
} from "./signUpSlice";
import { motion } from "motion/react";

const SignUpStage1 = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = useForm({ mode: "onChange" });
	const navigate = useNavigate();
	const [retypedPasswordMatches, setRetypedPasswordMatches] = useState(false);
	const dispatch = useAppDispatch();
	const { currentSignUpStage, name, username, email, password } =
		useAppSelector((state) => ({
			currentSignUpStage: state.signUp.currentSignUpStage,
			name: state.signUp.name,
			username: state.signUp.username,
			email: state.signUp.email,
			birthday: state.signUp.birthday,
			biography: state.signUp.biography,
			faculty: state.signUp.faculty,
			password: state.signUp.password,
		}));
	// check if current sign up stage is at 0
	useEffect(() => {
		if (currentSignUpStage === 0) {
			navigate("/Welcome");
		}
		if (watch("password") !== "") {
			setRetypedPasswordMatches(watch("password") === watch("retypedPassword"));
		}
	}, [watch("password"), watch("retypedPassword")]);

	const handleCheckAvailability = handleSubmit((data) => {
		if (currentSignUpStage > 1) {
			navigate("../2");
		} else {
			retypedPasswordMatches &&
				postJSON(
					"/authentication/sign-up/check-availability",
					{
						name: data.name,
						username: data.username,
						email: data.email,
						password: data.password,
					},
					() => {
						dispatch(changeEmail(data.email));
						dispatch(changeName(data.name));
						dispatch(changeUsername(data.username));
						dispatch(changePassword(data.password));
						dispatch(incrementStage());
						navigate("../2");
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
		}
	});

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1.4 }}
		>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				
			>
				<Box marginBottom={3} width={350}>
					<Typography textAlign="center">Fill in your credentials</Typography>
				</Box>

				<Card elevation={4} sx={{ width: 350, marginBottom: 10 }}>
					{/*Form fields uses uncontrolled components, hence its values can only be accessed on form submission*/}
					<form>
						<CardContent>
							<Box
								width="100%"
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								marginBottom={1}
							>
								<Button
									buttonIcon={<ArrowBackRoundedIcon />}
									color="primary.dark"
									handleButtonClick={() => {
										dispatch(reset());
										navigate("/Welcome");
									}}
								/>
								<Typography fontFamily="Open Sans" fontSize={20}>
									Step 1
								</Typography>
								<Button
									buttonIcon={<ArrowForwardRoundedIcon />}
									color="primary.dark"
									handleButtonClick={handleCheckAvailability}
								/>
							</Box>
							<TextField
								label="Name"
								variant="outlined"
								{...register("name", {
									required: "The name field is required",
								})}
								error={!!errors.name}
								helperText={errors.name?.message as string}
								fullWidth
								defaultValue={name}
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
								defaultValue={username}
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
								defaultValue={email}
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
								defaultValue={password}
							/>
							<br />
							<br />
							<TextField
								label="Re-type Password"
								type="password"
								variant="outlined"
								defaultValue=""
								{...register("retypedPassword")}
								disabled={watch("password") === ""}
								error={!retypedPasswordMatches && watch("password") !== ""}
								helperText={
									!retypedPasswordMatches &&
									watch("retypedPassword") !== "" &&
									"The re-typed password does not match"
								}
								fullWidth
							/>
							<br />
							<br />
							<Divider>
								<Typography>or</Typography>
							</Divider>
							<br />
							<Button
								fullWidth
								variant="outlined"
								buttonIcon={
									<Avatar
										src={googleIcon}
										sx={{ width: 20, height: 20, mx: 1 }}
									/>
								}
							>
								Sign Up with Google
							</Button>
							<br />
							<br />
							<Button
								fullWidth
								variant="outlined"
								buttonIcon={
									<Avatar
										src={githubIcon}
										sx={{ width: 20, height: 20, mx: 1 }}
									/>
								}
							>
								Sign Up with GitHub
							</Button>
							<br />
							<br />
							<Box display="flex" justifyContent="center">
								<Button
									variant="outlined"
									buttonIcon={<ArrowForwardIosRoundedIcon />}
									iconPosition="end"
									color="primary.dark"
									disabled={
										!!errors.email ||
										!!errors.username ||
										!!errors.name ||
										!!errors.password ||
										!retypedPasswordMatches
									}
									handleButtonClick={handleCheckAvailability}
								>
									Next
								</Button>
							</Box>
						</CardContent>
					</form>
				</Card>
			</Box>
		</motion.div>
	);
};

export default SignUpStage1;
