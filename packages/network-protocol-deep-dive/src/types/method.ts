import { tags } from "typia";
import { Token } from "./grammar";

/**
 * RFC 2616 §5.1.1 Method
 * - Method = token
 * - RFC에서는 표준 메서드 집합(§9)을 정의하고, 확장은 대문자 토큰을 권장한다.
 */

/** 표준 HTTP/1.1 메서드 집합 (§9) */
export type StandardMethod =
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "TRACE"
  | "CONNECT";

/**
 * 확장 메서드 = token (일반적으로 대문자 알파벳+숫자)
 * - RFC 2616은 메서드 문법을 token으로 정의하며, 관례상 대문자 사용.
 */
export type ExtensionMethod = Token & tags.Pattern<"^[A-Z][A-Z0-9-]*$">;

/** Method 전체 = 표준 메서드 ∪ 확장 메서드 */
export type Method = StandardMethod | ExtensionMethod;

/**
 * 안전(Safe) 메서드 — 요청 반복이 서버 상태를 변경하지 않음(§9.1.1)
 * - RFC 2616 기준: GET, HEAD
 */
export type SafeMethod = Extract<StandardMethod, "GET" | "HEAD">;

/**
 * 멱등(Idempotent) 메서드 — n회 수행 == 1회 수행의 효과(§9.1.2)
 * - RFC 2616 기준: OPTIONS, GET, HEAD, PUT, DELETE, TRACE
 */
export type IdempotentMethod = Extract<
  StandardMethod,
  "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | "TRACE"
>;

/**
 * 캐시 가능(Cacheable) 메서드 — 응답이 캐시 저장 가능(§9.1.3)
 * - RFC 2616은 GET/HEAD 기본 허용, POST는 명시적 지시 시 허용.
 */
export type CacheableMethod = Extract<StandardMethod, "GET" | "HEAD" | "POST">;
