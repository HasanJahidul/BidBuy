export interface ISeatInfo {
  Id: number;
  StartTime: string;
  SeatNo: number;
  TicketId: number;
  TransportId: number;
  AgeClassEnum: AgeClassEnum;
  SeatClassEnum: SeatClassEnum;
  Status: string;
}

export interface AgeClassEnum {
  Id: number;
  Value: string;
}

export interface SeatClassEnum extends AgeClassEnum {}
export interface RoleClassEnum extends AgeClassEnum {}

export interface User {
  id: number;
  nid: string;
  email: string;
  username: string;
  password: string;
  type: string;
  products: null;
}

export interface IKyc {
  id: number;
  number: number;
  user: IUser | null;
  name: string;
  address: string;
  phone: string;
  gender: string;
}

export interface IUser {
  id: number;
  kyc: IKyc | null;
  email: string;
  username: string;
  type: "admin" | "user";
  soldProducts: IProduct[] | null;
  boughtProducts: IProduct[] | null;
}

export interface IProduct {
  id: number;
  name: string;
  category: string;
  status: string;
  price: number;
  sell_price: number | null;
  description: string;
  buyer: IUser | null;
  created_at: string;
  image: string;
  seller: IUser | null;
}

export interface IBid {
  id: number;
  bidPrice: number;
  product: IProduct | null;
}

export interface IProductCategory {
  id: number;
  name: string;
}
