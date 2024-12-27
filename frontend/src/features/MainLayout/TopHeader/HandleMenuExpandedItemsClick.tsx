import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default () => {
	const navigate = useNavigate();
	return [
		(event: React.MouseEvent<HTMLElement>) =>
			event.currentTarget.dataset.value &&
			navigate(event.currentTarget.dataset.value),
		(event: React.MouseEvent<HTMLElement>) =>
			event.currentTarget.dataset.value &&
			navigate(event.currentTarget.dataset.value),
		(event: React.MouseEvent<HTMLElement>) => {
			console.log("hi")
			Cookies.remove("authorID");
			event.currentTarget.dataset.value &&
				navigate(event.currentTarget.dataset.value);
		},
	];
};
