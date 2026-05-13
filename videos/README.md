# 📹 Sample Video 폴더

이 폴더에 샘플 영상 파일을 넣어주세요.

## 📥 파일명 규칙

**기본 파일명: `sample.mp4`**

영상 파일을 이 폴더에 넣고 이름을 `sample.mp4` 로 바꾸시면 HTML에서 자동으로 불러옵니다.

```
playday-v3/
├── index.html
├── style.css
├── script.js
└── videos/
    ├── README.md
    └── sample.mp4   ← 여기에 넣으세요
```

## 📐 권장 사양

- **형식**: MP4 (H.264 코덱)
- **비율**: 16:9 (예: 1920×1080, 1280×720)
- **용량**: 가능하면 **20MB 이하** 권장
  - GitHub는 단일 파일 100MB 까지 허용하지만, 50MB 넘으면 경고가 뜸
  - 웹에서 로딩이 빠르려면 작을수록 좋음
- **재생시간**: 30초 ~ 1분 30초 권장

## 🔄 다른 파일명을 쓰고 싶다면

`index.html` 에서 아래 부분을 찾아 파일명을 바꿔주세요:

```html
<source src="videos/sample.mp4" type="video/mp4" />
```

예: `videos/my-letter.mp4` 로 바꾸려면:
```html
<source src="videos/my-letter.mp4" type="video/mp4" />
```

## ⚠️ 영상 용량이 너무 클 때

100MB 이상이면 GitHub에 일반 push로 못 올라갑니다. 그럴 땐:
1. 영상을 압축 (HandBrake 같은 무료 도구)
2. 또는 유튜브에 올리고 `<iframe>` 임베드로 교체

압축 도움 필요하시면 알려주세요!
