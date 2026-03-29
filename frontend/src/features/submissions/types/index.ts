import { AuthUser } from "../../auth/types";
import { Activity } from "../../activities/types";

export interface Submission {
  id: number;
  activity: Activity;
  student: AuthUser;
  content: string;
  grade: number | null;
  feedback: string | null;
  turned_in_at: string;
  updated_at: string;
}
