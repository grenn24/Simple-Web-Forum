import { Box, Typography } from "@mui/material";
import List from "../../components/List";
import Button from "../../components/Button";

import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

const GeneralPage = () => {

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
							Sign Out
						</Typography>
						<Button
							buttonIcon={
								<KeyboardArrowRightRoundedIcon sx={{ color: "primary.dark" }} />
							}
							disabled
							buttonStyle={{ py: 0 }}
						/>
					</Box>,
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography fontFamily="Open Sans" fontSize={17}>
							Delete Account
						</Typography>
						<Button
							buttonIcon={
								<KeyboardArrowRightRoundedIcon sx={{ color: "primary.secondary" }} />
							}
							disabled
							buttonStyle={{ py: 0 }}
						/>
					</Box>,
				]}
				listItemTextStyle={{flexGrow:1}}
				disableRipple
				divider
			/>
		</Box>
	);
};

export default GeneralPage;
