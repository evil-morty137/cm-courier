import { Router } from "express";
import parcelRoutes from './parcel'
import { jwtGuard } from "../middlewares/auth-guard";

const apiRouter = Router();
const route = Router();

const jwt = jwtGuard({ credentialsRequired: true }).unless({
    path: [
        '/',
        '/v1/parcel/get',
        '/tracker/:parcelId'

    ]
})
apiRouter.use(parcelRoutes)
route.use('/v1', jwt, apiRouter);

export default route;