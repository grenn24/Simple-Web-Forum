import {
	List as ListBase,
	ListItem,
	ListItemButton,
	ListItemText,
	Divider,
	Box,
} from "@mui/material";
interface Prop {
	listItemsArray: string[] | JSX.Element[];
	listIconsArray?: JSX.Element[];
	disablePadding?: boolean;
	backgroundColor?: string;
	listItemsDataValues?: string[];
	handleListItemsClick?: ((event: React.MouseEvent<HTMLElement>) => void)[];
	listItemsStyles?: object;
	disabled?: boolean;
	disableRipple?: boolean;
	variant?: "text" | "button";
	divider?: boolean;
}

const List = ({
	listItemsArray,
	listIconsArray,
	disablePadding,
	backgroundColor,
	listItemsDataValues,
	handleListItemsClick,
	listItemsStyles,
	disabled,
	disableRipple = false,
	variant = "button",
	divider = false,
}: Prop) => {
	return (
		<>
			<ListBase
				sx={{ backgroundColor: backgroundColor }}
				disablePadding={disablePadding}
			>
				{listItemsArray.map((item, index) => (
					<Box key={index}>
						<ListItem disablePadding={disablePadding}>
							{variant === "button" ? (
								<ListItemButton
									data-value={listItemsDataValues && listItemsDataValues[index]}
									onClick={handleListItemsClick && handleListItemsClick[index]}
									sx={{ ...listItemsStyles }}
									disabled={disabled}
									disableRipple={disableRipple}
									disableTouchRipple={disableRipple}
								>
									{listIconsArray && listIconsArray[index]}
									<ListItemText primary={item} />
								</ListItemButton>
							) : (
								<ListItemText
									data-value={listItemsDataValues && listItemsDataValues[index]}
									onClick={handleListItemsClick && handleListItemsClick[index]}
									sx={{ ...listItemsStyles }}
								>
									{listIconsArray && listIconsArray[index]}
									<ListItemText primary={item} />
								</ListItemText>
							)}
						</ListItem>
						{divider ? <Divider variant="inset" component="li" /> : null}
					</Box>
				))}
			</ListBase>
		</>
	);
};

export default List;
