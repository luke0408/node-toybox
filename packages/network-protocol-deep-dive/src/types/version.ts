import { tags } from "typia";

/**
 * RFC 2616 §3.1 HTTP-Version
 * - HTTP-Version = "HTTP" "/" 1*DIGIT "." 1*DIGIT
 */

/** 1*DIGIT 시퀀스(major/minor 버전 숫자 표현) */
export type VersionNumber = string & tags.Pattern<"^[0-9]+$">;

/** HTTP-Version 토큰 */
export type HTTPVersion = string & tags.Pattern<"^HTTP/[0-9]+\\.[0-9]+$">;

/** tuple 표현: [major, minor] */
export type HTTPVersionTuple = readonly [major: VersionNumber, minor: VersionNumber];

/** RFC 2616에서 명시된 버전 */
export type KnownHTTPVersion = "HTTP/0.9" | "HTTP/1.0" | "HTTP/1.1";
