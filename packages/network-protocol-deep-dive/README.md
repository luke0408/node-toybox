# Network Protocol Deep Dive

HTTP/1.1(RFC 2616)을 **타입과 테스트**로 모델링하며 프로토콜 내부를 해부하는 학습 리포지토리.

## 목표(Goals)
> 모든 목표는 2025.08.16 기준입니다.

* RFC 2616을 **Top-Down**으로 읽고, 메시지 구성요소(Version, Method, Status, Header, Entity)를 **Type/Interface**로 정리한다.
* 각 타입 항목을 **RFC 섹션/문구에 연결**하고, 테스트 케이스 ID로 추적 가능하게 만든다.
* 구현(파서/직렬화)은 뒤로 미루되, **입·출력 규약(spec)** 을 먼저 문서화한다.

### 비목표(Non-Goals)

* 즉시 완성된 HTTP 서버/클라이언트 구현
* HTTP/2, TLS, gRPC의 즉시 비교(후속 단계의 별도 레포/패키지에서 다룬다)

## 디렉터리 구조(최소 시작형)

```
rfc2616-http/
├─ src/
│  ├─ types/                # RFC 2616 타입 스펙 정리(블로그와 1:1 매핑)
│  │  ├─ method.ts          # Method, 안전/멱등 구분 규칙 요약(§5.1.1, §9)
│  │  ├─ version.ts         # HTTP/<major>.<minor> 문법(§3.1)
│  │  ├─ status.ts          # Status Code & Reason-Phrase 범주(§6.1)
│  │  ├─ headers.ts         # General/Request/Response/Entity 구분(§4.2, §14)
│  │  ├─ entity.ts          # Content-Length / Transfer-Encoding(§7)
│  │  └─ grammar.ts         # token / quoted-string 등 문법 관례(§2)
│  ├─ core/                 # 파서/빌더 "스펙" 인터페이스(구현은 선택)
│  │  ├─ request.ts         # HttpRequest 인터페이스(입력 제약 요약)
│  │  ├─ response.ts        # HttpResponse 인터페이스(출력 제약 요약)
│  │  ├─ parse.spec.md      # Request-Line/Headers/Body 파싱 규약
│  │  └─ serialize.spec.md  # Status-Line/Headers/Body 직렬화 규약
│  ├─ impl/                 # (선택) 실제 구현을 나중에 담는 공간
│  │  ├─ parser/
│  │  └─ serializer/
│  ├─ fixtures/             # Raw HTTP 메시지 케이스(학습/테스트 공유)
│  │  ├─ requests/
│  │  └─ responses/
│  └─ index.ts
├─ tests/
│  ├─ conformance/          # RFC 섹션별 적합성 테스트(파일명에 § 표기)
│  │  ├─ §4-message/
│  │  │  ├─ MSG-REQ-001.spec.ts    # 예) Request-Line 파싱
│  │  │  └─ MSG-BODY-001.spec.ts   # 예) Content-Length 일치 검증
│  │  ├─ §5-request/
│  │  ├─ §6-response/
│  │  ├─ §7-entity/
│  │  ├─ §8-connection/
│  │  ├─ §9-method/
│  │  ├─ §10-status/
│  │  ├─ §12-negotiation/
│  │  └─ §13-caching/
│  ├─ helpers/              # test utils(소켓 전송, 청크 조립 등)
│  └─ recorder/             # nock/http-debug 연계 로그 저장
├─ docs/
│  ├─ blog/                 # 블로그 원고(타입 스펙 정리 중심)
│  ├─ rfc-map.md            # "테스트ID ↔ RFC 섹션 ↔ 파일 경로" 매핑표
│  └─ decisions/            # ADR(설계 의사결정 기록)
├─ scripts/
│  ├─ bench/                # (후속) wrk/autocannon 스크립트
│  └─ generate/             # ReasonPhrase/Headers 테이블 생성 도구
├─ .github/workflows/       # CI(타입체크, 테스트, 린트)
├─ tsconfig.json
├─ package.json
└─ README.md
```

> \[!TIP]
> OS/도구 호환성을 위해 `tests/conformance/§4-message` 대신
> `tests/conformance/sec-4-message` 네이밍을 사용해도 좋습니다.
> (Windows/에디터에 따라 `§` 문자가 문제될 수 있습니다.)

## 테스트 ID 규칙

* **형식:** `블록-세부-번호` + RFC 섹션 태그

  * `MSG-REQ-001` — 메시지/요청/001번 케이스
  * `ENT-CHUNK-001` — 엔티티/청크 전송/001번
* **파일 위치:** `tests/conformance/§<section>/<ID>.spec.ts`
* **본문 주석:** 맨 위에 RFC 링크/섹션/요구 내용 요약을 남긴다.

> \[!NOTE]
> 예) `[RFC 2616 §4.1] Request-Line = Method SP Request-URI SP HTTP-Version CRLF`

## 로드맵

* **Phase 1 — 타입 스펙/테스트 설계(현재 단계)**
  * 타입/테스트 스켈레톤/매핑표 완성

* **Phase 2 — 파서/직렬화 규약 문서화**
  * `parse.spec.md`, `serialize.spec.md` 작성

* **Phase 3 — (선택) 구현 & 예제**
  * `impl/` 채우기 + `fixtures/` 케이스 확장

* **Phase 4 — RPC & gRPC 비교 레포로 확장**
