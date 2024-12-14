import { List as ListBase, ListItem, ListItemButton , ListItemText, Divider} from "@mui/material"
interface Prop {
    listItemsArray: string[] | JSX.Element[];
    listIconsArray?: JSX.Element[];
    disablePadding?: boolean;
    backgroundColor?: string;
	listItemsDataValues?: string[]
	handleListItemsClick?: ((event: React.MouseEvent<HTMLElement>) => void)[];
	listItemsStyles?: object;
	disabled?: boolean;
	disableRipple?: boolean
	disableHoverEffect?: boolean
	divider?: boolean
}

const List = ({
	listItemsArray,
	listIconsArray,
	disablePadding,
	backgroundColor,
	listItemsDataValues, handleListItemsClick,
	listItemsStyles,
	disabled,
	disableRipple=false,
	disableHoverEffect=false,
	divider=false
}: Prop) => {
	return (
		<>
			<ListBase sx={{ backgroundColor: backgroundColor }} disablePadding={disablePadding}>
				{listItemsArray.map((item, index) => (
					<>
						<ListItem disablePadding={disablePadding} key={index}>
							{!disableHoverEffect ? (
								<ListItemButton
									data-value={listItemsDataValues && listItemsDataValues[index]}
									onClick={handleListItemsClick && handleListItemsClick[index]}
									sx={{ ...listItemsStyles }}
									disabled={disabled}
									disableRipple={disableRipple}
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
					</>
				))}
			</ListBase>
		</>
	);
};

export default List;