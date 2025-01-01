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
import MenuExpandedIconsBookmarkTrue from "./TopRightMenu/MenuExpandedIconsBookmarkTrue";
import MenuExpandedIconsBookmarkFalse from "./TopRightMenu/MenuExpandedIconsBookmarkFalse";
import { dateToYear } from "../../utilities/dateToString";

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
	threadID: number;
	threadTitle: string;
	threadAuthor: string;
	threadCreatedAt: Date;
	threadLikeCount: number;
	threadCommentCount: number;
	threadContentSummarised: string;
	threadImageLink?: string;
	avatarIconLink: string;
	handleAvatarIconClick?: (event: React.MouseEvent<HTMLElement>) => void;
	threadLikeStatus: boolean;
	threadBookmarkStatus: boolean;
}

const ThreadCard = ({
	threadID,
	threadTitle,
	threadAuthor,
	threadCreatedAt,
	threadLikeCount,
	threadCommentCount,
	threadContentSummarised,
	threadImageLink,
	avatarIconLink,
	handleAvatarIconClick,
	threadLikeStatus,
	threadBookmarkStatus,
}: Prop) => {
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [expandCardContent, setExpandCardContent] = useState(false);

	const [likeStatus, setLikeStatus] = useState(threadLikeStatus);
	const [likeCount, setLikeCount] = useState(threadLikeCount);
	const [bookmarkStatus, setBookmarkStatus] = useState(threadBookmarkStatus);

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
					onClick={() => navigate(`../Thread/${threadID}`)}
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
								dividerPositions={[2]}
								menuExpandedDataValuesArray={[]}
								toolTipText="View Profile"
								handleMenuIconClick={(event) => {
									handleAvatarIconClick && handleAvatarIconClick(event);
									event.stopPropagation();
								}}
								showMenuExpandedOnClick={false}
							/>
						}
						action={
							<>
								<Menu
									menuIcon={<MoreVertIcon sx={{ color: "primary.dark" }} />}
									menuExpandedIconsArray={
										bookmarkStatus
											? MenuExpandedIconsBookmarkTrue
											: MenuExpandedIconsBookmarkFalse
									}
									menuExpandedItemsArray={MenuExpandedItems}
									toolTipText="More"
									scrollLock={true}
									handleMenuIconClick={(event) => event.stopPropagation()}
									handleMenuExpandedItemsClick={[
										(event) => event.stopPropagation(),
										(event) => {
											event.stopPropagation();
											setBookmarkStatus(!bookmarkStatus);
											bookmarkStatus
												? Delete(
														`threads/${threadID}/bookmarks/user`,
														{},
														() => {},
														(err) => console.log(err)
												  )
												: postJSON(
														`threads/${threadID}/bookmarks/user`,
														{},
														() => {},
														(err) => console.log(err)
												  );
										},
										(event) => event.stopPropagation(),
									]}
								/>
							</>
						}
						title={threadAuthor}
						titleTypographyProps={{ fontWeight: 750 }}
						subheader={dateToYear(threadCreatedAt, "long")}
					/>

					<CardContent>
						<Typography variant="h5" color="primary.dark" fontWeight={760}>
							{threadTitle}
						</Typography>
					</CardContent>

					<CardMedia
						component="img"
						height="194"
						image={threadImageLink}
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
										`/threads/${threadID}/likes/user`,
										{},
										() => {},
										(err) => console.log(err)
									);
								} else {
									player();
									setLikeCount(likeCount + 1);
									postJSON(
										`/threads/${threadID}/likes/user`,
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
								navigate(`../Thread/${threadID}`, {
									state: { expandTextField: true },
								}); //Pass in state during navigation
								event.stopPropagation();
							}}
						>
							{String(threadCommentCount)}
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
						>
							<List
								listItemsArray={["Copy Link", "Share to WhatsApp"]}
								listIconsArray={[
									<LinkRoundedIcon sx={{ marginRight: 1 }} />,
									<WhatsAppIcon sx={{ marginRight: 1 }} />,
								]}
								disablePadding
								handleListItemsClick={[
									(event) => {
										setOpenSnackbar(true);
										event.stopPropagation();
									},
									(event) => {
										const currentPathObject = new URL(window.location.href);
										const parentPathRelative =
											currentPathObject.pathname.substring(
												0,
												currentPathObject.pathname.lastIndexOf("/")
											);
										const parentPathAbsolute = `${currentPathObject.origin}${parentPathRelative}`;
										window.location.href = `whatsapp://send?text=${parentPathAbsolute}/Thread/${threadID}`;
										event.stopPropagation();
									},
								]}
								listItemsStyles={{ padding: 2.5 }}
							/>
							<Snackbar
								openSnackbar={openSnackbar}
								setOpenSnackbar={setOpenSnackbar}
								message="Link copied to clipboard"
								handleSnackbarClose={() => {
									const currentPathObject = new URL(window.location.href);
									const parentPathRelative =
										currentPathObject.pathname.substring(
											0,
											currentPathObject.pathname.lastIndexOf("/")
										);
									const parentPathAbsolute = `${currentPathObject.origin}${parentPathRelative}`;
									navigator.clipboard.writeText(
										`${parentPathAbsolute}/Thread/${threadID}`
									);
								}}
								duration={1500}
							/>
						</SimpleDialog>
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
							<Typography sx={{ marginBottom: 2 }}>
								{threadContentSummarised}
							</Typography>
						</CardContent>
					</Collapse>
				</CardActionArea>
			</Card>
		</>
	);
};

export default ThreadCard;
