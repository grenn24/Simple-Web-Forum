import { List as ListBase, ListItem, ListItemIcon, ListItemButton , ListItemText} from "@mui/material"
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
}

const List = ({
	listItemsArray,
	listIconsArray,
	disablePadding,
	backgroundColor,
	listItemsDataValues, handleListItemsClick,
	listItemsStyles,
	disabled,
	disableRipple,
}: Prop) => {
	return (
		<>
			<ListBase sx={{ backgroundColor: backgroundColor }}>
				{listItemsArray.map((item, index) => (
					<ListItem disablePadding={disablePadding} key={index}>
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
					</ListItem>
				))}
			</ListBase>
		</>
	);
};

export default List;