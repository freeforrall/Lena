# The Shared Space — Firebase + Vercel

A responsive Next.js app for two consenting adults to manage shared routines, rules, weekly planning, rewards, agreed consequences, check-ins and reports. Personal/cycle/intimate logs are stored in a user-owned Firestore path and are private by default.

## 1. Firebase setup
1. Create a Firebase project at https://console.firebase.google.com.
2. Add a **Web app** and copy its config values.
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Create a **Cloud Firestore** database.
5. Open Firestore Rules and publish the contents of `firestore.rules`.
6. Copy `.env.example` to `.env.local` and fill in the six Firebase values.

## 2. Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```
Open http://localhost:3000.

## 3. Deploy to Vercel
1. Push this folder to a private GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Add the six `NEXT_PUBLIC_FIREBASE_*` environment variables in Vercel Project Settings → Environment Variables.
4. Deploy.

## Pairing
The first person registers and creates a workspace as Dom. In Settings, generate an invitation code. The second person registers with their own email/password, enters that code, and joins as Sub. The workspace membership is checked by Firestore rules; the role switch is not a security boundary.

## Data and privacy
- Shared workspace collections: tasks, rules, consequences, rewards, check-ins, reports and agreements.
- Personal records: `users/{uid}/private/{collection}/{id}`. The Firestore rules only permit the owning user to read/write these documents.
- The app does not require intimate photos, recordings or proof. Intimate activity is optional, self-reported and private.
- Cycle tracking is not medical advice and predictions are intentionally omitted.

## Before real-world use
This is a functional starter, not a certified medical or security product. Test with two accounts and review the deployed Firestore rules. Sensitive information deserves a professional security review. Enable Firebase App Check, configure authorized domains, strong passwords and account recovery. Do not store passwords or safeword details in ordinary notes. Do not use this app to enforce unsafe, non-consensual or coercive activity.
