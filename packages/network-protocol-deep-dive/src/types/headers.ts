import { tags } from "typia";
import { Token } from "./grammar";

/** Header field-name — token */
export type HeaderName = Token;

/**
 * field-value = *( field-content | LWS )
 * - 제어문자를 제외한 TEXT 및 접힌 공백을 허용한다.
 */
export type HeaderValue = string & tags.Pattern<
  "^(?:[\\t !-~\\x80-\\xFF]|(?:\\r\\n)?[ \\t])*$"
>;

/** RFC 2616 §4.5 General Headers */
export type GeneralHeaderName =
  | "Cache-Control"
  | "Connection"
  | "Date"
  | "Pragma"
  | "Trailer"
  | "Transfer-Encoding"
  | "Upgrade"
  | "Via"
  | "Warning";

/** RFC 2616 §5.3 Request Headers */
export type RequestHeaderName =
  | "Accept"
  | "Accept-Charset"
  | "Accept-Encoding"
  | "Accept-Language"
  | "Authorization"
  | "Expect"
  | "From"
  | "Host"
  | "If-Match"
  | "If-Modified-Since"
  | "If-None-Match"
  | "If-Range"
  | "If-Unmodified-Since"
  | "Max-Forwards"
  | "Proxy-Authorization"
  | "Range"
  | "Referer"
  | "TE"
  | "User-Agent";

/** RFC 2616 §6.2 Response Headers */
export type ResponseHeaderName =
  | "Accept-Ranges"
  | "Age"
  | "ETag"
  | "Location"
  | "Proxy-Authenticate"
  | "Retry-After"
  | "Server"
  | "Vary"
  | "WWW-Authenticate";

/** RFC 2616 §7.1 Entity Headers */
export type EntityHeaderName =
  | "Allow"
  | "Content-Encoding"
  | "Content-Language"
  | "Content-Length"
  | "Content-Location"
  | "Content-MD5"
  | "Content-Range"
  | "Content-Type"
  | "Expires"
  | "Last-Modified";

export type KnownHeaderName =
  | GeneralHeaderName
  | RequestHeaderName
  | ResponseHeaderName
  | EntityHeaderName;

/** Hop-by-hop 헤더 (§13.5.1) */
export type HopByHopHeaderName =
  | "Connection"
  | "Keep-Alive"
  | "Proxy-Authenticate"
  | "Proxy-Authorization"
  | "TE"
  | "Trailer"
  | "Transfer-Encoding"
  | "Upgrade";

/** End-to-End 헤더 = 전체 알려진 헤더 − hop-by-hop */
export type EndToEndHeaderName = Exclude<KnownHeaderName, HopByHopHeaderName>;

/** [field-name, field-value] 튜플 */
export type HeaderTuple<Name extends HeaderName = HeaderName> = readonly [
  Name,
  HeaderValue,
];
