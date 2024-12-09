import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import rightMenuOptions from "./RightMenuOptions";
import SearchBar from "./SearchBar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

interface Prop {
	openLeftNavBar: () => void;
	setCurrentSection: (currentSection: string) => void
}
export const TopHeader = ({openLeftNavBar, setCurrentSection} : Prop) => {
	const [showMenu, setShowMenu] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenu(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setShowMenu(null);
	};

	return (
		<>
			{/*Container with 3 elements*/}
			<AppBar
				position="fixed"
				sx={{
					bgcolor: "common.white",
					width: "100%",
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
						aria-label="delete"
						color="secondary"
						sx={{ display: { sm: "block", md: "none" } }}
						onClick={openLeftNavBar}
					>
						<MenuRoundedIcon sx={{ color: "common.black" }} />
					</IconButton>

					<SearchBar placeholder="Search for a thread" />

					<Box>
						<Tooltip title="">
							<IconButton
								onClick={handleOpenUserMenu}
								sx={{
									p: 0,
									"&:hover": {
										filter: "brightness(0.9)",
									},
								}}
							>
								<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px", zIndex: 2000 }}
							id="menu"
							anchorEl={showMenu}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={showMenu !== null}
							onClose={handleCloseUserMenu}
						>
							{rightMenuOptions.map((setting, index) => (
								<MenuItem
									key={setting}
									onClick={() => {
										handleCloseUserMenu();
										setCurrentSection(setting);
									}}
								>
									<Typography sx={{ textAlign: "center" }}>
										{index === 0 ? (
											<PersonOutlineRoundedIcon sx={{ marginRight: 2 }} />
										) : index === 1 ? (
											<SettingsRoundedIcon sx={{ marginRight: 2 }} />
										) : (
											<LogoutRoundedIcon sx={{ marginRight: 2 }} />
										)}
										{setting}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
		</>
	);
};
