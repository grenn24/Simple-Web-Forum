import React, { useEffect, useState } from "react";
import { DiscussionDTO } from "../../dtos/DiscussionDTO";
import { parseDiscussions } from "../../utilities/parseApiResponse";
import { get } from "../../utilities/api";
import { Box, CircularProgress, Typography } from "@mui/material";
import List from "../../components/List";
import DiscussionCardMini from "../Search/DiscussionsSearchPage/DiscussionCardMini";
import { useNavigate } from "react-router-dom";
import cryingCat from "../../assets/image/crying-cat.png";

const DiscussionsCreatedPage = () => {
	const [discussions, setDiscussions] = useState<DiscussionDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		get(
			"/authors/user/discussions/created",
			(res) => {
				const responseBody = res.data.data;
				setDiscussions(parseDiscussions(responseBody));
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, []);
	return (
		<Box
			width="100%"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			{isLoading ? (
				<Box marginTop={30}>
					<CircularProgress size={80} />
				</Box>
			) : (
				<Box width="100%">
					<Typography
						textAlign="left"
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={21}
						marginLeft={1.5}
						color="text.primary"
					>
						Discussions Created By You
					</Typography>

					{discussions.length === 0 ? (
						<Box
							width="100%"
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							marginTop={5}
						>
							<Typography
								textAlign="center"
								fontFamily="Open Sans"
								fontSize={19}
								color="primary.dark"
							>
								You have not created any discussions yet
							</Typography>
							<br />

							<img
								src={cryingCat}
								width={220}
								alt="crying cat"
								loading="eager"
							/>
						</Box>
					) : (
						<List
							listItemsArray={discussions.map((discussion, index) => (
								<DiscussionCardMini key={index} discussion={discussion} />
							))}
							listItemsDataValues={discussions.map((discussion) =>
								String(discussion.discussionID)
							)}
							handleListItemsClick={discussions.map(
								() => (e: React.MouseEvent<HTMLElement>) =>
									navigate(`/Discussions/${e.currentTarget.dataset.value}`)
							)}
							listItemTextStyle={{ flexGrow: 1, maxWidth: "100%" }}
							disableRipple
							listStyle={{ width: "100%" }}
							listItemPadding={1.7}
						/>
					)}
				</Box>
			)}
		</Box>
	);
};

export default DiscussionsCreatedPage;
