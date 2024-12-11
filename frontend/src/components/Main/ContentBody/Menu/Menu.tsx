import { useState } from "react";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuExpanded from "./MenuExpanded";
import React from "react";

interface Prop {
	menuExpandedItemsArray: string[];
	menuExpandedIconsArray?: JSX.Element[];
	menuExpandedDataValuesArray?: string[];
	menuExpandedItemStateUpdater?: (state: string) => void;
	menuIcon: JSX.Element;
	toolTipText?: string;
	defaultSelectedItem?: string;
	iconStyle?: Object;
	menuExpandedPosition?: {
		vertical: "top" | "bottom";
		horizontal: "left" | "right";
	};
	dividerIndex?: number;
	scrollLock?: boolean;
}
const Menu = ({
	menuExpandedIconsArray,
	menuExpandedItemsArray,
	menuExpandedItemStateUpdater,
	menuIcon,
	toolTipText,
	defaultSelectedItem,
	iconStyle,
	menuExpandedPosition,
	dividerIndex,
	scrollLock = false,
	menuExpandedDataValuesArray
}: Prop) => {
	const [showMenuExpanded, setShowMenuExpanded] = useState<null | HTMLElement>(
		null
	);

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenuExpanded(event.currentTarget);
	};

	const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenuExpanded(null);
		event.currentTarget.dataset.value &&
			menuExpandedItemStateUpdater &&
			menuExpandedItemStateUpdater(event.currentTarget.dataset.value);
	};

	return (
		<>
			<Tooltip title={toolTipText ? toolTipText : ""}>
				<IconButton onClick={handleOpenMenu} sx={iconStyle}>
					{menuIcon}
				</IconButton>
			</Tooltip>

			<MenuExpanded
				itemsArray={menuExpandedItemsArray}
				iconsArray={menuExpandedIconsArray}
				handleCloseMenu={handleCloseMenu}
				defaultSelectedItem={defaultSelectedItem}
				dividerIndex={dividerIndex}
				scrollLock={scrollLock}
				showMenuExpanded={showMenuExpanded}
				menuExpandedPosition={menuExpandedPosition}
				dataValuesArray={menuExpandedDataValuesArray}
			/>
		</>
	);
};

export default Menu;
