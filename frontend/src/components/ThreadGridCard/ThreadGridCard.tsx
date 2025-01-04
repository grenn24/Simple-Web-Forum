import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Menu from "../Menu";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRemoveRoundedIcon from "@mui/icons-material/BookmarkRemoveRounded";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { dateToYear } from "../../utilities/dateToString";
import { Delete, postJSON } from "../../utilities/apiClient";
import { ThreadDTO } from "../../dtos/ThreadDTO";

interface Prop {
	thread: ThreadDTO
}

const ThreadGridCard = ({
	thread
}: Prop) => {
	const [bookmarkStatus, setBookmarkStatus] = useState(
		thread.bookmarkStatus
	);
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
			<Card sx={{ borderRadius: 0.7 }} elevation={3}>
				<CardActionArea
					sx={{ borderRadius: 0 }}
					onClick={() => navigate(`../Thread/${thread.threadID}`)}
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
								toolTipText="View Profile"
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
						title={thread.author.name}
						subheader={dateToYear(thread.createdAt, "short")}
						titleTypographyProps={{ fontWeight: 750 }}
						sx={{ paddingBottom: 0.5 }}
					/>

					<CardContent sx={{ py: 0, my: 0 }}>
						<Typography
							fontSize={20}
							color="text.primary"
							fontFamily="Open Sans"
							fontWeight={600}
						>
							{thread.title}
						</Typography>
					</CardContent>

					<CardContent sx={{ py: 0, marginBottom: 1 }}>
						<Typography fontSize={14}>{thread.content}</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</>
	);
};

export default ThreadGridCard;
