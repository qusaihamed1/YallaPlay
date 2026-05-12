import API from "./api";

export type CreateBookingPayload = {
  userId: string;
  fieldId?: string;
  fieldName: string;
  date: string;
  time: string | number;
  duration: string | number;
  totalPrice: number;
  phone: string;
  email: string;
  paymentMethod: string;
};

export async function createBackendBooking(payload: CreateBookingPayload) {
  const response = await API.post("/bookings", payload);
  return response.data;
}
