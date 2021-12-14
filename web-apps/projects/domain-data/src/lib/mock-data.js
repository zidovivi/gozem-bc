import {Delivery, Package} from "./gz-common";

export let DELIVERIES;
DELIVERIES = [
  {
    delivery_id: '23745850',
    package_id: '23485',
    pickup_time: undefined,
    start_time: undefined,
    end_time: undefined,
    location_lat: 2345.45,
    location_lng: 1234.45,
    status: 'open'
  },
  {
    delivery_id: '23745850',
    package_id: '23485',
    pickup_time: undefined,
    start_time: undefined,
    end_time: undefined,
    location_lat: 2345.45,
    location_lng: 1234.45,
    status: 'open'
  }
];

export let PACKAGES;
PACKAGES = [
  {
    package_id: "1234",
    active_delivery_id: "",
    description: "A weird package",
    weight: 1,
    width: 12,
    height: 12,
    depth: 5,
    from_name: "Sender 1",
    from_address: "Sender 1 Address",
    from_location_lat: 6.361531,
    from_location_lng: 2.416985,
    to_name: "Recipient Long name",
    to_address: "Recipient 2 Address",
    to_location_lat: 6.358748,
    to_location_lng: 2.418133
  },
  {
    package_id: "3454",
    active_delivery_id: "",
    description: "A weird and heivy package",
    weight: 187,
    width: 12,
    height: 12,
    depth: 5,
    from_name: "Sender 2",
    from_address: "Sender 2 Address",
    from_location_lat: 6.361531,
    from_location_lng: 2.416985,
    to_name: "Recipient 2 Long name",
    to_address: "Recipient 2 Address",
    to_location_lat: 6.358748,
    to_location_lng: 2.418133
  }
];
