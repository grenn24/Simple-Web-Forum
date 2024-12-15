import { Box, Typography, Switch} from "@mui/material";
import List from "../../components/List";


const PrivacyPage = () => {
	return (
		<Box width="100%">
			<List
				listItemsArray={[
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography fontFamily="Open Sans" fontSize={17}>
							Hide Activity from Public
						</Typography>
						<Switch color="secondary" />
					</Box>,
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography fontFamily="Open Sans" fontSize={17}>
							Hide Posts from Public
						</Typography>
						<Switch color="secondary" />
					</Box>,
				]}
				disablePadding
				disableRipple
				divider
				disableHoverEffect
			/>
		</Box>
	);
};

export default PrivacyPage;
