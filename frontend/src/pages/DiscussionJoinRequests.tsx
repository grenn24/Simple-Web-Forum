import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import {
	DataGrid,
	GridRowsProp,
	GridColDef,
	GridActionsCellItem,
	GridRowId,
	GridRowSelectionModel,
	GridToolbarContainer,
	GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Delete, get, postJSON } from "../utilities/api";
import { useNavigate, useParams } from "react-router-dom";
import { parseDiscussionJoinRequests } from "../utilities/parseApiResponse";
import { DiscussionJoinRequestDTO } from "../dtos/DiscussionDTO";
import { dateToTimeYear } from "../utilities/dateToString";
import {
	CheckRounded as CheckRoundedIcon,
	CloseRounded as CloseRoundedIcon,
	SyncRounded as SyncRoundedIcon,
} from "@mui/icons-material";
import Button from "../components/Button";

const DiscussionJoinRequests = () => {
	const { discussionID } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const columns: GridColDef[] = [
		{
			field: "avatar",
			headerName: "Avatar",
			headerAlign: "center",
			width: 80,
			align: "center",
			disableColumnMenu: true,
			sortable: false,
			renderCell: (params) => (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					height="100%"
				>
					<Avatar src={params.row.avatar} alt={params.row.name} />
				</Box>
			),
		},
		{ field: "name", headerName: "Name", width: 170 },
		{ field: "username", headerName: "Username", width: 170 },
		{ field: "requestDate", headerName: "Request Date", width: 200 },
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,

			cellClassName: "actions",
			getActions: ({ id }) => {
				return [
					<GridActionsCellItem
						icon={
							<Tooltip title="Accept" placement="right">
								<CheckRoundedIcon />
							</Tooltip>
						}
						label="Accept"
						className="textPrimary"
						onClick={handleAcceptJoinRequest(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={
							<Tooltip title="Reject" placement="right">
								<CloseRoundedIcon />
							</Tooltip>
						}
						label="Reject"
						onClick={handleRejectJoinRequest(id)}
						color="inherit"
					/>,
				];
			},
		},
	];

	const [joinRequests, setJoinRequests] = useState<DiscussionJoinRequestDTO[]>(
		[]
	);
	const [rows, setRows] = useState<GridRowsProp>([]);
	const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

	const handleAcceptJoinRequest = (id: GridRowId) => () => {
		const requestID = joinRequests[Number(id.valueOf())].requestID;
		const authorID = joinRequests[Number(id.valueOf())].author.authorID;
		Delete(
			`/discussions/${discussionID}/join-requests/${requestID}`,
			{},
			() => {},
			(err) => console.log(err)
		);
		postJSON(
			`/discussions/${discussionID}/members`,
			{ author_id: authorID },
			() => {},
			(err) => console.log(err)
		);
		setRows(rows.filter((row) => row.id !== id));
	};

	const handleRejectJoinRequest = (id: GridRowId) => () => {
		const requestID = joinRequests[Number(id.valueOf())].requestID;
		Delete(
			`/discussions/${discussionID}/join-requests/${requestID}`,
			{},
			() => {},
			(err) => console.log(err)
		);
		setRows(rows.filter((row) => row.id !== id));
	};

	const handleAcceptSelectedJoinRequests = () =>
		selectedRows.forEach((id) => {
			handleAcceptJoinRequest(id)();
		});
	const handleRejectSelectedJoinRequests = () =>
		selectedRows.forEach((id) => {
			handleRejectJoinRequest(id)();
		});

	const retrieveJoinRequests = () => {
		setIsLoading(true);
		get(
			`discussions/${discussionID}/join-requests`,
			(res) => {
				const responseBody = res.data.data;
				const joinRequests = parseDiscussionJoinRequests(responseBody);
				setJoinRequests(joinRequests);
				setRows(
					joinRequests.map((request, index) => ({
						id: index,
						authorID: request.author.authorID,
						name: request.author.name,
						username: request.author.username,
						avatar: request.author.avatarIconLink,
						requestDate: dateToTimeYear(request.createdAt, "short"),
						requestID: request.requestID,
					}))
				);
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	};

	useEffect(() => {
		retrieveJoinRequests();
	}, []);

	const Toolbar = () => {
		return (
			<GridToolbarContainer>
				<Box display="flex" justifyContent="space-between" width="100%">
					<Box>
						<Button
							buttonIcon={<CheckRoundedIcon />}
							handleButtonClick={handleAcceptSelectedJoinRequests}
							disabled={selectedRows.length === 0}
						>
							Accept
						</Button>
						<Button
							buttonIcon={<CloseRoundedIcon />}
							handleButtonClick={handleRejectSelectedJoinRequests}
							disabled={selectedRows.length === 0}
						>
							Reject
						</Button>
						<Button
							buttonIcon={<SyncRoundedIcon />}
							handleButtonClick={retrieveJoinRequests}
						>
							Refresh
						</Button>
					</Box>
					<GridToolbarQuickFilter />
				</Box>
			</GridToolbarContainer>
		);
	};
	return (
		<Box width="100%">
			<Typography
				textAlign={"left"}
				fontFamily="Open Sans"
				fontWeight={700}
				fontSize={24}
				color="primary.dark"
				my={1}
			>
				Join Requests
			</Typography>
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5,
						},
					},
				}}
				pageSizeOptions={[10]}
				checkboxSelection
				onRowSelectionModelChange={(newSelection) => {
					setSelectedRows(newSelection);
				}}
				slots={{ toolbar: Toolbar }}
				slotProps={{
					toolbar: {
						showQuickFilter: true,
					},
					loadingOverlay: {
						variant: "skeleton",
						noRowsVariant: "skeleton",
					},
				}}
				onRowDoubleClick={(rowInfo) =>
					navigate(`/Profile/${rowInfo.row.authorID}`)
				}
				loading={isLoading}
				localeText={{
					noRowsLabel: "No join requests"
				}}
			/>
		</Box>
	);
};

export default DiscussionJoinRequests;
