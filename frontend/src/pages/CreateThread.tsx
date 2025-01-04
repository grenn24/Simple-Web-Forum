import { Box, Typography, Divider, Container } from "@mui/material";
import Button from "../components/Button";
import { ArrowBackRounded as ArrowBackRoundedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TabMenu from "../components/TabMenu";
import TextPage from "../features/CreateThread/TextPage";
import ImagePage from "../features/CreateThread/ImagePage";
import { useForm } from "react-hook-form";
import { postJSON } from "../utilities/apiClient";
import { useState } from "react";

const CreateThread = () => {
	const navigate = useNavigate();
	const [topicsSelected, setTopicsSelected] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm({ mode: "onChange" });

	const submitForm = handleSubmit((data) => {
		setIsUploading(true);
		postJSON(
			"/threads/user",
			{
				title: data.title,
				content: data.content,
				image_title: data.imageTitle,
				image_link: data.imageLink,
				topics_tagged: topicsSelected,
			},
			() => {reset();
				setIsUploading(false);
			},
			(err) => console.log(err)
		);
		setTopicsSelected([]);
		
	});
	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
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
					buttonStyle={{ mx: 0, px: 0 }}
					handleButtonClick={() => navigate(-1)}
				/>
			</Box>
			<Container
				sx={{
					width: { xs: "100%", sm: 600, md: 650, lg: 650, xl: 650 },
					my: 3,
					px: { xs: 1, sm: 3 },
				}}
				disableGutters
			>
				<TabMenu
					tabLabelArray={["Text", "Image", "Video"]}
					tabPageArray={[
						<TextPage
							register={register}
							submitForm={submitForm}
							errors={errors}
							control={control}
							topicsSelected={topicsSelected}
							setTopicsSelected={setTopicsSelected}
							isUploading={isUploading}
						/>,
						<ImagePage
							register={register}
							watch={watch}
							errors={errors}
							control={control}
						/>,
					]}
				/>
			</Container>
		</Box>
	);
};

export default CreateThread;
