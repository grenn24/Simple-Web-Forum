import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ThreadCard from "../components/ThreadCard";
import {
	ArrowBackRounded as ArrowBackRoundedIcon,
	SortRounded as SortRoundedIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Menu from "../components/Menu";
import sortIcons from "../features/Liked/sortIcons";
import sortOrder from "../features/Liked/sortOrder";
import { get } from "../utilities/api";
import ThreadCardLoading from "../components/ThreadCard/ThreadCardLoading";
import LikeDTO from "../dtos/LikeDTO";
import { parseLikes } from "../utilities/parseApiResponse";
import cryingCat from "../assets/image/crying-cat.png";
import { removeFromArray } from "../utilities/arrayManipulation";

const Liked = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [searchParams, _] = useSearchParams();
	const sort = searchParams.get("sort");

	const navigate = useNavigate();
	const [likes, setLikes] = useState<LikeDTO[]>([]);

	// Retrieve liked threads from api (re-fetch whenever sorting order is changed)
	useEffect(() => {
		setIsLoading(true);

		get(
			"/authors/user/likes?sort=" + (sort ? String(sortOrder.findIndex((element) => element === sort)) : "0"),
			(res) => {
				const responseBody = res.data.data;
				const likes = parseLikes(responseBody, true);
				setLikes(likes);
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	}, [sort]);

	return (
		<Box
			sx={{
				bgcolor: "background.default",
				p: { xs: 1.5, sm: 3 },
				minHeight: "100%",
			}}
			flexGrow={1}
			position="absolute"
			width="100%"
			boxSizing="border-box"
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
					Liked
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
					menuExpandedDataValuesArray={sortOrder.map((sort) => sort)}
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
					menuExpandedPosition={{ vertical: "top", horizontal: "right" }}
				>
					{
						sortOrder[
							sort
								? sortOrder.findIndex((element) => element === sort)
								: 0
						]
					}
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
				) : likes.length !== 0 ? (
					likes.map((like,index) => (
						<Box key={like.likeID} width="100%">
							<ThreadCard thread={like.thread} handleDeleteThread={()=>setLikes(removeFromArray(likes,index))}/>
							<Divider sx={{ my: 3 }} />
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
							No likes for now
						</Typography>
						<br />

						<img src={cryingCat} width={220} alt="crying cat" loading="eager" />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default Liked;
