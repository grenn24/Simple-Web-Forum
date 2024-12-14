import { Box, Typography } from "@mui/material";
import List from "../../components/List";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import profileDataSample from "./profileDataSample";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

const CommentsPage = () => {
    const navigate = useNavigate();
	return (
		<Box width="100%">
			<List
				listItemsArray={profileDataSample.comments.map((post, _) => {
					return (
						<>
							<Box display="flex" justifyContent="space-between">
								<Typography
									fontFamily="Open Sans"
									fontSize={22}
									fontWeight={600}
								>
									{post.title}
								</Typography>
								<Box display="flex" alignItems="center">
									<Button
										toolTipText="Delete Comment"
										color="primary.dark"
										buttonIcon={
											<DeleteForeverRoundedIcon sx={{ fontSize: 27 }} />
										}
										handleButtonClick={(event) => event.stopPropagation()}
									/>
									<Typography
										fontFamily="Open Sans"
										fontSize={13}
										fontWeight={600}
										fontStyle="text.secondary"
									>
										{post.date}
									</Typography>
								</Box>
							</Box>
							<Typography
								variant="h6"
								color="text.secondary"
								fontFamily="Open Sans"
								fontSize={18}
							>
								{post.topicsTagged.map((topic) => {
									return (
										<>
											<Button
												disableRipple
												handleButtonClick={() =>
													navigate(`../Topics?topicName=${topic}`)
												}
												fontFamily="Open Sans"
												buttonStyle={{ px: 1, py: 0, marginRight: 1 }}
												color="text.secondary"
												fontSize={12}
												variant="outlined"
												backgroundColor="primary.light"
											>
												{topic}
											</Button>
										</>
									);
								})}
							</Typography>
							<Typography marginTop={2} fontSize={17}>
								{post.contentSummarised}
							</Typography>
							<Box display="flex">
								<Typography marginTop={2} fontSize={17} marginRight={1.7} fontWeight={750}>
									You Replied:
								</Typography>
								<Typography marginTop={2} fontSize={17}>
									{post.commentContent}
								</Typography>
							</Box>
						</>
					);
				})}
                listItemsDataValues={profileDataSample.comments.map((post, _) => String(post.id))}
				handleListItemsClick={new Array(profileDataSample.comments.length).fill(
					(event: React.MouseEvent<HTMLElement>) => event.currentTarget.dataset && navigate(`../Thread/${event.currentTarget.dataset.value}`)
                )}
				disablePadding
				disableRipple
                divider
			/>
		</Box>
	);
};

export default CommentsPage;
