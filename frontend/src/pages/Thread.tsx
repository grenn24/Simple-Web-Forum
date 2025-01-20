import {
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Avatar,
	Typography,
	Box,
	Divider,
	FormControl,
	TextField,
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
	CheckRounded as CheckRoundedIcon,
	CloseRounded as CloseRoundedIcon,
} from "@mui/icons-material";
import Menu from "../components/Menu/index.ts";
import Button from "../components/Button/index.ts";
import SimpleDialog from "../components/SimpleDialog/index.tsx";
import Snackbar from "../components/Snackbar/index.ts";
import List from "../components/List/index.tsx";
import { useState, useEffect } from "react";
import MenuExpandedItems from "../features/Thread/TopRightMenu/MenuExpandedItems.tsx";
import playerGenerator from "../utilities/playerGenerator.ts";
import likeSound from "../assets/audio/like-sound.mp3";
import {
	useNavigate,
	useLocation,
	useParams,
	useSearchParams,
} from "react-router-dom";
import TextFieldAutosize from "../components/TextFieldAutosize/TextFieldAutosize.tsx";
import Comment from "../features/Thread/Comment.tsx";
import { Delete, get, postJSON, putJSON } from "../utilities/api.ts";
import { useForm, Controller } from "react-hook-form";
import { ThreadDTO } from "../dtos/ThreadDTO.tsx";
import { dateToTimeYear } from "../utilities/dateToString.ts";
import MenuExpandedIcons from "../features/Thread/TopRightMenu/MenuExpandedIcons.tsx";
import handleMenuExpandedItemsClick from "../features/Thread/TopRightMenu/handleMenuExpandedItemsClick.tsx";
import ThreadCardLoading from "../components/ThreadCard/ThreadCardLoading.tsx";
import { TopicDTO } from "../dtos/TopicDTO.tsx";
import { CommentDTO } from "../dtos/CommentDTO.tsx";
import commentSortOrder from "../features/Thread/commentSortOrder.tsx";
import { parseThread } from "../utilities/parseApiResponse.ts";
import MediaViewer from "../components/MediaViewer.tsx";
import SelectChip from "../components/SelectChip/SelectChip.tsx";
import { EditorState } from "draft-js";
import { convertToRaw } from "draft-js";
import RichTextField from "../components/RichTextField/RichTextField.tsx";

const Thread = () => {
	const player = playerGenerator(
		likeSound,
		0.9,
		{ default: [90, 3000] },
		"default"
	);

	const navigate = useNavigate();
	const location = useLocation();
	const { threadID } = useParams();

	const [searchParams, _] = useSearchParams();
	const commentSort = searchParams.get("comment-sort");
	let currentSortIndex = 0;
	commentSortOrder.forEach((value, index) => {
		if (value === commentSort) {
			currentSortIndex = index;
		}
	});
	const [threadContent, setThreadContent] = useState(new EditorState());
	const [likeCount, setLikeCount] = useState(0);
	const [likeStatus, setLikeStatus] = useState(false);
	const [archiveStatus, setArchiveStatus] = useState(false);
	const [bookmarkStatus, setBookmarkStatus] = useState(false);
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [openDeleteThreadDialog, setOpenDeleteThreadDialog] = useState(false);
	const [thread, setThread] = useState<ThreadDTO>({} as ThreadDTO);
	const [topicsSelected, setTopicsSelected] = useState<string[]>([]);

	// State variables used to track edit or loading status
	const [isLoading, setIsLoading] = useState(true);
	const [isUploadingThread, setIsUploadingThread] = useState(false);
	const [isUploadingComment, setIsUploadingComment] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isCommenting, setIsCommenting] = useState(false);

	// Fetch thread data and set the relevant state variables
	useEffect(
		() =>
			get<ThreadDTO>(
				`/threads/${threadID}/expanded?comment-sort=` + currentSortIndex,
				(res) => {
					const responseBody = res.data.data;
					const thread = parseThread(responseBody);
					setThread(thread);
					setLikeCount(thread.likeCount);
					setLikeStatus(thread.likeStatus);
					setTopicsSelected(thread.topicsTagged.map((topic) => topic.name));
					setArchiveStatus(thread.archiveStatus);
					setBookmarkStatus(thread.bookmarkStatus);
					setIsLoading(false);
					// Check if isEditing or isCommenting was passed in during navigation
					setIsCommenting(location.state?.isCommenting);
					setIsEditing(location.state?.isEditing);
					setThreadContent(thread.content);
				},
				(err) => console.log(err)
			),
		[isUploadingThread, isUploadingComment, commentSort]
	);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm();

	const handleCommentSubmit = handleSubmit((data) => {
		setIsUploadingComment(true);
		postJSON(
			`/threads/${thread.threadID}/comments/user`,
			{
				content: data.comment,
			},
			() => {
				setIsCommenting(false);
				reset();
				setIsUploadingComment(false);
			},
			(err) => console.log(err)
		);
	});

	const handleEditThread = handleSubmit((data) => {
		setIsUploadingThread(true);
		putJSON(
			`/threads/${thread.threadID}`,
			{
				title: data.title,
				content: JSON.stringify(
					convertToRaw(threadContent.getCurrentContent())
				),
				topics_tagged: topicsSelected,
			},
			() => {
				setIsUploadingThread(false);
				setIsEditing(false);
				reset();
			},
			(err) => {
				console.log(err);
				setIsUploadingThread(false);
			}
		);
	});

	return (
		<>
			<Box
				sx={{ p: { xs: 1.5, sm: 3 }, bgcolor: "background.default" }}
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				flexGrow={1}
				boxSizing="border-box"
				width="100%"
				maxWidth="100%"
				position="absolute"
			>
				<Box width="100%">
					<Button
						buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
						color="primary.dark"
						buttonStyle={{ mx: 0, p: 0.5 }}
						handleButtonClick={() => navigate(-1)}
					/>
				</Box>
				<Box
					sx={{
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
						<ThreadCardLoading bodyHeight={350} />
					) : (
						<Card elevation={2} sx={{ padding: { xs: 0.5, sm: 1, md: 1.5 } }}>
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
										showMenuExpandedOnClick={false}
										handleMenuIconClick={() =>
											navigate(`../Profile/${thread.author.authorID}`)
										}
									/>
								}
								action={
									<>
										<Menu
											menuIcon={<MoreVertIcon sx={{ color: "primary.dark" }} />}
											menuExpandedIconsArray={MenuExpandedIcons(
												thread,
												bookmarkStatus,
												archiveStatus
											)}
											menuExpandedItemsArray={MenuExpandedItems(
												thread,
												archiveStatus
											)}
											handleMenuExpandedItemsClick={handleMenuExpandedItemsClick(
												bookmarkStatus,
												setBookmarkStatus,
												archiveStatus,
												setArchiveStatus,
												isEditing,
												setIsEditing,
												thread,
												setOpenDeleteThreadDialog
											)}
											closeMenuOnExpandedItemsClick
											toolTipText="More"
											scrollLock={true}
										/>
									</>
								}
								title={thread.author.username}
								titleTypographyProps={{ fontWeight: 750 }}
								subheader={dateToTimeYear(thread.createdAt, "long")}
							/>

							<Divider sx={{ mx: 2 }} />

							{isEditing ? (
								<>
									{/*Edit Mode*/}
									<CardContent sx={{ paddingBottom: 0 }}>
										<Controller
											name="title"
											control={control}
											defaultValue={thread.title}
											render={() => (
												<TextField
													label="Thread Title"
													required
													fullWidth
													{...register("title", {
														required: "Thread title is required",
													})}
													helperText={errors.title?.message as string}
													error={!!errors.title}
												/>
											)}
										/>
										<Typography
											variant="h6"
											color="text.secondary"
											fontFamily="Open Sans"
											fontSize={17}
											marginTop={2}
											marginBottom={3}
										>
											<SelectChip
												predefinedTopics={[
													"Exams",
													"CCA",
													"Homework",
													"Orientation Camp",
													"Exchange",
												]}
												topicsSelected={topicsSelected}
												setTopicsSelected={setTopicsSelected}
											/>
										</Typography>
										<Box my={2}>
											<RichTextField
												editorState={threadContent}
												setEditorState={(editorState) =>
													setThreadContent(editorState)
												}
											/>
										</Box>
									</CardContent>

									<CardActions
										sx={{
											display: "flex",
											justifyContent: "flex-start",
											marginTop: 1,
											marginBottom: 1.5,
										}}
									>
										<Button
											component="button"
											role={undefined}
											variant="outlined"
											buttonIcon={<CloseRoundedIcon sx={{ fontSize: 25 }} />}
											color="primary.dark"
											borderRadius="10px"
											borderColor="primary.light"
											buttonStyle={{
												marginLeft: 1,
												marginRight: 1,
											}}
											handleButtonClick={() => {
												setIsEditing(false);
											}}
										>
											Discard
										</Button>
										<Button
											component="button"
											role={undefined}
											variant="outlined"
											buttonIcon={<CheckRoundedIcon sx={{ fontSize: 25 }} />}
											color="primary.dark"
											borderRadius="10px"
											borderColor="primary.light"
											buttonStyle={{
												marginRight: 1,
											}}
											handleButtonClick={handleEditThread}
											loadingStatus={isUploadingThread}
										>
											Confirm
										</Button>
									</CardActions>
								</>
							) : (
								<>
									{/*Display Mode*/}
									<CardContent sx={{ paddingBottom: 0 }}>
										<Typography
											variant="h5"
											color="text.secondary"
											fontWeight={760}
										>
											{thread.title}
										</Typography>
										<Typography
											variant="h6"
											color="text.secondary"
											fontFamily="Open Sans"
											fontSize={17}
											marginBottom={2}
										>
											{thread.topicsTagged.map((topic: TopicDTO) => (
												<Button
													key={topic.topicID}
													disableRipple
													handleButtonClick={() =>
														navigate(`../Topics/${topic.topicID}`)
													}
													fontFamily="Open Sans"
													buttonStyle={{
														p:0,
														marginLeft: 0,
														marginRight: 1.5,
													}}
													fontSize={14}
													color="text.secondary"
													variant="outlined"
													backgroundColor="primary.light"
												>
													{topic.name}
												</Button>
											))}
										</Typography>
										<Box my={2}>
											<RichTextField
												editorState={thread.content}
												showBorders={false}
												editable={false}
											/>
										</Box>
										<Box
											height={470}
											my={2}
											display={
												thread.imageLink.length === 0 &&
												thread.videoLink.length === 0
													? "none"
													: "block"
											}
										>
											<MediaViewer
												borderRadius={1.0}
												backgroundColor="black"
												imageLinks={thread.imageLink}
												videoLinks={thread.videoLink}
											/>
										</Box>
									</CardContent>
									<CardActions
										disableSpacing
										sx={{
											display: "flex",
											justifyContent: "flex-start",
											py:0
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
												setIsCommenting(true);
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
											dialogTitleHeight={55}
											width={400}
										>
											<List
												listItemsArray={[
													"Copy Link",
													"Share to WhatsApp",
													"Cancel",
												]}
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
													() => {
														setOpenShareDialog(false);
														const currentPathAbsolute = window.location.href;
														window.location.href = `whatsapp://send?text=${currentPathAbsolute}`;
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
												const currentPathAbsolute = window.location.href;
												navigator.clipboard.writeText(currentPathAbsolute);
												setOpenShareDialog(false);
											}}
											duration={1500}
										/>
									</CardActions>

									{/* Comment Box */}
									<CardContent
										sx={{
											display: "flex",
											justifyContent: "center",
											marginBottom: 1,
										}}
									>
										{!isCommenting ? (
											<TextFieldAutosize
												sx={{
													width: "100%",

													fontSize: 18,
													fontFamily: "Nunito",
													fontWeight: "Medium",
												}}
												minRows={1}
												placeholder="Add a comment"
												onClick={() => {
													setIsCommenting(true);
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
														buttonIcon={
															<CancelRoundedIcon sx={{ padding: 0 }} />
														}
														color="primary.dark"
														handleButtonClick={() => {
															setIsCommenting(false);
															reset();
														}}
													/>
													<Button
														buttonIcon={<SendRoundedIcon />}
														color="primary.dark"
														handleButtonClick={handleCommentSubmit}
														loadingStatus={isUploadingComment}
													/>
												</Box>
											</Box>
										)}
									</CardContent>
								</>
							)}

							<Divider sx={{ mx: 2 }} />
							<CardContent>
								<Box
									sx={{ px: 1, py: 0 }}
									display="flex"
									justifyContent="space-between"
									alignItems="center"
								>
									<Typography fontFamily="Open Sans" fontSize={18}>
										{thread.commentCount} Comments
									</Typography>
									<Menu
										menuExpandedItemsArray={commentSortOrder}
										menuExpandedDataValuesArray={commentSortOrder.map(
											(value) => value
										)}
										menuIcon={<SortRoundedIcon />}
										variant="text"
										handleMenuExpandedItemsClick={Array(
											commentSortOrder.length
										).fill((event: React.MouseEvent<HTMLElement>) =>
											navigate(
												`?comment-sort=${event.currentTarget.dataset?.value}`
											)
										)}
										menuStyle={{ fontFamily: "Open Sans" }}
									>
										{commentSortOrder[currentSortIndex]}
									</Menu>
								</Box>
								<List
									variant="text"
									listItemsArray={thread.comments.map((comment: CommentDTO) => {
										return <Comment comment={comment} />;
									})}
									listItemTextStyle={{ width: "100%" }}
								/>
							</CardContent>
						</Card>
					)}
				</Box>
			</Box>
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
							navigate(-1);
							Delete(
								`threads/${thread.threadID}`,
								{},
								() => {},
								(err) => console.log(err)
							);
						},
						(event) => {
							event.stopPropagation();
							setOpenDeleteThreadDialog(false);
						},
					]}
				/>
			</SimpleDialog>
		</>
	);
};

export default Thread;
