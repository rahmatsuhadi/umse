import { useMutation } from "@tanstack/react-query";
import { createVisitorLog, type VisitorLogParams } from "./api";

export const useCreateVisitorLog = () => {
    return useMutation({
        mutationFn: (data: VisitorLogParams) => createVisitorLog(data),
    });
};
