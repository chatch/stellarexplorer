import { ActionFunctionArgs as RemixActionFunctionArgs, LoaderFunctionArgs as RemixLoaderFunctionArgs } from "@remix-run/node";

/**
 * A Response helper to mimic `json` from @remix-run/node but compatible with the browser.
 */
export function json<Data>(data: Data, init: number | ResponseInit = {}) {
    let responseInit: ResponseInit = {};

    if (typeof init === "number") {
        responseInit = { status: init };
    } else {
        responseInit = init;
    }

    let headers = new Headers(responseInit.headers);
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
    }

    return new Response(JSON.stringify(data), {
        ...responseInit,
        headers,
    });
}

/**
 * A Response helper to mimic `redirect` from @remix-run/node but compatible with the browser.
 */
export function redirect(url: string, init: number | ResponseInit = 302) {
    let responseInit: ResponseInit = {};

    if (typeof init === "number") {
        responseInit = { status: init };
    } else {
        responseInit = init;
    }

    let headers = new Headers(responseInit.headers);
    headers.set("Location", url);

    return new Response(null, {
        ...responseInit,
        headers,
    });
}

export type LoaderFunctionArgs = {
    request: Request;
    params: import("@remix-run/react").Params;
};

export type ActionFunctionArgs = {
    request: Request;
    params: import("@remix-run/react").Params;
}

export interface TypedResponse<T = unknown> extends Response {
    json(): Promise<T>;
}

export type MetaFunction = import('@remix-run/react').MetaFunction
