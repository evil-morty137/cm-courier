import ParcelPayload, { GetParcelPayload } from "./interface/parcel.type"
import Parcel, { IParcel } from "../../models/parcel"
import { NotFoundException } from "../../utils/service-exception"

export default class ParcelService {
    createParcel = async (payload: ParcelPayload) => {
        try {
            const parcelData: Partial<IParcel> = {
                itemName: payload.itemName,
                from: payload.from,
                to: payload.to,
                receiver: payload.reciever,
                currentLocation: payload.currentLocation,
                date: payload.date,
                status: payload.status,
                sender: payload.sender
            }
            const parcel = await Parcel.create(parcelData)
            return parcel
        } catch (err) {
            console.log(err)
        }

    }

    getParcel = async (payload: GetParcelPayload) => {
        console.log("this is get parcel")
        const parcel = await Parcel.findById({ _id: payload.parcelId });
        if (!parcel) {
            throw new NotFoundException('Strangely, cannot find parcel information');
        }

        return parcel
    }

    deleteParcel = async (parcelId: string) => {
        const deletedParcel = await Parcel.deleteOne({ _id: parcelId });

        if (deletedParcel.deletedCount === 0) {
            throw new NotFoundException('Parcel not found');
        }

        return deletedParcel;
    };
}