import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	IconButton,
	Avatar,
	useTheme,
} from "@mui/material";
import Menu from "../../../components/Menu";
import { useState } from "react";
import SearchBar from "../../../components/SearchBar/SearchBar";
import {
	MenuRounded as MenuRoundedIcon,
	CloseRounded as CloseRoundedIcon,
	AddRounded as AddRoundedIcon,
} from "@mui/icons-material";
import MenuExpandedItems from "./MenuExpandedItems";
import MenuExpandedIcons from "./MenuExpandedIcons";
import MenuExpandedDataValues from "./MenuExpandedDataValues";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useWindowSize } from "@uidotdev/usehooks";

interface Prop {
	openLeftNavBar: () => void;
	leftNavBarStatus: boolean;
}
export const TopHeader = ({ openLeftNavBar, leftNavBarStatus }: Prop) => {
	const [showMenu, setShowMenu] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenu(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setShowMenu(null);
	};

	const navigate = useNavigate();

	const screenWidth = useWindowSize().width as number;

	return (
		<>
			{/*Container with 3 elements*/}
			<AppBar
				position="fixed"
				sx={{
					bgcolor: "background.default",
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
							color: "text.primary",
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
					<Box display="flex" alignItems="center">
						<Button
							variant="text"
							color="text.primary"
							borderRadius={50}
							fontSize={20}
							buttonIcon={
								<AddRoundedIcon
									sx={{
										marginBottom: 0.4,
									}}
								/>
							}
							buttonStyle={{ height: "80%" }}
							toolTipText="Create Thread"
							iconOnly={
								screenWidth > useTheme().breakpoints.values.md ? false : true
							}
							handleButtonClick={() => {
								navigate("../Create-Thread");
							}}
						>
							{screenWidth > useTheme().breakpoints.values.md ? "Create" : null}
						</Button>
						<Menu
							menuExpandedItemsArray={MenuExpandedItems}
							menuExpandedIconsArray={MenuExpandedIcons}
							menuIcon={
								<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
							}
							handleMenuExpandedItemsClick={(
								event: React.MouseEvent<HTMLElement>
							) => {
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
							dividerPositions={[2]}
							menuExpandedDataValuesArray={MenuExpandedDataValues}
							toolTipText="More"
						/>
					</Box>
				</Toolbar>
			</AppBar>
		</>
	);
};