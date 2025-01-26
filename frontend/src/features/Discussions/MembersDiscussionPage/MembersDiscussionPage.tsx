import { Avatar, Box, Tooltip } from "@mui/material";
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
import {
	SyncRounded as SyncRoundedIcon,
	CancelRounded as CancelRoundedIcon,
	AddRounded as AddRoundedIcon,
	DoneRounded as DoneRoundedIcon,
	CloseRounded as CloseRoundedIcon
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	DiscussionDTO,
} from "../../../dtos/DiscussionDTO";
import { Delete, get} from "../../../utilities/api";
import {
	parseDiscussion,
} from "../../../utilities/parseApiResponse";
import Button from "../../../components/Button";
import { useAppSelector } from "../../../utilities/redux";
import AddMembersDialog from "./AddMembersDialog";

const MembersDiscussionPage = () => {
	const { discussionID } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [rows, setRows] = useState<GridRowsProp>([]);
	const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
		const [openAddMembersDialog, setOpenAddMembersDialog] = useState(false);
	const { userAuthorID } = useAppSelector((state) => ({
		userAuthorID: state.userInfo.authorID,
	}));
	const [discussion, setDiscussion] = useState<DiscussionDTO>(
		{} as DiscussionDTO
	);
	const navigate = useNavigate();


	const columns: GridColDef[] =
		userAuthorID !== discussion.creator?.authorID
			? [
					{
						field: "avatar",
						headerName: "Avatar",
						width: 80,
						headerAlign: "center",
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
					{
						field: "username",
						headerName: "Username",
						width: 170,
					},
			  ]
			: [
					{
						field: "avatar",
						headerName: "Avatar",
						headerAlign: "center",
						width: 80,
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
					{
						field: "actions",
						type: "actions",
						headerName: "Actions",
						width: 90,
						align: "center",
						cellClassName: "actions",
						getActions: ({ id }) => {
							return [
								<GridActionsCellItem
									icon={
										<Tooltip title="Remove Member" placement="right">
											<CancelRoundedIcon />
										</Tooltip>
									}
									label="Remove"
									onClick={handleRemoveMember(id)}
									color="inherit"
									disabled={
										discussion.members[Number(id)].authorID ===
										discussion.creator.authorID
									}
								/>,
							];
						},
					},
					{
						field: "Admin",
						headerName: "Admin",
						width: 90,
						headerAlign: "center",
						disableColumnMenu: true,
						sortable: false,
						renderCell: (params) => (
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
								height="100%"
							>
								{params.row.authorID === discussion.creator.authorID ? <DoneRoundedIcon />:<CloseRoundedIcon /> }
							</Box>
						),
					},
			  ];

	const handleRemoveMember = (id: GridRowId) => () => {
		const authorID = discussion.members[Number(id.valueOf())].authorID;
		Delete(
			`/discussions/${discussionID}/members/${authorID}`,
			{},
			() => {},
			(err) => console.log(err)
		);
		setRows(rows.filter((row) => row.id !== id));
	};

	const handleRemoveMembers = () =>
		selectedRows.forEach((id) => {
			handleRemoveMember(id)();
		});

	const handleRetrieveMembers = () => {
		setIsLoading(true);
		get(
			`discussions/${discussionID}`,
			(res) => {
				const responseBody = res.data.data;
				const discussion = parseDiscussion(responseBody);
				setDiscussion(discussion);
				setRows(
					discussion.members.map((member, index) => ({
						id: index,
						authorID: member.authorID,
						avatar: member.avatarIconLink,
						name: member.name,
						username: member.username,
					}))
				);
				setIsLoading(false);
			},
			(err) => console.log(err)
		);
	};

	useEffect(() => {
		handleRetrieveMembers();
	}, []);

	const Toolbar = () => {
		return (
			<GridToolbarContainer>
				<Box display="flex" justifyContent="space-between" width="100%">
					<Box
						display={
							userAuthorID === discussion.creator?.authorID ? "flex" : "none"
						}
					>
						<Button
							buttonIcon={<AddRoundedIcon />}
							handleButtonClick={()=>setOpenAddMembersDialog(true)}
							
						>
							Add
						</Button>
						<Button
							buttonIcon={<CancelRoundedIcon />}
							handleButtonClick={handleRemoveMembers}
							disabled={selectedRows.length === 0}
						>
							Remove
						</Button>
						<Button
							buttonIcon={<SyncRoundedIcon />}
							handleButtonClick={handleRetrieveMembers}
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
		<Box width="100%" marginTop={2}>
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
				pageSizeOptions={[10, 25]}
				checkboxSelection={
					userAuthorID === discussion.creator?.authorID ? true : false
				}
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
				disableRowSelectionOnClick={
					userAuthorID === discussion.creator?.authorID ? false : true
				}
				onRowDoubleClick={(rowInfo) =>
					navigate(`/Profile/${rowInfo.row.authorID}`)
				}
				isRowSelectable={(rowInfo) =>
					rowInfo.row.authorID !== discussion.creator.authorID
				}
				loading={isLoading}
			/>
			<AddMembersDialog
				openAddMembersDialog={openAddMembersDialog}
				setOpenAddMembersDialog={setOpenAddMembersDialog}
			/>
		</Box>
	);
};

export default MembersDiscussionPage;
