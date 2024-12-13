import {
	Box,
	Button,
	Divider,
	Tooltip,
	Typography,
	Container,
	MenuItem,
	Menu,
	MenuProps,
	styled,
	alpha,
} from "@mui/material";
import { useState, useEffect } from "react";
import ThreadCard from "../components/ThreadCard";
import {
	AccessTimeRounded as AccessTimeRoundedIcon,
	KeyboardArrowDown as KeyboardArrowDownIcon,
	StarPurple500Rounded as StarPurple500RoundedIcon,
	LocalFireDepartmentRounded as LocalFireDepartmentRoundedIcon,
} from "@mui/icons-material";
import threads from "../features/Following/threadsDataSample";
import { useNavigate } from "react-router-dom";

const MenuExpanded = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right",
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color: "rgb(55, 65, 81)",
		boxShadow:
			"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
		"& .MuiMenu-list": {
			padding: "4px 0",
		},
		"& .MuiMenuItem-root": {
			"& .MuiSvgIcon-root": {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			"&:active": {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity
				),
			},
		},
		...theme.applyStyles("dark", {
			color: theme.palette.grey[300],
		}),
	},
}));

const Following = () => {
	const [showMenuExpanded, setShowMenuExpanded] = useState<null | HTMLElement>(
		null
	);
	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenuExpanded(event.currentTarget);
	};
	const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenuExpanded(null);
		event.currentTarget.dataset.value &&
			setSortingOrder(event.currentTarget.dataset.value);
	};

	const [boxWidth, setBoxWidth] = useState(0);

	useEffect(() => {
		const x = document.getElementById("followingPageContainer")?.offsetWidth;
		if (x) {
			setBoxWidth(x);
		}
	}, []);

	const [leftNavBarWidth, setLeftNavBarWidth] = useState(300);

	useEffect(() => {
		const x = document.getElementById(
			"leftNavigationBarTemporaryDrawer"
		)?.offsetWidth;
		if (x) {
			setLeftNavBarWidth(x);
		}
	}, []);

	const [offsetHeight, setOffsetHeight] = useState(80);

	useEffect(() => {
		const x = document.getElementById("AppBar")?.offsetHeight;
		if (x) {
			setOffsetHeight(x);
		}
	}, []);

	const [sortingOrder, setSortingOrder] = useState("Best");

	const navigate = useNavigate();

	return (
		<>
			<Box
				sx={{
					position: "absolute",
					top: `30px`,
					left: `${boxWidth * 0.45}px`,
					width: "100vw",
				}}
			>
				<Tooltip title="Sort By">
					<Button
						id="demo-customized-button"
						variant="outlined"
						disableElevation
						onClick={handleOpenMenu}
						endIcon={<KeyboardArrowDownIcon />}
						sx={{ border: 1, borderColor: "primary.light" }}
					>
						{sortingOrder}
					</Button>
				</Tooltip>
				<MenuExpanded
					id="demo-customized-menu"
					anchorEl={showMenuExpanded}
					open={showMenuExpanded !== null}
					onClose={handleCloseMenu}
					disableScrollLock={true}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
				>
					<MenuItem onClick={handleCloseMenu} data-value="Best">
						<StarPurple500RoundedIcon />
						Best
					</MenuItem>
					<MenuItem onClick={handleCloseMenu} data-value="Latest">
						<AccessTimeRoundedIcon />
						Latest
					</MenuItem>
					<MenuItem onClick={handleCloseMenu} data-value="Popular">
						<LocalFireDepartmentRoundedIcon />
						Popular
					</MenuItem>
				</MenuExpanded>
			</Box>
			<Box
				id="followingPageContainer"
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: 3,
					minHeight: "100%",
				}}
			>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignContent: "center",
					}}
				>
					<Typography
						textAlign={"left"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={30}
						color="primary.dark"
					>
						Following
					</Typography>
				</Box>
				<Divider />
				<Container
					sx={{
						width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
						my: 5,
					}}
					disableGutters
				>
					{threads.map((thread) => (
						<Box key={thread.id}>
							<ThreadCard
								threadId={thread.id}
								threadTitle={thread.title}
								threadAuthor={thread.author}
								threadDate={thread.date}
								threadLikeCount={thread.likeCount}
								threadCommentCount={thread.commentCount}
								threadContentSummarised={thread.contentSummarised}
								threadImageLink={thread.imageLink}
								avatarIconLink={thread.avatarIconLink}
								handleAvatarIconClick={() =>
									navigate(`../Profile/${thread.authorId}`)
								}
							/>
							<Divider />
						</Box>
					))}
				</Container>
			</Box>
		</>
	);
};

export default Following;
