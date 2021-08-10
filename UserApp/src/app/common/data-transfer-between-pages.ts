import { StorePageType } from "./Enums";

export interface iDataTransferBetweenPages {
    storeId?: number;
    serviceId?: number;
    orderId?: number;
    serviceName?: string;
    MerchantName?: string;
    categoryName?: string;
    pageType?: StorePageType;
    productSearchString?: string;
}
