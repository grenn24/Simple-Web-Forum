import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import useSound from "use-sound";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import likeSound from "../../../assets/audio/Like Sound.mp3";
import Menu from "../ContentBody/Menu";
import MenuExpandedIcons from "./MenuExpandedIcons";
import MenuExpandedItems from "./MenuExpandedItems";

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
	threadTitle: string;
	threadAuthor: string;
	threadDate: string;
	threadLikeCount: string;
	threadCommentCount: string;
	threadContentSummarised: string;
}

const ThreadCard = ({
	threadTitle,
	threadAuthor,
	threadDate,
	threadLikeCount,
	threadCommentCount,
	threadContentSummarised,
}: Prop) => {
	const [expanded, setExpanded] = React.useState(false);
	const [likeStatus, setLikeStatus] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const [playSound] = useSound(likeSound, {
		volume: 0.9,
		sprite: {
			default: [90, 3000]
		},
	});

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Card
				sx={{
					my: 3
				}}
			>
				<CardHeader
					avatar={<Avatar sx={{ bgcolor: red[500] }} />}
					action={
						<>
							<Menu
								menuIcon={<MoreVertIcon />}
								menuExpandedIconsArray={MenuExpandedIcons}
								menuExpandedItemsArray={MenuExpandedItems}
								toolTipText="More"
								scrollLock={true}
							/>
						</>
					}
					title={threadAuthor}
					subheader={threadDate}
				/>
				<CardContent>
					<Typography variant="h5" color="text.primary" fontFamily="Open Sans">
						{threadTitle}
					</Typography>
				</CardContent>
				<CardMedia
					component="img"
					height="194"
					image="https://media.self.com/photos/57d8952946d0cb351c8c50c9/master/w_1600%2Cc_limit/DELICIOUS-1-POT-Lentil-and-Black-Bean-Chili-Smoky-hearty-PROTEIN-and-fiber-packed-vegan-glutenfree-lentils-chili-healthy-recipe2.jpg"
					alt="Paella dish"
					sx={{ height: "auto", objectFit: "contain" }}
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
						component="label"
						role={undefined}
						variant="outlined"
						tabIndex={-1}
						startIcon={
							likeStatus ? (
								<FavoriteRoundedIcon color="warning" />
							) : (
								<FavoriteBorderRoundedIcon />
							)
						}
						color="primary"
						sx={{
							borderRadius: "10px",
							border: 1,
							marginLeft: 1,
							marginRight: 1,
							borderColor: "primary.light",
						}}
						onClick={() => {
							setLikeStatus(!likeStatus);
							{
								!likeStatus ? playSound({id: "default"}) : null;
							}
						}}
					>
						{threadLikeCount}
					</Button>
					<Button
						component="label"
						role={undefined}
						variant="outlined"
						tabIndex={-1}
						startIcon={<CommentRoundedIcon />}
						color="primary"
						sx={{
							borderRadius: "10px",
							border: 1,
							marginRight: 1,
							borderColor: "primary.light",
						}}
					>
						{threadCommentCount}
					</Button>
					<Button
						component="label"
						role={undefined}
						variant="outlined"
						tabIndex={-1}
						startIcon={<ShareRoundedIcon />}
						color="primary"
						sx={{
							borderRadius: "10px",
							border: 1,
							marginRight: 1,
							borderColor: "primary.light",
						}}
					>
						&nbsp;
					</Button>
					<ExpandMore
						expand={expanded}
						onClick={handleExpandClick}
						aria-expanded={expanded}
					>
						<ExpandMoreIcon />
					</ExpandMore>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography sx={{ marginBottom: 2 }}>
							{threadContentSummarised}
						</Typography>
					</CardContent>
				</Collapse>
			</Card>
		</>
	);
};

export default ThreadCard;
