import { Box, Divider, Typography, Container } from "@mui/material";
import { useState } from "react";
import ThreadCard from "../components/ThreadCard";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import threads from "../features/Following/followingDataSample";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Menu from "../components/Menu";
import sortingMenuItems from "../features/Following/sortingMenuItems";
import sortingMenuIcons from "../features/Following/sortingMenuIcons";

const Following = () => {
	const [sortingOrder, setSortingOrder] = useState("Best");

	const navigate = useNavigate();

	return (
		<>
			<Box
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: { xs: 1.5, sm: 3 },
					minHeight: "100%",
				}}
			>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
					}}
				>
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="primary.dark"
					>
						Following
					</Typography>
				</Box>
				<Divider />
				<Box
					sx={{ marginTop: 2 }}
					display="flex"
					justifyContent="space-between"
				>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="primary.dark"
						buttonStyle={{ mx: 0, px: 0 }}
						handleButtonClick={() => navigate(-1)}
						toolTipText="Back"
					/>
					<Menu
						menuExpandedItemsArray={sortingMenuItems}
						menuExpandedIconsArray={sortingMenuIcons}
						menuIcon={<SortRoundedIcon sx={{ fontSize: 20 }} />}
						menuStyle={{
							borderRadius: 30,
							px: 2,
							py: 0,
							fontSize: 20,
							fontFamily: "Open Sans",
							color: "text.primary",
						}}
						handleMenuExpandedItemsClick={Array(sortingMenuItems.length).fill(
							(event: React.MouseEvent<HTMLElement>) =>
								event.currentTarget.dataset.value &&
								setSortingOrder(event.currentTarget.dataset.value)
						)}
						toolTipText="Sort Options"
					>
						{sortingOrder}
					</Menu>
				</Box>
				<Container
					sx={{
						width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
						marginBottom: 3,
					}}
					disableGutters
				>
					{threads.map((thread) => (
						<Box key={thread.id}>
							<ThreadCard
								threadId={thread.id}
								threadTitle={thread.title}
								threadAuthor={thread.author}
								threadDate={thread.date}
								threadLikeCount={thread.likeCount}
								threadCommentCount={thread.commentCount}
								threadContentSummarised={thread.contentSummarised}
								threadImageLink={thread.imageLink}
								avatarIconLink={thread.avatarIconLink}
								initialLikeStatus={thread.likeStatus}
								handleAvatarIconClick={() =>
									navigate(`../Profile/${thread.authorId}`)
								}
							/>
							<Divider />
						</Box>
					))}
				</Container>
			</Box>
		</>
	);
};

export default Following;
