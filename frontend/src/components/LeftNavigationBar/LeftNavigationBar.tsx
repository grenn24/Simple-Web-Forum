import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SubscriptionsRoundedIcon from "@mui/icons-material/SubscriptionsRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import sections from "../Sections";
import { useState, useEffect } from "react";

interface Prop {
	drawerWidth: number;
	leftNavBarStatus: boolean;
	setLeftNavBarStatus: (x: boolean) => void;
	closeLeftNavBar: () => void;
	handleLeftBarTransitionEnd: () => void;
	setCurrentSection: (currentSection: string) => void;
}

const LeftNavigationBar = ({
	drawerWidth,
	leftNavBarStatus,
	closeLeftNavBar,
	handleLeftBarTransitionEnd,
	setCurrentSection
}: Prop) => {
	const [height, setHeight] = useState(80);

	useEffect(() => {
		const x = document.getElementById("AppBar")?.offsetHeight;
		if (x) {
			setHeight(x);
		}
	}, []);

	const drawer = (
		<Box sx={{ marginTop: `${height}px` }}>
			<List sx={{ marginTop: 2 }}>
				{sections[0].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon sx={{ marginLeft: "13%", color: "common-black" }}>
								{index === 0 ? (
									<HomeRoundedIcon
										sx={{
											fontSize: "1.7em",
											marginLeft: 0,
											color: "#2bffbc",
										}}
									/>
								) : index === 1 ? (
									<SubscriptionsRoundedIcon
										sx={{
											color: "#ff722b",
										}}
									/>
								) : (
									<StarsRoundedIcon
										sx={{
											color: "#ffce2e",
										}}
									/>
								)}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<br />
			<br />
			<br />
			<br />
			<List>
				{sections[1].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon sx={{ marginLeft: "13%", color: "common.black" }}>
								{index === 0 ? (
									<ForumRoundedIcon />
								) : index === 1 ? (
									<CategoryRoundedIcon />
								) : index === 2 ? (
									<BookmarkRoundedIcon />
								) : (
									<FavoriteRoundedIcon />
								)}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	const container = undefined;

	return (
		<Box
			component="nav"
			sx={{
				width: { md: drawerWidth },
				flexShrink: { md: 0 },
			}}
		>
			<Drawer
				container={container}
				variant="temporary"
				open={leftNavBarStatus}
				onTransitionEnd={handleLeftBarTransitionEnd}
				onClose={closeLeftNavBar}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: "none", md: "block" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

export default LeftNavigationBar;

/*
		<Drawer
			sx={{
				position: "absolute",
				width: drawerWidth,
				flexShrink: 1,
				marginTop:"80px",
			}}
			variant="permanent"
			anchor="left"
		>
			
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				<List>
					{settings[0].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon sx={{ marginLeft: "13%", color: "common-black" }}>
									{index === 0 ? (
										<HomeRoundedIcon
											sx={{
												fontSize: "1.7em",
												marginLeft: 0,
												color: "#2bffbc",
											}}
										/>
									) : index === 1 ? (
										<SubscriptionsRoundedIcon
											sx={{
												color: "#ff722b",
											}}
										/>
									) : (
										<StarsRoundedIcon
											sx={{
												color: "#ffce2e",
											}}
										/>
									)}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<br />
				<br />
				<br />
				<br />
				<List>
					{sections[1].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton sx={{ color: "common.black" }}>
								<ListItemIcon sx={{ marginLeft: "13%", color: "common.black" }}>
									{index === 0 ? (
										<ForumRoundedIcon />
									) : index === 1 ? (
										<CategoryRoundedIcon />
									) : index === 2 ? (
										<BookmarkRoundedIcon />
									) : (
										<FavoriteRoundedIcon />
									)}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>*/
