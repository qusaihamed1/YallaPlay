import * as Location from "expo-location";
import { useCallback, useState } from "react";

type LocationState = {
  latitude: number;
  longitude: number;
} | null;

export function useDeviceLocation() {
  const [location, setLocation] = useState<LocationState>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const requestLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);
      setLocationError("");

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLocationError("Location permission was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      setLocationError("Could not read device location");
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  return { location, loadingLocation, locationError, requestLocation };
}
