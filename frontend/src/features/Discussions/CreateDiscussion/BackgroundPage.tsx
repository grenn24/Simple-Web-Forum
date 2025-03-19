import { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import FileInput from "../../../components/FileInput";
import { useAppDispatch, useAppSelector } from "../../../utilities/redux";
import {
	changeBackgroundImage,
	changeIsCompressingImage,
} from "../createDiscussionSlice";
import { Box } from "@mui/material";
import {
	compressImageFile,
	generateFileURL,
} from "../../../utilities/fileManipulation";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { AnimatePresence, motion } from "motion/react";

const BackgroundPage = () => {
	const [openFileInput, setOpenFileInput] = useState(false);
	const dispatch = useAppDispatch();
	const handleUploadBackground = (files: FileList) => {
		dispatch(changeIsCompressingImage(true));
		compressImageFile(files[0], 1)
			.then((file) => {
				dispatch(changeBackgroundImage(file));
				dispatch(changeIsCompressingImage(false));
			})
			.catch((err) => console.log(err));
	};

	const handleDeleteBackground = () => dispatch(changeBackgroundImage(null));

	const { backgroundImage } = useAppSelector((state) => ({
		backgroundImage: state.createDiscussion.backgroundImage,
	}));

	const imageViewerRef = useRef<HTMLDivElement>();
	const [showButtons, setShowButtons] = useState(false);

	useEffect(() => {
		if (imageViewerRef.current) {
			imageViewerRef.current.onmouseenter = () => setShowButtons(true);
			imageViewerRef.current.onmouseleave = () => setShowButtons(false);
		}
		setShowButtons(false);
		return () => {
			if (imageViewerRef.current) {
				imageViewerRef.current.removeEventListener("mouseenter", () =>
					setShowButtons(true)
				);
				imageViewerRef.current.removeEventListener("mouseleave", () =>
					setShowButtons(false)
				);
			}
		};
	}, [backgroundImage]);
	return !backgroundImage ? (
		<>
			<Button
				variant="outlined"
				handleButtonClick={() => setOpenFileInput(true)}
				fontSize={18}
				color="primary.dark"
				buttonStyle={{
					width: "100%",
					height: 55,
					justifyContent: "flex-start",
				}}
			>
				Upload Background Image
			</Button>
			<br />
			<br />

			<FileInput
				openFileInput={openFileInput}
				onFileSubmit={handleUploadBackground}
				setOpenFileInput={setOpenFileInput}
				acceptedFileTypes="image/jpeg, image/png"
			/>
		</>
	) : (
		<Box
			width="100%"
			position="relative"
			borderRadius={1.2}
			height={250}
			overflow="hidden"
			ref={imageViewerRef}
		>
			<img
				src={generateFileURL(backgroundImage)}
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					maxWidth: "100%",
					maxHeight: "100%",
					objectFit: "contain",
					zIndex: 1,
				}}
			/>
			<img
				src={generateFileURL(backgroundImage)}
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					maxWidth: "100%",
					maxHeight: "100%",
					objectFit: "fill",
					filter: "blur(9px) grayscale(50%) brightness(50%)",
					transform: "scale(1.5)",
					overflow: "hidden",
				}}
			/>
			<AnimatePresence>
				{showButtons && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						<Box
							boxSizing="border-box"
							width="100%"
							position="absolute"
							p={1}
							zIndex={2}
						>
							<Box
								width="100%"
								display="flex"
								justifyContent="flex-end"
								zIndex={2}
							>
								<Button
									buttonIcon={
										<DeleteOutlineRoundedIcon
											sx={{ color: "background.default", fontSize: 24 }}
										/>
									}
									backgroundColor="rgb(0,0,0,0.4)"
									buttonStyle={{ p: 0.7 }}
									handleButtonClick={handleDeleteBackground}
								/>
							</Box>
						</Box>
					</motion.div>
				)}
			</AnimatePresence>
		</Box>
	);
};

export default BackgroundPage;
