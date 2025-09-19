import { ok } from 'node:assert';
import typia from 'typia';
import {
  EndToEndHeaderName,
  GeneralHeaderName,
  HeaderTuple,
  HeaderValue,
  HopByHopHeaderName,
  KnownHeaderName,
  RequestHeaderName,
  ResponseHeaderName,
  EntityHeaderName,
} from '../../src/types/headers';

// Utility type to compare two types for equality
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/** GeneralHeaderName union should follow RFC 2616 §4.5 */
export function test_types_GeneralHeaderName_union() {
  type Question = GeneralHeaderName;
  type Answer =
    | 'Cache-Control'
    | 'Connection'
    | 'Date'
    | 'Pragma'
    | 'Trailer'
    | 'Transfer-Encoding'
    | 'Upgrade'
    | 'Via'
    | 'Warning';
  ok(typia.random<Equal<Question, Answer>>());
}

/** RequestHeaderName union should match RFC 2616 §5.3 */
export function test_types_RequestHeaderName_union() {
  type Question = RequestHeaderName;
  type Answer =
    | 'Accept'
    | 'Accept-Charset'
    | 'Accept-Encoding'
    | 'Accept-Language'
    | 'Authorization'
    | 'Expect'
    | 'From'
    | 'Host'
    | 'If-Match'
    | 'If-Modified-Since'
    | 'If-None-Match'
    | 'If-Range'
    | 'If-Unmodified-Since'
    | 'Max-Forwards'
    | 'Proxy-Authorization'
    | 'Range'
    | 'Referer'
    | 'TE'
    | 'User-Agent';
  ok(typia.random<Equal<Question, Answer>>());
}

/** ResponseHeaderName union should match RFC 2616 §6.2 */
export function test_types_ResponseHeaderName_union() {
  type Question = ResponseHeaderName;
  type Answer =
    | 'Accept-Ranges'
    | 'Age'
    | 'ETag'
    | 'Location'
    | 'Proxy-Authenticate'
    | 'Retry-After'
    | 'Server'
    | 'Vary'
    | 'WWW-Authenticate';
  ok(typia.random<Equal<Question, Answer>>());
}

/** EntityHeaderName union should match RFC 2616 §7.1 */
export function test_types_EntityHeaderName_union() {
  type Question = EntityHeaderName;
  type Answer =
    | 'Allow'
    | 'Content-Encoding'
    | 'Content-Language'
    | 'Content-Length'
    | 'Content-Location'
    | 'Content-MD5'
    | 'Content-Range'
    | 'Content-Type'
    | 'Expires'
    | 'Last-Modified';
  ok(typia.random<Equal<Question, Answer>>());
}

/** KnownHeaderName union collects all header groups */
export function test_types_KnownHeaderName_union() {
  type Question = KnownHeaderName;
  type Answer =
    | GeneralHeaderName
    | RequestHeaderName
    | ResponseHeaderName
    | EntityHeaderName;
  ok(typia.random<Equal<Question, Answer>>());
}

/** HopByHopHeaderName enumerates headers removed by proxies (§13.5.1) */
export function test_types_HopByHopHeaderName_union() {
  type Question = HopByHopHeaderName;
  type Answer =
    | 'Connection'
    | 'Keep-Alive'
    | 'Proxy-Authenticate'
    | 'Proxy-Authorization'
    | 'TE'
    | 'Trailer'
    | 'Transfer-Encoding'
    | 'Upgrade';
  ok(typia.random<Equal<Question, Answer>>());
}

/** EndToEndHeaderName excludes hop-by-hop headers */
export function test_types_EndToEndHeaderName_excludes_hop_by_hop() {
  type Question = EndToEndHeaderName;
  type Forbidden = HopByHopHeaderName;
  type Known = KnownHeaderName;
  type Answer = Exclude<Known, Forbidden>;
  ok(typia.random<Equal<Question, Answer>>());
}

/** HeaderValue allows TEXT with optional folded whitespace */
export function test_types_HeaderValue_allows_text_and_folding() {
  const valuePattern = /^(?:[\t !-~\x80-\xFF]|(?:\r\n)?[ \t])*$/;
  ok(valuePattern.test('text value'));
  ok(valuePattern.test('folded\r\n value'));
  ok(valuePattern.test(''));
  ok(!valuePattern.test('bad\u0007char'));
}

/** HeaderTuple models [name, value] pairs */
export function test_types_HeaderTuple_pair_shape() {
  type Question = HeaderTuple<'Content-Type'>;
  type Answer = readonly ['Content-Type', HeaderValue];
  ok(typia.random<Equal<Question, Answer>>());
}
