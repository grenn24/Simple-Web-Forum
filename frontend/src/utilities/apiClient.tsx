import axios from "axios";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export function get(
	url: string,
	handleSuccessResponse: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	axios
		.get(url, {
			headers: {
				Authorization:
					"Bearer " + (Cookies.get("jwtToken") ? Cookies.get("jwtToken") : ""),
				Accept: "application/json",
			},
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				handleErrorResponse && handleErrorResponse(err);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log("Error while setting up request:" + err.message);
			}
		});
	return;
}

export function postJSON(
	url: string,
	requestBody: object,
	handleSuccessResponse?: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	axios
		.post(url, requestBody, {
			headers: {
				Authorization:
					"Bearer " + (Cookies.get("jwtToken") ? Cookies.get("jwtToken") : ""),
				"Content-Type": "application/json",
			},
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				handleErrorResponse && handleErrorResponse(err.response);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log("Error while setting up request:" + err.message);
			}
		});
	return;
}

export function putJSON(
	url: string,
	requestBody: object,
	handleSuccessResponse?: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	axios
		.post(url, requestBody, {
			headers: {
				Authorization:
					"Bearer " + (Cookies.get("jwtToken") ? Cookies.get("jwtToken") : ""),
				"Content-Type": "application/json",
			},
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				handleErrorResponse && handleErrorResponse(err.response);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log("Error while setting up request:" + err.message);
			}
		});
	return;
}

export function Delete(
	url: string,
	handleSuccessResponse: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	axios
		.get(url, {
			headers: {
				Authorization:
					"Bearer " + (Cookies.get("jwtToken") ? Cookies.get("jwtToken") : ""),
				Accept: "application/json",
			},
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				handleErrorResponse && handleErrorResponse(err);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log("Error while setting up request:" + err.message);
			}
		});
	return;
}
