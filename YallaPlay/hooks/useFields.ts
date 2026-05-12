import { useQuery } from "@tanstack/react-query";
import { getFields } from "../services/fieldsService";

export function useFields() {
  return useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
    staleTime: 1000 * 60 * 5,
  });
}
