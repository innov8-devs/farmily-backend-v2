import express from 'express';
import { GoogleOAuthController } from './googleOauth.controller';
const router = express.Router();

router.get('/login', GoogleOAuthController.initiateSignUpOrLogin);
router.post('/callback', GoogleOAuthController.handleGoogleCallback);

export default router;
