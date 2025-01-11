import {
	Box,
	TextField,
	Card,
	CardContent,
	Avatar,
	Typography,
} from "@mui/material";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { postFormData } from "../../utilities/api";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	ArrowForwardIosRounded as ArrowForwardIosRoundedIcon,
	FileUploadRounded as FileUploadRoundedIcon,
	CameraAltRounded as CameraAltRoundedIcon,
	AttachFileRounded as AttachFileRoundedIcon,
	DeleteOutlineRounded as DeleteOutlineRoundedIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utilities/reduxHooks";
import { changeAvatarIcon, changeBiography, reset } from "./signUpSlice";
import Menu from "../../components/Menu";
import CameraInput from "../../components/CameraInput";
import FileInput from "../../components/FileInput";
import { generateFileURL } from "../../utilities/fileManipulation";
import { motion } from "motion/react";

const SignUpStage3 = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { currentSignUpStage } = useAppSelector((state) => ({
		currentSignUpStage: state.signUp.currentSignUpStage,
		avatarIcon: state.signUp.avatarIcon,
	}));

	const [openCameraInput, setOpenCameraInput] = useState(false);
	const [openFileInput, setOpenFileInput] = useState(false);
	const handleUploadAvatarIcon = (files: FileList) => {
		dispatch(changeAvatarIcon(files[0]));
	};
	const {
		name,
		username,
		email,
		password,
		birthday,
		biography,
		faculty,
		avatarIcon,
	} = useAppSelector((state) => ({
		name: state.signUp.name,
		username: state.signUp.username,
		email: state.signUp.email,
		birthday: state.signUp.birthday,
		biography: state.signUp.biography,
		faculty: state.signUp.faculty,
		password: state.signUp.password,
		avatarIcon: state.signUp.avatarIcon,
	}));
	// check if current sign up stage is at 0
	useEffect(() => {
		if (currentSignUpStage === 0) {
			navigate("/Welcome");
		}
	}, []);

	const handleCreateAccount = () => {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("username", username);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("biography", biography);
		// omit if falsy (stored as null in db if empty)
		avatarIcon && formData.append("avatar_icon", avatarIcon);
		faculty && formData.append("faculty", faculty);
		birthday && formData.append("birthday", birthday);
		postFormData(
			"/authentication/sign-up",
			formData,
			() => {
				dispatch(reset());
				navigate("/");
			},
			(err) => {
				console.log(err);
			}
		);
	};

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
					<Typography textAlign="center">
						Add an avatar 👻, so that others can recognise you
					</Typography>
				</Box>
				<Card elevation={4} sx={{ width: 350, marginBottom: 10 }}>
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
								handleButtonClick={() => navigate("../2")}
							/>
							<Typography fontFamily="Open Sans" fontSize={20}>
								Step 3
							</Typography>
							<Button
								buttonIcon={<ArrowBackRoundedIcon />}
								color="primary.dark"
								buttonStyle={{ opacity: 0, cursor: "default" }}
							/>
						</Box>
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							height={95}
						>
							<Box display="flex" justifyContent="center">
								<Avatar
									src={generateFileURL(avatarIcon)}
									style={{ width: 90, height: 90 }}
								/>
							</Box>
							<Box
								display="flex"
								flexDirection="column"
								justifyContent="space-between"
								height="100%"
								flexGrow={1}
								marginLeft={1}
							>
								<Menu
									variant="outlined"
									menuIcon={<FileUploadRoundedIcon />}
									menuExpandedItemsArray={["Take a Photo", "Upload from File"]}
									menuExpandedIconsArray={[
										<CameraAltRoundedIcon sx={{ marginRight: 1.5 }} />,
										<AttachFileRoundedIcon sx={{ marginRight: 1.5 }} />,
									]}
									handleMenuExpandedItemsClick={[
										() => setOpenCameraInput(true),
										() => setOpenFileInput(true),
									]}
									menuExpandedPosition={{
										vertical: "top",
										horizontal: "right",
									}}
								>
									Upload
								</Menu>
								<Button
									variant="outlined"
									fullWidth
									buttonIcon={<DeleteOutlineRoundedIcon />}
									iconPosition="end"
									handleButtonClick={() => dispatch(changeAvatarIcon(null))}
								>
									Delete
								</Button>
							</Box>
						</Box>
						<br />
						<br />
						<TextField
							label="Your Bio"
							variant="outlined"
							onChange={(event) => {
								dispatch(changeBiography(event.target.value));
							}}
							defaultValue={biography}
							fullWidth
						/>
						<br />
						<br />

						<Box display="flex" justifyContent="center">
							<Button
								variant="outlined"
								buttonIcon={<ArrowForwardIosRoundedIcon />}
								iconPosition="end"
								color="primary.dark"
								handleButtonClick={handleCreateAccount}
							>
								Create Account
							</Button>
						</Box>
					</CardContent>
				</Card>
				{/*Hidden Camera and File Input*/}
				<CameraInput
					onFileSubmit={handleUploadAvatarIcon}
					openCameraInput={openCameraInput}
					setOpenCameraInput={setOpenCameraInput}
					acceptedFileTypes="image/jpeg, image/png"
				/>
				<FileInput
					onFileSubmit={handleUploadAvatarIcon}
					openFileInput={openFileInput}
					setOpenFileInput={setOpenFileInput}
					acceptedFileTypes="image/jpeg, image/png, image/gif"
				/>
			</Box>
		</motion.div>
	);
};

export default SignUpStage3;
