

import { useEffect, useRef, useState } from "react";
import { TopicDTO } from "../../dtos/TopicDTO";
import { Box } from "@mui/material";

import {
	NavigateBeforeRounded as NavigateBeforeRoundedIcon,
	NavigateNextRounded as NavigateNextRoundedIcon,
} from "@mui/icons-material";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Button from "../../components/Button";
import TopicCardsViewer from "./TopicCardsViewer";

interface Prop {
	topics: TopicDTO[];
}
const TrendingTopics = ({ topics }: Prop) => {
	const [isScrolling, setIsScrolling] = useState(false);
	const [showScrollButtons, setShowScrollButtons] = useState(false);
	const [topicSelected, setTopicSelected] = useState<TopicDTO | null>(null);
	const topicButtonsViewerRef = useRef<HTMLDivElement>(null);
	const topicsViewer = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		if (!isScrolling) {
			setIsScrolling(true);
			topicButtonsViewerRef.current?.scrollBy({
				left: -topicButtonsViewerRef.current.clientWidth,
				behavior: "smooth",
			});
			setTimeout(() => setIsScrolling(false), 550);
		}
	};

	const scrollRight = () => {
		if (!isScrolling) {
			setIsScrolling(true);
			topicButtonsViewerRef.current?.scrollBy({
				left: topicButtonsViewerRef.current.clientWidth,
				behavior: "smooth",
			});
			setTimeout(() => setIsScrolling(false), 550);
		}
	};
	useEffect(() => {
		if (topicsViewer.current) {
			topicsViewer.current.onmouseenter = () => setShowScrollButtons(true);
			topicsViewer.current.onmouseleave = () => setShowScrollButtons(false);
		}
		return () => {
			topicsViewer.current &&
				topicsViewer.current.removeEventListener("mouseenter", () =>
					setShowScrollButtons(true)
				);
			topicsViewer.current &&
				topicsViewer.current.removeEventListener("mouseleave", () =>
					setShowScrollButtons(true)
				);
		};
	}, []);

	return (
		<>
			<Box width="100%" height="100%" position="relative" ref={topicsViewer}>
				<Box
				position="relative"
					display="flex"
					maxWidth="100%"
					height={30}
					overflow="auto"
					py={1}
					ref={topicButtonsViewerRef}
					zIndex={2}
				>
					{topics.map((topic) => (
						<motion.div whileHover={{ scale: 1.05 }}>
							<Button
								key={topic.topicID}
								disableRipple
								fontFamily="Open Sans"
								buttonStyle={{
									px: 1,
									py: 0,
									marginLeft: 0,
									marginRight: 2.7,
									filter:
										topic === topicSelected
											? "brightness(0.85)"
											: "brightness(1)",
								}}
								color="text.secondary"
								variant="outlined"
								backgroundColor="primary.light"
								handleButtonClick={() =>
									topicSelected === topic
										? setTopicSelected(null)
										: setTopicSelected(topic)
								}
							>
								{topic.name}
							</Button>
						</motion.div>
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
														topicButtonsViewerRef.current?.clientWidth! <
														topicButtonsViewerRef.current?.scrollWidth!
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
														topicButtonsViewerRef.current?.clientWidth! <
														topicButtonsViewerRef.current?.scrollWidth!
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

			<LayoutGroup>
				<AnimatePresence mode="wait">
					{topicSelected && (
						<motion.div
							key={topicSelected.name}
							initial={{ x: -80, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 80, opacity: 0 }}
							transition={{ ease: "easeOut", duration: 0.3 }}
							layout
						>
							<TopicCardsViewer topic={topicSelected} />
						</motion.div>
					)}
				</AnimatePresence>
			</LayoutGroup>
		</>
	);
};

export default TrendingTopics;
