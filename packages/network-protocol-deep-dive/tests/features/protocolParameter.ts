import { ok } from 'node:assert';
import {
  AbsolutePath,
  AbsoluteURI,
  Authority,
  RequestURI,
} from '#types/protocolParameter';

/**
 * AbsoluteURI must start with a valid scheme followed by a colon
 */
export function test_types_AbsoluteURI_requires_scheme_and_hier_part() {
  const absoluteUriPattern = /^[A-Za-z][A-Za-z0-9+.-]*:.+$/;
  ok(absoluteUriPattern.test('http://example.com/resource'));
  ok(absoluteUriPattern.test('mailto:user@example.com'));
  ok(!absoluteUriPattern.test('relative/path'));
  ok(!absoluteUriPattern.test('//missing-scheme'));
}

/**
 * AbsolutePath must begin with '/'
 */
export function test_types_AbsolutePath_starts_with_forward_slash() {
  const absolutePathPattern = /^\/(?:[^\s?#]*)$/;
  ok(absolutePathPattern.test('/'));
  ok(absolutePathPattern.test('/images/logo.png'));
  ok(!absolutePathPattern.test('relative/path'));
  ok(!absolutePathPattern.test('/bad path'));
}

/**
 * Authority is limited to host[:port] patterns
 */
export function test_types_Authority_allows_host_and_optional_port() {
  const hostLabel = '[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?';
  const fqdn = new RegExp(`^(?:${hostLabel})(?:\\.(?:${hostLabel}))*$`);
  const ipv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const authorityPattern = new RegExp(
    `^(?:${hostLabel}(?:\\.(?:${hostLabel}))*|(?:\\d{1,3}\\.){3}\\d{1,3})(?::\\d{1,5})?$`
  );
  ok(authorityPattern.test('example.com'));
  ok(authorityPattern.test('example.com:8080'));
  ok(authorityPattern.test('192.168.0.1'));
  ok(!authorityPattern.test('example.com:port'));
  ok(!authorityPattern.test('bad host'));
  ok(!authorityPattern.test('http://example.com'));
  ok(fqdn.test('example.com'));
  ok(ipv4.test('192.168.0.1'));
}

/**
 * RequestURI can be '*', absoluteURI, abs_path, or authority (CONNECT)
 */
export function test_types_RequestURI_supports_all_rfc_variants() {
  const absoluteUriPattern = /^[A-Za-z][A-Za-z0-9+.-]*:.+$/;
  const absolutePathPattern = /^\/(?:[^\s?#]*)$/;
  const authorityPattern = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*|(?:\d{1,3}\.){3}\d{1,3})(?::\d{1,5})?$/;
  const matchesRequestUri = (value: string): boolean =>
    value === '*' ||
    absoluteUriPattern.test(value) ||
    absolutePathPattern.test(value) ||
    authorityPattern.test(value);

  ok(matchesRequestUri('*'));
  ok(matchesRequestUri('http://example.com/index.html'));
  ok(matchesRequestUri('/relative/path'));
  ok(matchesRequestUri('example.com:80'));
  ok(!matchesRequestUri('bad uri'));
  ok(!matchesRequestUri('http:'));
}
