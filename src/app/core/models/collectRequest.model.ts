import WasteType from "../enums/WasteType";
import CollectRequestStatus from "../enums/CollectRequestStatus";

export type CollectRequestDetail = {
  type: WasteType;
  weight: number;
}

export type CollectRequest = {
  id: string;
  userId: string;
  types: CollectRequestDetail[];
  address: string;
  scheduledDate: Date;
  note?: string;
  status: CollectRequestStatus;
  totalWeight: number;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
  collectedBy?: string;
}
