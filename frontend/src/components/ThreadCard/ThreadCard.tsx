import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	CardActionArea,
	Collapse,
	Avatar,
	Typography,
	styled,
	IconButton,
	IconButtonProps,
	Box,
	Divider,
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
import { Delete, postJSON } from "../../utilities/api";
import { formatDistanceToNow } from "date-fns";
import MenuExpandedIcons from "./TopRightMenu/MenuExpandedIcons";
import handleMenuExpandedItemsClick from "./TopRightMenu/handleMenuExpandedItemsClick";
import { ThreadDTO } from "../../dtos/ThreadDTO";
import MediaViewer from "../MediaViewer";
import RichTextField from "../RichTextField";
import {
	cacheImageUrls,
} from "../../utilities/fileManipulation";

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
	thread: ThreadDTO;
	handleDeleteThread?: (threadID : number) => void;
}

const ThreadCard = ({ thread, handleDeleteThread }: Prop) => {
	const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState(false);
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

	useEffect(() => {
		cacheImageUrls(thread.imageLink)
			.then(() => {})
			.catch((err) => console.log(err));
	}, []);

	return (
		<>
			<Card elevation={3}>
				<CardActionArea
					sx={{ borderRadius: 0 }}
					onClick={() => navigate(`/Thread/${thread.threadID}`)}
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
									navigate(`/Profile/${thread.author.authorID}`);
								}}
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
										navigate,
										setOpenDeleteThreadDialog
									)}
									closeMenuOnExpandedItemsClick
								/>
							</>
						}
						title={thread.author.username}
						titleTypographyProps={{ fontWeight: 750 }}
						subheader={formatDistanceToNow(thread.createdAt, {
							addSuffix: true,
						})}
					/>

					<CardContent sx={{ paddingTop: 0 }}>
						<Typography variant="h5" color="primary.dark" fontWeight={760}>
							{thread.title}
						</Typography>
					</CardContent>

					<Box
						height={470}
						display={
							thread.imageLink.length === 0 && thread.videoLink.length === 0
								? "none"
								: "block"
						}
					>
						<MediaViewer
							backgroundColor="black"
							imageLinks={thread.imageLink}
							videoLinks={thread.videoLink}
							fullScreenMode={false}
							borderRadius={0.6}
						/>
					</Box>

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
								navigate(`/Thread/${thread.threadID}`, {
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

						<ExpandMore
							expand={expandCardContent}
							onClick={(event) => {
								setExpandCardContent(!expandCardContent);
								event?.stopPropagation();
							}}
						>
							<ExpandMoreIcon
								sx={{
									color: "primary.dark",
									display: thread.content ? "block" : "none",
								}}
							/>
						</ExpandMore>
					</CardActions>

					<Collapse in={expandCardContent} timeout="auto" unmountOnExit>
						<CardContent sx={{ py: 0 }}>
							<Divider />
						</CardContent>

						<CardContent>
							<Box fontSize={16}>
								<RichTextField
									editorState={thread.content}
									showBorders={false}
									editable={false}
								/>
							</Box>
						</CardContent>
					</Collapse>
				</CardActionArea>
			</Card>
			{/*Confirm Delete Thread Dialog*/}
			<SimpleDialog
				openDialog={openDeleteThreadDialog}
				setOpenDialog={setOpenDeleteThreadDialog}
				title="Confirm Delete Thread"
				backdropBlur={5}
				borderRadius={1.3}
				dialogTitleHeight={55}
				width={400}
			>
				<List
					listItemsArray={["Yes", "No"]}
					divider
					handleListItemsClick={[
						(event) => {
							event.stopPropagation();
							Delete(
								`threads/${thread.threadID}`,
								{},
								() => {},
								(err) => console.log(err)
							);
							setOpenDeleteThreadDialog(false);
							handleDeleteThread && handleDeleteThread(thread.threadID);
							
						},
						(event) => {
							event.stopPropagation();
							setOpenDeleteThreadDialog(false);
						},
					]}
				/>
			</SimpleDialog>
			{/*Share Thread Dialog*/}
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
							const domain = window.location.hostname;
							const protocol = window.location.protocol;

							window.location.href = `whatsapp://send?text=${protocol}${domain}/Thread/${thread.threadID}`;
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
					const domain = window.location.hostname;
					const protocol = window.location.protocol;
					navigator.clipboard.writeText(
						`${protocol}${domain}/Thread/${thread.threadID}`
					);
				}}
				duration={1500}
			/>
		</>
	);
};

export default ThreadCard;
