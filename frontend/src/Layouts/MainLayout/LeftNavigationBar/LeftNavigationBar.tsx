import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useState, useEffect } from "react";
import DrawerItems from "./DrawerItems";
import DrawerIcons from "./DrawerIcons";
import { useNavigate } from "react-router-dom";
import Routes from "./Routes";
import { Typography } from "@mui/material";

interface Prop {
	leftNavBarExpandedStatus: boolean;
	setLeftNavBarStatus: (x: boolean) => void;
	closeLeftNavBar: () => void;
	handleLeftBarCloseTransitionEnd: () => void;
}

const LeftNavigationBar = ({
	leftNavBarExpandedStatus,
	closeLeftNavBar,
	handleLeftBarCloseTransitionEnd,
}: Prop) => {
	const [offsetHeight, setOffsetHeight] = useState(80);

	useEffect(() => {
		const x = document.getElementById("AppBar")?.offsetHeight;
		if (x) {
			setOffsetHeight(x);
		}
	}, []);

	const navigate = useNavigate();

	const drawerContent = (
		<Box
			sx={{
				marginTop: `${offsetHeight}px`,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<List
				sx={{
					marginTop: 2,
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				{DrawerItems.map((text, index) => (
					<Box key={text} width="100%" >
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => {
									leftNavBarExpandedStatus ? closeLeftNavBar() : null;
									navigate(Routes[index]);
								}}
							>
								<ListItemIcon
									sx={{
										display: "flex",
										justifyContent: "center",
										marginRight: 1,
										marginLeft: 1,
									}}
								>
									{DrawerIcons[index]}
								</ListItemIcon>
								<Typography fontFamily="Open Sans" fontWeight={440}>{text}</Typography>
							</ListItemButton>
						</ListItem>
						{index === 2 ? (
							<>
								<br />
								<br />
								<br />
								<br />
							</>
						) : null}
					</Box>
				))}
			</List>
		</Box>
	);

	const container = undefined;

	return (
		<Box
			id="leftNavigationBarContainer"
			component="nav"
			sx={{
				minWidth: { xs: "0px", sm: "0px", md: "250px", lg: "300px" },
			}}
		>
			<Drawer
				id="leftNavigationBarTemporaryDrawer"
				container={container}
				variant="temporary"
				open={leftNavBarExpandedStatus}
				onTransitionEnd={handleLeftBarCloseTransitionEnd}
				onClose={closeLeftNavBar}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: {
						xs: "block",
						sm: "block",
						md: "none",
						lg: "none",
						xl: "none",
					},
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: {
							xs: "250px",
							sm: "300px",
							md: "0px",
						},
						zIndex: 1200,
						backgroundColor: "background.default",
					},
					backdropFilter: "blur(4px)",
				}}
			>
				{drawerContent}
			</Drawer>
			<Drawer
				id="leftNavigationBarPermanentDrawer"
				variant="permanent"
				sx={{
					display: {
						xs: "none",
						sm: "none",
						md: "block",
						lg: "block",
						xl: "block",
					},
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: {
							xs: "0px",
							sm: "0px",
							md: "250px",
							lg: "300px",
						},
						zIndex: 1200,
					},
				}}
				open
			>
				{drawerContent}
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
