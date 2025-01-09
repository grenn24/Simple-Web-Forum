import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../../utilities/apiClient";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
} from "@mui/icons-material";


const LogIn = () => {
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
				navigate("/");
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
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			{...register("email", { required: true })}
		>
			<Card elevation={4} sx={{ width: 350 }}>
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
							<Typography fontFamily="Open Sans" fontSize={20}>
						
							</Typography>
							<Button
								buttonIcon={<ArrowBackRoundedIcon />}
								color="primary.dark"
								buttonStyle={{ opacity: 0, cursor: "default" }}
							/>
						</Box>
						<TextField
							label="Email"
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
						<Box display="flex" justifyContent="center">
							<Button
								type="submit"
								variant="outlined"
								buttonIcon={<ArrowForwardIosRoundedIcon />}
								iconPosition="end"
								color="primary.dark"
							>
								Log In
							</Button>
						</Box>
					</CardContent>
				</form>
			</Card>
		</Box>
	);
};

export default LogIn;
