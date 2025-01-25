import { AppBar, Box, Typography, Avatar, useTheme } from "@mui/material";
import Menu from "../../../components/Menu";
import SearchBar from "../../../components/SearchBar/SearchBar";
import {
	MenuRounded as MenuRoundedIcon,
	CloseRounded as CloseRoundedIcon,
	AddRounded as AddRoundedIcon,
} from "@mui/icons-material";
import MenuExpandedItems from "./MenuExpandedItems";
import MenuExpandedIcons from "./MenuExpandedIcons";
import MenuExpandedDataValues from "./MenuExpandedDataValues";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useWindowSize } from "@uidotdev/usehooks";
import { get } from "../../../utilities/api";
import SimpleDialog from "../../../components/SimpleDialog";
import List from "../../../components/List";
import { useEffect, useState } from "react";
import { parseAuthor } from "../../../utilities/parseApiResponse";
import { useAppDispatch, useAppSelector } from "../../../utilities/redux";
import {
	changeAuthorID,
	changeAvatarIconLink,
	changeName,
	changeUsername,
} from "./userInfoSlice";

interface Prop {
	openLeftNavBar: () => void;
	leftNavBarStatus: boolean;
}
export const TopHeader = ({ openLeftNavBar, leftNavBarStatus }: Prop) => {
	const navigate = useNavigate();
	const location = useLocation();
	const screenWidth = useWindowSize().width as number;
	const dispatch = useAppDispatch();
	const [openLogOutDialog, setOpenLogOutDialog] = useState(false);
	const { avatarIconLink } = useAppSelector((state) => ({
		avatarIconLink: state.userInfo.avatarIconLink,
	}));

	useEffect(
		() =>
			get(
				"/authors/user",
				(res) => {
					const responseBody = res.data.data;
					const user = parseAuthor(responseBody);
					dispatch(changeUsername(user.username));
					dispatch(changeName(user.name));
					dispatch(changeAvatarIconLink(user.avatarIconLink));
					dispatch(changeAuthorID(user.authorID))
				},
				(err) => console.log(err)
			),
		[location]
	);

	return (
		<>
			{/*Container with 3 elements*/}
			<AppBar
				position="fixed"
				sx={{
					bgcolor: "rgb(255,255,255,0.7)",
					backdropFilter: "blur(6px)",
					height: "auto",
					zIndex: 1201,
					width: "100%",
					py: 1,
					px: 1,
				}}
				id="AppBar"
			>
				<Box
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href="./"
						mx={2}
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
						NUS Gossips
					</Typography>
					<Button
						color="secondary"
						buttonStyle={{
							display: {
								xs: "block",
								sm: "block",
								md: "none",
								lg: "none",
								xl: "none",
							},
							px: 1.5,
						}}
						handleButtonClick={() => {
							openLeftNavBar();
						}}
						buttonIcon={
							!leftNavBarStatus ? (
								<MenuRoundedIcon color="primary" />
							) : (
								<CloseRoundedIcon color="primary" />
							)
						}
					/>
					<SearchBar
						placeholder="Search for anything"
						handleKeyDown={(e) => {
							if (e.key === "Enter" && e.currentTarget.value !== "") {
								navigate(`/Search?query=${e.currentTarget.value}&type=Threads`);
								(document.activeElement as HTMLElement)?.blur();
							}
						}}
					/>
					<Box
						display="flex"
						alignItems="center"
						width="20%"
						justifyContent="flex-end"
					>
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
							buttonStyle={{ height: "80%", px: 1.3 }}
							toolTipText="Create Thread"
							handleButtonClick={() => {
								navigate("../Create-Thread");
							}}
						>
							{screenWidth > useTheme().breakpoints.values.md && "Create"}
						</Button>
						<Menu
							menuExpandedItemsArray={MenuExpandedItems}
							menuExpandedIconsArray={MenuExpandedIcons}
							menuIcon={
								<Avatar
									alt="Remy Sharp"
									src={avatarIconLink}
									sx={{ width: 40, height: 40 }}
								/>
							}
							handleMenuExpandedItemsClick={[
								(event: React.MouseEvent<HTMLElement>) =>
									event.currentTarget.dataset.value &&
									navigate(event.currentTarget.dataset.value),
								(event: React.MouseEvent<HTMLElement>) =>
									event.currentTarget.dataset.value &&
									navigate(event.currentTarget.dataset.value),
								() => setOpenLogOutDialog(true),
							]}
							menuExpandedPosition={{
								vertical: "top",
								horizontal: "right",
							}}
							dividerPositions={[2]}
							menuExpandedDataValuesArray={MenuExpandedDataValues}
							toolTipText="More"
						/>
					</Box>
				</Box>
			</AppBar>
			{/*Confirm Sign Out Dialog*/}
			<SimpleDialog
				openDialog={openLogOutDialog}
				setOpenDialog={setOpenLogOutDialog}
				title="Confirm Sign Out"
				backdropBlur={5}
				borderRadius={1.3}
				dialogTitleHeight={55}
				width={400}
			>
				<List
					listItemsArray={["Yes", "No"]}
					divider
					handleListItemsClick={[
						(event) => {
							event.stopPropagation();
							get(
								"/authentication/log-out",
								() => {},
								(err) => console.log(err)
							);
							navigate("../Welcome");
						},
						(event) => {
							event.stopPropagation();
							setOpenLogOutDialog(false);
						},
					]}
				/>
			</SimpleDialog>
		</>
	);
};
