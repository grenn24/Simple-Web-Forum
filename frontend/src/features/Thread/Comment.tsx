
import { Box, Typography, Avatar } from "@mui/material";
import Menu from "../../components/Menu";
import { CommentDTO } from "../../dtos/CommentDTO";
import { dateToTimeYear } from "../../utilities/dateToString";
import { useNavigate } from "react-router-dom";

interface Prop {
	comment: CommentDTO
}
const Comment = ({
	comment
}: Prop) => {
	const navigate = useNavigate();
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Box display="flex">
				<Menu
					menuExpandedItemsArray={[]}
					menuIcon={<Avatar src={comment.author.avatarIconLink} />}
					menuStyle={{
						padding: 0,
						"&:hover": {
							filter: "brightness(0.9)",
						},
						marginRight: 1.5,
					}}
					menuIconDataValue="Profile"
					menuExpandedPosition={{
						vertical: "top",
						horizontal: "right",
					}}
					menuExpandedDataValuesArray={[]}
					toolTipText="View Profile"
					showMenuExpandedOnClick={false}
					handleMenuIconClick={()=>navigate(`../Profile/${comment.author.authorID}`)}
				/>
				<Box>
					<Typography fontSize={14} fontWeight={700}>
						{comment.author.username}
					</Typography>
					<Typography color="primary.dark" fontSize={14}>
						{dateToTimeYear(comment.createdAt, "short")}
					</Typography>
				</Box>
			</Box>
			<Typography
				color="text.primary"
				fontSize={16}
				lineHeight={1.3}
			>
				{comment.content}
			</Typography>
			{/* Upcoming feature to be added
			<Box display="flex" flexDirection="column">
				<Button
					buttonIcon={
						likeStatus ? <ThumbUpRoundedIcon /> : <ThumbUpOutlinedIcon />
					}
					color="primary.dark"
					handleButtonClick={() => {
						setLikeStatus(!likeStatus);
						!likeStatus && player();
					}}
				/>
				<Typography color="text.dark" fontSize={14} textAlign="center">
					{0}
				</Typography>
			</Box>
			*/}
		</Box>
	);
};

export default Comment;
