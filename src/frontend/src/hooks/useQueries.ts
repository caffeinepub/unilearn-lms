import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type {
  Assignment,
  Attendance,
  Material,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useAllMaterials() {
  const { actor, isFetching } = useActor();
  return useQuery<Material[]>({
    queryKey: ["materials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMaterials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMaterialsBySubject(subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Material[]>({
    queryKey: ["materials", subject],
    queryFn: async () => {
      if (!actor) return [];
      if (!subject) return actor.getAllMaterials();
      return actor.getMaterialsBySubject(subject);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      subject,
      fileType,
      file,
    }: {
      title: string;
      subject: string;
      fileType: string;
      file: File;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      return actor.uploadMaterial(title, subject, fileType, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useAllAssignments() {
  const { actor, isFetching } = useActor();
  return useQuery<Assignment[]>({
    queryKey: ["assignments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssignments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignmentsBySubject(subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Assignment[]>({
    queryKey: ["assignments", subject],
    queryFn: async () => {
      if (!actor) return [];
      if (!subject) return actor.getAllAssignments();
      return actor.getAssignmentsBySubject(subject);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAssignment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      deadline,
      subject,
    }: {
      title: string;
      description: string;
      deadline: string;
      subject: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createAssignment(title, description, deadline, subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useSubmitAssignment() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      assignmentTitle,
      notes,
      file,
    }: {
      assignmentTitle: string;
      notes: string;
      file: File;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      return actor.submitAssignment(assignmentTitle, notes, blob);
    },
  });
}

export function useAllAttendance() {
  const { actor, isFetching } = useActor();
  return useQuery<Attendance[]>({
    queryKey: ["attendance"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAttendanceRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      student,
      date,
      present,
    }: {
      student: string;
      date: string;
      present: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      // Cast string to Principal type for the backend call
      type AnyPrincipal = Parameters<typeof actor.markAttendance>[0];
      return actor.markAttendance(
        student as unknown as AnyPrincipal,
        date,
        present,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useSystemAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery<[bigint, bigint, bigint, bigint]>({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return [0n, 0n, 0n, 0n];
      return actor.getSystemAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllSubjects() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUniqueSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useChatbotResponse() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (question: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getChatbotResponse(question);
    },
  });
}
