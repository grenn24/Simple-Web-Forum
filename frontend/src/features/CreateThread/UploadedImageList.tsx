import { Box, Divider, Typography } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Button from "../../components/Button";
import { removeFromArray } from "../../utilities/arrayManipulation";

interface Prop {
	imagesSelected: File[];
	setImagesSelected: (images: File[]) => void;
}

const UploadedImageList = ({ imagesSelected, setImagesSelected }: Prop) => {
	const imageFiles = Array.from(imagesSelected).map((image: File) => image);
	return (
		imageFiles.length !== 0 && (
			<>
				<Typography fontFamily="Open Sans" color="text.primary">
					{imageFiles.length} Images
				</Typography>
				<Divider sx={{ my: 1.2 }} />
				{imageFiles.map((image, index) => (
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
							{image.name}
						</Typography>
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
								handleButtonClick={() =>
									setImagesSelected(removeFromArray(imagesSelected, index))
								}
							/>
						</Box>
					</Box>
				))}
			</>
		)
	);
};

export default UploadedImageList;
