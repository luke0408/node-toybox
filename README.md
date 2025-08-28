# 🧰 node-toybox

> **토박이(토이+토이박스)**: 작은 실험과 아이디어를 쌓아가는 Node.js 기반 개인 아카이브

## 📌 소개

`node-toybox`는 저의 **개인 Node.js 실험실**이자 작은 아이디어를 테스트하고 정리하는 공간입니다.  
주로 학습, 프로토타입 구현, 또는 재미 위주의 토이 프로젝트를 다루며,  
실험을 통해 얻은 기록과 코드를 아카이브하는 것을 목표로 합니다.

관련된 글과 기록은 블로그에서 함께 공유합니다: 


[🔗 블로그 방문하기](https://your-blog-link.com) (준비중...)

## 🛠️ 현재 진행 중인 실험들

이 레포지토리에는 다음과 같은 실험들이 포함될 예정입니다:

- \[Now\] **Network Protocol Deep Dive**
  - 현대의 Network Protocol은 어떻게 발전해왔을까?
  - RFC 문서 스팩을 기반으로 Protocol 코드를 직접 만들어보거나 설계해보자!
    1. `HTTP 1.1`의 스팩 [RFC 2616](https://www.rfc-editor.org/rfc/rfc2616.html) 구현해보기 (inprogress)
    2. `HTTP 1.1` 스팩을 기반으로 `RCP` [RFC 707](https://rfc-editor.org/rfc/rfc707.html)의 요구사항 충족시켜보기
- \[redy for start\] **`.txt` file compiler**
  - `.js`와 `.txt`의 차이는 확장자가 다르다는 것 뿐 본질적으로 다르지 않은데 왜 `.txt`는 컴파일 되지 않을까?
  - `.txt`을 위한 `Tokenizer`, `Lexer`, `Parser`를 만들어보자!
- \[Now\] **HTTP Status를 더 다체롭게 활용하는 방법**
  - HTTP의 요청 성공 코드는 200만 존재하는 것이 아닌데, 200을 고정으로 하고 response json에 error code에 대한 필드를 새롭게 정의하고 해당 코드를 변경하면서 사용하는 모습을 자주 보았다. HTTP Status를 더 다채롭게 사용해보자!
