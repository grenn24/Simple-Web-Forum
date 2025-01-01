import axios from "axios";
import { AxiosResponse } from "axios";

const apiClient = axios.create({
	baseURL: "https://simple-web-forum-backend-61723a55a3b5.herokuapp.com",
});

apiClient.interceptors.response.use(
	// status code within 2xx
	function (response) {
		return response;
	},
	// status code outside 2xx
	function (error) {
		console.log(error)
		// check if error is caused by expired jwt token
		const errResponseBody = error.response.data
		if (errResponseBody.error_code === "INVALID_TOKEN") {
			apiClient
				.get("/authentication/refresh-jwt-token", { withCredentials: true })
				.catch((err) => {
					console.log(err);
				});
		} else {
			return Promise.reject(error);
		}
	}
);

export function get(
	url: string,
	handleSuccessResponse: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	apiClient
		.get(url, {
			headers: {
				Accept: "application/json",
			},
			withCredentials: true,
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
	apiClient
		.post(url, requestBody, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
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
	apiClient
		.put(url, requestBody, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
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
	requestBody?: object,
	handleSuccessResponse?: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	apiClient
		.delete(url, {
			data: requestBody,
			headers: {
				Accept: "application/json",
			},
			withCredentials: true,
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
