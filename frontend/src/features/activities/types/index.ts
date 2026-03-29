import { AuthUser } from "../../auth/types";

export interface ClassRoom {
  id: number;
  name: string;
  created_at: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  classroom: ClassRoom;
  teacher: AuthUser;
  due_date: string;
  created_at: string;
  updated_at: string;
}
