export type Status = "Delivered" | "Pending" | "Cancelled";

export interface Order {
  id: string;
  date: string; // ISO yyyy-mm-dd
  region: string;
  category: string;
  amount: number; // INR
  status: Status;
}

export interface Filters {
  region: string; // "All" or a region name
  category: string;
  query: string; // matches order id
}
