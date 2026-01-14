# 🔥 평화로운 게임마을 - Firebase 연동 가이드

이 문서는 웹사이트와 Firebase 백엔드를 연동하고 실제 데이터베이스를 활성화하기 위한 사용자 가이드입니다.
아래 단계들을 차근차근 따라와 주세요.

## 1. 환경 변수 설정 (.env.local)

현재 `web` 폴더 안에 `.env.local` 파일이 생성되어 있지만, 아직 실제 키 값이 없는 상태입니다.

1. `web/.env.local` 파일을 텍스트 에디터(메모장, VS Code 등)로 엽니다.
2. [Firebase Console](https://console.firebase.google.com/)에 접속하여 프로젝트를 선택합니다.
3. 왼쪽 메뉴 상단의 **톱니바퀴 아이콘(설정) > 프로젝트 설정**으로 이동합니다.
4. 아래로 스크롤하여 '내 앱' 섹션에서 `SDK 설정 및 구성`의 `Config` 라디오 버튼을 선택합니다.
5. 보여지는 코드(`firebaseConfig`)에서 값을 복사하여 `.env.local` 파일의 각 항목(`=`) 뒤에 붙여넣습니다.

**예시:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

> **주의**: 값 주변에 따옴표(' 또는 ")를 붙이지 마세요.

## 2. Firestore 데이터베이스 활성화

데이터베이스를 사용하려면 콘솔에서 먼저 활성화해야 합니다.

1. Firebase Console 왼쪽 메뉴에서 **빌드 > Firestore Database**를 클릭합니다.
2. **데이터베이스 만들기** 버튼을 클릭합니다.
3. 위치 설정(예: `asia-northeast3` 서울)을 하고 **다음**을 누릅니다.
4. 보안 규칙 설정에서 **프로덕션 모드에서 시작**을 선택하고 **만들기**를 누릅니다.
5. 데이터베이스 생성이 완료되면, 상단 **규칙(Rules)** 탭을 클릭합니다.
6. 아래 규칙을 복사하여 붙여넣고 **게시**를 클릭합니다. (또는 `web/firestore.rules` 파일 내용을 복사)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사이트 데이터 (공개 읽기 / 관리자만 쓰기)
    match /siteData/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // 가입 신청서 (누구나 생성 가능 / 관리자만 읽기, 수정, 삭제)
    match /applications/{document=**} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## 3. 인증(Authentication) 활성화

관리자 로그인을 위해 인증 서비스가 필요합니다.

1. Firebase Console 왼쪽 메뉴에서 **빌드 > Authentication**을 클릭합니다.
2. **시작하기** 버튼을 클릭합니다.
3. **로그인 방법(Sign-in method)** 탭에서 **이메일/비밀번호**를 클릭합니다.
4. **사용 설정** 스위치를 켜고 **저장**을 누릅니다.
5. (관리자 계정 생성) **사용자(Users)** 탭으로 이동하여 **사용자 추가**를 클릭합니다.
6. 관리에 사용할 이메일과 비밀번호를 입력하고 **사용자 추가**를 누릅니다.

## 4. 로컬 테스트 및 확인

이제 모든 준비가 끝났습니다!

1. 터미널(VS Code 터미널 등)을 엽니다.
2. `web` 폴더 경로에서 아래 명령어를 실행합니다.
   ```bash
   npm run dev
   ```
3. 브라우저에서 `http://localhost:3000`으로 접속합니다.
4. **F12**를 눌러 개발자 도구의 **Console** 탭을 확인합니다.
   - `✅ Firestore 연결 성공` 메시지가 보이면 연동 완료입니다!
   - 만약 빨간색 에러 메시지가 보인다면 `.env.local` 키 값이 정확한지 확인해 주세요.
5. `/admin` 경로로 접속하여 3번 단계에서 만든 계정으로 로그인해 봅니다.
   - 로그인이 성공하고 대시보드가 보이면 인증 기능도 정상 작동하는 것입니다.

---

## 🆘 트러블슈팅 (자주 발생하는 오류)

### Q. "이 시스템에서 스크립트를 실행할 수 없으므로..." (PSSecurityException) 오류가 뜰 때

Windows PowerShell의 보안 설정 때문에 발생하는 문제입니다. 아래 두 가지 방법 중 하나로 해결할 수 있습니다.

#### 방법 1: 실행 권한 변경 (권장)
PowerShell에서 스크립트 실행을 허용하도록 설정을 변경합니다.

1. **Windows 검색창**에 `PowerShell`을 검색합니다.
2. 검색 결과에서 마우스 우클릭 후 **관리자 권한으로 실행**을 클릭합니다.
3. 아래 명령어를 입력하고 엔터를 칩니다.
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```
4. 변경 여부를 물으면 `Y` (Yes) 또는 `A` (All)를 입력하고 엔터를 칩니다.
5. 이제 다시 VS Code 등에서 `npm run dev`를 실행하면 정상 작동합니다.

#### 방법 2: Command Prompt (cmd) 사용
PowerShell 대신 일반 명령 프롬프트(cmd)를 사용하면 이 오류를 피할 수 있습니다.

1. VS Code 터미널 우측 상단의 `+` 옆 화살표(`v`)를 클릭합니다.
2. `Command Prompt` (명령 프롬프트)를 선택하여 새 터미널을 엽니다.
3. 거기서 `npm run dev`를 실행합니다.

### Q. 화면이 텍스트만 나오고 깨져서 보여요 (스타일 미적용)

Tailwind CSS 설정이 새로 추가되었기 때문에 발생합니다. **서버를 재시작**해야 합니다.

1. 터미널에서 `Ctrl + C`를 눌러 현재 서버를 종료합니다. (프롬프트가 나올 때까지)
2. 다시 `npm run dev`를 입력하여 서버를 시작합니다.
3. 브라우저를 새로고침하면 예쁜 디자인이 적용된 화면을 볼 수 있습니다.

