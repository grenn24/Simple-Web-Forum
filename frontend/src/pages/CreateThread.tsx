import { Box, Typography, Divider, Container} from "@mui/material";
import Button from "../components/Button";
import {
	ArrowBackRounded as ArrowBackRoundedIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TabMenu from "../components/TabMenu";
import TextPage from "../features/CreateThread/TextPage";
import ImagePage from "../features/CreateThread/ImagePage";
import { useForm } from "react-hook-form";

const CreateThread = () => {
	const navigate = useNavigate();

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm({
		mode: "onChange"
	});

	const submitForm = handleSubmit((data) => {
		console.log(data);
		isValid && reset();
	});
	return (
		<>
			<Box
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: 3,
					minHeight: "100%",
				}}
			>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
					}}
				>
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="primary.dark"
					>
						Create Thread
					</Typography>
				</Box>
				<Divider />
				<Box marginTop={2}>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="primary.dark"
						buttonStyle={{ mx: 0 }}
						handleButtonClick={() => navigate(-1)}
					/>
				</Box>
				<Container
					sx={{
						width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
						my: 3,
						px: 3,
					}}
					disableGutters
				>
					<TabMenu
						tabLabelArray={["Text", "Image"]}
						tabPageArray={[
							<TextPage
								register={
									register
								}
								submitForm={submitForm}
								errors={errors}
								watch={watch}
							/>,
							<ImagePage
								register={
									register
								}
								watch={watch}
								errors={errors}
							/>,
						]}
					/>
				</Container>
			</Box>
		</>
	);
};

export default CreateThread;
