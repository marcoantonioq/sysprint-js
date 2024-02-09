import { EventEmitter } from "events";
import { Spool } from "../core/Spools";

export interface SpoolRequest {
  id?: number;
  user: string;
  print: string;
  title?: string;
  copies?: number;
  range?: string;
  pages?: "all" | "odd" | "even";
  sided?: "one-sided" | "two-sided-long-edge" | "two-sided-short-edge";
  media?: "letter" | "A3" | "A4" | "A5" | "legal" | "envelope" | "photo";
  orientation?: "portrait" | "landscape";
  quality: "3" | "4" | "5";
  buffer?: Buffer;
  path?: string;
  msgs?: string[];
  errors?: string[];
}

export interface InterfaceRepository {
  event: EventEmitter;
  lp(options: SpoolRequest): Promise<Spool[]>;
  all(): Promise<SpoolRequest[]>;
}
