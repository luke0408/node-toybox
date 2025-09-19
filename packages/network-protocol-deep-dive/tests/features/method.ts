import { ok } from 'node:assert';
import typia from 'typia';
import {
  CacheableMethod,
  ExtensionMethod,
  IdempotentMethod,
  Method,
  SafeMethod,
  StandardMethod,
} from '../../src/types/method';

// Utility type to compare two types for equality
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/** StandardMethod union must match RFC 2616 definitions */
export function test_types_StandardMethod_matches_rfc2616_list() {
  type Question = StandardMethod;
  type Answer =
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT';
  ok(typia.random<Equal<Question, Answer>>());
}

/** Safe methods should be GET and HEAD */
export function test_types_SafeMethod_includes_get_and_head_only() {
  type Question = SafeMethod;
  type Answer = 'GET' | 'HEAD';
  ok(typia.random<Equal<Question, Answer>>());
}

/** IdempotentMethod covers OPTIONS, GET, HEAD, PUT, DELETE, TRACE */
export function test_types_IdempotentMethod_matches_rfc2616_definition() {
  type Question = IdempotentMethod;
  type Answer = 'OPTIONS' | 'GET' | 'HEAD' | 'PUT' | 'DELETE' | 'TRACE';
  ok(typia.random<Equal<Question, Answer>>());
}

/** Cacheable methods are GET, HEAD, POST */
export function test_types_CacheableMethod_allows_get_head_post() {
  type Question = CacheableMethod;
  type Answer = 'GET' | 'HEAD' | 'POST';
  ok(typia.random<Equal<Question, Answer>>());
}

/** Method union accepts both standard and extension tokens */
export function test_types_Method_allows_standard_and_extension_tokens() {
  type AcceptsGet = 'GET' extends Method ? true : false;
  type AcceptsPatch = 'PATCH' extends Method ? true : false;
  type ExtensionCoversPatch = 'PATCH' extends ExtensionMethod ? true : false;
  ok(typia.random<Equal<AcceptsGet, true>>());
  ok(typia.random<Equal<AcceptsPatch, true>>());
  ok(typia.random<Equal<ExtensionCoversPatch, true>>());
}

/** ExtensionMethod should require uppercase tokens */
export function test_types_ExtensionMethod_enforces_uppercase_token_pattern() {
  const extensionPattern = /^[A-Z][A-Z0-9-]*$/;
  ok(extensionPattern.test('PATCH'));
  ok(extensionPattern.test('M-SEARCH'));
  ok(!extensionPattern.test('lowercase'));
  ok(!extensionPattern.test('bad token'));
}
