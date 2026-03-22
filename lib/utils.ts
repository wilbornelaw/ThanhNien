import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function calculateReadingTime(content: string) {
  const wordCount = stripHtml(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function formatDate(date: string | null, pattern = "MMM dd, yyyy") {
  if (!date) return "Unscheduled";
  return format(new Date(date), pattern);
}

export function formatRelative(date: string | null) {
  if (!date) return "Pending";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function absoluteUrl(path = "/") {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
  return `${baseUrl}${path}`;
}

export function buildPageRange(total: number, page: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return {
    pageCount,
    start: (page - 1) * pageSize,
    end: page * pageSize - 1,
  };
}

export function parsePageParam(value?: string) {
  const page = Number(value || "1");
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

export function socialLinksToArray(links?: Record<string, string>) {
  return Object.entries(links ?? {}).filter(([, value]) => Boolean(value));
}

