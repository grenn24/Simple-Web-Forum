import axios from "axios";
import { AxiosResponse } from "axios";

const apiClient = axios.create({
	baseURL: "https://nus-gossips-6a2501962208.herokuapp.com/api",
});

export function get<T>(
	url: string,
	handleSuccessResponse: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void,
	headers?: object
) {
	apiClient
		.get<T>(url, {
			headers: {
				Accept: "application/json",
				...headers,
			},
			withCredentials: true,
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				const responseBody = err.response.data;
				// Make another request with the refreshed jwt tokens
				if (responseBody.error_code === "TOKEN_REFRESHED") {
					get(
						url,
						handleSuccessResponse,
						handleErrorResponse,
						headers
					);
					return;
				}
				handleErrorResponse && handleErrorResponse(err);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server: " + err.request);
			} else {
				// An error occurred while setting up the request
				console.log(
					"Error while setting up request or handling the response: " +
						err.message
				);
			}
		});
	return;
}

export function postJSON<T>(
	url: string,
	requestBody: object,
	handleSuccessResponse?: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	apiClient
		.post<T>(url, requestBody, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				const responseBody = err.response.data;
				// Make another request with the refreshed jwt tokens
				if (responseBody.error_code === "TOKEN_REFRESHED") {
					postJSON(
						url,
						requestBody,
						handleSuccessResponse,
						handleErrorResponse
					);
					return;
				}
				handleErrorResponse && handleErrorResponse(err.response);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log(
					"Error while setting up request or handling the response:" +
						err.message
				);
			}
		});
	return;
}

// For sending over other data types not supported in json (e.g. binary data) in http post requests
export function postFormData<T>(
	url: string,
	formData: FormData,
	handleSuccessResponse?: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	apiClient
		.post<T>(url, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				const responseBody = err.response.data;
				// Make another request with the refreshed jwt tokens
				if (responseBody.error_code === "TOKEN_REFRESHED") {
					postFormData(
						url,
						formData,
						handleSuccessResponse,
						handleErrorResponse
					);
					return;
				}
				handleErrorResponse && handleErrorResponse(err.response);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log(
					"Error while setting up request or handling the response or handling the response:" +
						err.message
				);
			}
		});
	return;
}

export function putJSON<T>(
	url: string,
	requestBody: object,
	handleSuccessResponse?: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	apiClient
		.put<T>(url, requestBody, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				const responseBody = err.response.data;
				// Make another request with the refreshed jwt tokens
				if (responseBody.error_code === "TOKEN_REFRESHED") {
					putJSON(
						url,
						requestBody,
						handleSuccessResponse,
						handleErrorResponse
					);
					return;
				}
				handleErrorResponse && handleErrorResponse(err.response);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log(
					"Error while setting up request or handling the response:" +
						err.message
				);
			}
		});
	return;
}

// For sending over other data types not supported in json (e.g. binary data) in http put requests
export function putFormData<T>(
	url: string,
	formData: FormData,
	handleSuccessResponse?: (res: AxiosResponse<any, any>) => void,
	handleErrorResponse?: (err: any) => void
) {
	apiClient
		.put<T>(url, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		})
		.then(handleSuccessResponse)
		.catch((err) => {
			// Response with http status code outside 2xx
			if (err.response) {
				const responseBody = err.response.data;
				// Make another request with the refreshed jwt tokens
				if (responseBody.error_code === "TOKEN_REFRESHED") {
					putFormData(
						url,
						formData,
						handleSuccessResponse,
						handleErrorResponse
					);
					return;
				}
				handleErrorResponse && handleErrorResponse(err.response);
			} else if (err.request) {
				// Request was made but no response was received
				console.log("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.log(
					"Error while setting up request or handling the response:" +
						err.message
				);
			}
		});
	return;
}

export function Delete(
	url: string,
	requestBody?: object | FormData,
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
				const responseBody = err.response.data;
				// Make another request with the refreshed jwt tokens
				if (responseBody.error_code === "TOKEN_REFRESHED") {
					Delete(
						url,
						requestBody,
						handleSuccessResponse,
						handleErrorResponse
					);
					return;
				}
				handleErrorResponse && handleErrorResponse(err);
			} else if (err.request) {
				// Request was made but no response was received
				console.error("No response from server:" + err.request);
			} else {
				// An error occurred while setting up the request
				console.error(
					"Error while setting up request or handling the response:" +
						err.message
				);
			}
		});
	return;
}

/*
apiClient.interceptors.response.use(
	// status code within 2xx
	(response) => response,
	// status code outside 2xx
	(error) => {
		console.log(error);
		// check if error is caused by expired jwt token
		const errResponseBody = error.response.data;
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
*/