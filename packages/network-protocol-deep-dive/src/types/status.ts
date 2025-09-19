import { tags } from "typia";

/** 3자리 상태코드 */
export type StatusCode = string & tags.Pattern<"^[0-9]{3}$">;

export type InformationalStatusCode = "100" | "101";

export type SuccessfulStatusCode =
  | "200"
  | "201"
  | "202"
  | "203"
  | "204"
  | "205"
  | "206";

export type RedirectionStatusCode =
  | "300"
  | "301"
  | "302"
  | "303"
  | "304"
  | "305"
  | "306"
  | "307";

export type ClientErrorStatusCode =
  | "400"
  | "401"
  | "402"
  | "403"
  | "404"
  | "405"
  | "406"
  | "407"
  | "408"
  | "409"
  | "410"
  | "411"
  | "412"
  | "413"
  | "414"
  | "415"
  | "416"
  | "417";

export type ServerErrorStatusCode =
  | "500"
  | "501"
  | "502"
  | "503"
  | "504"
  | "505";

export type KnownStatusCode =
  | InformationalStatusCode
  | SuccessfulStatusCode
  | RedirectionStatusCode
  | ClientErrorStatusCode
  | ServerErrorStatusCode;

export type StatusCodeClass = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

/** Reason-Phrase = *<TEXT, excluding CR, LF> */
export type ReasonPhrase = string & tags.Pattern<"^[\\t !-~\\x80-\\xFF]*$">;

/**
 * Status-Line (CRLF 제외) 근사 모델
 * - HTTP-Version SP Status-Code SP Reason-Phrase
 */
export type StatusLineCore = string & tags.Pattern<
  "^HTTP/[0-9]+\\.[0-9]+ [0-9]{3} [\\t !-~\\x80-\\xFF]*$"
>;
