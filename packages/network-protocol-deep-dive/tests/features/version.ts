import { ok } from 'node:assert';
import typia from 'typia';
import {
  HTTPVersion,
  HTTPVersionTuple,
  KnownHTTPVersion,
  VersionNumber,
} from '../../src/types/version';

// Utility type to compare two types for equality
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/** VersionNumber must be one-or-more digits */
export function test_types_VersionNumber_requires_digit_sequence() {
  const digitPattern = /^[0-9]+$/;
  ok(digitPattern.test('1'));
  ok(digitPattern.test('11'));
  ok(!digitPattern.test('1.1'));
  ok(!digitPattern.test('v1'));
}

/** HTTPVersion must follow HTTP/<major>.<minor> */
export function test_types_HTTPVersion_matches_protocol_pattern() {
  const versionPattern = /^HTTP\/[0-9]+\.[0-9]+$/;
  ok(versionPattern.test('HTTP/1.1'));
  ok(versionPattern.test('HTTP/2.0'));
  ok(!versionPattern.test('HTTP1.1'));
  ok(!versionPattern.test('http/1.1'));
}

/** KnownHTTPVersion union enumerates RFC2616 versions */
export function test_types_KnownHTTPVersion_enumerates_known_versions() {
  type Question = KnownHTTPVersion;
  type Answer = 'HTTP/0.9' | 'HTTP/1.0' | 'HTTP/1.1';
  ok(typia.random<Equal<Question, Answer>>());
}

/** HTTPVersionTuple expresses [major, minor] digit strings */
export function test_types_HTTPVersionTuple_is_pair_of_version_numbers() {
  type Question = HTTPVersionTuple;
  type Answer = readonly [VersionNumber, VersionNumber];
  ok(typia.random<Equal<Question, Answer>>());
}

/** HTTPVersion should accept standard literal */
export function test_types_HTTPVersion_accepts_literal() {
  type Accepts = 'HTTP/1.1' extends HTTPVersion ? true : false;
  ok(typia.random<Equal<Accepts, true>>());
}
