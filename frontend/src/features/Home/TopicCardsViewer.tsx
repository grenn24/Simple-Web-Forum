import { useEffect, useRef, useState } from "react";
import { TopicDTO } from "../../dtos/TopicDTO";
import { Box } from "@mui/material";
import ThreadGridCard from "../../components/ThreadGridCard/ThreadGridCard";
import Button from "../../components/Button";
import {
	NavigateBeforeRounded as NavigateBeforeRoundedIcon,
	NavigateNextRounded as NavigateNextRoundedIcon,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "motion/react";

interface Prop {
	topic: TopicDTO;
}
const TopicCardsViewer = ({ topic }: Prop) => {
	const [isScrolling, setIsScrolling] = useState(false);
	const [showScrollButtons, setShowScrollButtons] = useState(false);
	const topicCardsViewerRef = useRef<HTMLDivElement>(null);
	const topicCardRef = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		if (!isScrolling) {
			setIsScrolling(true);
			topicCardsViewerRef.current?.scrollBy({
				left: -topicCardsViewerRef.current.clientWidth,
				behavior: "smooth",
			});
			setTimeout(() => setIsScrolling(false), 550);
		}
	};

	const scrollRight = () => {
		if (!isScrolling) {
			setIsScrolling(true);
			topicCardsViewerRef.current?.scrollBy({
				left: topicCardsViewerRef.current.clientWidth,
				behavior: "smooth",
			});
			setTimeout(() => setIsScrolling(false), 550);
		}
	};
	useEffect(() => {
		if (topicCardRef.current) {
			topicCardRef.current.onmouseenter = () => setShowScrollButtons(true);
			topicCardRef.current.onmouseleave = () =>
				setShowScrollButtons(false);
		}
		return () => {
			topicCardRef.current &&
				topicCardRef.current.removeEventListener("mouseenter", () =>
					setShowScrollButtons(true)
				);
			topicCardRef.current &&
				topicCardRef.current.removeEventListener("mouseleave", () =>
					setShowScrollButtons(true)
				);
		};
	}, []);

	return (
		<Box
			width="100%"
			height={230}
			maxWidth="100%"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			position="relative"
			ref={topicCardRef}
		>
			<Box
				position="absolute"
				display="flex"
				maxWidth="100%"
				overflow="auto"
				py={1}
				px={1}
				ref={topicCardsViewerRef}
				zIndex={1}
				sx={{
					"::-webkit-scrollbar": {
						display: "none",
					},
				}}
			>
				{topic.threads.map((thread) => (
					<ThreadGridCard
						thread={thread}
						style={{ flexShrink: 0, marginRight: 2, height: 200, width: 300 }}
						showAvatarTooltipText={false}
					/>
				))}
			</Box>
			<Box
				position="absolute"
				width="100%"
				height="100%"
				display={{ xs: "none", md: "flex" }}
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
			>
				<Box
					display="flex"
					width="100%"
					justifyContent="space-between"
					alignItems="center"
				>
					<AnimatePresence>
						{showScrollButtons && (
							<>
								<Box zIndex={6}>
									<motion.div
										whileHover={{ scale: 1.2 }}
										initial={{ x: -40, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: -40, opacity: 0 }}
										transition={{ duration: 0.4, ease: "easeOut" }}
									>
										<Button
											buttonIcon={
												<NavigateBeforeRoundedIcon sx={{ color: "grey" }} />
											}
											buttonStyle={{
												p: 0,
												outlineColor: "black",
												outline: 1.5,
												boxShadow: 7,
												opacity:
													topicCardsViewerRef.current?.clientWidth! <
													topicCardsViewerRef.current?.scrollWidth!
														? 1
														: 0,
											}}
											backgroundColor="background.default"
											handleButtonClick={(event) => {
												event.stopPropagation();
												scrollLeft();
											}}
										/>
									</motion.div>
								</Box>
								<Box zIndex={6}>
									<motion.div
										whileHover={{ scale: 1.2 }}
										initial={{ x: 40, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: 40, opacity: 0 }}
										transition={{ duration: 0.4, ease: "easeOut" }}
									>
										<Button
											buttonIcon={
												<NavigateNextRoundedIcon sx={{ color: "grey" }} />
											}
											buttonStyle={{
												p: 0,
												outlineColor: "black",
												outline: 1.5,
												boxShadow: 7,
												opacity:
													topicCardsViewerRef.current?.clientWidth! <
													topicCardsViewerRef.current?.scrollWidth!
														? 1
														: 0,
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
		</Box>
	);
};

export default TopicCardsViewer;
