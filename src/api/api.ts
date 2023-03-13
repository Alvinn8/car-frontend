import { getAuthKey } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE;

/**
 * Check whether the app is running in dev mode which
 * determines if dev api requests should be sent.
 * 
 * @returns Whether dev mode is on.
 */
function getIsDev() {
    const url = new URL(location.href);
    return url.searchParams.get("dev") == "true";
}

/**
 * Whether to send dev api requests.
 */
const isDev = getIsDev();

/**
 * An error thrown when an API request fails.
 */
export class ApiError extends Error {
    /**
     * The raw HTTP response from the server.
     */
    public readonly response: Response;
    /**
     * The status code of the HTTP response.
     */
    public readonly statusCode: number;

    public constructor(response: Response, message: string) {
        super(message);
        this.response = response;
        this.statusCode = response.status;
    }
}

async function apiRequest(endpoint: string, options?: RequestInit): Promise<any> {
    const url = new URL(BASE_URL + endpoint);
    if (isDev) {
        url.searchParams.set("dev", "true");
    }
    if (!options) options = {};
    if (!options.headers) options.headers = {};
    options.headers = {
        ...options.headers,
        "pragma": "no-cache",
        "cache-control": "no-cache",
        "Authorization": "Bearer " + getAuthKey()
    };
    const response = await fetch(url.href, options);
    if (response.type == "error") {
        throw new ApiError(response, "Failed to communicate with the API.");
    }
    if (response.status == 400) {
        throw new ApiError(response, "Bad Request: " + await response.text());
    }
    if (response.status == 401) {
        throw new ApiError(response, "Invalid authentication.");
    }
    if (response.status == 500) {
        throw new ApiError(response, "Failed to execute request (HTTP 500). The car is probably not present.");
    }
    if (!response.ok) {
        throw new ApiError(response, "Unexpected status code " + response.status);
    }

    if (response.headers.get("Content-Type") == "application/json"
        || endpoint == "status") { // status returns text/html even though it is json
        return await response.json();
    } else {
        return await response.text();
    }
}

/**
 * Send a GET request to the API.
 * 
 * If the HTTP response has a content type of json, the function
 * returns json, if not, a string is returned.
 * 
 * @param endpoint The api endpoint to contact.
 * @returns JSON or a string.
 */
export async function apiGet(endpoint: string): Promise<any> {
    return await apiRequest(endpoint);
}

export async function apiPost(endpoint: string, body: any): Promise<any> {
    return await apiRequest(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}

export async function apiDelete(endpoint: string) {
    return await apiRequest(endpoint, {
        method: "DELETE"
    });
}

export namespace ApiResponse {
    export type AcMode = "cooling" | "heating" | "windscreen";
    export type Status = {
        status: {
            client: string;
            acMinutes: number;
            acMode: AcMode;
            acOn: boolean;
            batteryLevel: number;
            bonnetOpen: boolean;
            bootOpen: boolean;
            /**
             * Minutes until full charge.
             */
            chargeTimeRemaining: number;
            charging: boolean;
            driverDoorOpen: boolean;
            frontDoorOpen: boolean;
            headLightsOn: boolean;
            locked: boolean;
            numberOfRegisteredClients: number;
            parkingLightsOn: boolean;
            rearLeftDoorOpen: boolean;
            rearRightDoorOpen: boolean;
            vin: string;
        };
        /**
         * An object that maps the register id to the bytes (as
         * hex, separated by spaces).
         */
        registers: {
            [register: string]: string
        };
        settings: {
            sendIdleDisconnectSeconds: number;
            taskRetryCount: number;
            version19: boolean;
            wireLog: boolean;
            wireLogPing: boolean;
        };
    };
    export type LightType = "head" | "parking";
    export type Task = {
        id: number;
        executionTime: string; //ex. "2022-11-27 00:28"
        retries: number;
        lights: null | {
            type: LightType;
            on: boolean;
        };
        ac: null | {
            type: AcMode;
            on: boolean;
            minutes: number;
        };
    };
    export type Tasks = Task[];
}