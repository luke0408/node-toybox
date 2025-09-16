import { tags } from "typia";

/**
 * RFC 2616은 URI 문법을 RFC 2396에 위임.
 * 이 파일은 HTTP/1.1에서 실제로 사용되는 Request-URI 형태를 실용 근사로 강제한다.
 */
namespace Rx {
  // scheme ":" ...
  export type ABS_URI = `[A-Za-z][A-Za-z0-9+.-]*:.+`;

  // abs_path  ("/" 로 시작, 공백/제어/공유 금지문자 대략 배제)
  export type ABS_PATH = `\\/(?:[^\\s?#]*)`;

  // authority (호스트[:포트]) — 실용 근사: FQDN 또는 IPv4
  export type HOST_LABEL = `[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?`;
  export type FQDN = `${HOST_LABEL}(?:\\.${HOST_LABEL})*`;
  export type IPV4 = `(?:\\d{1,3}\\.){3}\\d{1,3}`;
  export type PORT = `\\d{1,5}`;
  export type AUTHORITY = `(?:${FQDN}|${IPV4})(?::${PORT})?`;

  // Request-URI = "*" | absoluteURI | abs_path | authority(주로 CONNECT)
  export type STAR = `\\*`;
  export type REQUEST_URI = `(?:${STAR}|${ABS_URI}|${ABS_PATH}|${AUTHORITY})`;
}

export type AbsoluteURI =
  string & tags.Pattern<`${Rx.ABS_URI}$`>;

export type AbsolutePath =
  string & tags.Pattern<`${Rx.ABS_PATH}$`>;

export type Authority =
  string & tags.Pattern<`${Rx.AUTHORITY}$`>;

export type RequestURI =
  string & tags.Pattern<`${Rx.REQUEST_URI}$`>;
