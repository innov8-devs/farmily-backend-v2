import { Router } from "express";
import CustomerController from "./customer.controller";
import { isAuthenticated } from "../../Shared/Middlewares/Account/isAuthenticated.middleware";

const router = Router();

router.get("/verify/:verificationToken", CustomerController.verifyCustomer);
router.get("/logout", isAuthenticated, CustomerController.logoutCustomer);
router.get("/:accountId", isAuthenticated, CustomerController.getCustomerAccountDetails);

router.post("/signup", CustomerController.signUpCustomer);
router.post("/login", CustomerController.loginCustomer);
router.post('/forget-password', CustomerController.forgetCustomerPassword);
router.post('/reset-password', CustomerController.resetCustomerPassword);
router.post('/change-password', isAuthenticated, CustomerController.changeCustomerPassword);


/*
router.post('/create-google-account', CustomerController.createCustomerGoogleAccount);
*/

export default router;
