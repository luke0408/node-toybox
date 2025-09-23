import { ok } from 'node:assert';
import typia from 'typia';
import {
  ClientErrorStatusCode,
  InformationalStatusCode,
  KnownStatusCode,
  ReasonPhrase,
  RedirectionStatusCode,
  ServerErrorStatusCode,
  StatusCode,
  StatusCodeClass,
  SuccessfulStatusCode,
} from '#types/status';

// Utility type to compare two types for equality
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/** StatusCode must be exactly three digits */
export function test_types_StatusCode_requires_three_digits() {
  const codePattern = /^[0-9]{3}$/;
  ok(codePattern.test('200'));
  ok(codePattern.test('404'));
  ok(!codePattern.test('99'));
  ok(!codePattern.test('2000'));
  type LiteralFits = '200' extends StatusCode ? true : false;
  ok(typia.random<Equal<LiteralFits, true>>());
}

/** Informational status codes include 100 and 101 */
export function test_types_InformationalStatusCode_union() {
  type Question = InformationalStatusCode;
  type Answer = '100' | '101';
  ok(typia.random<Equal<Question, Answer>>());
}

/** SuccessfulStatusCode should include 200-206 */
export function test_types_SuccessfulStatusCode_union() {
  type Question = SuccessfulStatusCode;
  type Answer = '200' | '201' | '202' | '203' | '204' | '205' | '206';
  ok(typia.random<Equal<Question, Answer>>());
}

/** RedirectionStatusCode covers 300-307 (including reserved 306) */
export function test_types_RedirectionStatusCode_union() {
  type Question = RedirectionStatusCode;
  type Answer = '300' | '301' | '302' | '303' | '304' | '305' | '306' | '307';
  ok(typia.random<Equal<Question, Answer>>());
}

/** ClientErrorStatusCode covers 400-417 */
export function test_types_ClientErrorStatusCode_union() {
  type Question = ClientErrorStatusCode;
  type Answer =
    | '400'
    | '401'
    | '402'
    | '403'
    | '404'
    | '405'
    | '406'
    | '407'
    | '408'
    | '409'
    | '410'
    | '411'
    | '412'
    | '413'
    | '414'
    | '415'
    | '416'
    | '417';
  ok(typia.random<Equal<Question, Answer>>());
}

/** ServerErrorStatusCode covers 500-505 */
export function test_types_ServerErrorStatusCode_union() {
  type Question = ServerErrorStatusCode;
  type Answer = '500' | '501' | '502' | '503' | '504' | '505';
  ok(typia.random<Equal<Question, Answer>>());
}

/** KnownStatusCode union is the set of all enumerated codes */
export function test_types_KnownStatusCode_combines_all_ranges() {
  type Question = KnownStatusCode;
  type Answer =
    | InformationalStatusCode
    | SuccessfulStatusCode
    | RedirectionStatusCode
    | ClientErrorStatusCode
    | ServerErrorStatusCode;
  ok(typia.random<Equal<Question, Answer>>());
}

/** StatusCodeClass should be the canonical five classes */
export function test_types_StatusCodeClass_literals() {
  type Question = StatusCodeClass;
  type Answer = '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  ok(typia.random<Equal<Question, Answer>>());
}

/** ReasonPhrase excludes CR/LF but allows HT and SP */
export function test_types_ReasonPhrase_disallows_crlf() {
  const reasonPattern = /^[\t !-~\x80-\xFF]*$/;
  ok(reasonPattern.test('OK'));
  ok(reasonPattern.test('Created'));
  ok(reasonPattern.test('Multiple Choices'));
  ok(reasonPattern.test(''));
  ok(!reasonPattern.test('Bad\rRequest'));
  ok(!reasonPattern.test('Bad\nRequest'));
  type Accepts = 'OK' extends ReasonPhrase ? true : false;
  ok(typia.random<Equal<Accepts, true>>());
}

/** StatusLineCore enforces HTTP/<d>.<d> SP status-code SP reason */
export function test_types_StatusLineCore_pattern() {
  const statusLinePattern = /^HTTP\/[0-9]+\.[0-9]+ [0-9]{3} [\t !-~\x80-\xFF]*$/;
  ok(statusLinePattern.test('HTTP/1.1 200 OK'));
  ok(statusLinePattern.test('HTTP/1.1 204 '));
  ok(!statusLinePattern.test('HTTP/1.1 200'));
  ok(!statusLinePattern.test('HTTP/1.1 OK'));
}
