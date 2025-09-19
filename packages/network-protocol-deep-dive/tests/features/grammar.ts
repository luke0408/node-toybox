import { ok } from 'node:assert';
import typia from 'typia';
import {
  ALPHA,
  CHAR,
  Comment,
  CR,
  CRLF,
  CTL,
  DIGIT,
  HEX,
  HT,
  LF,
  LWS,
  LOALPHA,
  OCTET,
  QuotedPair,
  QuotedString,
  Separator,
  SP,
  TEXT,
  Token,
  UPALPHA,
} from '../../src/types/grammar';

// Utility type to compare two types for equality
// `true` if types are identical, otherwise `false`
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/**
 * Ensures CR represents a carriage-return character
 */
export function test_types_CR_represents_carriage_return_character() {
  type Question = CR;
  type Answer = '\r';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Ensures LF represents a line-feed character
 */
export function test_types_LF_represents_line_feed_character() {
  type Question = LF;
  type Answer = '\n';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Ensures SP represents a single space character
 */
export function test_types_SP_represents_space_character() {
  type Question = SP;
  type Answer = ' ';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Ensures HT represents a horizontal tab character
 */
export function test_types_HT_represents_horizontal_tab_character() {
  type Question = HT;
  type Answer = '\t';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * Ensures CRLF represents a carriage-return followed by line-feed
 */
export function test_types_CRLF_represents_carriage_return_line_feed() {
  type Question = CRLF;
  type Answer = '\r\n';
  ok(typia.random<Equal<Question, Answer>>());
}

/**
 * LWS must contain optional CRLF followed by one-or-more SP/HT
 */
export function test_types_LWS_allows_optional_crlf_and_whitespace() {
  const lwsPattern = /^(?:\r\n)?[ \t]+$/;
  ok(lwsPattern.test('  '));
  ok(lwsPattern.test(' \t'));
  ok(lwsPattern.test('\r\n\t'));
  ok(!lwsPattern.test('a'));
  ok(!lwsPattern.test('\n '));
}

/**
 * OCTET accepts any single 8-bit value
 */
export function test_types_OCTET_accepts_any_single_byte_value() {
  const octetPattern = /^[\x00-\xFF]$/;
  ok(octetPattern.test('A'));
  ok(octetPattern.test('\u0000'));
  ok(!octetPattern.test('Ā'));
  ok(!octetPattern.test('AB'));
}

/**
 * CHAR restricts values to US-ASCII (octets 0–127)
 */
export function test_types_CHAR_is_limited_to_us_ascii_range() {
  const charPattern = /^[\x00-\x7F]+$/;
  ok(charPattern.test('~'));
  ok(charPattern.test('A'));
  ok(!charPattern.test('Ā'));
  ok(!charPattern.test('𝌆'));
}

/**
 * CTL matches ASCII control characters only
 */
export function test_types_CTL_matches_control_characters_only() {
  const ctlPattern = /^[\x00-\x1F\x7F]+$/;
  ok(ctlPattern.test('\u0000'));
  ok(ctlPattern.test('\u001f'));
  ok(!ctlPattern.test(' '));
  ok(!ctlPattern.test('A'));
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
 * UPALPHA accepts exactly one uppercase letter
 */
export function test_types_UPALPHA_requires_single_uppercase_letter() {
  const uppercasePattern = /^[A-Z]$/;
  ok(uppercasePattern.test('A'));
  ok(!uppercasePattern.test('a'));
  ok(!uppercasePattern.test('AA'));
}

/**
 * LOALPHA accepts exactly one lowercase letter
 */
export function test_types_LOALPHA_requires_single_lowercase_letter() {
  const lowercasePattern = /^[a-z]$/;
  ok(lowercasePattern.test('a'));
  ok(!lowercasePattern.test('A'));
  ok(!lowercasePattern.test('aa'));
}

/**
 * ALPHA is satisfied by either uppercase or lowercase alphabetic characters
 */
export function test_types_ALPHA_accepts_uppercase_and_lowercase_letters() {
  const alphaPattern = /^[A-Za-z]$/;
  ok(alphaPattern.test('A'));
  ok(alphaPattern.test('z'));
  ok(!alphaPattern.test('1'));
  ok(!alphaPattern.test('aa'));
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
 * TEXT must not include control characters
 */
export function test_types_TEXT_excludes_control_characters() {
  const textPattern = /^(?:[\x20-\x7E\x80-\xFF]|(?:\r\n)?[ \t])+$/;
  ok(textPattern.test('Header value 123'));
  ok(textPattern.test('Folded header\r\n value'));
  ok(!textPattern.test('Bad\u0007value'));
}

/**
 * Valid Token should not contain separators or whitespace
 */
export function test_types_Token_rejects_whitespace_and_separators() {
  const tokenPattern = /^(?:[!#$%&'*+\-.^_`|~0-9A-Za-z])+$/;
  ok(tokenPattern.test('token123'));
  ok(!tokenPattern.test('bad token'));
  ok(!tokenPattern.test('bad,token'));
}

/**
 * QuotedPair must consist of a backslash followed by any CHAR
 */
export function test_types_QuotedPair_requires_backslash_followed_by_char() {
  const quotedPairPattern = /^\\[\x00-\x7F]$/;
  ok(quotedPairPattern.test('\\n'));
  ok(quotedPairPattern.test('\\"'));
  ok(!quotedPairPattern.test('n'));
  ok(!quotedPairPattern.test('\\'));
}

/**
 * QuotedString must be wrapped with double quotes
 */
export function test_types_QuotedString_requires_double_quotes() {
  const quotedStringPattern = /^"(?:[\t !#-\[\]-~\x80-\xFF]|\\[\x00-\x7F])*"$/;
  ok(quotedStringPattern.test('"hello"'));
  ok(!quotedStringPattern.test('hello'));
}

/**
 * Comment allows nested structures and quoted-pair content
 */
export function test_types_Comment_supports_nested_and_escaped_content() {
  const commentPattern = /^\((?:[\t !#-\[\]-~\x80-\xFF]|\\[\x00-\x7F]|\([^()\\]*\))*\)$/;
  ok(commentPattern.test('(simple comment)'));
  ok(commentPattern.test('(outer (inner) comment)'));
  ok(commentPattern.test("(with \\\"quoted\\\" text)"));
  ok(!commentPattern.test('('));
  ok(!commentPattern.test('not a comment'));
}
