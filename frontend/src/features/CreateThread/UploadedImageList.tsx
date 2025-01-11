import { Box, Divider, Link, Typography } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Button from "../../components/Button";
import { removeFromArray } from "../../utilities/arrayManipulation";
import { openFileInNewWindow } from "../../utilities/fileManipulation";

interface Prop {
	imagesSelected: File[];
	setImagesSelected: (images: File[]) => void;
	setOpenImageDeletedSnackbar: (state: boolean) => void;
	setImageDeleted: (image: File) => void;
}

const UploadedImageList = ({ imagesSelected, setImagesSelected , setOpenImageDeletedSnackbar, setImageDeleted}: Prop) => {

	
	const imageFiles = Array.from(imagesSelected).map((image: File) => image);
	return (
		imageFiles.length !== 0 && (
			<>
				<Box width="100%" display="flex" justifyContent="space-between">
					<Typography fontFamily="Open Sans" color="text.primary">
						{imageFiles.length} Images
					</Typography>
					<Button buttonStyle={{py:0}} handleButtonClick={()=>setImagesSelected([])}>
						Clear All
					</Button>
				</Box>

				<Divider sx={{ my: 1.2 }} />
				{imageFiles.map((image, index) => (
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
						alignItems="center"
						key={index}
					>
						<Link
							onClick={() => openFileInNewWindow(image)}
							underline="hover"
							rel="noreferrer"
							target="_blank"
							sx={{
								"&:hover": {
									cursor: "pointer",
								},
							}}
						>
							<Typography
								fontFamily="Open Sans"
								color="text.primary"
								fontSize={15}
							>
								{image.name}
							</Typography>
						</Link>
						<Box
							display="flex"
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography
								fontFamily="Open Sans"
								color="text.primary"
								fontSize={15}
							>
								{Math.round((image.size / Math.pow(2, 20)) * 100) / 100}mb
							</Typography>
							<Button
								buttonIcon={<ClearRoundedIcon />}
								color="primary.dark"
								buttonStyle={{ marginLeft: 1, p: 0 }}
								handleButtonClick={() => {
									setImagesSelected(removeFromArray(imagesSelected, index));
									setImageDeleted(image);
									setOpenImageDeletedSnackbar(true);
								}}
							/>
						</Box>
					</Box>
				))}
			</>
		)
	);
};

export default UploadedImageList;
