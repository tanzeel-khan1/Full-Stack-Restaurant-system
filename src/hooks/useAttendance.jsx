import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../utils/api";

// ✅ Get all attendance
export const useAttendance = () => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const { data } = await API.get("/attendance");
      return data;
    },
  });
};

// ✅ Get attendance by ID
export const useAttendanceById = (attendanceId) => {
  return useQuery({
    queryKey: ["attendance", attendanceId],
    queryFn: async () => {
      const { data } = await API.get(`/attendance/${attendanceId}`);
      return data;
    },
    enabled: !!attendanceId,
  });
};

// ✅ Get attendance by user
export const useAttendanceByUser = (userId) => {
  return useQuery({
    queryKey: ["attendanceByUser", userId],
    queryFn: async () => {
      const { data } = await API.get(`/attendance/user/${userId}`);
      return data.attendance; // agar sirf array chahiye
    },
    enabled: !!userId,
  });
};

// ✅ Create attendance
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAttendance) => {
      const { data } = await API.post("/attendance/mark", newAttendance);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

// ✅ Update attendance
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedAttendance }) => {
      const { data } = await API.put(
        `/attendance/${id}`,
        updatedAttendance
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

// ✅ Delete attendance
export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await API.delete(`/attendance/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

// ✅ Apply leave
export const useApplyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leaveData) => {
      // leaveData = { userId, startDate, endDate, reason }
      const { data } = await API.post("/attendance/apply-leave", leaveData);
      return data;
    },
    onSuccess: () => {
      // attendance related data refresh ho jaaye
      queryClient.invalidateQueries(["attendance"]);
      queryClient.invalidateQueries(["attendanceByUser"]);
    },
  });
};
