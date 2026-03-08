import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Material {
    title: string;
    subject: string;
    file: ExternalBlob;
    fileType: string;
    uploadTime: Time;
    uploadedBy: Principal;
}
export type Time = bigint;
export interface Attendance {
    present: boolean;
    date: string;
    markedBy: Principal;
    student: Principal;
}
export interface Assignment {
    title: string;
    subject: string;
    createdBy: Principal;
    description: string;
    deadline: string;
}
export type Subject = string;
export interface UserProfile {
    name: string;
    role: UserRole;
    email: string;
}
export enum UserRole {
    admin = "admin",
    faculty = "faculty",
    student = "student"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createAssignment(title: string, description: string, deadline: string, subject: string): Promise<void>;
    getAllAssignments(): Promise<Array<Assignment>>;
    getAllAttendanceRecords(): Promise<Array<Attendance>>;
    getAllMaterials(): Promise<Array<Material>>;
    getAllUniqueSubjects(): Promise<Array<Subject>>;
    getAssignment(title: string): Promise<Assignment>;
    getAssignmentsBySubject(subject: string): Promise<Array<Assignment>>;
    getAttendanceByDate(date: string): Promise<Array<Attendance>>;
    getAttendanceByStudent(student: Principal): Promise<Array<Attendance>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getChatbotResponse(question: string): Promise<string>;
    getMaterial(title: string): Promise<Material>;
    getMaterialsBySubject(subject: string): Promise<Array<Material>>;
    getSystemAnalytics(): Promise<[bigint, bigint, bigint, bigint]>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markAttendance(student: Principal, date: string, present: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAssignment(assignmentTitle: string, notes: string, file: ExternalBlob): Promise<void>;
    uploadMaterial(title: string, subject: string, fileType: string, file: ExternalBlob): Promise<void>;
}
