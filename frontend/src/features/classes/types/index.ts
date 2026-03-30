import { AuthUser } from "../../auth/types";

export interface ClassRoom {
  id: number;
  name: string;
  code: string;
  teacher: AuthUser;
  created_at: string;
  students_count?: number;
  activities_count?: number;
}

export interface ClassRoomMember {
  id: number;
  student: AuthUser;
  joined_at: string;
}
