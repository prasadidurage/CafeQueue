import { useLoader as useLoaderFromContext } from "@/context/LoaderContext";

export const useLoader = () => {
  return useLoaderFromContext();
};
