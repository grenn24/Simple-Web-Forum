import { useState } from "react";
import { Tooltip } from "@mui/material";
import MenuExpanded from "./MenuExpanded";
import React from "react";
import { Button, IconButton } from "@mui/material";

interface Prop {
	menuExpandedItemsArray: string[];
	menuExpandedIconsArray?: JSX.Element[];
	menuExpandedDataValuesArray?: string[] | number[];
	handleMenuExpandedItemsClick?: ((event: React.MouseEvent<HTMLElement>) => void)[];
	handleMenuIconClick?: (event: React.MouseEvent<HTMLElement>) => void;
	closeMenuOnExpandedItemsClick?: boolean;
	menuIcon: JSX.Element;
	menuIconDataValue?: string;
	toolTipText?: string;
	defaultSelectedItemIndex?: number;
	menuStyle?: Object;
	menuExpandedPosition?: {
		vertical: "top" | "bottom";
		horizontal: "left" | "right";
	};
	dividerPositions?: number[];
	scrollLock?: boolean;
	showMenuExpandedOnClick?: boolean
	children?: React.ReactNode;
	variant?: "outlined" | "contained" | "text";
	allCaps?: boolean
}
const Menu = ({
	menuExpandedIconsArray,
	menuExpandedItemsArray,
	handleMenuExpandedItemsClick,
	closeMenuOnExpandedItemsClick=true,
	handleMenuIconClick,
	menuIcon,
	menuIconDataValue,
	toolTipText,
	defaultSelectedItemIndex,
	menuStyle,
	menuExpandedPosition,
	dividerPositions,
	scrollLock = false,
	menuExpandedDataValuesArray=menuExpandedItemsArray,
	showMenuExpandedOnClick = true,
	children,
	variant,
	allCaps=false
}: Prop) => {
	const [showMenuExpanded, setShowMenuExpanded] = useState<null | HTMLElement>(
		null
	);

	return (
		<>
			<Tooltip title={toolTipText ? toolTipText : ""}>
				{!children ? (
					<IconButton
						onClick={(event: React.MouseEvent<HTMLElement>) => {
							setShowMenuExpanded(event.currentTarget);
							handleMenuIconClick && handleMenuIconClick(event);
						}}
						sx={menuStyle}
						data-value={menuIconDataValue}
					>
						{menuIcon}
					</IconButton>
				) : (
					<Button
						variant={variant}
						onClick={(event: React.MouseEvent<HTMLElement>) => {
							setShowMenuExpanded(event.currentTarget);
							handleMenuIconClick && handleMenuIconClick(event);
						}}
						endIcon={menuIcon}
						sx={{ ...menuStyle, textTransform: allCaps ? "uppercase" : "none" }}
					>
						{children}
					</Button>
				)}
			</Tooltip>

			{showMenuExpandedOnClick ? (
				<MenuExpanded
					itemsArray={menuExpandedItemsArray}
					iconsArray={menuExpandedIconsArray}
					defaultSelectedItemIndex={defaultSelectedItemIndex}
					dividerPositions={dividerPositions}
					scrollLock={scrollLock}
					showMenuExpanded={showMenuExpanded}
					setShowMenuExpanded={setShowMenuExpanded}
					menuExpandedPosition={menuExpandedPosition}
					dataValuesArray={menuExpandedDataValuesArray}
					handleMenuExpandedItemsClick={handleMenuExpandedItemsClick}
					closeMenuOnExpandedItemsClick={closeMenuOnExpandedItemsClick}
				/>
			) : null}
		</>
	);
};

export default Menu;
