import { Router } from "express";
import parcelController from "./parcel.controller";
import * as vA from "./validator/auth.validator"
const controller = new parcelController()
const router = Router()

router.post('/parcel/create', vA.exchangePublicToken, controller.createParcel)
router.post('/parcel/get', controller.getParcel)
router.delete('/parcel/delete/:parcelId', controller.deleteParcel)
export default router;

