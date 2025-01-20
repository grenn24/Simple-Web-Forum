import { Box, Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ThreadCard from "../components/ThreadCard";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Menu from "../components/Menu";
import sortOrder from "../features/Following/sortOrder";
import sortIcons from "../features/Following/sortIcons";
import { get } from "../utilities/api";
import { ThreadDTO } from "../dtos/ThreadDTO";
import ThreadCardLoading from "../components/ThreadCard/ThreadCardLoading";
import { parseThreads } from "../utilities/parseApiResponse";
import cryingCat from "../assets/image/crying-cat.png";

const Following = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [searchParams, _] = useSearchParams();
	const sort = searchParams.get("sort");
	let currentSortIndex = 0;
	sortOrder.forEach((value, index) => {
		if (value === sort) {
			currentSortIndex = index;
		}
	});
	const navigate = useNavigate();
	const [followedThreads, setFollowedThreads] = useState<ThreadDTO[]>([]);

	// Retrieve followed threads from api (re-fetch whenever sorting order is changed)
	useEffect(
		() =>
			{setIsLoading(true);
				get<ThreadDTO[]>(
				"./authors/user/follows?sort=" + currentSortIndex,
				(res) => {
					const responseBody = res.data.data;
					const threads = parseThreads(responseBody);
					setFollowedThreads(threads);
					setIsLoading(false);
				},
				(err) => console.log(err)
			);},
		[sort]
	);

	return (
		<>
			<Box
				sx={{
					bgcolor: "background.default",
					p: { xs: 1.5, sm: 3 },
					minHeight: "100%",
				}}
				position="absolute"
				width="100%"
				boxSizing="border-box"
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
						color="text.primary"
					>
						Following
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
						color="text.primary"
						buttonStyle={{ mx: 0, p: 0 }}
						handleButtonClick={() => navigate(-1)}
						toolTipText="Back"
					/>
					<Menu
						menuExpandedItemsArray={sortOrder}
						menuExpandedIconsArray={sortIcons}
						menuExpandedDataValuesArray={sortOrder.map((value) => value)}
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
								navigate(`?sort=${event.currentTarget.dataset?.value}`)
						)}
						toolTipText="Sort Options"
					>
						{sortOrder[currentSortIndex]}
					</Menu>
				</Box>
				<Box
					sx={{
						width: { xs: "100%", sm: "100%", md: "80%", lg: "65%", xl: "50%" },
						my: 3,
					}}
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
				>
					{/*If website is still fetching data from api, display loading skeleton cards instead*/}
					{isLoading ? (
						<Box width="100%">
							<ThreadCardLoading bodyHeight={180} />
							<br />
							<br />
							<ThreadCardLoading bodyHeight={180} />
						</Box>
					) : followedThreads.length !== 0 ? (
						followedThreads.map((followedThread) => (
							<Box width="100%" key={followedThread.threadID}>
								<ThreadCard thread={followedThread} />
								<Divider sx={{ my: 3 }} />
							</Box>
						))
					) : (
						<Box
							width="70%"
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
								No threads from followed authors or topics for now
							</Typography>
							<br />
							<img
								src={cryingCat}
								width={220}
								alt="crying cat"
								loading="eager"
							/>
						</Box>
					)}
				</Box>
			</Box>
		</>
	);
};

export default Following;
