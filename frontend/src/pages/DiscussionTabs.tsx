
import {
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import {
	Box,
} from "@mui/material";
import TabMenu from "../components/TabMenu";
import ThreadsDiscussionPage from "../features/Discussions/ThreadsDiscussionPage/ThreadsDiscussionPage";
import tabMenuLabels from "../features/Discussions/tabMenuLabels";
import MembersDiscussionPage from "../features/Discussions/MembersDiscussionPage/MembersDiscussionPage";

const DiscussionTabs = () => {
	const navigate = useNavigate();
	const [searchParams, _] = useSearchParams();
	const type = searchParams.get("type");
	return (
		<Box width="100%" display="flex" flexDirection="column" alignItems="center">
			<TabMenu
				tabLabelArray={tabMenuLabels}
				tabPageArray={[<ThreadsDiscussionPage />, <MembersDiscussionPage />]}
				variant="standard"
				defaultPageIndex={
					type ? tabMenuLabels.findIndex((element) => element === type) : 0
				}
				tabHeaderStyle={{ marginBottom: 0 }}
				handleTabLabelClick={(newTabIndex) =>
					navigate(`?type=${tabMenuLabels[newTabIndex]}`)
				}
			/>
		</Box>
	);
};

export default DiscussionTabs;
