import {
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	Avatar,
	Typography,
	Box,
	Divider,
} from "@mui/material";
import {
	FavoriteBorderRounded as FavoriteBorderRoundedIcon,
	CommentRounded as CommentRoundedIcon,
	ShareRounded as ShareRoundedIcon,
	FavoriteRounded as FavoriteRoundedIcon,
	MoreVert as MoreVertIcon,
	LinkRounded as LinkRoundedIcon,
	WhatsApp as WhatsAppIcon,
	SendRounded as SendRoundedIcon,
	CancelRounded as CancelRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import Menu from "../components/Menu";
import Button from "../components/Button";
import SimpleDialog from "../components/SimpleDialog";
import Snackbar from "../components/Snackbar";
import List from "../components/List";
import { useState, useRef } from "react";
import MenuExpandedIcons from "../features/Thread/MenuExpandedIcons";
import MenuExpandedItems from "../features/Thread/MenuExpandedItems";
import playerGenerator from "../utilities/playerGenerator";
import likeSound from "../assets/audio/like-sound.mp3";
import ThreadMetadata from "../features/Thread/threadDataSample.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import FullScreenImage from "../components/FullScreenImage";
import TextFieldAutosize from "../components/TextFieldAutosize/TextFieldAutosize.tsx";
import Comment from "../features/Thread/Comment.tsx";

const Thread = () => {
	const [threadLikeClickStatus, setThreadLikeClickStatus] = useState(false);
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [fullScreenImage, setFullScreenImage] = useState(false);
	const [expandTextField, setExpandTextField] = useState(false);
	const [commentSortingOrder, setCommentSortingOrder] = useState("Newest");

	const player = playerGenerator(
		likeSound,
		0.9,
		{ default: [90, 3000] },
		"default"
	);

	const navigate = useNavigate();

	const textField = useRef<HTMLTextAreaElement>(null);
	const textFieldExpanded = useRef<HTMLTextAreaElement>(null);

	const location = useLocation();
	const focusTextField = location.state;
	focusTextField && textField.current && textField.current.focus();

	return (
		<>
			<Box
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: 3,
					minHeight: "100%",
					width: {
						xs: "100%",
						sm: "100%",
						md: "95%",
						lg: "70%",
						xl: "60%",
					},
					marginX: "auto",
				}}
			>
				<Card elevation={2} sx={{ padding: 2 }}>
					<CardHeader
						avatar={
							<Menu
								menuExpandedItemsArray={[]}
								menuIcon={<Avatar src={ThreadMetadata.avatarIconLink} />}
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
								showMenuExpandedOnClick={false}
								handleMenuIconClick={() =>
									navigate(`../Profile/${ThreadMetadata.authorId}`)
								}
							/>
						}
						action={
							<>
								<Menu
									menuIcon={<MoreVertIcon sx={{ color: "primary.dark" }} />}
									menuExpandedIconsArray={MenuExpandedIcons}
									menuExpandedItemsArray={MenuExpandedItems}
									toolTipText="More"
									scrollLock={true}
								/>
							</>
						}
						title={ThreadMetadata.author}
						titleTypographyProps={{ fontWeight: 750 }}
						subheader={ThreadMetadata.date}
					/>
					<Divider />

					<CardContent sx={{ paddingBottom: 0 }}>
						<Typography
							variant="h5"
							color="text.secondary"
							fontWeight={760}
							marginBottom={2}
						>
							{ThreadMetadata.title}
						</Typography>
						<Typography
							variant="h6"
							color="text.secondary"
							fontFamily="Open Sans"
							fontSize={17}
						>
							Topics Tagged:{" "}
							{ThreadMetadata.topicsTagged.map((topic) => {
								return (
									<>
										<Button
											disableRipple
											handleButtonClick={() =>
												navigate(`../Topics?topicName=${topic}`)
											}
											fontFamily="Open Sans"
											buttonStyle={{ px: 1, py: 0 }}
											color="text.secondary"
											variant="outlined"
											backgroundColor="primary.light"
										>
											{topic}
										</Button>
									</>
								);
							})}
						</Typography>

						<CardMedia
							component="img"
							image={ThreadMetadata.imageLink}
							sx={{
								width: "100%",
								height: "auto",
								objectFit: "contain",
								borderRadius: 1.3,
								my: 3,
							}}
							onClick={() => setFullScreenImage(true)}
						/>
					</CardContent>
					<CardContent sx={{ py: 0 }}>
						<Typography sx={{ marginBottom: 2 }} textAlign="left">
							{ThreadMetadata.content}
						</Typography>
					</CardContent>

					<CardActions
						disableSpacing
						sx={{
							display: "flex",
							justifyContent: "flex-start",
							marginTop: 1,
						}}
					>
						<Button
							component="button"
							role={undefined}
							variant="outlined"
							buttonIcon={
								threadLikeClickStatus ? (
									<FavoriteRoundedIcon color="warning" />
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
							handleButtonClick={() => {
								setThreadLikeClickStatus(!threadLikeClickStatus);
								!threadLikeClickStatus && player();
							}}
						>
							{ThreadMetadata.likeCount}
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
							handleButtonClick={() => {
								textField.current && textField.current.focus();
								textFieldExpanded.current && textFieldExpanded.current.focus();
							}}
						>
							{ThreadMetadata.commentCount}
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
								marginRight: 1,
							}}
							handleButtonClick={() => setOpenShareDialog(true)}
						>
							Share
						</Button>
						<SimpleDialog
							openDialog={openShareDialog}
							setOpenDialog={setOpenShareDialog}
							title="Share"
							backdropBlur={5}
							borderRadius={1.3}
						>
							<List
								listItemsArray={["Copy Link", "Share to WhatsApp"]}
								listIconsArray={[
									<LinkRoundedIcon sx={{ marginRight: 1 }} />,
									<WhatsAppIcon sx={{ marginRight: 1 }} />,
								]}
								disablePadding
								handleListItemsClick={[
									() => {
										setOpenSnackbar(true);
									},
									() => {
										const currentLink = window.location.href;
										window.location.href = `whatsapp://send?text=${currentLink}/Thread/${ThreadMetadata.id}`;
									},
								]}
							/>
							<Snackbar
								openSnackbar={openSnackbar}
								setOpenSnackbar={setOpenSnackbar}
								message="Link copied to clipboard"
								handleSnackbarClose={() => {
									const currentLink = window.location.href;
									navigator.clipboard.writeText(currentLink);
								}}
								duration={1500}
							/>
						</SimpleDialog>
					</CardActions>

					<CardContent sx={{ display: "flex", justifyContent: "center" }}>
						{!expandTextField ? (
							<TextFieldAutosize
								sx={{ width: "100%", marginBottom: 1.5 }}
								minRows={1}
								placeholder="Add a comment"
								onClick={() => setExpandTextField(true)}
								ref={textField}
							/>
						) : (
							<Box sx={{ width: "100%" }}>
								<TextFieldAutosize
									sx={{ width: "100%" }}
									minRows={3}
									placeholder="Add a comment"
									ref={textFieldExpanded}
									autoFocus
								/>
								<Box sx={{ display: "flex", justifyContent: "right" }}>
									<Button
										iconOnly
										buttonIcon={<CancelRoundedIcon sx={{ padding: 0 }} />}
										color="primary.dark"
										buttonStyle={{ marginLeft: "auto", marginRight: 0 }}
										handleButtonClick={() => setExpandTextField(false)}
									/>
									<Button
										iconOnly
										buttonIcon={<SendRoundedIcon />}
										color="primary.dark"
										buttonStyle={{ marginLeft: "auto", marginRight: 0 }}
									/>
								</Box>
							</Box>
						)}
					</CardContent>
					<Divider />
					<CardContent sx={{ px: 0 }}>
						<Box sx={{ px: 1,  py:0 }} display="flex" justifyContent="space-between" alignItems="center">
							<Typography fontFamily="Open Sans" fontSize={18}>
								51 Comments
							</Typography>
							<Menu
								menuExpandedItemsArray={["Newest", "Popular", "Oldest"]}
								menuIcon={<SortRoundedIcon />}
								variant="text"
								handleMenuExpandedItemsClick={(event) =>
									event.currentTarget.dataset.value &&
									setCommentSortingOrder(event.currentTarget.dataset.value)
								}
								menuStyle={{fontFamily:"Open Sans"}}
							>
								{commentSortingOrder}
							</Menu>
						</Box>
						<List
							listItemsStyles={{
								"&:hover": { backgroundColor: "transparent" },
							}}
							disablePadding
							disableRipple
							listItemsArray={ThreadMetadata.comments.map((comment) => {
								return (
									<Comment
										id={comment.id}
										author={comment.author}
										authorId={comment.authorId}
										likeCount={comment.likeCount}
										content={comment.content}
										date={comment.date}
										avatarIconLink={comment.avatarIconLink}
										handleAvatarIconClick={() =>
											navigate(`../Profile/${comment.authorId}`)
										}
									/>
								);
							})}
						/>
					</CardContent>
				</Card>
			</Box>
			<FullScreenImage
				path={ThreadMetadata.imageLink}
				setFullScreenImage={setFullScreenImage}
				fullScreenImage={fullScreenImage}
			/>
		</>
	);
};

export default Thread;
