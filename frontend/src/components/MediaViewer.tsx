import { Box } from "@mui/material";
import {
	NavigateBeforeRounded as NavigateBeforeRoundedIcon,
	NavigateNextRounded as NavigateNextRoundedIcon,
} from "@mui/icons-material";
import Button from "./Button";
import {  useRef } from "react";
interface Prop {
	imageLinks: string[];
    borderRadius ?: number;
	backgroundColor ?: string;
}

const MediaViewer = ({ imageLinks, borderRadius, backgroundColor }: Prop) => {
	const mediaViewerRef = useRef<HTMLDivElement>(null);
	const scrollLeft = () =>
		mediaViewerRef.current?.scrollBy({
			left: -mediaViewerRef.current.clientWidth,
			behavior: "smooth",
		});
	const scrollRight = () =>
		mediaViewerRef.current?.scrollBy({
			left: mediaViewerRef.current.clientWidth,
			behavior: "smooth",
		});

	return (
		<Box width="100%" height="100%" position="relative">
			<Box
				width="100%"
				height="100%"
				overflow="auto"
				display="flex"
				flexDirection="row"
				alignItems="center"
				sx={{ backgroundColor: backgroundColor }}
				position="absolute"
				ref={mediaViewerRef}
				zIndex={5}
				borderRadius = {borderRadius}
			>
				{imageLinks.map((image: string) => (
					<Box
						flexShrink={0}
						width="100%"
						height="100%"
						display="flex"
						flexDirection="row"
						justifyContent="center"
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
						handleButtonClick={scrollLeft}
					/>

					<Button
						buttonIcon={<NavigateNextRoundedIcon />}
						buttonStyle={{
							p: 0,
							zIndex: 6,
						}}
						backgroundColor="background.default"
						handleButtonClick={scrollRight}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default MediaViewer;
