import { tags } from "typia";

/* -------------------------- *
 * RFC 2616 §3.1 HTTP Version *
 * -------------------------- */
 
/** HTTP-Version = "HTTP" "/" 1*DIGIT "." 1*DIGIT */
export type HttpVersion = string & tags.Pattern<`HTTP\\/\\d+\\.\\d+`>;

/* ------------------------------------------------ *
 * RFC 2616 §3.2 Uniform Resource Identifiers (URI) *
 * ------------------------------------------------ */
 
/** {@link https://github.com/samchon/typia/blob/master/src/internal/_isFormatUrl.ts} */
export type URL = string & tags.Format<"uri">;
/** {@link https://github.com/samchon/typia/blob/master/src/internal/_isFormatUri.ts} */
export type URI = string & tags.Format<"url">;
