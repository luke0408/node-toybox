import { tags } from "typia";

/**
 * RFC 2616 §2.2 Basic Rules — type-only model
 * - 목적: 스펙의 "문자 규칙"을 타입 레벨로 구분하여 코드/문서 간 1:1 매핑을 돕는다.
 * - 한계: TypeScript는 정규식·문자셋 제약을 완전 표현하지 못하므로,
 *         일부는 '브랜딩(branded string)'으로 표기하고 런타임 검증에 위임한다.
 */

/* ------------------------------------------------------------------ */
/* Control & whitespace primitives                                     */
/* ------------------------------------------------------------------ */
export type CR = '\r';
export type LF = '\n';
export type SP = ' ';
export type HT = '\t';
export type CRLF = `${CR}${LF}`;

/**
 * LWS (Linear White Space)
 * ABNF: [CRLF] 1*( SP | HT )
 * - 헤더 필드 내에서 줄바꿈 접기/펼치기 용으로 사용되던 공백.
 * - 구현 시: 연속 LWS → 단일 SP로 축약 가능(§4.2),
 *   선행/후행 LWS는 의미에 영향 없이 제거 가능.
 */
export type LWS =
  string &
  tags.MinLength<1> &
  tags.Pattern<`${Rx.LWS}`>;

/* ------------------------------------------------------------------ */
/* Character classes (logical brands; runtime validator로 보완)         */
/* ------------------------------------------------------------------ */

/**
 * OCTET: 8-bit data (0–255)
 * - TS로 범위를 강제할 수 없어 brand만 부여.
 */
export type OCTET = string & tags.Pattern<`${Rx.OCTET_CLASS}`>;

/**
 * CHAR: US-ASCII (octets 0–127)
 */
export type CHAR = string & tags.Pattern<`${Rx.CHAR_CLASS}+`>;

/**
 * CTL: 제어문자 (0–31, 127)
 */
export type CTL = string & tags.Pattern<`${Rx.CTL_CLASS}+`>;

/**
 * DIGIT: '0'–'9'
 */
export type DIGIT =
  | '0' | '1' | '2' | '3' | '4'
  | '5' | '6' | '7' | '8' | '9';

/**
 * HEX: 0–9 / A–F / a–f
 */
export type HEX =
  | DIGIT
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

/**
 * ALPHA: A–Z / a–z (상·하위 포함)
 */
export type UPALPHA = string & tags.Pattern<"[A-Z]">;
export type LOALPHA = string & tags.Pattern<"[a-z]">;
export type ALPHA = UPALPHA | LOALPHA;

/* ------------------------------------------------------------------ */
/* Separators, TEXT, token, quoted forms                               */
/* ------------------------------------------------------------------ */

/**
 * separators
 * ABNF: "(" | ")" | "<" | ">" | "@"
 *     | "," | ";" | ":" | "\" | <"> | "/"
 *     | "[" | "]" | "?" | "="
 *     | "{" | "}" | SP | HT
 */
export type Separator =
  | '(' | ')' | '<' | '>' | '@'
  | ',' | ';' | ':' | '\\' | '"'
  | '/' | '[' | ']' | '?' | '='
  | '{' | '}' | SP | HT;

/**
 * TEXT
 * ABNF: <any OCTET except CTLs, but including LWS>
 * - 제어문자를 제외한 모든 옥텟(헤더 내 LWS 포함).
 */
export type TEXT =
  string &
  tags.MinLength<1> &
  tags.Pattern<`${Rx.TEXT}`>;

/**
 * token
 * ABNF: 1*<any CHAR except CTLs or separators>
 * - 공백/구분자/제어문자 없이 연속된 문자 시퀀스.
 * - 헤더 이름(field-name)·메서드·파라미터 키 등에 사용.
 */
export type Token =
  string &
  tags.MinLength<1> &
  tags.Pattern<`${Rx.TOKEN}`>;

/**
 * quoted-pair
 * ABNF: "\" CHAR
 * - 이스케이프 시퀀스(예: \" \\ \t 등).
 */
export type QuotedPair =
  string &
  tags.Pattern<`${Rx.QUOTED_PAIR}`>;

/**
 * quoted-string
 * ABNF: <"> *(qdtext | quoted-pair) <">
 * - 큰따옴표로 둘러싼 문자열. 내부에 LWS/특수문자 포함 가능(quoted-pair 사용).
 */
export type QuotedString =
  string &
  tags.MinLength<2> &
  tags.Pattern<`${Rx.QUOTED_STRING}`>;

/**
 * comment
 * ABNF: "(" *( ctext | quoted-pair | comment ) ")"
 * - 중첩 가능. 헤더 등에서 주석 용도.
 */
export type Comment =
  string & 
  tags.Pattern<`${Rx.COMMENT_APPROX}`>;

/**
 * RFC 2616 §2.2 Basic Rules — 패턴 캡슐화
 * - 외부 공개: 최종 타입(LWS, TEXT, Token, QuotedString …)
 * - 내부 캡슐화: Rx.* 패턴 조각(정규식 스트링 리터럴 타입)
 * - 주의: namespace 앞에 export 붙이지 않음 → 모듈 외부로 Rx 노출 안 됨
 */
namespace Rx {
  /** OCTET-class: 0x00–0xFF (8-bit) */
  export type OCTET_CLASS = `[\\x00-\\xFF]`;

  /** CHAR-class: 0x00–0x7F (US-ASCII) */
  export type CHAR_CLASS  = `[\\x00-\\x7F]`;

  /** CTL-class : 0x00–0x1F, 0x7F */
  export type CTL_CLASS   = `[\\x00-\\x1F\\x7F]`;

  /** LWS = [CRLF]? 1*( SP / HT ) */
  export type LWS = `(?:${CRLF})?[ ${HT}]+`;

  /* ─── Generic helpers (reusing OCTET) ────────────────────────────── */
  /** 한 글자 OCTET이 "CTL이 아님" */
  export type NON_CTL_OCTET = `(?!${CTL_CLASS})${OCTET_CLASS}`;

  /** TEXT atom = NON_CTL_OCTET | LWS */
  export type TEXT_ATOM = `${NON_CTL_OCTET}|${LWS}`;
  export type TEXT      = `(?:${TEXT_ATOM})+`;

  /** quoted-pair = "\" CHAR (이스케이프 1글자) */
  export type QUOTED_PAIR = `\\\\${CHAR_CLASS}`;

  /* ─── token (1*CHAR − CTL − separators − SP − HT) ──────────────── */
  /** separators + SP/HT (token에서 금지되는 집합) */
  export type FORBIDDEN_TOKEN =
    `(?:${CTL_CLASS}|[()<>@,;:\\\\\\"/\\[\\]?={} ${HT}])`;

  /** token character = (?!금지)OCTET  */
  export type TOKEN_CHAR = `(?!${FORBIDDEN_TOKEN})${OCTET_CLASS}`;
  export type TOKEN      = `${TOKEN_CHAR}+`;

  /* ─── qdtext / quoted-string (따옴표 내부) ─────────────────────── */
  /** qdtext = TEXT − DQUOTE (권장: "\"도 제외) */
  export type FORBIDDEN_QDTEXT = `(?:${CTL_CLASS}|\\\\"|\\\\)`;

  /** qdtext 한 글자 = (?![" or \ or CTL])OCTET  또는 LWS */
  export type QDTEXT_ATOM = `${LWS}|(?!(?:${FORBIDDEN_QDTEXT}))${OCTET_CLASS}`;
  export type QDTEXT      = `(?:${QDTEXT_ATOM})+`;

  /** quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE */
  export type QUOTED_INNER  = `(?:${QDTEXT}|${QUOTED_PAIR})*`;
  export type QUOTED_STRING = `"(?:${QUOTED_INNER})"`;

  /* ─── ctext / comment (주석 내부, 중첩 허용) ───────────────────── */
  /** ctext = TEXT − "(" − ")" − "\"  */
  export type FORBIDDEN_CTEXT = `(?:${CTL_CLASS}|\\(|\\)|\\\\)`;

  /** ctext 한 글자 = (?![( ) \ or CTL])OCTET  또는 LWS */
  export type CTEXT_ATOM = `${LWS}|(?!(?:${FORBIDDEN_CTEXT}))${OCTET_CLASS}`;
  export type CTEXT      = `(?:${CTEXT_ATOM})+`;

 /** comment = "(" *( ctext / quoted-pair / comment ) ")"  (근사) */
  export type NESTED_COMMENT_SHALLOW = `\\((?:[^()\\\\]|${QUOTED_PAIR})*\\)`;
  export type COMMENT_INNER =
    `(?:${CTEXT}|${QUOTED_PAIR}|${NESTED_COMMENT_SHALLOW})*`;
  export type COMMENT_APPROX = `\\((?:${COMMENT_INNER})\\)`;
}
