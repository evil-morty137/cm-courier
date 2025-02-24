import { Request, Response } from "express";
import ParcelService from "./parcel.service";
export default class parcelController {

    private parcelService: ParcelService;

    constructor() {
        this.parcelService = new ParcelService();
    }

    createParcel = async (req: Request, res: Response) => {
        const result = await this.parcelService.createParcel(req.body)
        res.status(201).json(result);
    }

    getParcel = async (req: Request, res: Response) => {
        const result = await this.parcelService.getParcel(req.body)
        res.status(201).json(result);
    }
    deleteParcel = async (req: Request, res: Response) => {
        const result = await this.parcelService.deleteParcel(req.params.parcelId)
        res.status(201).json(result);
    }
}