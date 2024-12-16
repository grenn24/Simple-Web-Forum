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
import MenuExpandedIcons from "./MenuExpandedIcons";
import MenuExpandedItems from "./MenuExpandedItems";
import SimpleDialog from "../SimpleDialog";
import List from "../List";
import { useNavigate } from "react-router-dom";
import playerGenerator from "../../utilities/playerGenerator";

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
	threadId: number;
	threadTitle: string;
	threadAuthor: string;
	threadDate: string;
	threadLikeCount: number;
	threadCommentCount: number;
	threadContentSummarised: string;
	threadImageLink?: string;
	avatarIconLink: string;
	handleAvatarIconClick?: (event: React.MouseEvent<HTMLElement>) => void;
	initialLikeStatus: boolean;
}

const ThreadCard = ({
	threadId,
	threadTitle,
	threadAuthor,
	threadDate,
	threadLikeCount,
	threadCommentCount,
	threadContentSummarised,
	threadImageLink,
	avatarIconLink,
	handleAvatarIconClick,
	initialLikeStatus,
}: Prop) => {
	const [expandCardContent, setExpandCardContent] = useState(false);
	const [likeStatus, setLikeStatus] = useState(initialLikeStatus);
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);

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
									menuExpandedIconsArray={MenuExpandedIcons}
									menuExpandedItemsArray={MenuExpandedItems}
									toolTipText="More"
									scrollLock={true}
									handleMenuIconClick={(event) => event.stopPropagation()}
								/>
							</>
						}
						title={threadAuthor}
						titleTypographyProps={{ fontWeight: 750 }}
						subheader={threadDate}
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
							component="button"
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
								!likeStatus && player();
								event.stopPropagation();
							}}
						>
							{threadLikeCount}
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
								navigate(`../Thread/${threadId}`, {
									state: { focusTextField: true },
								}); //Pass in state during navigation
								event.stopPropagation();
							}}
						>
							{threadCommentCount}
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
										window.location.href = `whatsapp://send?text=${parentPathAbsolute}/Thread/${threadId}`;
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
										`${parentPathAbsolute}/Thread/${threadId}`
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
