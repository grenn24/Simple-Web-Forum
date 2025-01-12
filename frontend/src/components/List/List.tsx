import {
	List as ListBase,
	ListItem,
	ListItemButton,
	ListItemText,
	Divider,
	Box,
	Typography,
	SxProps,
	Theme,
} from "@mui/material";
interface Prop {
	listItemsArray: string[] | JSX.Element[];
	listIconsArray?: JSX.Element[];
	listItemPadding?: number;
	backgroundColor?: string;
	listItemsDataValues?: string[];
	handleListItemsClick?: ((event: React.MouseEvent<HTMLElement>) => void)[];
	disabled?: boolean;
	disableRipple?: boolean;
	variant?: "text" | "button";
	divider?: boolean;
	listStyle?: object;
	width?: number | string;
	listItemTextStyle?: SxProps<Theme>;
}

const List = ({
	listItemsArray,
	listIconsArray,
	listItemPadding = 2.3,
	backgroundColor,
	listItemsDataValues,
	handleListItemsClick,
	disabled,
	disableRipple = false,
	variant = "button",
	divider = false,
	listStyle,
	width,
	listItemTextStyle,
}: Prop) => {
	return (
		<ListBase
			sx={{
				backgroundColor: backgroundColor,
				width: width,
				lineHeight: 15,
				...listStyle,
			}}
			disablePadding
		>
			{divider ? <Divider variant="fullWidth" component="li" /> : null}
			{listItemsArray.map((item, index) => (
				<Box key={index}>
					<ListItem disablePadding>
						{variant === "button" ? (
							<ListItemButton
								data-value={listItemsDataValues && listItemsDataValues[index]}
								onClick={handleListItemsClick && handleListItemsClick[index]}
								sx={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									padding: listItemPadding,
								}}
								disabled={disabled}
								disableRipple={disableRipple}
								disableTouchRipple={disableRipple}
							>
								<Box display="flex" width="100%" justifyContent="center">
									{listIconsArray && listIconsArray[index]}
									<Typography sx={{ ...listItemTextStyle }}>{item}</Typography>
								</Box>
							</ListItemButton>
						) : (
							<ListItemText
								data-value={listItemsDataValues && listItemsDataValues[index]}
								onClick={handleListItemsClick && handleListItemsClick[index]}
								sx={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									padding: listItemPadding,
								}}
							>
								<Box display="flex" width="100%" justifyContent="center" >
									{listIconsArray && listIconsArray[index]}
									<Typography sx={{ ...listItemTextStyle}}>{item}</Typography>
								</Box>
							</ListItemText>
						)}
					</ListItem>
					{divider ? <Divider variant="fullWidth" component="li" /> : null}
				</Box>
			))}
		</ListBase>
	);
};

export default List;
