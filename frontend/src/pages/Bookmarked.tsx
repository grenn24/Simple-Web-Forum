import { Box, Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ThreadCard from "../components/ThreadCard";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Menu from "../components/Menu";
import sortIcons from "../features/Bookmarked/sortIcons";
import sortOrder from "../features/Bookmarked/sortOrder";
import { ThreadDTO } from "../dtos/ThreadDTO";
import { get } from "../utilities/apiClient";
import ThreadCardLoading from "../components/ThreadCard/ThreadCardLoading";
import { parseThreads } from "../utilities/parseApiResponse";
import cryingCat from "../assets/image/crying-cat.png";

const Bookmarked = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [sortIndex, setSortIndex] = useState(0);
	const navigate = useNavigate();
	const [bookmarkedThreads, setBookmarkedThreads] = useState<ThreadDTO[]>([]);

	// Retrieve bookmarked threads from api (re-fetch whenever sorting order is changed)
	useEffect(() => {
		get<ThreadDTO[]>(
			"/authors/user/bookmarks?sort=" + sortIndex,
			(res) => {
				const responseBody = res.data.data;
				const threads = parseThreads(responseBody, true);
				setBookmarkedThreads(threads);
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [sortIndex]);

	return (
		<Box
			sx={{
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
				minHeight: "100%",
			}}
			flexGrow={1}
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<Box
				sx={{
					marginBottom: 2,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignContent: "center",
				}}
				width="100%"
			>
				<Typography
					textAlign={"left"}
					fontFamily="Open Sans"
					fontWeight={700}
					fontSize={30}
					color="primary.dark"
				>
					Bookmarked
				</Typography>
			</Box>
			<Box width="100%">
				<Divider />
			</Box>
			<Box
				sx={{ marginTop: 2 }}
				width="100%"
				display="flex"
				justifyContent="space-between"
			>
				<Button
					buttonIcon={<ArrowBackRoundedIcon sx={{ fontSize: 35 }} />}
					color="primary.dark"
					buttonStyle={{ mx: 0, p: 0 }}
					handleButtonClick={() => navigate(-1)}
					toolTipText="Back"
				/>
				<Menu
					menuExpandedItemsArray={sortOrder}
					menuExpandedIconsArray={sortIcons}
					menuExpandedDataValuesArray={sortOrder.map((_, index) => index)}
					menuIcon={<SortRoundedIcon sx={{ fontSize: 20 }} />}
					menuStyle={{
						borderRadius: 30,
						px: 2,
						py: 0,
						fontSize: 20,
						fontFamily: "Open Sans",
						color: "primary.dark",
					}}
					handleMenuExpandedItemsClick={Array(sortOrder.length).fill(
						(event: React.MouseEvent<HTMLElement>) =>
							event.currentTarget.dataset.value &&
							setSortIndex(Number(event.currentTarget.dataset.value))
					)}
					toolTipText="Sort Options"
					menuExpandedPosition={{ vertical: "top", horizontal: "right" }}
				>
					{sortOrder[sortIndex]}
				</Menu>
			</Box>
			<Box
				sx={{
					width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
					marginBottom: 3,
				}}
			>
				{/*If website is still fetching data from api, display loading skeleton cards instead*/}
				{isLoading ? (
					<Box width="100%">
						<ThreadCardLoading bodyHeight={180} />
					</Box>
				) : bookmarkedThreads.length !== 0 ? (
					bookmarkedThreads.map((bookmarkedThread) => (
						<Box width="100%" key={bookmarkedThread.threadID}>
							<ThreadCard thread={bookmarkedThread} />
							<Divider />
						</Box>
					))
				) : (
					<Box
						width="100%"
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						marginTop={5}
					>
						<Typography
							textAlign="center"
							fontFamily="Open Sans"
							fontSize={19}
							color="primary.dark"
						>
							No bookmarks for now, try adding some
						</Typography>
						<br />
						<br />
						<img src={cryingCat} width={220} alt="crying cat" loading="eager" />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default Bookmarked;
