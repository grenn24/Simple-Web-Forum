import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import DrawerItems from "./DrawerItems";
import DrawerIcons from "./DrawerIcons";
import { useNavigate } from "react-router-dom";
import Routes from "./Routes";

interface Prop {
	leftNavBarExpandedStatus: boolean;
	setLeftNavBarStatus: (x: boolean) => void;
	closeLeftNavBar: () => void;
	handleLeftBarCloseTransitionEnd: () => void;
	setCurrentSection: (currentSection: string) => void;
}

const LeftNavigationBar = ({
	leftNavBarExpandedStatus,
	closeLeftNavBar,
	handleLeftBarCloseTransitionEnd,
	setCurrentSection,
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
						<ListItem  disablePadding >
							<ListItemButton onClick={() => {setCurrentSection(text);
								leftNavBarExpandedStatus ? closeLeftNavBar() : null;
								navigate(Routes[index]);
							}}>
								<ListItemIcon
									sx={{
										display: "flex",
										justifyContent: "center",
										marginRight:1,
										marginLeft:1
									}}
								>
									{DrawerIcons[index]}
								</ListItemIcon>
								<ListItemText primary={text} />
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
				width: { xs: "0px", sm: "0px", md: "300px" },
				flexShrink: { md: 0 },
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
					display: { xs: "block", sm: "block", md: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: "300px",
					},
				}}
			>
				{drawerContent}
			</Drawer>
			<Drawer
				id="leftNavigationBarPermanentDrawer"
				variant="permanent"
				sx={{
					display: { xs: "none", sm: "none", md: "block" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: "300px",
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