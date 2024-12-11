import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import MenuBox from "@mui/material/Menu";
import Box from "@mui/material/Box";

interface Prop {
	itemsArray: string[];
	iconsArray?: JSX.Element[];
	handleCloseMenu: (event: React.MouseEvent<HTMLElement>) => void;
	defaultSelectedItem?: string;
	dividerIndex?: number; //The index of the element above the divider;
	scrollLock?: boolean;
	menuExpandedPosition?: {
		vertical: "top" | "bottom";
		horizontal: "left" | "right";
	};
	showMenuExpanded: HTMLElement | null;
	dataValuesArray?: string[];
}
const MenuExpanded = ({
	itemsArray,
	iconsArray,
	handleCloseMenu,
	defaultSelectedItem,
	dividerIndex,
	scrollLock,
	showMenuExpanded,
	menuExpandedPosition = {
		vertical: "top",
		horizontal: "left",
	},
	dataValuesArray=itemsArray
}: Prop) => {
	const mappedArray = new Array(
		Math.max(itemsArray.length, iconsArray ? iconsArray.length : 0)
	).fill("");

	mappedArray.forEach(
		(_, index) =>
			(mappedArray[index] = (
				<Box key={itemsArray[index] ? itemsArray[index] : index}>
					<MenuItem
						
						onClick={handleCloseMenu}
						selected={
							itemsArray[index]
								? itemsArray[index] === defaultSelectedItem
								: false
						}
						data-value={dataValuesArray[index]}
					>
						{iconsArray && iconsArray[index]}
						{itemsArray[index]}
					</MenuItem>
					{dividerIndex === Number(index) ? <Divider /> : null}
				</Box>
			))
	);
	return (
		<MenuBox
			sx={{ mt: "45px", zIndex: 2000 }}
			anchorEl={showMenuExpanded}
			anchorOrigin={{
				vertical: menuExpandedPosition.vertical,
				horizontal: menuExpandedPosition.horizontal,
			}}
			slotProps={{
				paper: {
					style: {
						width: "20ch",
					},
				},
			}}
			keepMounted //Keep children elements in DOM
			transformOrigin={menuExpandedPosition}
			open={showMenuExpanded !== null}
			onClose={handleCloseMenu}
			disableScrollLock={!scrollLock}
		>
			{mappedArray}
		</MenuBox>
	);
};

export default MenuExpanded;
