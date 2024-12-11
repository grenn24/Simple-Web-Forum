import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "../Main/Menu";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import SearchBar from "./SearchBar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuExpandedItems from "./MenuExpandedItems";
import MenuExpandedIcons from "./MenuExpandedIcons";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuExpandedDataValues from "./MenuExpandedDataValues";
import { useNavigate } from "react-router-dom";

interface Prop {
	openLeftNavBar: () => void;
	leftNavBarStatus: boolean;
	setCurrentSection: (currentSection: string) => void;
}
export const TopHeader = ({
	openLeftNavBar,
	setCurrentSection,
	leftNavBarStatus,
}: Prop) => {
	const [showMenu, setShowMenu] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenu(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setShowMenu(null);
	};

	const navigate = useNavigate();

	return (
		<>
			{/*Container with 3 elements*/}
			<AppBar
				position="fixed"
				sx={{
					bgcolor: "common.white",
					height: "auto",
					zIndex: 2000,
				}}
				id="AppBar"
			>
				<Toolbar
					sx={{
						maxWidth: "auto",
						display: "flex",
						justifyContent: "space-between",
						marginTop: 1,
						marginBottom: 1,
					}}
				>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="NUS Forum"
						sx={{
							fontFamily: "poppins",
							fontWeight: 500,
							letterSpacing: ".3rem",
							color: "common.black",
							textDecoration: "none",
							display: {
								xs: "none",
								sm: "none",
								lg: "block",
								md: "block",
								xl: "block",
							},
						}}
					>
						NUS Forum
					</Typography>
					<IconButton
						color="secondary"
						sx={{
							display: {
								xs: "block",
								sm: "block",
								md: "none",
								lg: "none",
								xl: "none",
							},
						}}
						onClick={() => {
							openLeftNavBar();
						}}
					>
						{!leftNavBarStatus ? (
							<MenuRoundedIcon color="primary" />
						) : (
							<CloseRoundedIcon color="primary" />
						)}
					</IconButton>

					<SearchBar placeholder="Search for a thread" />

					<Menu
						menuExpandedItemsArray={MenuExpandedItems}
						menuExpandedIconsArray={MenuExpandedIcons}
						menuIcon={
							<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
						}
						handleMenuExpandedItemsClick={(event: React.MouseEvent<HTMLElement>) => {
							event.currentTarget.dataset.value && setCurrentSection(
								event.currentTarget.dataset.value
							);
							event.currentTarget.dataset.value &&
								navigate(`../${event.currentTarget.dataset.value}`);
						}}
						menuIconStyle={{
							padding: 1,
							"&:hover": {
								filter: "brightness(0.9)",
							},
						}}
						menuExpandedPosition={{
							vertical: "top",
							horizontal: "right",
						}}
						dividerIndex={2}
						menuExpandedDataValuesArray={MenuExpandedDataValues}
					/>
				</Toolbar>
			</AppBar>
		</>
	);
};
