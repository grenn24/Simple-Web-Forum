import { useEffect, useState } from "react";
import {
	Outlet,
	useNavigate,
	useParams,
} from "react-router-dom";
import {
	Box,
	Divider,
	TextField,
	Typography,
} from "@mui/material";
import {
	AddRounded as AddRoundedIcon,
	HowToRegRounded as HowToRegRoundedIcon,
	PersonAddAltRounded as PersonAddAltRoundedIcon,
	MoreHorizRounded as MoreHorizRoundedIcon,
	EditRounded as EditRoundedIcon,
	DeleteRounded as DeleteRoundedIcon,
	WatchLaterRounded as WatchLaterRoundedIcon,
	GroupAddRounded as GroupAddRoundedIcon
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import SimpleDialog from "../../components/SimpleDialog";
import List from "../../components/List";
import { DiscussionDTO } from "../../dtos/DiscussionDTO";
import { useAppSelector } from "../../utilities/redux";
import { Delete, get, postJSON, putJSON } from "../../utilities/api";
import { parseDiscussion } from "../../utilities/parseApiResponse";
import Button from "../../components/Button";
import ThreadCardLoading from "../../components/ThreadCard/ThreadCardLoading";
import Menu from "../../components/Menu";
import Snackbar from "../../components/Snackbar";

const DiscussionLayout = () => {
	const [pageIsLoading, setPageIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isUploadingDiscussion, setIsUploadingDiscussion] = useState(false);
	const [openLeaveDiscussionDialog, setOpenLeaveDiscussionDialog] =
		useState(false);
	const [openDeleteDiscussionDialog, setOpenDeleteDiscussionDialog] =
		useState(false);
	const [
		openAdminCannotLeaveDiscussionSnackbar,
		setOpenAdminCannotLeaveDiscussionSnackbar,
	] = useState(false);
	const { discussionID } = useParams();
	const [discussion, setDiscussion] = useState<DiscussionDTO>(
		{} as DiscussionDTO
	);
	const [joinRequested, setJoinRequested] = useState(false);
	const { userAuthorID } = useAppSelector((state) => ({
		userAuthorID: state.userInfo.authorID,
	}));
	const {
		register,
		formState: { errors },
		handleSubmit,
		watch
	} = useForm({ mode: "onChange" });

	const navigate = useNavigate();

	const handleLeaveDiscussion = () => {
		navigate("..");
		Delete(
			`/discussions/${discussionID}/members/user`,
			{},
			() => {},
			(err) => console.log(err)
		);
	};

	const handleEditDiscussion = handleSubmit((data) => {
		setIsUploadingDiscussion(true);
		putJSON(
			`/discussions/${discussionID}`,
			{
				name: data.name,
				description: data.description,
			},
			() => {
				setIsUploadingDiscussion(false);
				setIsEditing(false);
			},
			(err) => console.log(err)
		);
	});
	const handleRequestJoin = () => {
		setJoinRequested(true);
		postJSON(
			`/discussions/${discussionID}/join-requests/user`,
			{},
			() => {},
			(err) => console.log(err)
		);
	};
	const handleRemoveRequestJoin = () => {
		setJoinRequested(false);
		Delete(
			`/discussions/${discussionID}/join-requests/user`,
			{},
			() => {},
			(err) => console.log(err)
		);
	};

	useEffect(() => {
		setPageIsLoading(true);
		get(
			`/discussions/${discussionID}`,
			(res) => {
				const responseBody = res.data.data;
				const discussion = parseDiscussion(responseBody);
				setDiscussion(discussion);
				setJoinRequested(discussion.isRequested);
				setPageIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, []);

	return (
		<Box p={{ xs: 1.5, md: 3 }} display="flex" justifyContent="center">
			<Box width={{ xs: "100%", sm: "100%", md: "90%", lg: "80%", xl: "70%" }}>
				{pageIsLoading ? (
					<ThreadCardLoading bodyHeight={180} />
				) : (
					<>
						{discussion.BackgroundImageLink && (
							<img
								src={discussion?.BackgroundImageLink}
								width="100%"
								height={140}
								style={{ objectFit: "cover" }}
							/>
						)}
						{isEditing ? (
							<Box
								my={2}
								display="flex"
								justifyContent="space-between"
								alignItems="center"
							>
								<Box
									display="flex"
									flexDirection="column"
									flexGrow={1}
									marginRight={2}
								>
									<TextField
										label="Name"
										size="small"
										required
										defaultValue={discussion.name}
										sx={{ width: "40%" }}
										{...register("name", {
											required: "Discussion name is required",
											validate: {
												validName: (x: string) => /^.{0,20}$/.test(x),
											},
										})}
										error={!!errors.name}
										helperText={errors.name?.message as string}
									/>
									<Typography
										fontSize={15}
										marginLeft={1}
										fontWeight={500}
										color={errors.title?.type === "name" ? "red" : "inherit"}
									>
										{watch("name")?.length ? watch("name")?.length : 0}/20
										Characters
									</Typography>

									<br />
									<TextField
										label="Description"
										size="small"
										defaultValue={discussion.description}
										minRows={3}
										multiline
										{...register("description", {
											validate: {
												validDescription: (x: string) => /^.{0,200}$/.test(x),
											},
										})}
										error={!!errors.description}
									/>
									<Typography
										fontSize={15}
										marginLeft={1}
										fontWeight={500}
										color={
											errors.title?.type === "description" ? "red" : "inherit"
										}
									>
										{watch("description")?.length
											? watch("description")?.length
											: 0}
										/200 Characters
									</Typography>
								</Box>
								<Button
									variant="outlined"
									handleButtonClick={handleEditDiscussion}
									loadingStatus={isUploadingDiscussion}
								>
									Confirm
								</Button>
							</Box>
						) : (
							<Box>
								<Box
									display={{ xs: "block", lg: "flex" }}
									justifyContent="space-between"
									alignItems="center"
									my={1}
								>
									<Typography
										variant="h4"
										color="primary.dark"
										fontWeight={760}
										fontSize={32}
									>
										{discussion.name}
									</Typography>
									<Box display="flex" alignItems="center">
										<Button
											buttonStyle={{
												display: discussion.isJoined ? "display" : "none",
											}}
											variant="outlined"
											fontFamily="Open Sans"
											buttonIcon={<AddRoundedIcon />}
											handleButtonClick={() =>
												navigate("/Create-Thread", {
													state: { discussionID: discussionID },
												})
											}
											fontSize={14}
											toolTipText="Create Discussion Thread"
										>
											Create Thread
										</Button>
										{discussion.isJoined ? (
											<Button
												variant="outlined"
												fontFamily="Open Sans"
												buttonStyle={{ marginLeft: 2 }}
												buttonIcon={<HowToRegRoundedIcon />}
												handleButtonClick={() => {
													userAuthorID === discussion.creator.authorID
														? setOpenAdminCannotLeaveDiscussionSnackbar(true)
														: setOpenLeaveDiscussionDialog(true);
												}}
												toolTipText="Leave"
												fontSize={14}
											>
												{userAuthorID === discussion.creator.authorID
													? "Admin"
													: "Member"}
											</Button>
										) : joinRequested ? (
											<Button
												variant="outlined"
												fontFamily="Open Sans"
												buttonStyle={{ marginLeft: 2 }}
												buttonIcon={<WatchLaterRoundedIcon />}
												toolTipText="Remove Request"
												handleButtonClick={handleRemoveRequestJoin}
												fontSize={14}
											>
												Requested
											</Button>
										) : (
											<Button
												variant="outlined"
												fontFamily="Open Sans"
												buttonStyle={{ marginLeft: 2 }}
												buttonIcon={<PersonAddAltRoundedIcon />}
												toolTipText="Request to Join"
												handleButtonClick={handleRequestJoin}
												fontSize={14}
											>
												Join
											</Button>
										)}
										<Menu
											menuStyle={{
												marginLeft: 2,
												border: 1,
												p: 0.5,
												display:
													userAuthorID === discussion.creator.authorID
														? "inherit"
														: "none",
											}}
											menuExpandedItemsArray={[
												"View Join Requests",
												"Edit Discussion",
												"Delete Discussion",
											]}
											menuExpandedIconsArray={[
												<GroupAddRoundedIcon sx={{ marginRight: 1 }} />,
												<EditRoundedIcon sx={{ marginRight: 1 }} />,
												<DeleteRoundedIcon sx={{ marginRight: 1 }} />,
											]}
											menuExpandedPosition={{
												vertical: "top",
												horizontal: "left",
											}}
											variant="outlined"
											menuIcon={
												<MoreHorizRoundedIcon sx={{ color: "text.primary" }} />
											}
											toolTipText="More"
											handleMenuExpandedItemsClick={[
												() => navigate("Join-Requests"),
												() => setIsEditing(true),
												() => setOpenDeleteDiscussionDialog(true),
											]}
										/>
									</Box>
								</Box>

								<Typography width="100%" my={2} fontSize={16}>
									{discussion.description}
								</Typography>
							</Box>
						)}

						<Box width="100%">
							<Divider />
						</Box>

						{discussion.isJoined ? (
							<Outlet />
						) : (
							<Typography
								textAlign="center"
								fontFamily="Open Sans"
								fontSize={19}
								color="primary.dark"
								marginTop={5}
								width="100%"
							>
								You are currently not a member of this discussion
							</Typography>
						)}
					</>
				)}
			</Box>
			{/*Confirm Leave Discussion Dialog*/}
			<SimpleDialog
				openDialog={openLeaveDiscussionDialog}
				setOpenDialog={setOpenLeaveDiscussionDialog}
				title="Confirm Leave Discussion"
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
							handleLeaveDiscussion();
						},
						(event) => {
							event.stopPropagation();
							setOpenLeaveDiscussionDialog(false);
						},
					]}
				/>
			</SimpleDialog>
			{/*Confirm Delete Discussion Dialog*/}
			<SimpleDialog
				openDialog={openDeleteDiscussionDialog}
				setOpenDialog={setOpenDeleteDiscussionDialog}
				title="Confirm Delete Discussion"
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
							navigate("/discussions");
							Delete(
								`/discussions/${discussion.discussionID}`,
								{},
								() => {},
								(err) => console.log(err)
							);
						},
						(event) => {
							event.stopPropagation();
							setOpenDeleteDiscussionDialog(false);
						},
					]}
				/>
			</SimpleDialog>
			{/*Admin cannot leave discussion snackbar*/}
			<Snackbar
				openSnackbar={openAdminCannotLeaveDiscussionSnackbar}
				setOpenSnackbar={setOpenAdminCannotLeaveDiscussionSnackbar}
				message="You cannot leave a discussion that you are an admin of"
				duration={2000}
			/>
		</Box>
	);
};

export default DiscussionLayout;
