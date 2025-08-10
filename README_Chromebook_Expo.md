# Tempted — Expo Source (Chromebook-Friendly)

## Build your Android .aab with no installs
1. Push this folder to a new GitHub repo (e.g. `tempted`).
2. Go to https://expo.dev → create account → New Project → Connect GitHub repo.
3. In the Expo project → **Build** → **Android** → profile **production**.
4. Let Expo manage the keystore. When the build finishes, click **Download .aab**.
5. Upload the `.aab` to Google Play Console → Production → Create Release.

### RevenueCat
- In Expo → Project → **Secrets**, add `RC_PUBLIC_SDK_KEY` (from RevenueCat).
- In RevenueCat dashboard, create entitlements: `ent_gold`, `ent_platinum`, and attach your Play products.
