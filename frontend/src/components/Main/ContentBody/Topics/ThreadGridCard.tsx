import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "../../Menu";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme }) => ({
	marginLeft: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
	variants: [
		{
			props: ({ expand }) => !expand,
			style: {
				transform: "rotate(0deg)",
			},
		},
		{
			props: ({ expand }) => !!expand,
			style: {
				transform: "rotate(180deg)",
			},
		},
	],
}));

interface Prop {
	threadTitle: string;
	threadAuthor: string;
	threadDate: string;
	avatarIconLink: string;
	threadContentSummarised: string;
	avatarClickHandlerFunction?: () => void;
}

const ThreadGridCard = ({
	threadTitle,
	threadAuthor,
	threadDate,
	avatarIconLink,
	threadContentSummarised,
	avatarClickHandlerFunction,
}: Prop) => {
	return (
		<>
			<Card sx={{borderRadius:0.7}}>
				<CardHeader
					avatar={
						<Menu
							menuExpandedItemsArray={[]}
							menuIcon={<Avatar src={avatarIconLink} />}
							menuIconStyle={{
								padding: 0,
								"&:hover": {
									filter: "brightness(0.9)",
								},
							}}
							menuIconDataValue="Profile"
							menuExpandedPosition={{
								vertical: "top",
								horizontal: "right",
							}}
							dividerIndex={2}
							menuExpandedDataValuesArray={[]}
							toolTipText="View Profile"
							handleMenuIconClick={avatarClickHandlerFunction}
							showMenuExpandedOnClick={false}
						/>
					}
					action={
						<>
							<Menu
								menuIcon={<BookmarkBorderRoundedIcon />}
								menuExpandedItemsArray={[]}
								toolTipText="Bookmark"
								scrollLock={true}
								showMenuExpandedOnClick={false}
							/>
						</>
					}
					title={threadAuthor}
					subheader={threadDate}
					titleTypographyProps={{ fontWeight: 750 }}
                    sx={{paddingBottom: 0.5}}
				/>
				<CardContent sx={{ py: 0, my: 0 }}>
					<Typography
						fontSize={20}
						color="text.primary"
						fontFamily="Open Sans"
						fontWeight={600}
					>
						{threadTitle}
					</Typography>
				</CardContent>

				<CardContent sx={{ py: 0, my: 0 }}>
					<Typography fontSize={14}>{threadContentSummarised}</Typography>
				</CardContent>
			</Card>
		</>
	);
};

export default ThreadGridCard;
