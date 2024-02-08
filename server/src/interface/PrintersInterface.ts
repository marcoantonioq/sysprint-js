import { EventEmitter } from "events";
import { Printer } from "../core/Printers";

export interface PrintData {
  name: string;
  location: string;
  description: string;
  model: string;
  driver: string;
  status: string;
  info: string;
}

export interface InterfaceRepository {
  event: EventEmitter;
  add(print: PrintData): Promise<PrintData>;
  list(): Promise<Printer[]>;
}
