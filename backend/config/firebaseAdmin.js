import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
dotenv.config();

let adminAuth = null;

try {
  // If FIREBASE_SERVICE_ACCOUNT_JSON is provided as a stringified JSON in the environment variables
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount)
      });
    }
    adminAuth = getAuth();
    console.log('📦 Firebase Admin SDK initialized successfully.');
  } else {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_JSON is not set. Google Sign-In will not work until configured.');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
}

export { adminAuth };
