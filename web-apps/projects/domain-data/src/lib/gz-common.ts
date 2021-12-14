export const DELIVERY_STATUSES = ['open', 'picked-up', 'in-transit', 'delivered', 'failed']

export interface Delivery {
  delivery_id: string,
  package_id: string,
  pickup_time: Date | undefined,
  start_time: Date | undefined,
  end_time: Date | undefined,
  location_lat: number,
  location_lng: number,
  status: string
}

export interface CreateDelivery {
  package_id: any,
}

export function transformToDelivery(data: {
  delivery_id: any; package_id: any; pickup_time: any; start_time: any; end_time: any; location: {
    lng: any;
    lat: any;
  }; status: any;
}): Delivery {
  return {
    delivery_id: data.delivery_id,
    package_id: data.package_id,
    pickup_time: data.pickup_time,
    start_time: data.start_time,
    end_time: data.end_time,
    location_lat: data.location?.lat,
    location_lng: data.location?.lng,
    status: data.status
  }
}

export interface Package {
  package_id?: string,
  active_delivery_id?: string,
  description: string,
  weight: number,
  width: number,
  height: number,
  depth: number,
  from_name: string,
  from_address: string,
  from_location_lat: number,
  from_location_lng: number,
  to_name: string,
  to_address: string,
  to_location_lat: number,
  to_location_lng: number,
}

export class Coordinates {

  constructor(public lat: number,
              public lng: number) {
  }
}
