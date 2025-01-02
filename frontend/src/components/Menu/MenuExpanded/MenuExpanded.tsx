import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import MenuBox from "@mui/material/Menu";
import Box from "@mui/material/Box";

interface Prop {
	itemsArray: string[];
	iconsArray?: JSX.Element[];
	defaultSelectedItemIndex?: number;
	dividerPositions?: number[]; //The index of the element above the dividers;
	scrollLock?: boolean;
	menuExpandedPosition?: {
		vertical: "top" | "bottom";
		horizontal: "left" | "right";
	};
	showMenuExpanded: HTMLElement | null;
	setShowMenuExpanded: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
	dataValuesArray?: string[] | number[];
	handleMenuExpandedItemsClick?: ((
		event: React.MouseEvent<HTMLElement>
	) => void)[];
	closeMenuOnExpandedItemsClick: boolean;
}
const MenuExpanded = ({
	itemsArray,
	iconsArray,
	setShowMenuExpanded,
	defaultSelectedItemIndex,
	dividerPositions,
	scrollLock,
	showMenuExpanded,
	menuExpandedPosition = {
		vertical: "top",
		horizontal: "left",
	},
	dataValuesArray = itemsArray,
	handleMenuExpandedItemsClick,
	closeMenuOnExpandedItemsClick,
}: Prop) => {
	const mappedArray = new Array(
		Math.max(itemsArray.length, iconsArray ? iconsArray.length : 0)
	).fill("");

	mappedArray.forEach(
		(_, index) =>
			(mappedArray[index] = (
				<Box key={itemsArray[index] ? itemsArray[index] : index}>
					<MenuItem
						onClick={(event) => {
							closeMenuOnExpandedItemsClick && setShowMenuExpanded(null);
							handleMenuExpandedItemsClick &&
								handleMenuExpandedItemsClick[index](event);
						}}
						selected={
							defaultSelectedItemIndex
								? defaultSelectedItemIndex === index
								: false
						}
						data-value={dataValuesArray[index]}
					>
						{iconsArray && iconsArray[index]}
						{itemsArray[index]}
					</MenuItem>
					{dividerPositions && dividerPositions.includes(Number(index)) ? (
						<Divider />
					) : null}
				</Box>
			))
	);
	const handleCloseMenu = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.stopPropagation();
		setShowMenuExpanded(null);
	};
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
						width: "auto",
					},
				},
			}}
			keepMounted //Keep children elements in DOM
			transformOrigin={menuExpandedPosition}
			open={showMenuExpanded !== null}
			onClick={handleCloseMenu}
			disableScrollLock={!scrollLock}
			elevation={3}
		>
			{mappedArray}
		</MenuBox>
	);
};

export default MenuExpanded;
