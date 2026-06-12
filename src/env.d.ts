/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare type PagesFunction = (context: { request: Request; env: Record<string, unknown>; params: Record<string, string> }) => Response | Promise<Response>;
