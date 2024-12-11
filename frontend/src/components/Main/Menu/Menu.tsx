import { useState } from "react";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuExpanded from "./MenuExpanded";
import React from "react";

interface Prop {
	menuExpandedItemsArray: string[];
	menuExpandedIconsArray?: JSX.Element[];
	menuExpandedDataValuesArray?: string[];
	handleMenuExpandedItemsClick?: (event: React.MouseEvent<HTMLElement>) => void;
	handleMenuIconClick?: (event: React.MouseEvent<HTMLElement>) => void;
	menuIcon: JSX.Element;
	menuIconDataValue?: string;
	toolTipText?: string;
	defaultSelectedItem?: string;
	menuIconStyle?: Object;
	menuExpandedPosition?: {
		vertical: "top" | "bottom";
		horizontal: "left" | "right";
	};
	dividerIndex?: number;
	scrollLock?: boolean;
	showMenuExpandedOnClick?: boolean;
}
const Menu = ({
	menuExpandedIconsArray,
	menuExpandedItemsArray,
	handleMenuExpandedItemsClick,
	handleMenuIconClick,
	menuIcon,
	menuIconDataValue,
	toolTipText,
	defaultSelectedItem,
	menuIconStyle,
	menuExpandedPosition,
	dividerIndex,
	scrollLock = false,
	menuExpandedDataValuesArray,
	showMenuExpandedOnClick = true,
}: Prop) => {
	const [showMenuExpanded, setShowMenuExpanded] = useState<null | HTMLElement>(
		null
	);

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenuExpanded(event.currentTarget);
		handleMenuIconClick && handleMenuIconClick(event);
	};

	const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
		setShowMenuExpanded(null);
		handleMenuExpandedItemsClick && handleMenuExpandedItemsClick(event);
	};

	return (
		<>
			<Tooltip title={toolTipText ? toolTipText : ""}>
				<IconButton
					onClick={handleOpenMenu}
					sx={menuIconStyle}
					data-value={menuIconDataValue}
				>
					{menuIcon}
				</IconButton>
			</Tooltip>

			{showMenuExpandedOnClick ? (
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
			) : null}
		</>
	);
};

export default Menu;
