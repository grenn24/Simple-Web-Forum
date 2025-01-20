import { Box } from "@mui/material";
import {
	NavigateBeforeRounded as NavigateBeforeRoundedIcon,
	NavigateNextRounded as NavigateNextRoundedIcon,
} from "@mui/icons-material";
import Button from "./Button";
import { useEffect, useRef, useState } from "react";
import FullScreenMediaViewer from "./FullScreenMediaViewer";
import { AnimatePresence, motion } from "motion/react";
interface Prop {
	imageLinks: string[];
	videoLinks?: string[];
	borderRadius?: number;
	backgroundColor?: string;
	fullScreenMode?: boolean;
}

const MediaViewer = ({
	imageLinks,
	videoLinks,
	borderRadius,
	backgroundColor,
	fullScreenMode = true,
}: Prop) => {
	const [openFullScreenMediaViewer, setOpenFullScreenMediaViewer] = useState(false);
	const mediaViewerRef = useRef<HTMLDivElement>(null);
	const buttonBoxRef = useRef<HTMLDivElement>(null);
	const [isScrolling, setIsScrolling] = useState(false);
	const [showScrollButtons, setShowScrollButtons] = useState(false);
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

	useEffect(() => {
		if (buttonBoxRef.current) {
			buttonBoxRef.current.onmouseenter = () => setShowScrollButtons(true);
			buttonBoxRef.current.onmouseleave = () => setShowScrollButtons(false);
		}
		return () => {
			if (buttonBoxRef.current) {
				buttonBoxRef.current.removeEventListener("mouseenter", () =>
					setShowScrollButtons(true)
				);
				buttonBoxRef.current.removeEventListener("mouseleave", () =>
					setShowScrollButtons(false)
				);
			}
		};
	}, []);

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
				borderRadius={borderRadius}
				onClick={() => fullScreenMode && setOpenFullScreenMediaViewer(true)}
			>
				{videoLinks?.map((video: string) => (
					<Box
						flexShrink={0}
						width="100%"
						height="100%"
						display="flex"
						flexDirection="row"
						justifyContent="center"
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
							muted
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
			{/*Box for left and right scroll buttons (only show on medium or larger screens)*/}
			<Box
				position="absolute"
				width="100%"
				height="100%"
				display={{ xs: "none", md: "flex" }}
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				ref={buttonBoxRef}
				zIndex={2}
				onClick={() => fullScreenMode && setOpenFullScreenMediaViewer(true)}
			>
				<Box
					display="flex"
					width="96%"
					justifyContent="space-between"
					alignItems="center"
				>
					<AnimatePresence>
						{showScrollButtons && (
							<>
								<Box zIndex={2}>
									<motion.div
										whileHover={{ scale: 1.2 }}
										initial={{ x: -40, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: -40, opacity: 0 }}
										transition={{ duration: 0.4, ease: "easeOut" }}
									>
										<Button
											buttonIcon={<NavigateBeforeRoundedIcon />}
											buttonStyle={{
												p: 0,
											}}
											backgroundColor="background.default"
											handleButtonClick={(event) => {
												event.stopPropagation();
												scrollLeft();
											}}
										/>
									</motion.div>
								</Box>
								<Box zIndex={2}>
									<motion.div
										whileHover={{ scale: 1.2 }}
										initial={{ x: 40, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: 40, opacity: 0 }}
										transition={{ duration: 0.4, ease: "easeOut" }}
									>
										<Button
											buttonIcon={<NavigateNextRoundedIcon />}
											buttonStyle={{
												p: 0,
											}}
											backgroundColor="background.default"
											handleButtonClick={(event) => {
												event.stopPropagation();
												scrollRight();
											}}
										/>
									</motion.div>
								</Box>
							</>
						)}
					</AnimatePresence>
				</Box>
			</Box>
			{openFullScreenMediaViewer && (
				<FullScreenMediaViewer
					imageLinks={imageLinks}
					videoLinks={videoLinks}
					setOpenFullScreenMediaViewer={setOpenFullScreenMediaViewer}
				/>
			)}
		</Box>
	);
};

export default MediaViewer;
