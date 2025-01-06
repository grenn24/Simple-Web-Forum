import {
	AppBar,
	Box,
	Typography,
	Avatar,
	useTheme,
} from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useWindowSize } from "@uidotdev/usehooks";
import { get } from "../../../utilities/apiClient";

interface Prop {
	openLeftNavBar: () => void;
	leftNavBarStatus: boolean;
}
export const TopHeader = ({ openLeftNavBar, leftNavBarStatus }: Prop) => {
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
						flexDirection:"row",
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
							px:1.5,
							height:"80%"
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
					></Button>
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
								<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
							}
							handleMenuExpandedItemsClick={[
								(event: React.MouseEvent<HTMLElement>) =>
									event.currentTarget.dataset.value &&
									navigate(event.currentTarget.dataset.value),
								(event: React.MouseEvent<HTMLElement>) =>
									event.currentTarget.dataset.value &&
									navigate(event.currentTarget.dataset.value),
								(event: React.MouseEvent<HTMLElement>) => {
									get(
										"/authentication/log-out",
										() => {},
										(err) => console.log(err)
									);
									event.currentTarget.dataset.value &&
										navigate(event.currentTarget.dataset.value);
								},
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
		</>
	);
};
