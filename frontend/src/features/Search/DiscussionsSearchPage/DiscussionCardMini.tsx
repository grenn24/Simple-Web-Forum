import { DiscussionDTO } from "../../../dtos/DiscussionDTO";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Divider, Tooltip, Typography } from "@mui/material";

interface Prop {
	discussion: DiscussionDTO;
}
const DiscussionCardMini = ({ discussion }: Prop) => {
	const navigate = useNavigate();
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
				alignItems="left"
				height={90}
			>
				<Typography fontSize={22} fontWeight={760} color="primary.dark">
					{discussion.name}
				</Typography>
				<Box display="flex" alignItems="center" flexDirection="row">
					<Typography
						fontSize={17}
						color="primary.dark"
						whiteSpace="pre-wrap"
					>
						Creator
					</Typography>
					<Divider orientation="vertical" flexItem sx={{mx:1.4}} />
					<Tooltip title={discussion.creator.name}>
						<Avatar
							sx={{ width: 30, height: 30 }}
							src={discussion.creator.avatarIconLink}
							onClick={(event) => {
								event.stopPropagation();
								navigate(`/Profile/${discussion.creator.authorID}`);
							}}
						/>
					</Tooltip>
				</Box>
			</Box>
			<Box
				width="40%"
				display={discussion.BackgroundImageLink ? "inherit" : "none"}
			>
				<img
					height={90}
					style={{ objectFit: "cover", flexGrow: 1 }}
					src={discussion.BackgroundImageLink}
				/>
			</Box>
		</Box>
	);
};

export default DiscussionCardMini;
