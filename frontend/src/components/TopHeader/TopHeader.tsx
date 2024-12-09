import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import rightMenuOptions from "./RightMenuOptions";
import SearchBar from "./SearchBar";

export const TopHeader = () => {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<>
			{/*Container with 3 elements*/}
			<AppBar
				position="static"
				sx={{
					bgcolor: "common.white",
					width: "100%",
				}}
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
						}}
					>
						NUS Forum
					</Typography>

					<SearchBar placeholder="Search for a thread" />

					<Box>
						<Tooltip title="More">
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
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{rightMenuOptions.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography sx={{ textAlign: "center" }}>
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
