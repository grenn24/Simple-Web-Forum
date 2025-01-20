import { Box } from "@mui/material";
import Button from "../Button";
import {
	NavigateBeforeRounded as NavigateBeforeRoundedIcon,
	NavigateNextRounded as NavigateNextRoundedIcon,
	ClearRounded as ClearRoundedIcon,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

interface Prop {
	imageLinks: string[];
	videoLinks?: string[];
	setOpenFullScreenMediaViewer: (state: boolean) => void;
}
const FullScreenImage = ({
	imageLinks,
	videoLinks,
	setOpenFullScreenMediaViewer,
}: Prop) => {
	const [imageZoom, setImageZoom] = useState(false);
	const imageRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLDivElement>(null);
	const imageViewerRef = useRef<HTMLDivElement>(null);
	const imageViewerContainerRef = useRef<HTMLDivElement>(null);
	const scrollLeft = () => {
		imageViewerRef.current?.scrollBy({
			left: -imageViewerRef.current.clientWidth,
			behavior: "auto",
		});
	};

	const scrollRight = () => {
		imageViewerRef.current?.scrollBy({
			left: imageViewerRef.current.clientWidth,
			behavior: "auto",
		});
	};
	useEffect(() => {
		document.body.style.overflow = "hidden";
		window.onkeydown = (event) => {
			if (event.key === "ArrowRight") {
				event.preventDefault();
				scrollRight();
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				scrollLeft();
			}
			event.key === "Escape" && setOpenFullScreenMediaViewer(false);
		};
		imageViewerContainerRef.current?.requestFullscreen();
		return () => {
			window.removeEventListener("keydown", () => {});
			document.body.style.overflow = "visible";
		};
	}, []);

	const exitFullScreen = () => {
		setOpenFullScreenMediaViewer(false);
	};

	return (
		<Box
			width="100vw"
			height="100vh"
			position="fixed"
			zIndex={1202}
			top={0}
			left={0}
			ref={imageViewerContainerRef}
		>
			<Box
				width="100%"
				height="100%"
				overflow="auto"
				display="flex"
				flexDirection="row"
				alignItems="center"
				position="absolute"
				ref={imageViewerRef}
				sx={{
					backgroundColor: "rgba(0, 0, 0, 0.88)",
				}}
				zIndex={21}
			>
				{videoLinks?.map((video: string) => (
					<Box
						flexShrink={0}
						width="100%"
						height="100%"
						display="flex"
						flexDirection="row"
						justifyContent="center"
						onClick={exitFullScreen}
						ref={videoRef}
					>
						<video
							src={video}
							style={{
								maxWidth: "100%",
								maxHeight: "100%",
								objectFit: "contain",
								width: "auto",
							}}
							autoPlay
							controls
							loop
						/>
					</Box>
				))}
				{imageLinks.map((image: string) => (
					<Box
						flexShrink={0}
						width="100%"
						height="100%"
						display="flex"
						flexDirection="row"
						justifyContent="center"
						onClick={exitFullScreen}
						ref={imageRef}
					>
						<img
							src={image}
							style={{
								objectFit: "contain",
								maxWidth: "100%",
								maxHeight: "100%",
								cursor: imageZoom ? "zoom-out" : "zoom-in",
							}}
							onClick={(event) => {
								event.stopPropagation();
								setImageZoom(!imageZoom);
							}}
						/>
					</Box>
				))}
			</Box>
			<Box
				position="absolute"
				width="100%"
				height="100%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				<Box
					display="flex"
					width="96%"
					justifyContent="space-between"
					alignItems="center"
				>
					<Button
						buttonIcon={<NavigateBeforeRoundedIcon />}
						buttonStyle={{
							p: 0,
							zIndex: 22,
						}}
						backgroundColor="background.default"
						handleButtonClick={(event) => {
							event.stopPropagation();
							scrollLeft();
						}}
					/>

					<Button
						buttonIcon={<NavigateNextRoundedIcon />}
						buttonStyle={{
							p: 0,
							zIndex: 22,
						}}
						backgroundColor="background.default"
						handleButtonClick={(event) => {
							event.stopPropagation();
							scrollRight();
						}}
					/>
				</Box>
				<Box position="absolute" top="1%" right="1%">
					<Button
						buttonIcon={<ClearRoundedIcon />}
						buttonStyle={{
							p: 0.5,
							zIndex: 22,
						}}
						color="background.default"
						handleButtonClick={exitFullScreen}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default FullScreenImage;
