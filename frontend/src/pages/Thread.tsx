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
	Container,
	FormControl,
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
	ArrowBackRounded as ArrowBackRoundedIcon,
} from "@mui/icons-material";
import Menu from "../components/Menu/index.ts";
import Button from "../components/Button/index.ts";
import SimpleDialog from "../components/SimpleDialog/index.tsx";
import Snackbar from "../components/Snackbar/index.ts";
import List from "../components/List/index.tsx";
import { useState, useEffect } from "react";
import MenuExpandedItems from "../features/Thread/TopRightMenu/MenuExpandedItems.tsx";
import playerGenerator from "../utilities/playerGenerator.tsx";
import likeSound from "../assets/audio/like-sound.mp3";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import FullScreenImage from "../components/FullScreenImage/index.ts";
import TextFieldAutosize from "../components/TextFieldAutosize/TextFieldAutosize.tsx";
import Comment from "../features/Thread/Comment.tsx";
import { Delete, get, postJSON } from "../utilities/apiClient.tsx";
import { useForm, Controller } from "react-hook-form";
import { ThreadExpandedDTO } from "../dtos/ThreadDTO.tsx";
import { dateToTimeYear } from "../utilities/dateToString.tsx";
import MenuExpandedIcons from "../features/Thread/TopRightMenu/MenuExpandedIcons.tsx";
import handleMenuExpandedItemsClick from "../features/Thread/TopRightMenu/handleMenuExpandedItemsClick.tsx";
import ThreadCardLoading from "../components/ThreadCard/ThreadCardLoading.tsx";

const Thread = () => {
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [fullScreenImage, setFullScreenImage] = useState(false);
	const [commentSortingOrder, setCommentSortingOrder] = useState("Newest");
	const [isLoading, setIsLoading] = useState(true);

	const player = playerGenerator(
		likeSound,
		0.9,
		{ default: [90, 3000] },
		"default"
	);

	const navigate = useNavigate();

	// Check if an expand text field state was passed in during navigation as state
	const location = useLocation();
	const [expandTextField, setExpandTextField] = useState(false);

	const [threadExpanded, setThreadExpanded] = useState<ThreadExpandedDTO>({
		threadID: 0,
		comments: [],
		title: "",
		content: "",
		author: {
			authorName: "",
			authorID: 0,
			avatarIconLink: "",
		},
		likeCount: 0,
		likeStatus: false,
		commentCount: 0,
		imageTitle: "",
		imageLink: "",
		createdAt: new Date(),
		topicsTagged: [],
		bookmarkStatus: false,
		archiveStatus: false,
	});
	const { threadID } = useParams();

	const [likeCount, setLikeCount] = useState(0);
	const [likeStatus, setLikeStatus] = useState(false);
	const [archiveStatus, setArchiveStatus] = useState(false);
	const [commentCount, setCommentCount] = useState(0);
	const [bookmarkStatus, setBookmarkStatus] = useState(false);

	useEffect(
		() =>
			get(
				"/threads/expanded/" + threadID,
				(res) => {
					const responseBody = res.data.data;
					const threadExpanded = {
						threadID: responseBody.thread_id,
						title: responseBody.title,
						content: responseBody.content,
						author: {
							authorName: responseBody.author.author_name,
							authorID: responseBody.author.author_id,
							avatarIconLink: responseBody.author.avatar_icon_link,
						},
						comments: responseBody.comments.map((comment: any) => ({
							commentID: comment.comment_id,
							threadID: comment.thread_id,
							authorID: comment.author_id,
							authorName: comment.author_name,
							content: comment.content,
							createdAt: new Date(comment.created_at),
						})),
						likeCount: responseBody.like_count,
						likeStatus: responseBody.like_status,
						commentCount: responseBody.comment_count,
						imageTitle: responseBody.image_title,
						imageLink: responseBody.image_link,
						createdAt: new Date(responseBody.created_at),
						topicsTagged: responseBody.topics_tagged
							? responseBody.topics_tagged.map((topic: any) => ({
									topicID: topic.topic_id,
									name: topic.name,
							  }))
							: [],
						bookmarkStatus: responseBody.bookmark_status,
						archiveStatus: responseBody.archive_status,
					};

					setThreadExpanded(threadExpanded);
					setCommentCount(threadExpanded.commentCount);
					setLikeCount(threadExpanded.likeCount);
					setLikeStatus(threadExpanded.likeStatus);
					setArchiveStatus(threadExpanded.archiveStatus);
					setBookmarkStatus(threadExpanded.bookmarkStatus);
					setExpandTextField(location.state?.expandTextField);
					setIsLoading(false);
				},
				(err) => console.log(err)
			),
		[commentCount]
	);

	const { register, handleSubmit, reset, control } = useForm();

	const handleCommentSubmit = handleSubmit((data) => {
		reset();
		setExpandTextField(false);
		postJSON(
			`/threads/${threadExpanded.threadID}/comments/user`,
			{
				content: data.comment,
			},
			() => setCommentCount(commentCount + 1),
			(err) => console.log(err)
		);
	});

	return (
		<>
			<Box sx={{ p: { xs: 1.5, sm: 3 }, bgcolor: "background.default" }}>
				<Box>
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="primary.dark"
						buttonStyle={{ mx: 0, p: 0.5 }}
						handleButtonClick={() => navigate(-1)}
					/>
				</Box>
				<Container
					sx={{
						flexGrow: 1,

						minHeight: "100%",
						width: {
							xs: "100%",
							sm: "100%",
							md: "95%",
							lg: "70%",
							xl: "60%",
						},
						px: 0,
						marginTop: 2,
					}}
				>
					{isLoading ? (
						<ThreadCardLoading bodyHeight={350}/>
					) : (
						<Card elevation={2} sx={{ padding: { xs: 0.5, sm: 1, md: 2 } }}>
							<CardHeader
								avatar={
									<Menu
										menuExpandedItemsArray={[]}
										menuIcon={
											<Avatar src={threadExpanded.author.avatarIconLink} />
										}
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
											navigate(`../Profile/${threadExpanded.author.authorID}`)
										}
									/>
								}
								action={
									<>
										<Menu
											menuIcon={<MoreVertIcon sx={{ color: "primary.dark" }} />}
											menuExpandedIconsArray={MenuExpandedIcons(
												bookmarkStatus,
												archiveStatus
											)}
											menuExpandedItemsArray={MenuExpandedItems(archiveStatus)}
											handleMenuExpandedItemsClick={handleMenuExpandedItemsClick(
												bookmarkStatus,
												setBookmarkStatus,
												archiveStatus,
												setArchiveStatus,
												threadExpanded.threadID
											)}
											closeMenuOnExpandedItemsClick={false}
											toolTipText="More"
											scrollLock={true}
										/>
									</>
								}
								title={threadExpanded.author.authorName}
								titleTypographyProps={{ fontWeight: 750 }}
								subheader={dateToTimeYear(threadExpanded.createdAt, "long")}
							/>
							<Divider />

							<CardContent sx={{ paddingBottom: 0 }}>
								<Typography
									variant="h5"
									color="text.secondary"
									fontWeight={760}
									marginBottom={2}
								>
									{threadExpanded.title}
								</Typography>
								<Typography
									variant="h6"
									color="text.secondary"
									fontFamily="Open Sans"
									fontSize={17}
								>
									{threadExpanded.topicsTagged.map((topic) => {
										return (
											<Button
												key={topic.topicID}
												disableRipple
												handleButtonClick={() =>
													navigate(`../Topics?topicName=${topic}`)
												}
												fontFamily="Open Sans"
												buttonStyle={{ px: 1, py: 0, mx: 0.5 }}
												color="text.secondary"
												variant="outlined"
												backgroundColor="primary.light"
											>
												{topic.name}
											</Button>
										);
									})}
								</Typography>

								{threadExpanded.imageLink ? (
									<CardMedia
										component="img"
										image={threadExpanded.imageLink}
										sx={{
											width: "100%",
											height: "auto",
											objectFit: "contain",
											borderRadius: 1.3,
											my: 3,
											"&:hover": {
												cursor: "pointer",
											},
										}}
										onClick={() => setFullScreenImage(true)}
									/>
								) : (
									<br />
								)}
							</CardContent>
							<CardContent sx={{ py: 0 }}>
								<Typography sx={{ marginBottom: 2 }} textAlign="left">
									{threadExpanded.content}
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
										likeStatus ? (
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
									handleButtonClick={() => {
										setExpandTextField(true);
									}}
								>
									{String(commentCount)}
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
												const currentPathAbsolute = window.location.href;
												window.location.href = `whatsapp://send?text=${currentPathAbsolute}`;
											},
										]}
										listItemsStyles={{ padding: 2.5 }}
									/>
									<Snackbar
										openSnackbar={openSnackbar}
										setOpenSnackbar={setOpenSnackbar}
										message="Link copied to clipboard"
										handleSnackbarClose={() => {
											const currentPathAbsolute = window.location.href;
											navigator.clipboard.writeText(currentPathAbsolute);
											setOpenShareDialog(false);
										}}
										duration={1500}
									/>
								</SimpleDialog>
							</CardActions>

							{/* Comment Box */}
							<CardContent sx={{ display: "flex", justifyContent: "center" }}>
								{!expandTextField ? (
									<TextFieldAutosize
										sx={{
											width: "100%",
											marginBottom: 1.5,
											fontSize: 18,
											fontFamily: "Nunito",
											fontWeight: "Medium",
										}}
										minRows={1}
										placeholder="Add a comment"
										onClick={() => {
											setExpandTextField(true);
										}}
									/>
								) : (
									<Box sx={{ width: "100%" }}>
										<FormControl fullWidth>
											<Controller
												name="comment"
												control={control}
												render={() => (
													<TextFieldAutosize
														sx={{
															width: "100%",
															fontSize: 18,
															fontFamily: "Nunito",
															fontWeight: "Medium",
														}}
														placeholder="Add a comment"
														minRows={3}
														required
														{...register("comment", { required: true })}
														autoFocus
													/>
												)}
											/>
										</FormControl>

										<Box sx={{ display: "flex", justifyContent: "right" }}>
											<Button
												buttonIcon={<CancelRoundedIcon sx={{ padding: 0 }} />}
												color="primary.dark"
												handleButtonClick={() => {
													setExpandTextField(false);
													reset();
												}}
											/>
											<Button
												buttonIcon={<SendRoundedIcon />}
												color="primary.dark"
												handleButtonClick={handleCommentSubmit}
											/>
										</Box>
									</Box>
								)}
							</CardContent>
							<Divider />
							<CardContent>
								<Box
									sx={{ px: 1, py: 0 }}
									display="flex"
									justifyContent="space-between"
									alignItems="center"
								>
									<Typography fontFamily="Open Sans" fontSize={18}>
										{commentCount} Comments
									</Typography>
									<Menu
										menuExpandedItemsArray={["Newest", "Popular", "Oldest"]}
										menuIcon={<SortRoundedIcon />}
										variant="text"
										handleMenuExpandedItemsClick={Array(3).fill(
											(event: React.MouseEvent<HTMLElement>) =>
												event.currentTarget.dataset.value &&
												setCommentSortingOrder(
													event.currentTarget.dataset.value
												)
										)}
										menuStyle={{ fontFamily: "Open Sans" }}
									>
										{commentSortingOrder}
									</Menu>
								</Box>
								<List
									variant="text"
									disablePadding
									listItemsArray={threadExpanded.comments.map((comment) => {
										return (
											<Comment
												id={comment.commentID}
												key={comment.commentID}
												author={comment.authorName}
												likeCount={0}
												content={comment.content}
												date={dateToTimeYear(comment.createdAt, "short")}
												avatarIconLink={comment.avatarIconLink}
												handleAvatarIconClick={() =>
													navigate(`../Profile/${comment.authorID}`)
												}
											/>
										);
									})}
								/>
							</CardContent>
						</Card>
					)}
				</Container>
			</Box>
			<FullScreenImage
				path={threadExpanded.imageLink}
				setFullScreenImage={setFullScreenImage}
				fullScreenImage={fullScreenImage}
			/>
		</>
	);
};

export default Thread;
