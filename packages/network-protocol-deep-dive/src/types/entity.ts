import { tags } from "typia";
import { Token } from "./grammar";

/** Content-Length 값 — 1*DIGIT */
export type ContentLengthValue = string & tags.Pattern<"^[0-9]+$">;

/** content-coding (RFC 2616 §3.5) */
export type KnownContentCoding = "identity" | "gzip" | "compress" | "deflate";
export type ContentCoding = KnownContentCoding | Token;

/** transfer-coding (RFC 2616 §3.6) */
export type KnownTransferCoding = "chunked" | "identity";
export type TransferCoding = KnownTransferCoding | Token;

/** media-type (RFC 2616 §3.7) */
export type MediaType = string & tags.Pattern<
  "^[!#$%&'*+-.^_`|~0-9A-Za-z]+/[!#$%&'*+-.^_`|~0-9A-Za-z]+$"
>;

/** charset (token) */
export type Charset = Token;

/** language-tag (RFC 2616 §3.10) */
export type LanguageTag = string & tags.Pattern<
  "^[A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*$"
>;

namespace Rx {
  export type OPAQUE_TAG = `"(?:[\\t !#-[\\]-~\\x80-\\xFF]|\\\\[\\x00-\\x7F])*"`;
}

/** entity-tag (RFC 2616 §3.11) */
export type EntityTag = string & tags.Pattern<`^(?:W/)?${Rx.OPAQUE_TAG}$`>;
export type WeakEntityTag = string & tags.Pattern<`^W/${Rx.OPAQUE_TAG}$`>;
export type StrongEntityTag = string & tags.Pattern<`^${Rx.OPAQUE_TAG}$`>;

/** byte-range-set (RFC 2616 §14.35.1) — 간단 근사 */
export type ByteRangeSpec = string & tags.Pattern<"^[0-9]+-[0-9]*$">;
export type SuffixByteRangeSpec = string & tags.Pattern<"^-[0-9]+$">;
export type ByteRangeUnit = "bytes";

/** Content-Range header 값의 단순화된 표현 */
export type ContentRange = string & tags.Pattern<
  "^bytes (?:[0-9]+-[0-9]+/[0-9]+|\*/[0-9]+)$"
>;
