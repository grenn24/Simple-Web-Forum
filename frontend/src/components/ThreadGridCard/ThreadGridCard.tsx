import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "../Menu";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRemoveRoundedIcon from "@mui/icons-material/BookmarkRemoveRounded";
import { Box, CardActionArea, SxProps, Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Delete, postJSON } from "../../utilities/api";
import { ThreadDTO } from "../../dtos/ThreadDTO";
import { formatDistanceToNow } from "date-fns";
import RichTextField from "../RichTextField";

interface Prop {
	thread: ThreadDTO;
	style?: SxProps<Theme>;
	showAvatarTooltipText?: boolean;
}

const ThreadGridCard = ({ thread, style, showAvatarTooltipText=true }: Prop) => {
	const [bookmarkStatus, setBookmarkStatus] = useState(thread.bookmarkStatus);
	const navigate = useNavigate();

	const handleBookmarkIconClick = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setBookmarkStatus(!bookmarkStatus);
		if (bookmarkStatus) {
			Delete(
				`threads/${thread.threadID}/bookmarks/user`,
				{},
				() => {},
				(err) => console.log(err)
			);
		} else {
			postJSON(
				`threads/${thread.threadID}/bookmarks/user`,
				{},
				() => {},
				(err) => console.log(err)
			);
		}
	};
	return (
		<>
			<Card sx={{ borderRadius: 0.7, ...style }} elevation={3}>
				<CardActionArea
					sx={{
						borderRadius: 0,
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-start",
					}}
					onClick={(event) => {
						event.stopPropagation();
						navigate(`../Thread/${thread.threadID}`);
					}}
					disableRipple
				>
					<CardHeader
						avatar={
							<Menu
								menuExpandedItemsArray={[]}
								menuIcon={<Avatar src={thread.author.avatarIconLink} />}
								menuStyle={{
									padding: 0,
									"&:hover": {
										filter: "brightness(0.9)",
									},
								}}
								menuIconDataValue="Profile"
								menuExpandedPosition={{
									vertical: "top",
									horizontal: "right",
								}}
								menuExpandedDataValuesArray={[]}
								toolTipText={showAvatarTooltipText ? "View Profile" : undefined}
								handleMenuIconClick={(event) => {
									event.stopPropagation();
									navigate(`../Profile/${thread.author.authorID}`);
								}}
								showMenuExpandedOnClick={false}
							/>
						}
						action={
							<Menu
								menuIcon={
									!bookmarkStatus ? (
										<BookmarkBorderRoundedIcon sx={{ color: "primary.dark" }} />
									) : (
										<BookmarkRemoveRoundedIcon sx={{ color: "primary.dark" }} />
									)
								}
								menuExpandedItemsArray={[]}
								toolTipText={
									!bookmarkStatus ? "Add Bookmark" : "Remove Bookmark"
								}
								scrollLock={true}
								showMenuExpandedOnClick={false}
								handleMenuIconClick={handleBookmarkIconClick}
							/>
						}
						title={thread.author.username}
						subheader={formatDistanceToNow(thread.createdAt, {
							addSuffix: true,
						})}
						titleTypographyProps={{ fontWeight: 750 }}
						sx={{ paddingBottom: 0.5, boxSizing: "border-box", width: "100%" }}
					/>

					<CardContent
						sx={{
							py: 0,
							my: 1,
							boxSizing: "border-box",
							width: "100%",
							height: "100%",
						}}
					>
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="space-between"
							height="100%"
							maxHeight="100%"
						>
							<Box display="flex" flexDirection="column" flexGrow={1}>
								<Typography
									fontSize={20}
									color="primary.dark"
									fontWeight={700}
									lineHeight={1.3}
									height={30}
								>
									{thread.title}
								</Typography>


								<Box  height={50} fontSize={15}>
									<RichTextField
										editorState={thread.content}
										editable={false}
										showBorders={false}
									/>
								</Box>
							</Box>

							<Typography
								fontSize={15}
								fontFamily="Open Sans"
								fontWeight={400}
								whiteSpace="pre-wrap"
							>
								{thread.likeCount} Likes • {thread.commentCount} Comments
							</Typography>
						</Box>
					</CardContent>
				</CardActionArea>
			</Card>
		</>
	);
};

export default ThreadGridCard;
