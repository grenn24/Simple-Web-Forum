import { Box } from "@mui/material";
import Button from "../Button";
import {
	NavigateBeforeRounded as NavigateBeforeRoundedIcon,
	NavigateNextRounded as NavigateNextRoundedIcon,
	ClearRounded as ClearRoundedIcon,
} from "@mui/icons-material";
import { useEffect, useRef } from "react";

interface Prop {
	imageLinks: string[];

	setFullScreenImage: (state: boolean) => void;
}
const FullScreenImage = ({
	imageLinks,
	setFullScreenImage,
}: Prop) => {
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
		window.onkeydown = (event) => {
			if (event.key === "ArrowRight") {
				event.preventDefault();
				scrollRight();
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				scrollLeft();
			}
			event.key === "Escape" && setFullScreenImage(false);
		};
		 document.body.style.overflow = "hidden";
		 imageViewerContainerRef.current?.requestFullscreen();
	}, []);

	const exitFullScreen = ()=> {
		setFullScreenImage(false);
		document.body.style.overflow = "visible";
	}

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
				{imageLinks.map((image: string) => (
					<Box
						flexShrink={0}
						width="100%"
						height="100%"
						display="flex"
						flexDirection="row"
						justifyContent="center"
						onClick={exitFullScreen}
					>
						<img
							src={image}
							style={{
								maxWidth: "100%",
								maxHeight: "100%",
								objectFit: "contain",
								width: "auto",
							}}
							onClick={(event)=>event.stopPropagation()}
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
