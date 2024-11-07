import { Timestamp } from "firebase-admin/firestore";

export type User = {
  name: string;
  age: number;
  email?: string;
  password: string;
  dob: Timestamp;
};

export type Family = {
  name: string;
  createdBy: string;
  members: string[];
};

export type Toy = {
  name: string;
  price: number;
  description: string;
};
