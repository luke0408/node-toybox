import { ok } from 'node:assert';
import typia from 'typia';
import {
  CRLF,
  DIGIT,
  HEX,
  Separator,
  SP,
  HT,
  Token,
  QuotedString,
} from '../../src/types/grammar';

// Utility type to compare two types for equality
// `true` if types are identical, otherwise `false`
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/**
 * Ensures CRLF represents a carriage-return followed by line-feed
 */
export function test_types_CRLF_represents_carriage_return_line_feed() {
  type Question = CRLF;
  type Answer = '\r\n';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Ensures DIGIT covers numeric characters 0 through 9
 */
export function test_types_DIGIT_covers_0_through_9() {
  type Question = DIGIT;
  type Answer =
    | '0' | '1' | '2' | '3' | '4'
    | '5' | '6' | '7' | '8' | '9';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Ensures HEX includes both upper and lower case hexadecimal characters
 */
export function test_types_HEX_includes_upper_and_lowercase() {
  type Question = HEX;
  type Answer =
    | DIGIT
    | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
    | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Ensures Separator union matches RFC 2616 definition
 */
export function test_types_Separator_matches_rfc_definition() {
  type Question = Separator;
  type Answer =
    | '(' | ')' | '<' | '>' | '@'
    | ',' | ';' | ':' | '\\' | '"'
    | '/' | '[' | ']' | '?' | '='
    | '{' | '}' | SP | HT;
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Valid Token should not contain separators or whitespace
 */
export function test_types_Token_rejects_whitespace_and_separators() {
  ok(typia.is<Token>('token123'));
  ok(!typia.is<Token>('bad token'));
  ok(!typia.is<Token>('bad,token'));
}

/**
 * QuotedString must be wrapped with double quotes
 */
export function test_types_QuotedString_requires_double_quotes() {
  ok(typia.is<QuotedString>('"hello"'));
  ok(!typia.is<QuotedString>('hello'));
}
