import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import ThreadCard from "../ThreadCard";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarPurple500RoundedIcon from "@mui/icons-material/StarPurple500Rounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";

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

	const [offsetWidth, setOffsetWidth] = useState(0);

	useEffect(() => {
		const x = document.getElementById(
			"leftNavigationBarContainer"
		)?.offsetWidth;
		if (x) {
			setOffsetWidth(x);
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

	return (
		<>
			<Box
				sx={{
					position: "fixed",
					top: `${offsetHeight + 20}px`,
					left: `${offsetWidth + 24}px`,
					width:"100vw"
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
				component="main"
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
						textAlign={"center"}
						fontFamily="Open Sans"
						fontWeight={700}
						fontSize={25}
						color="primary.dark"
					>
						Following
					</Typography>
				</Box>
				<Divider />
				<Container
					sx={{ width: {xs:"100%", sm:"100%", md:"50%", lg:"50%", xl:"50%"}, my: 5 }}
					disableGutters
					
				>
					<ThreadCard
						threadTitle="Hello wetiuhawuithiatuhiuh iweuthwiuthwiehtuiw we wetwetwet  wtt"
						threadAuthor="Gren"
						threadDate="12/12/2022"
						threadLikeCount="12"
						threadCommentCount="12"
						threadContentSummarised="Hello How are you"
					/>
					<Divider />
					<ThreadCard
						threadTitle="Hello wetiuhawuithiatuhiuh iweuthwiuthwiehtuiw we wetwetwet  wtt"
						threadAuthor="Gren"
						threadDate="12/12/2022"
						threadLikeCount="12"
						threadCommentCount="12"
						threadContentSummarised="Hello How are you"
					/>
					<Divider />
					<ThreadCard
						threadTitle="Hello wetiuhawuithiatuhiuh iweuthwiuthwiehtuiw we wetwetwet  wtt"
						threadAuthor="Gren"
						threadDate="12/12/2022"
						threadLikeCount="12"
						threadCommentCount="12"
						threadContentSummarised="Hello How are you"
					/>
					<Divider />
					<ThreadCard
						threadTitle="Hello wetiuhawuithiatuhiuh iweuthwiuthwiehtuiw we wetwetwet  wtt"
						threadAuthor="Gren"
						threadDate="12/12/2022"
						threadLikeCount="12"
						threadCommentCount="12"
						threadContentSummarised="Hello How are you"
					/>
					<Divider />
				</Container>
			</Box>
		</>
	);
};

export default Following;
