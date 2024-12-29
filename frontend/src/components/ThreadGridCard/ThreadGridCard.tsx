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


interface Prop {
	threadId: number;
	threadTitle: string;
	threadAuthorName: string;
	threadAuthorID?: string;
	threadCreatedAt: Date;
	avatarIconLink: string;
	threadContentSummarised: string;
	handleAvatarIconClick?: () => void;
	bookmarkedStatus: boolean;
}

const ThreadGridCard = ({
	threadId,
	threadTitle,
	threadAuthorName,
	threadCreatedAt,
	avatarIconLink,
	threadContentSummarised,
	handleAvatarIconClick,
	bookmarkedStatus
}: Prop) => {
	const [bookMarkedClickedStatus, setBookmarkClickedStatus] = useState(bookmarkedStatus);
	const navigate = useNavigate();
	return (
		<>
			<Card sx={{ borderRadius: 0.7 }} elevation={3}>
				<CardActionArea
					sx={{ borderRadius: 0 }}
					onClick={() => navigate(`../Thread/${threadId}`)}
					disableRipple
				>
					<CardHeader
						avatar={
							<Menu
								menuExpandedItemsArray={[]}
								menuIcon={<Avatar src={avatarIconLink} />}
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
									handleAvatarIconClick && handleAvatarIconClick();
									event.stopPropagation();
								}}
								showMenuExpandedOnClick={false}
								
							/>
						}
						action={
							<>
								<Menu
									menuIcon={
										!bookMarkedClickedStatus ? (
											<BookmarkBorderRoundedIcon
												sx={{ color: "primary.dark" }}
											/>
										) : (
											<BookmarkRemoveRoundedIcon
												sx={{ color: "primary.dark" }}
											/>
										)
									}
									menuExpandedItemsArray={[]}
									toolTipText={
										!bookMarkedClickedStatus
											? "Add Bookmark"
											: "Remove Bookmark"
									}
									scrollLock={true}
									showMenuExpandedOnClick={false}
									handleMenuIconClick={(event) => {
										setBookmarkClickedStatus(!bookMarkedClickedStatus);
										event.stopPropagation();
									}}
								/>
							</>
						}
						title={threadAuthorName}
						subheader={threadCreatedAt.getDate() + "/" + (threadCreatedAt.getMonth() + 1) + "/" + threadCreatedAt.getFullYear()}
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
							{threadTitle}
						</Typography>
					</CardContent>

					<CardContent sx={{ py: 0, marginBottom: 1 }}>
						<Typography fontSize={14}>{threadContentSummarised}</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</>
	);
};

export default ThreadGridCard;
