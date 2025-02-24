export default interface ParcelPayload {
    itemName: string;
    from: string;
    to: string;
    reciever: string;
    currentLocation: string;
    date: string;
    status: string;
    sender: string;
}
export interface GetParcelPayload {
    parcelId: string
}