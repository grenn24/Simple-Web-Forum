import { Box } from "@mui/material";
import {
	NavigateBeforeRounded as NavigateBeforeRoundedIcon,
	NavigateNextRounded as NavigateNextRoundedIcon,
} from "@mui/icons-material";
import Button from "./Button";
import { useRef, useState } from "react";
import FullScreenImage from "./FullScreenMediaViewer";
interface Prop {
	imageLinks: string[];
	borderRadius?: number;
	backgroundColor?: string;
}

const MediaViewer = ({ imageLinks, borderRadius, backgroundColor }: Prop) => {
	const [isScrolling, setIsScrolling] = useState(false);
	const [fullScreenImage, setFullScreenImage] = useState(false);
	const mediaViewerRef = useRef<HTMLDivElement>(null);
	const scrollLeft = () => {
		if (!isScrolling) {
			setIsScrolling(true);
			mediaViewerRef.current?.scrollBy({
				left: -mediaViewerRef.current.clientWidth,
				behavior: "smooth",
			});
			setTimeout(() => setIsScrolling(false), 550);
		}
	};

	const scrollRight = () => {
		if (!isScrolling) {
			setIsScrolling(true);
			mediaViewerRef.current?.scrollBy({
				left: mediaViewerRef.current.clientWidth,
				behavior: "smooth",
			});
			setTimeout(() => setIsScrolling(false), 550);
		}
	};

	return (
		<Box width="100%" height="100%" position="relative">
			<Box
				width="100%"
				height="100%"
				overflow="auto"
				display="flex"
				flexDirection="row"
				alignItems="center"
				sx={{
					backgroundColor: backgroundColor,
					"::-webkit-scrollbar": {
						display: "none",
					},
				}}
				position="absolute"
				ref={mediaViewerRef}
				zIndex={5}
				borderRadius={borderRadius}
			>
				{imageLinks.map((image: string) => (
					<Box
						flexShrink={0}
						width="100%"
						height="100%"
						display="flex"
						flexDirection="row"
						justifyContent="center"
						onClick={() => setFullScreenImage(true)}
					>
						<img
							src={image}
							style={{
								maxWidth: "100%",
								maxHeight: "100%",
								objectFit: "contain",
								width: "auto",
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
							zIndex: 6,
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
							zIndex: 6,
						}}
						backgroundColor="background.default"
						handleButtonClick={(event) => {
							event.stopPropagation();
							scrollRight();
						}}
					/>
				</Box>
			</Box>
			{fullScreenImage && (
				<FullScreenImage
					imageLinks={imageLinks}
					setFullScreenImage={setFullScreenImage}
				/>
			)}
		</Box>
	);
};

export default MediaViewer;
