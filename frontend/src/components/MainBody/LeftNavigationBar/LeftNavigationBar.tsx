import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
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
import sections from "./Sections";

interface Prop {
	drawerWidth: number;
}
const LeftNavigationBar = ({ drawerWidth }: Prop) => {
	return (
		<Drawer
			sx={{
				position: "relative",
				width: drawerWidth,
				flexShrink: 1,
				"& .MuiDrawer-paper": {
					position: "relative",
					width: drawerWidth,
					boxSizing: "border-box",
				},
			}}
			variant="permanent"
			anchor="left"
		>
			
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				<List>
					{["Home", "Following", "Recommended"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon sx={{ marginLeft: "10%", color: "common-black" }}>
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
					{sections.map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton sx={{ color: "common.black" }}>
								<ListItemIcon sx={{ marginLeft: "10%", color: "common.black" }}>
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
		</Drawer>
	);
};

export default LeftNavigationBar;
