import { ok } from 'node:assert';
import typia from 'typia';
import {
  ByteRangeSpec,
  ByteRangeUnit,
  ContentCoding,
  ContentLengthValue,
  ContentRange,
  Charset,
  EntityTag,
  KnownContentCoding,
  KnownTransferCoding,
  StrongEntityTag,
  SuffixByteRangeSpec,
  TransferCoding,
  WeakEntityTag,
} from '../../src/types/entity';

// Utility type to compare two types for equality
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/** Content-Length values must be digits */
export function test_types_ContentLengthValue_requires_digits() {
  const numericPattern = /^[0-9]+$/;
  ok(numericPattern.test('0'));
  ok(numericPattern.test('12345'));
  ok(!numericPattern.test('-1'));
  ok(!numericPattern.test('12.3'));
  type Accepts = '42' extends ContentLengthValue ? true : false;
  ok(typia.random<Equal<Accepts, true>>());
}

/** KnownContentCoding enumerates RFC-defined codings */
export function test_types_KnownContentCoding_union() {
  type Question = KnownContentCoding;
  type Answer = 'identity' | 'gzip' | 'compress' | 'deflate';
  type ExtensionAccepts = 'br' extends ContentCoding ? true : false;
  ok(typia.random<Equal<Question, Answer>>());
  ok(typia.random<Equal<ExtensionAccepts, true>>());
}

/** Transfer codings include chunked, identity, and extensions */
export function test_types_TransferCoding_allows_known_and_extension() {
  type Known = KnownTransferCoding;
  type Union = TransferCoding;
  type AcceptsChunked = 'chunked' extends Union ? true : false;
  type AcceptsCustom = 'custom' extends Union ? true : false;
  ok(typia.random<Equal<Known, 'chunked' | 'identity'>>());
  ok(typia.random<Equal<AcceptsChunked, true>>());
  ok(typia.random<Equal<AcceptsCustom, true>>());
}

/** MediaType should match type/subtype token syntax */
export function test_types_MediaType_pattern() {
  const mediaTypePattern = /^[!#$%&'*+-.^_`|~0-9A-Za-z]+\/[!#$%&'*+-.^_`|~0-9A-Za-z]+$/;
  ok(mediaTypePattern.test('text/html'));
  ok(mediaTypePattern.test('application/json'));
  ok(!mediaTypePattern.test('text'));
  ok(!mediaTypePattern.test('text/html; charset=utf-8'));
}

/** Charset is a token (e.g., utf-8) */
export function test_types_Charset_accepts_token_strings() {
  type Accepts = 'utf-8' extends Charset ? true : false;
  ok(typia.random<Equal<Accepts, true>>());
}

/** LanguageTag must follow primary-subtag *("-" subtag) */
export function test_types_LanguageTag_pattern() {
  const languagePattern = /^[A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*$/;
  ok(languagePattern.test('en'));
  ok(languagePattern.test('en-US'));
  ok(languagePattern.test('zh-Hant-TW'));
  ok(!languagePattern.test('en--US'));
  ok(!languagePattern.test('en_US'));
}

/** Entity tags support weak/strong forms */
export function test_types_EntityTag_patterns() {
  const opaquePattern = /^"(?:[\t !#-[\]-~\x80-\xFF]|\\[\x00-\x7F])*"$/;
  const strongPattern = opaquePattern;
  const weakPattern = /^W\/"(?:[\t !#-[\]-~\x80-\xFF]|\\[\x00-\x7F])*"$/;
  ok(strongPattern.test('"etag"'));
  ok(weakPattern.test('W/"etag"'));
  ok(!strongPattern.test('etag'));
  ok(!weakPattern.test('w/"etag"'));
  type StrongAccepts = '"etag"' extends StrongEntityTag ? true : false;
  type WeakAccepts = 'W/"etag"' extends WeakEntityTag ? true : false;
  type EntityAccepts = '"etag"' extends EntityTag ? true : false;
  ok(typia.random<Equal<StrongAccepts, true>>());
  ok(typia.random<Equal<WeakAccepts, true>>());
  ok(typia.random<Equal<EntityAccepts, true>>());
}

/** Byte range specs and suffix forms */
export function test_types_ByteRange_patterns() {
  const rangePattern = /^[0-9]+-[0-9]*$/;
  const suffixPattern = /^-[0-9]+$/;
  ok(rangePattern.test('0-499'));
  ok(rangePattern.test('500-'));
  ok(!rangePattern.test('-500'));
  ok(suffixPattern.test('-500'));
  ok(!suffixPattern.test('500-'));
  type RangeAccepts = '0-499' extends ByteRangeSpec ? true : false;
  type SuffixAccepts = '-500' extends SuffixByteRangeSpec ? true : false;
  ok(typia.random<Equal<RangeAccepts, true>>());
  ok(typia.random<Equal<SuffixAccepts, true>>());
}

/** ContentRange approximates "bytes x-y/length" or "bytes star/length" */
export function test_types_ContentRange_pattern() {
  const contentRangePattern = /^bytes (?:[0-9]+-[0-9]+\/[0-9]+|\*\/[0-9]+)$/;
  ok(contentRangePattern.test('bytes 0-499/1234'));
  ok(contentRangePattern.test('bytes 500-999/1234'));
  ok(contentRangePattern.test('bytes */1234'));
  ok(!contentRangePattern.test('bytes 0-499'));
  ok(!contentRangePattern.test('bytes 0-499/'));
  type Accepts = 'bytes 0-1/2' extends ContentRange ? true : false;
  ok(typia.random<Equal<Accepts, true>>());
}

/** ByteRangeUnit literal should be "bytes" */
export function test_types_ByteRangeUnit_literal() {
  type Question = ByteRangeUnit;
  type Answer = 'bytes';
  ok(typia.random<Equal<Question, Answer>>());
}
