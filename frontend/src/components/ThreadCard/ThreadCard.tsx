import { useState } from "react";
import {
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	CardActionArea,
	Collapse,
	Avatar,
	Typography,
	styled,
	IconButton,
	IconButtonProps,
} from "@mui/material";
import Button from "../Button";
import Snackbar from "../Snackbar";
import {
	FavoriteBorderRounded as FavoriteBorderRoundedIcon,
	CommentRounded as CommentRoundedIcon,
	ShareRounded as ShareRoundedIcon,
	FavoriteRounded as FavoriteRoundedIcon,
	ExpandMore as ExpandMoreIcon,
	MoreVert as MoreVertIcon,
	LinkRounded as LinkRoundedIcon,
	WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import likeSound from "../../assets/audio/like-sound.mp3";
import Menu from "../Menu";
import MenuExpandedItems from "./TopRightMenu/MenuExpandedItems";
import SimpleDialog from "../SimpleDialog";
import List from "../List";
import { useNavigate } from "react-router-dom";
import playerGenerator from "../../utilities/playerGenerator";
import { Delete, postJSON } from "../../utilities/apiClient";
import { dateToYear } from "../../utilities/dateToString";
import MenuExpandedIcons from "./TopRightMenu/MenuExpandedIcons";
import handleMenuExpandedItemsClick from "./TopRightMenu/handleMenuExpandedItemsClick";
import { ThreadDTO } from "../../dtos/ThreadDTO";

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme }) => ({
	marginLeft: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
	variants: [
		{
			props: ({ expand }) => !expand,
			style: {
				transform: "rotate(0deg)",
			},
		},
		{
			props: ({ expand }) => !!expand,
			style: {
				transform: "rotate(180deg)",
			},
		},
	],
}));

interface Prop {
	thread: ThreadDTO
}

const ThreadCard = ({
	thread,
}: Prop) => {
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [expandCardContent, setExpandCardContent] = useState(false);
	const [likeStatus, setLikeStatus] = useState(thread.likeStatus);
	const [likeCount, setLikeCount] = useState(thread.likeCount);
	const [bookmarkStatus, setBookmarkStatus] = useState(thread.bookmarkStatus);
	const [archiveStatus, setArchiveStatus] = useState(thread.archiveStatus);

	const navigate = useNavigate();

	const player = playerGenerator(
		likeSound,
		0.9,
		{ default: [90, 3000] },
		"default"
	);

	return (
		<>
			<Card
				sx={{
					my: 3,
				}}
				elevation={3}
			>
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
								dividerPositions={[2]}
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
							<>
								<Menu
									menuIcon={<MoreVertIcon sx={{ color: "primary.dark" }} />}
									menuExpandedIconsArray={MenuExpandedIcons(
										bookmarkStatus,
										archiveStatus,
										thread
									)}
									menuExpandedItemsArray={MenuExpandedItems(
										thread,
										archiveStatus
									)}
									toolTipText="More"
									scrollLock={true}
									handleMenuIconClick={(event) => event.stopPropagation()}
									handleMenuExpandedItemsClick={handleMenuExpandedItemsClick(
										bookmarkStatus,
										setBookmarkStatus,
										archiveStatus,
										setArchiveStatus,
										thread,
										navigate
									)}
									closeMenuOnExpandedItemsClick={false}
								/>
							</>
						}
						title={thread.author.username}
						titleTypographyProps={{ fontWeight: 750 }}
						subheader={dateToYear(thread.createdAt, "long")}
					/>

					<CardContent>
						<Typography variant="h5" color="primary.dark" fontWeight={760}>
							{thread.title}
						</Typography>
					</CardContent>

					<CardMedia
						component="img"
						height="194"
						image={thread.imageLink}
						sx={{ height: "auto", objectFit: "contain", pointerEvents: "none" }}
					/>

					<CardActions
						disableSpacing
						sx={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: 1,
							marginBottom: 1,
						}}
					>
						<Button
							role={undefined}
							variant="outlined"
							buttonIcon={
								likeStatus ? (
									<FavoriteRoundedIcon sx={{ color: "red" }} />
								) : (
									<FavoriteBorderRoundedIcon />
								)
							}
							color="primary.dark"
							borderRadius="10px"
							borderColor="primary.light"
							buttonStyle={{
								marginLeft: 1,
								marginRight: 1,
							}}
							handleButtonClick={(event) => {
								setLikeStatus(!likeStatus);
								if (likeStatus) {
									setLikeCount(likeCount - 1);
									Delete(
										`/threads/${thread.threadID}/likes/user`,
										{},
										() => {},
										(err) => console.log(err)
									);
								} else {
									player();
									setLikeCount(likeCount + 1);
									postJSON(
										`/threads/${thread.threadID}/likes/user`,
										{},
										() => {},
										(err) => console.log(err)
									);
								}
								event.stopPropagation();
							}}
						>
							{String(likeCount)}
						</Button>
						<Button
							component="button"
							role={undefined}
							variant="outlined"
							buttonIcon={<CommentRoundedIcon />}
							color="primary.dark"
							borderRadius="10px"
							borderColor="primary.light"
							buttonStyle={{
								marginRight: 1,
							}}
							handleButtonClick={(event) => {
								navigate(`../Thread/${thread.threadID}`, {
									state: { isCommenting: true },
								});
								event.stopPropagation();
							}}
						>
							{String(thread.commentCount)}
						</Button>
						<Button
							component="button"
							role={undefined}
							variant="outlined"
							buttonIcon={<ShareRoundedIcon sx={{ fontSize: 25 }} />}
							color="primary.dark"
							borderRadius="10px"
							borderColor="primary.light"
							buttonStyle={{
								border: 1,
								marginRight: 1,
							}}
							handleButtonClick={(event) => {
								setOpenShareDialog(true);
								event.stopPropagation();
							}}
						/>
						<SimpleDialog
							openDialog={openShareDialog}
							setOpenDialog={setOpenShareDialog}
							title="Share"
							backdropBlur={5}
							borderRadius={1.3}
							handleCloseDialog={(event) => event.stopPropagation()}
							dialogTitleHeight={55}
							width={400}
						>
							<List
								listItemsArray={["Copy Link", "Share to WhatsApp", "Cancel"]}
								listIconsArray={[
									<LinkRoundedIcon sx={{ marginRight: 1 }} />,
									<WhatsAppIcon sx={{ marginRight: 1 }} />,
								]}
				
								divider
								handleListItemsClick={[
									(event) => {
										setOpenSnackbar(true);
										setOpenShareDialog(false);
										event.stopPropagation();
									},
									(event) => {
										setOpenShareDialog(false);
										const currentPathObject = new URL(window.location.href);
										const parentPathRelative =
											currentPathObject.pathname.substring(
												0,
												currentPathObject.pathname.lastIndexOf("/")
											);
										const parentPathAbsolute = `${currentPathObject.origin}${parentPathRelative}`;
										window.location.href = `whatsapp://send?text=${parentPathAbsolute}/Thread/${thread.threadID}`;
										event.stopPropagation();
									},
									() => setOpenShareDialog(false),
								]}
							/>
						</SimpleDialog>
						<Snackbar
							openSnackbar={openSnackbar}
							setOpenSnackbar={setOpenSnackbar}
							message="Link copied to clipboard"
							handleSnackbarClose={() => {
								const currentPathObject = new URL(window.location.href);
								const parentPathRelative = currentPathObject.pathname.substring(
									0,
									currentPathObject.pathname.lastIndexOf("/")
								);
								const parentPathAbsolute = `${currentPathObject.origin}${parentPathRelative}`;
								navigator.clipboard.writeText(
									`${parentPathAbsolute}/Thread/${thread.threadID}`
								);
							}}
							duration={1500}
						/>
						<ExpandMore
							expand={expandCardContent}
							onClick={(event) => {
								setExpandCardContent(!expandCardContent);
								event?.stopPropagation();
							}}
						>
							<ExpandMoreIcon sx={{ color: "primary.dark" }} />
						</ExpandMore>
					</CardActions>

					<Collapse in={expandCardContent} timeout="auto" unmountOnExit>
						<CardContent>
							<Typography sx={{ marginBottom: 2 }}>{thread.content}</Typography>
						</CardContent>
					</Collapse>
				</CardActionArea>
			</Card>
		</>
	);
};

export default ThreadCard;
