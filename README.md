# 📱 Rekrutacyjne zadanie React Native (Expo + EAS Build)

---

## 🚀 Uruchomienie projektu lokalnie

Poniżej znajdują się instrukcje, jak zbudować i uruchomić aplikację lokalnie na emulatorze Androida lub fizycznym urządzeniu.

---

### ✅ Wymagania

- Node.js + npm
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Android Studio (do emulatora) lub fizyczny telefon
- Konto Expo (może być darmowe): https://expo.dev/signup

---

### 🛠️ Instalacja

1. **Sklonuj repozytorium:**

```bash
git clone https://github.com/alekry78/TWG-React-Native.git
cd TWG-React-Native
```
2. **Zainstaluj zalezności:**
```bash
npm install
```
3. **Zaloguj się do Expo:**
```bash
eas login
```
4. **Stwórz plik .env i dodaj do niego EXPO_PUBLIC_YOUTUBE_API_KEY wraz ze swoim kluczem YoutubeAPI**

5. **Zbuduj aplikację**
```bash
eas build --platform android --profile development
```
6.  **Pobierz plik .apk i zainstaluj go**
```bash
adb install path/to/app.apk
```
7. **Uruchom bundler**
```bash
npx expo start --dev-client
```

