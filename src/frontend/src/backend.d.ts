import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    text: string;
    sender: string;
    timestamp: bigint;
}
export interface Tool {
    urlTemplate: string;
    name: string;
    description: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTool(tool: Tool): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConciergeTools(): Promise<Array<Tool>>;
    getConversationHistory(): Promise<Array<Message>>;
    getTools(): Promise<Array<Tool>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMessage(message: Message): Promise<void>;
}
