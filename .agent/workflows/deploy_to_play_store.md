---
description: How to deploy the Expo app to Google Play Store
---

# Deploying to Google Play Store

This guide walks you through building your Expo app (`doltech`) for Android and submitting it to the Google Play Store.

## Prerequisites

1.  **Google Play Developer Account**: You must have a paid account ($25 one-time fee) at [play.google.com/console](https://play.google.com/console).
2.  **EAS CLI**: Ensure you have the EAS CLI installed.
    ```powershell
    npm install -g eas-cli
    ```
3.  **Expo Account**: You need an account at [expo.dev](https://expo.dev). Run `eas login` to log in.

## Step 1: Configure App for Android

Your `app.json` needs a unique package name (e.g., `com.yourname.doltech`).

1.  Open `app/app.json`.
2.  Add the `package` field inside the `android` object.

```json
"android": {
  "package": "com.doltech.app", 
  "adaptiveIcon": { ... }
}
```
*Note: Replace `com.doltech.app` with your unique identifier.*

## Step 2: Configure Build Profile

Initialize the EAS build configuration:

```powershell
eas build:configure
```

*   Select **Android**.
*   This creates an `eas.json` file in your project root.

## Step 3: create a build

To generate an **AAB (Android App Bundle)** file (required for Play Store), run:

```powershell
eas build -p android
```

*   **Log in** if prompted.
*   **Keystore**: Choose "Generate new keystore" if this is your first time. **IMPORTANT**: EAS manages this for you, but keep your Expo credentials safe.
*   Wait for the build to finish. It will give you a link to download the `.aab` file.

## Step 4: Create App on Play Console

1.  Go to [Google Play Console](https://play.google.com/console).
2.  Click **Create app**.
3.  Fill in the App Name ("Doltech"), Language, and App Type (App/Free).
4.  Accept declarations and create.

## Step 5: Upload to Play Console

1.  In Play Console, go to **Testing > Internal testing** (recommended for first run) or **Production**.
2.  Click **Create new release**.
3.  Upload the `.aab` file you downloaded from Step 3.
4.  Enter release notes.
5.  Click **Next** and **Save**.

## Step 6: Complete Store Listing

Before you can publish, you must complete the **Dashboard** tasks in Play Console:
*   Set up your Store Listing (Title, Description, Screenshots, Icon).
*   Answer Content Rating questionnaire.
*   Set Target Audience.
*   Set Data Safety details.

## Step 7: Review and Rollout

Once verified, go to **Publishing overview** and send your changes for review. Google usually reviews new apps within 1-7 days.
