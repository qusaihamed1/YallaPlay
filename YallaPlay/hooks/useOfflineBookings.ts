import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

type OfflineBooking = {
  id: number;
  fieldName: string;
  date: string;
  time: string;
};

const db = SQLite.openDatabaseSync("yallaplay.db");

export function useOfflineBookings() {
  const [offlineBookings, setOfflineBookings] = useState<OfflineBooking[]>([]);

  const loadOfflineBookings = useCallback(async () => {
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS offline_bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, fieldName TEXT, date TEXT, time TEXT);"
    );

    const rows = await db.getAllAsync<OfflineBooking>(
      "SELECT * FROM offline_bookings ORDER BY id DESC;"
    );

    setOfflineBookings(rows);
  }, []);

  const addOfflineBooking = useCallback(async (fieldName = "Offline Quick Booking", date?: string, time = "6:00 PM") => {
    await db.runAsync(
      "INSERT INTO offline_bookings (fieldName, date, time) VALUES (?, ?, ?);",
      [fieldName, date || new Date().toLocaleDateString(), time]
    );

    await loadOfflineBookings();
  }, [loadOfflineBookings]);

  const deleteOfflineBooking = useCallback(async (id: number) => {
    await db.runAsync("DELETE FROM offline_bookings WHERE id = ?;", [id]);
    await loadOfflineBookings();
  }, [loadOfflineBookings]);

  useEffect(() => {
    loadOfflineBookings();
  }, [loadOfflineBookings]);

  return { offlineBookings, addOfflineBooking, deleteOfflineBooking };
}
