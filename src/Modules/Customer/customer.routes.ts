import { Router } from "express";
import CustomerController from "./customer.controller";
import { isAuthenticated } from "../../Shared/Middlewares/Account/isAuthenticated.middleware";
import { AccountRateLimiter } from "../../Shared/Middlewares/Account/accountRateLimiter.middleware";

const router = Router();

router.get("/verify/:verificationToken", CustomerController.verifyCustomer);
router.get("/logout", isAuthenticated, CustomerController.logoutCustomer);
router.get("/getCustomerAccountDetails", isAuthenticated, CustomerController.getCustomerAccountDetails);

router.post(
  "/signup",
  AccountRateLimiter.signUpRateLimiter, CustomerController.signUpCustomer
);
router.post(
  "/resend-verification-link",
  AccountRateLimiter.resendVerificationRateLimiter, CustomerController.resendVerificationLink
);
router.post("/login", AccountRateLimiter.loginRateLimiter, CustomerController.loginCustomer);
router.post(
  "/forget-password",
  AccountRateLimiter.forgetPasswordRateLimiter, CustomerController.forgetCustomerPassword
);
router.post('/reset-password', CustomerController.resetCustomerPassword);
router.post('/change-password', isAuthenticated, CustomerController.changeCustomerPassword);

export default router;
