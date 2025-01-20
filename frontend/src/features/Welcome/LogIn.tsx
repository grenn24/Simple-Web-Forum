import {
	Avatar,
	Box,
	Card,
	CardContent,
	Divider,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get, postJSON } from "../../utilities/api";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
	CheckRounded as CheckRoundedIcon,
} from "@mui/icons-material";
import { motion } from "motion/react";
import googleIcon from "../../assets/image/google-icon.svg";
import githubIcon from "../../assets/image/github-icon.svg";
import successSound from "../../assets/audio/success-sound.mp3";
import playerGenerator from "../../utilities/playerGenerator";
import { useEffect, useState } from "react";
import Snackbar from "../../components/Snackbar";
import { useGoogleLogin } from "@react-oauth/google";





const LogIn = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm();
	const navigate = useNavigate();
	const player = playerGenerator(
		successSound,
		0.7,
		{ default: [0, 2000] },
		"default"
	);
	const [isLoading, setIsLoading] = useState(false);
	const [loginSuccess, setLoginSuccess] = useState(false);
	const [searchParams, _] = useSearchParams();
	const code = searchParams.get("code");
	const [openLogInErrorSnackbar, setOpenLogInErrorSnackbar] = useState(false);
	const handleGoogleLogIn = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			setIsLoading(true);
			get(
				"/authentication/oauth?provider=google",
				() => {
					setIsLoading(false);
					setLoginSuccess(true);
					player();
					setTimeout(() => navigate("/"), 1000);
				},
				(err) => console.log(err),
				{ Authorization: "Bearer " + tokenResponse.access_token }
			);
		},
	});

	const handleGitHubLogIn = () => {
		const clientID = import.meta.env.VITE_GITHUB_CLIENT_ID;
		const currentUrl = window.location.href;
		window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${currentUrl}`;
	};

	const handleFormSubmit = handleSubmit((data) => {
		setIsLoading(true);
		postJSON(
			"/authentication/log-in",
			{
				email: data.email,
				password: data.password,
			},
			() => {
				setIsLoading(false);
				setLoginSuccess(true);
				player();
				setTimeout(() => navigate("/"), 1000);
			},
			(err) => {
				const responseBody = err.data;
				setIsLoading(false);
				// Check if error is due to invalid email or password
				if (responseBody.error_code === "UNAUTHORISED") {
					setError("email", {
						type: "custom",
						message: responseBody.message,
					});
					setError("password", {
						type: "custom",
						message: responseBody.message,
					});
				} else {
					setOpenLogInErrorSnackbar(true);
				}
			}
		);
	});

	// After callback, make a post request to api with authorisation code
	useEffect(() => {
		if (code) {
			setIsLoading(true);
			postJSON(
				"/authentication/oauth?provider=github",
				{ authorisationCode: code },
				() => {
					setIsLoading(false);
					setLoginSuccess(true);
					player();
					setTimeout(() => navigate("/"), 1000);
				},
				(err) => console.log(err)
			);
		}
	}, [code]);

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
				{...register("email", { required: true })}
			>
				<Card elevation={4} sx={{ width: 350, marginBottom: 5 }}>
					<form onSubmit={handleFormSubmit}>
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
									handleButtonClick={() => navigate("/Welcome")}
								/>
								<Typography fontFamily="Open Sans" fontSize={20}></Typography>
								<Button
									buttonIcon={<ArrowBackRoundedIcon />}
									color="primary.dark"
									buttonStyle={{ opacity: 0, cursor: "default" }}
								/>
							</Box>
							<TextField
								label="Email"
								autoComplete="email"
								variant="outlined"
								{...register("email", {
									required: "The email field is required",
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
								})}
								error={!!errors.password}
								helperText={errors.password?.message as string}
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
								handleButtonClick={() => handleGoogleLogIn()}
								buttonIcon={
									<Avatar
										src={googleIcon}
										sx={{ width: 20, height: 20, mx: 1 }}
									/>
								}
							>
								Log In with Google
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
								handleButtonClick={() => handleGitHubLogIn()}
							>
								Log In with GitHub
							</Button>
							<br />
							<br />
							<Box display="flex" justifyContent="center">
								<Button
									type="submit"
									variant="outlined"
									buttonIcon={
										loginSuccess ? undefined : <ArrowForwardIosRoundedIcon />
									}
									iconPosition="end"
									color={loginSuccess ? "white" : "primary.dark"}
									loadingStatus={isLoading}
									backgroundColor={loginSuccess ? "green" : "inherit"}
								>
									{loginSuccess ? <CheckRoundedIcon /> : "Log In"}
								</Button>
							</Box>
						</CardContent>
					</form>
				</Card>
			</Box>

			{/*Log In Error Snackbar*/}
			<Snackbar
				openSnackbar={openLogInErrorSnackbar}
				setOpenSnackbar={setOpenLogInErrorSnackbar}
				message="An error occurred while trying to log in. Please try again in a moment."
				duration={3000}
				undoButton={false}
			/>
		</motion.div>
	);
};

export default LogIn;
