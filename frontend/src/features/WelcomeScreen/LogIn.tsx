import { Box, Card, CardContent, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { postJSON } from "../../utilities/apiClient";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
} from "@mui/icons-material";

interface Prop {
	opacity: number;
	visibility: string;
	setFormStatus: (status: string) => void;
}
const LogIn = ({ opacity, visibility, setFormStatus }: Prop) => {
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
				navigate("..");
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
			{...register("email", { required: true })}
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
