import { Router } from "express";
import { PaystackController } from "./Paystack/paystack.controller";
import PaymentWebhookController from "./paymentWebhook.controller";
import { isAuthenticated } from "../../Shared/Middlewares/Account/isAuthenticated.middleware";

const router = Router();

/**
 * A gateway Id params is used to support managing webhooks 
 *   from other payment gateways that may be used in future.
 */
router.post("/webhooks/:gatewayId", PaymentWebhookController.handleWebhook);

// Routes for Paystack services
router.post(
  "/create_customer",
  isAuthenticated,
  PaystackController.createCustomer
);

router.post(
  "/validate_customer",
  isAuthenticated,
  PaystackController.validateCustomer
);

router.post(
  "/create_dedicated_account",
  isAuthenticated,
  PaystackController.createDedicatedVirtualAccount
);

router.post(
  "/initialize_transaction",
  isAuthenticated,
  PaystackController.initializeTransaction
);

router.get(
  "/validate_card",
  isAuthenticated,
  PaystackController.validateCard
);

router.post(
  "/saved_card",
  isAuthenticated,
  PaystackController.payWithSavedCards
);

export default router;
