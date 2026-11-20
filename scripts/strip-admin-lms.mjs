import fs from "fs";

const path = "D:/Courses/karim-ai/src/components/admin/lms/legacyPanels.tsx";
let s = fs.readFileSync(path, "utf8");

s = s.replace(/import \{ useProjects[\s\S]*?\} from "@\/data\/projects";\n/, "");
s = s.replace(/import \{\n  useHeroContent[\s\S]*?\} from "@\/data\/siteContent";\n/, "");

const start = s.indexOf("// ─── Main Admin Component");
const adv = s.indexOf("// ─── Advanced Course Tab");
if (start >= 0 && adv > start) s = s.slice(0, start) + s.slice(adv);

const pe = s.indexOf("function ProjectsEditor");
const cce = s.indexOf("function CourseContentEditor");
if (pe >= 0 && cce > pe) s = s.slice(0, pe) + s.slice(cce);

for (const name of [
  "AdvancedCourseTab",
  "PaidCoursesManager",
  "CourseStudentsSection",
  "CoursePaymentsSection",
  "EmployeesTab",
  "CourseContentEditor",
  "ChapterLessonsEditor",
  "LessonEditor",
  "LessonResourcesEditor",
]) {
  s = s.replace(new RegExp(`function ${name}\\(`), `export function ${name}(`);
}

s = s.replace(/export default Admin;\s*$/, "");

const header = `import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LogOut, Plus, Trash2, Loader2, Upload, Users,
  CreditCard, Check, X, Eye, UserMinus, UserPlus, Search, CalendarIcon,
  DollarSign, TrendingUp, BookOpen, Pencil,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { normalizeVideoUrl } from "@/lib/videoUrl";
import { toast } from "@/hooks/use-toast";

`;

// Drop old imports block (everything before Advanced Course Tab marker content after our cut starts with Advanced)
const bodyStart = s.indexOf("// ─── Advanced Course Tab");
const body = bodyStart >= 0 ? s.slice(bodyStart) : s;

fs.writeFileSync(path, header + body);
console.log("wrote", path, "bytes", header.length + body.length);
